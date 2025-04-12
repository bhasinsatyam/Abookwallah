
import React from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orderService";

// Form schema for validation
const formSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required (min 3 characters)" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address is required (min 5 characters)" }),
  city: z.string().min(2, { message: "City is required" }),
  pincode: z.string().min(6, { message: "Please enter a valid pincode" }),
  state: z.string().min(2, { message: "State is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  subtotal: number;
  tax: number;
  shipping: number;
  securityDeposit: number;
  total: number;
  cartItems: any[];
  cartId: string;
  onOrderSuccess: (order: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  subtotal,
  tax,
  shipping,
  securityDeposit,
  total,
  cartItems,
  cartId,
  onOrderSuccess,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useAuth();

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create shipping info object
      const shippingInfo = {
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.pincode,
        country: "India", // Default country
      };
      
      // Transform cart items for order creation
      const items = cartItems.map(item => ({
        book_id: item.book.id,
        quantity: item.quantity,
        is_rental: item.type === "rent",
        rental_period: item.type === "rent" ? item.rentalPeriod * 30 : null, // Convert months to days
        books: { price: item.book.price }
      }));
      
      console.log("Creating order with user ID:", user.id);
      console.log("Items to add:", items);
      
      // Create order in Supabase
      const { order, error } = await createOrder({
        userId: user.id,
        cartId: cartId,
        items: items,
        shippingInfo: shippingInfo,
        paymentMethod: "Cash on Delivery", // Default payment method
        totalAmount: total,
      });
      
      if (error) {
        console.error("Order creation error:", error);
        throw new Error(error);
      }
      
      if (!order) {
        throw new Error("No order was returned from the server");
      }

      // Show success toast
      toast.success("Order placed successfully!");
      
      // Call onOrderSuccess with the new order
      onOrderSuccess(order);
      
      // Navigate to order confirmation page
      navigate("/order-confirmation", { state: { order } });
    } catch (error: any) {
      console.error("Order submission error:", error);
      // Show error toast
      toast.error("Failed to place order: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Apartment 4B" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="400001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Maharashtra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18% GST):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `₹${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            
            {securityDeposit > 0 && (
              <div className="flex justify-between text-rent-600">
                <span>Security Deposit (Refundable):</span>
                <span>₹{securityDeposit.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderForm;
