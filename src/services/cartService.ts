
import { supabase } from "@/integrations/supabase/client";

// Get or create cart for the current user
export async function getOrCreateCart(userId: string) {
  try {
    // First, try to get the existing cart
    const { data: existingCart, error: fetchError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching cart:", fetchError);
      return { cart: null, error: fetchError.message };
    }

    // If cart exists, return it
    if (existingCart) {
      return { cart: existingCart, error: null };
    }

    // If cart doesn't exist, create a new one
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (createError) {
      console.error("Error creating cart:", createError);
      return { cart: null, error: createError.message };
    }

    return { cart: newCart, error: null };
  } catch (error: any) {
    console.error("Error in getOrCreateCart service:", error);
    return {
      cart: null,
      error: error.message || "An error occurred while processing your cart",
    };
  }
}

// Get cart items with book details for a specific cart
export async function getCartItems(cartId: string) {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        books:book_id(*)
      `)
      .eq("cart_id", cartId);

    if (error) {
      console.error("Error fetching cart items:", error);
      return { items: [], error: error.message };
    }

    return { items: data, error: null };
  } catch (error: any) {
    console.error("Error in getCartItems service:", error);
    return {
      items: [],
      error: error.message || "An error occurred while fetching cart items",
    };
  }
}

// Add an item to the cart
export async function addToCart({
  cartId,
  bookId,
  quantity = 1,
  isRental = false,
  rentalPeriod = null,
}: {
  cartId: string;
  bookId: string;
  quantity?: number;
  isRental?: boolean;
  rentalPeriod?: number | null;
}) {
  try {
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("book_id", bookId)
      .eq("is_rental", isRental)
      .single();

    if (existingItem) {
      // Update quantity if item already exists
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating cart item:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data, error: null };
    } else {
      // Add new item to cart
      const { data, error } = await supabase
        .from("cart_items")
        .insert([
          {
            cart_id: cartId,
            book_id: bookId,
            quantity,
            is_rental: isRental,
            rental_period: rentalPeriod,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding item to cart:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data, error: null };
    }
  } catch (error: any) {
    console.error("Error in addToCart service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while adding to cart",
    };
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      console.error("Error updating cart item:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error: any) {
    console.error("Error in updateCartItemQuantity service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while updating cart",
    };
  }
}

// Remove an item from the cart
export async function removeFromCart(itemId: string) {
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error removing cart item:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in removeFromCart service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while removing from cart",
    };
  }
}

// Clear the entire cart
export async function clearCart(cartId: string) {
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);

    if (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in clearCart service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while clearing cart",
    };
  }
}
