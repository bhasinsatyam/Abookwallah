
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch statistics for the admin dashboard
 */
export async function getDashboardStats() {
  try {
    // Get all categories to count them
    const { data: categoriesData } = await supabase.rpc('get_all_categories');
    
    // Get book count
    const { count: bookCount } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true });
    
    // Get order count
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });
    
    // Get resell request count
    const { count: resellCount } = await supabase
      .from("resell_requests")
      .select("*", { count: "exact", head: true });
    
    return {
      bookCount: bookCount || 0,
      categoryCount: categoriesData?.length || 0,
      orderCount: orderCount || 0,
      resellCount: resellCount || 0,
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return {
      bookCount: 0,
      categoryCount: 0,
      orderCount: 0,
      resellCount: 0,
      error: error.message
    };
  }
}

/**
 * Get all books with pagination
 */
export async function getAllBooks(page = 1, limit = 10, filters = {}) {
  try {
    let query = supabase
      .from("books")
      .select("*, categories:category_id(name)")
      .order("created_at", { ascending: false });
    
    // Apply filters if any
    if (filters.title) {
      query = query.ilike('title', `%${filters.title}%`);
    }
    
    if (filters.author) {
      query = query.ilike('author', `%${filters.author}%`);
    }
    
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Get total count
    const { count } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true });
    
    // Get paginated data
    const { data, error } = await query.range(from, to);
    
    if (error) throw error;
    
    return {
      books: data || [],
      total: count || 0,
      page,
      limit,
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching books:", error);
    return {
      books: [],
      total: 0,
      page,
      limit,
      error: error.message
    };
  }
}

/**
 * Get all categories
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase.rpc('get_all_categories');
    
    if (error) throw error;
    
    return {
      categories: data || [],
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return {
      categories: [],
      error: error.message
    };
  }
}

/**
 * Create a new book
 */
export async function createBook(bookData) {
  try {
    const { data, error } = await supabase
      .from("books")
      .insert([bookData])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      book: data,
      error: null
    };
  } catch (error: any) {
    console.error("Error creating book:", error);
    return {
      book: null,
      error: error.message
    };
  }
}

/**
 * Update a book
 */
export async function updateBook(id, bookData) {
  try {
    const { data, error } = await supabase
      .from("books")
      .update(bookData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      book: data,
      error: null
    };
  } catch (error: any) {
    console.error("Error updating book:", error);
    return {
      book: null,
      error: error.message
    };
  }
}

/**
 * Delete a book
 */
export async function deleteBook(id) {
  try {
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    return {
      success: true,
      error: null
    };
  } catch (error: any) {
    console.error("Error deleting book:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all orders with pagination
 */
export async function getOrders(page = 1, limit = 10, status = null) {
  try {
    let query = supabase
      .from("orders")
      .select("*, profiles:user_id(first_name, last_name, email)")
      .order("created_at", { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Get paginated data
    const { data, error } = await query.range(from, to);
    
    if (error) throw error;
    
    return {
      orders: data || [],
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return {
      orders: [],
      error: error.message
    };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      order: data,
      error: null
    };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return {
      order: null,
      error: error.message
    };
  }
}

/**
 * Get all resell requests with pagination
 */
export async function getResellRequests(page = 1, limit = 10, status = null) {
  try {
    let query = supabase
      .from("resell_requests")
      .select("*, profiles:user_id(first_name, last_name, email)")
      .order("created_at", { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Get paginated data
    const { data, error } = await query.range(from, to);
    
    if (error) throw error;
    
    return {
      requests: data || [],
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching resell requests:", error);
    return {
      requests: [],
      error: error.message
    };
  }
}

/**
 * Update resell request status
 */
export async function updateResellRequestStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from("resell_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      request: data,
      error: null
    };
  } catch (error: any) {
    console.error("Error updating resell request status:", error);
    return {
      request: null,
      error: error.message
    };
  }
}
