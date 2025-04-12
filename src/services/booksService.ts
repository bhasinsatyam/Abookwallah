
import { supabase } from "@/integrations/supabase/client";
import { Book, mapDatabaseBookToModel } from "@/types/book";

// Get all books with optional pagination and filtering
export async function getAllBooks({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sortBy = "title",
  sortOrder = "asc",
} = {}) {
  try {
    let query = supabase
      .from("books")
      .select("*", { count: "exact" });

    // Apply search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%, author.ilike.%${search}%`);
    }

    // Apply category filter if provided
    if (category && category !== "all-categories" && category !== "all") {
      // Using join to get books by category name
      const { data: categoryData, error: categoryError } = await supabase
        .rpc('get_all_categories');

      if (categoryError) {
        console.error("Error fetching categories:", categoryError);
        return { books: [], count: 0, error: categoryError.message };
      }

      const categoryItem = categoryData?.find((cat: any) => cat.name === category);
      if (categoryItem?.id) {
        query = query.eq("category_id", categoryItem.id);
      }
    }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching books:", error);
      return { books: [], count: 0, error: error.message };
    }

    // Map database books to model books
    const books = data.map(book => mapDatabaseBookToModel(book));

    return { 
      books, 
      count, 
      totalPages: count ? Math.ceil(count / limit) : 0,
      currentPage: page,
      error: null 
    };
  } catch (error: any) {
    console.error("Error in getAllBooks service:", error);
    return {
      books: [],
      count: 0,
      totalPages: 0,
      currentPage: page,
      error: error.message || "An error occurred while fetching books",
    };
  }
}

// Get a single book by ID
export async function getBookById(id: string) {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching book:", error);
      return { book: null, error: error.message };
    }

    if (!data) {
      return { book: null, error: "Book not found" };
    }

    // Map database book to model book
    const book = mapDatabaseBookToModel(data);

    return { book, error: null };
  } catch (error: any) {
    console.error("Error in getBookById service:", error);
    return {
      book: null,
      error: error.message || "An error occurred while fetching the book",
    };
  }
}

// Get distinct categories from the database
export async function getCategories() {
  try {
    // Using the RPC function for categories
    const { data, error } = await supabase
      .rpc('get_all_categories');

    if (error) {
      console.error("Error fetching categories:", error);
      return { categories: [], bookCounts: {}, error: error.message };
    }

    if (!data || !Array.isArray(data)) {
      return { categories: [], bookCounts: {}, error: "Invalid data format returned" };
    }

    // Extract categories and create a map of category to book count
    const categories = data.map((item: any) => item.name);
    const bookCounts = data.reduce((acc: Record<string, number>, item: any) => {
      acc[item.name] = item.book_count;
      return acc;
    }, {} as Record<string, number>);

    return { categories, bookCounts, error: null };
  } catch (error: any) {
    console.error("Error in getCategories service:", error);
    return {
      categories: [],
      bookCounts: {},
      error: error.message || "An error occurred while fetching categories",
    };
  }
}

// Get featured books
export async function getFeaturedBooks() {
  return getAllBooks({ 
    limit: 6,
    sortBy: "rating",
    sortOrder: "desc"
  });
}

// Get testimonials
export async function getTestimonials() {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching testimonials:", error);
      return { testimonials: [], error: error.message };
    }

    const testimonials = data.map(item => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar_url || '',
      text: item.content,
      rating: 5, // Default rating if not available
      location: item.role || ''
    }));

    return { testimonials, error: null };
  } catch (error: any) {
    console.error("Error in getTestimonials service:", error);
    return {
      testimonials: [],
      error: error.message || "An error occurred while fetching testimonials",
    };
  }
}

// Create a new book
export async function createBook(bookData: Partial<Book>) {
  try {
    // Convert Date object to string if necessary
    const publicationDate = bookData.publicationDate instanceof Date 
      ? bookData.publicationDate.toISOString().split('T')[0] 
      : bookData.publicationDate;
    
    // Get category_id from category name
    let categoryId = null;
    if (bookData.category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", bookData.category)
        .single();
      
      if (categoryData) {
        categoryId = categoryData.id;
      }
    }
    
    const { data, error } = await supabase
      .from("books")
      .insert({
        title: bookData.title,
        author: bookData.author,
        cover_image: bookData.coverImage,
        price: bookData.price,
        original_price: bookData.originalPrice,
        description: bookData.description,
        category_id: categoryId, // Use category_id instead of category
        language: bookData.language,
        publisher: bookData.publisher,
        publication_date: publicationDate,
        isbn: bookData.isbn,
        page_count: bookData.pageCount,
        edition: bookData.edition,
        binding: bookData.binding,
        is_new: bookData.isNew,
        has_free_delivery: bookData.hasFreeDelivery,
        has_rent_option: bookData.hasRentOption,
        is_available_for_resell: bookData.isAvailableForResell,
        stock_status: bookData.stockStatus
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating book:", error);
      return { book: null, error: error.message };
    }

    // Map database book to model book
    const book = mapDatabaseBookToModel(data);

    return { book, error: null };
  } catch (error: any) {
    console.error("Error in createBook service:", error);
    return {
      book: null,
      error: error.message || "An error occurred while creating the book",
    };
  }
}

// Update an existing book
export async function updateBook(id: string, bookData: Partial<Book>) {
  try {
    // Convert Date object to string if necessary
    const publicationDate = bookData.publicationDate instanceof Date 
      ? bookData.publicationDate.toISOString().split('T')[0] 
      : bookData.publicationDate;
    
    // Get category_id from category name
    let categoryId = null;
    if (bookData.category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", bookData.category)
        .single();
      
      if (categoryData) {
        categoryId = categoryData.id;
      }
    }
    
    const { data, error } = await supabase
      .from("books")
      .update({
        title: bookData.title,
        author: bookData.author,
        cover_image: bookData.coverImage,
        price: bookData.price,
        original_price: bookData.originalPrice,
        description: bookData.description,
        category_id: categoryId, // Use category_id instead of category
        language: bookData.language,
        publisher: bookData.publisher,
        publication_date: publicationDate,
        isbn: bookData.isbn,
        page_count: bookData.pageCount,
        edition: bookData.edition,
        binding: bookData.binding,
        is_new: bookData.isNew,
        has_free_delivery: bookData.hasFreeDelivery,
        has_rent_option: bookData.hasRentOption,
        is_available_for_resell: bookData.isAvailableForResell,
        stock_status: bookData.stockStatus
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating book:", error);
      return { book: null, error: error.message };
    }

    // Map database book to model book
    const book = mapDatabaseBookToModel(data);

    return { book, error: null };
  } catch (error: any) {
    console.error("Error in updateBook service:", error);
    return {
      book: null,
      error: error.message || "An error occurred while updating the book",
    };
  }
}

// Delete a book
export async function deleteBook(id: string) {
  try {
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting book:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in deleteBook service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while deleting the book",
    };
  }
}
