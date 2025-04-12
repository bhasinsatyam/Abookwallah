
import { supabase } from "@/integrations/supabase/client";

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  } catch (error: any) {
    console.error("Error in getUserProfile service:", error);
    return {
      profile: null,
      error: error.message || "An error occurred while fetching the profile",
    };
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  } catch (error: any) {
    console.error("Error in updateUserProfile service:", error);
    return {
      profile: null,
      error: error.message || "An error occurred while updating the profile",
    };
  }
}

// Upload an image for a resell request
export async function uploadResellImage(
  resellRequestId: string,
  file: File,
  index: number
): Promise<string | null> {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${resellRequestId}_${index}.${fileExt}`;
    const filePath = `${resellRequestId}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('resell-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('resell-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error: any) {
    console.error("Error in uploadResellImage service:", error);
    return null;
  }
}

// Submit resell request
export async function submitResellRequest({
  userId,
  bookTitle,
  bookAuthor,
  bookIsbn,
  bookCondition,
  askingPrice,
  description,
  contactPhone,
  imageUrls = [],
}: {
  userId: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn?: string;
  bookCondition: string;
  askingPrice?: number;
  description?: string;
  contactPhone: string;
  imageUrls?: string[];
}) {
  try {
    // For demo purposes - if no userId provided, use a default admin ID
    const userToUse = userId || '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from("resell_requests")
      .insert([
        {
          status: "pending",
          book_title: bookTitle,
          book_author: bookAuthor,
          book_isbn: bookIsbn,
          book_condition: bookCondition,
          asking_price: askingPrice,
          description: description,
          contact_phone: contactPhone,
          user_id: userToUse,
          image_urls: imageUrls.length > 0 ? imageUrls : null
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error submitting resell request:", error);
      return { request: null, error: error.message };
    }

    return { request: data, error: null };
  } catch (error: any) {
    console.error("Error in submitResellRequest service:", error);
    return {
      request: null,
      error: error.message || "An error occurred while submitting the request",
    };
  }
}

// Submit a review for a book
export async function submitReview({
  userId,
  bookId,
  rating,
  comment,
}: {
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
}) {
  try {
    // For demo purposes - if no userId provided, use a default admin ID
    const userToUse = userId || '00000000-0000-0000-0000-000000000000';
    
    // Check if user has already reviewed this book
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userToUse)
      .eq("book_id", bookId)
      .maybeSingle();

    if (existingReview) {
      const { data, error } = await supabase
        .from("reviews")
        .update({ rating, comment })
        .eq("id", existingReview.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating review:", error);
        return { review: null, error: error.message };
      }

      // Update book rating average
      await updateBookRating(bookId);

      return { review: data, error: null };
    } else {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            user_id: userToUse,
            book_id: bookId,
            rating: rating,
            comment: comment,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error submitting review:", error);
        return { review: null, error: error.message };
      }

      // Update book rating average
      await updateBookRating(bookId);

      return { review: data, error: null };
    }
  } catch (error: any) {
    console.error("Error in submitReview service:", error);
    return {
      review: null,
      error: error.message || "An error occurred while submitting the review",
    };
  }
}

// Helper to update a book's rating
async function updateBookRating(bookId: string) {
  try {
    // Get all reviews for this book
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("book_id", bookId);

    if (!reviews || reviews.length === 0) return;

    // Calculate average rating
    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const averageRating = totalRating / reviews.length;

    // Update the book with new rating and review count
    await supabase
      .from("books")
      .update({
        rating: averageRating,
        reviews: reviews.length,
      })
      .eq("id", bookId);
  } catch (error) {
    console.error("Error updating book rating:", error);
  }
}

// Get all user profiles (for admin)
export async function getUserProfiles() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user profiles:", error);
      return { profiles: [], error: error.message };
    }

    return { profiles: data, error: null };
  } catch (error: any) {
    console.error("Error in getUserProfiles service:", error);
    return {
      profiles: [],
      error: error.message || "An error occurred while fetching profiles",
    };
  }
}
