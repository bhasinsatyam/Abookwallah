
import { supabase } from "@/integrations/supabase/client";

// Create a new order
export async function createOrder({
  userId,
  cartId,
  items,
  shippingInfo,
  paymentMethod,
  totalAmount,
}: {
  userId: string;
  cartId: string;
  items: any[];
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount: number;
}) {
  try {
    // Use default user ID for demo purposes if not provided
    const userToUse = userId || '00000000-0000-0000-0000-000000000000';
    
    // First create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userToUse,
          status: "pending",
          total_amount: totalAmount,
          shipping_address: shippingInfo.address,
          shipping_city: shippingInfo.city,
          shipping_state: shippingInfo.state,
          shipping_zip: shippingInfo.zip,
          shipping_country: shippingInfo.country,
          payment_method: paymentMethod,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return { order: null, error: orderError.message };
    }

    console.log("Order created successfully:", order);

    // Process each order item individually to better handle RLS issues
    for (const item of items) {
      const orderItem = {
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
        price: item.books.price,
        is_rental: item.is_rental,
        rental_period: item.rental_period,
        rental_end_date: item.is_rental
          ? new Date(Date.now() + item.rental_period * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : null,
      };

      const { error: itemError } = await supabase
        .from("order_items")
        .insert([orderItem]);

      if (itemError) {
        console.error("Error adding order item:", itemError, orderItem);
        // Continue with other items instead of failing completely
      }
    }

    // Clear the cart after successful order if cartId exists
    if (cartId) {
      const { error: cartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);

      if (cartError) {
        console.error("Error clearing cart:", cartError);
        // Don't return error here, as the order was successful
      }
    }

    // Get the complete order with items for confirmation
    const { data: completeOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order.id)
      .single();

    if (fetchError) {
      console.error("Error fetching complete order:", fetchError);
      // Still return the original order
      return { order, error: null };
    }

    return { order: completeOrder, error: null };
  } catch (error: any) {
    console.error("Error in createOrder service:", error);
    return {
      order: null,
      error: error.message || "An error occurred while creating your order",
    };
  }
}

// Get all orders for a user
export async function getUserOrders(userId: string) {
  try {
    // Use default user ID for demo purposes if not provided
    const userToUse = userId || '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userToUse)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], error: error.message };
    }

    return { orders: data, error: null };
  } catch (error: any) {
    console.error("Error in getUserOrders service:", error);
    return {
      orders: [],
      error: error.message || "An error occurred while fetching orders",
    };
  }
}

// Get order details with items
export async function getOrderDetails(orderId: string, userId: string) {
  try {
    // Use default user ID for demo purposes if not provided
    const userToUse = userId || '00000000-0000-0000-0000-000000000000';
    
    // First verify this order belongs to the user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", userToUse)
      .single();

    if (orderError) {
      console.error("Error fetching order:", orderError);
      return { order: null, items: [], error: orderError.message };
    }

    // Get order items with book details
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        *,
        books:book_id(*)
      `)
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return { order, items: [], error: itemsError.message };
    }

    return { order, items, error: null };
  } catch (error: any) {
    console.error("Error in getOrderDetails service:", error);
    return {
      order: null,
      items: [],
      error: error.message || "An error occurred while fetching order details",
    };
  }
}
