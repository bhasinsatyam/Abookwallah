import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  RotateCw, 
  ArrowRight, 
  Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import OrderForm from "@/components/OrderForm";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateCart, getCartItems, updateCartItemQuantity, removeFromCart } from "@/services/cartService";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Fetch cart and cart items when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Get or create cart
        const { cart, error: cartError } = await getOrCreateCart(user.id);
        
        if (cartError || !cart) {
          toast.error("Error loading cart: " + (cartError || "Unknown error"));
          setIsLoading(false);
          return;
        }
        
        setCart(cart);
        
        // Get cart items
        const { items, error: itemsError } = await getCartItems(cart.id);
        
        if (itemsError) {
          toast.error("Error loading cart items: " + itemsError);
          setIsLoading(false);
          return;
        }
        
        // Transform cart items to match the expected format
        const transformedItems = items.map((item: any) => ({
          id: item.id,
          type: item.is_rental ? "rent" : "buy",
          book: item.books,
          quantity: item.quantity,
          rentalPeriod: item.rental_period ? Math.ceil(item.rental_period / 30) : 3 // Convert days to months, default to 3
        }));
        
        setCartItems(transformedItems);
      } catch (error: any) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart: " + (error.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCart();
  }, [user]);
  
  const handleQuantityChange = async (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    
    const newQuantity = Math.max(1, Math.min(10, item.quantity + change));
    
    try {
      const { success, error } = await updateCartItemQuantity(id, newQuantity);
      
      if (success) {
        setCartItems(prev => 
          prev.map(item => 
            item.id === id 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
      } else if (error) {
        toast.error("Failed to update quantity: " + error);
      }
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity: " + (error.message || "Unknown error"));
    }
  };
  
  const handleRentalPeriodChange = async (id: string, period: number) => {
    // Update local state
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, rentalPeriod: period } 
          : item
      )
    );
    
    // Note: This would require a backend update function for rental period
    // For now we only update the local state since the cart service doesn't have rental period update
    toast("Rental period set to " + period + " " + (period === 1 ? 'month' : 'months'));
  };
  
  const handleRemoveItem = async (id: string) => {
    try {
      const { success, error } = await removeFromCart(id);
      
      if (success) {
        setCartItems(prev => prev.filter(item => item.id !== id));
        toast("The item has been removed from your cart.");
      } else if (error) {
        toast.error("Failed to remove item: " + error);
      }
    } catch (error: any) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item: " + (error.message || "Unknown error"));
    }
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.type === "buy") {
        return total + (item.book.price * item.quantity);
      } else {
        // Calculate rental price (40% of MRP for 1 month, 35% for 3 months, 30% for 6 months)
        let rentalRate = 0.4; // Default for 1 month
        if (item.rentalPeriod === 3) rentalRate = 0.35;
        if (item.rentalPeriod === 6) rentalRate = 0.3;
        
        return total + (item.book.price * rentalRate * item.quantity);
      }
    }, 0);
  };
  
  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.18); // 18% GST
  };
  
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    if (subtotal >= 500) return 0; // Free shipping above ₹500
    return 50; // Standard shipping charge
  };
  
  const calculateSecurityDeposit = () => {
    return cartItems
      .filter(item => item.type === "rent")
      .reduce((total, item) => {
        // Security deposit is same as rental rate
        let depositRate = 0.4; // Default for 1 month
        if (item.rentalPeriod === 3) depositRate = 0.35;
        if (item.rentalPeriod === 6) depositRate = 0.3;
        
        return total + (item.book.price * depositRate * item.quantity);
      }, 0);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping() + calculateSecurityDeposit();
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error("Please log in to proceed to checkout");
      navigate('/login');
      return;
    }
    
    setIsCheckingOut(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleOrderSuccess = (order: any) => {
    // Clear the cart when order is placed successfully
    setCartItems([]);
    setIsCheckingOut(false);
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="text-center py-10">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">
          {isCheckingOut ? "Checkout" : "Your Cart"}
        </h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-gray-100 shadow-subtle text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-16 w-16 text-gray-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Link to="/books">
              <Button className="btn-primary">
                Browse Books
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : isCheckingOut ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-100 shadow-subtle overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold mb-1">Shipping Information</h2>
                  <p className="text-gray-500">
                    Please enter your details to complete your order
                  </p>
                </div>
                
                <div className="p-6">
                  <OrderForm 
                    subtotal={calculateSubtotal()}
                    tax={calculateTax()}
                    shipping={calculateShipping()}
                    securityDeposit={calculateSecurityDeposit()}
                    total={calculateTotal()}
                    cartItems={cartItems}
                    cartId={cart?.id || ''}
                    onOrderSuccess={handleOrderSuccess}
                  />
                </div>
                
                <div className="p-6 bg-gray-50 flex justify-between items-center">
                  <button 
                    className="text-bookwala-600 hover:text-bookwala-700 transition-colors flex items-center"
                    onClick={() => setIsCheckingOut(false)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Order Summary (same for both cart and checkout) */}
            <div className="animate-fade-in">
              <div className="bg-white rounded-lg border border-gray-100 shadow-subtle sticky top-24">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-semibold">₹{calculateTax().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${calculateShipping().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {calculateSecurityDeposit() > 0 && (
                    <div className="flex justify-between text-rent-600">
                      <span className="flex items-center">
                        Security Deposit
                        <span className="inline-flex items-center ml-1 text-xs bg-rent-100 text-rent-800 rounded-full px-1.5 py-0.5">
                          Refundable
                        </span>
                      </span>
                      <span className="font-semibold">₹{calculateSecurityDeposit().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  {!isCheckingOut && (
                    <div className="pt-2">
                      <Button 
                        className="w-full btn-primary justify-center h-12 text-base"
                        onClick={handleProceedToCheckout}
                      >
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      
                      <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
                        <Shield className="h-4 w-4 mr-1 text-gray-400" />
                        Secure checkout with bank-grade encryption
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Payment methods */}
                <div className="p-6 pt-0">
                  <p className="text-sm text-gray-600 mb-2">We accept:</p>
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">Visa</span>
                    </div>
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">MC</span>
                    </div>
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">UPI</span>
                    </div>
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">COD</span>
                    </div>
                  </div>
                </div>
                
                {/* Enter promo code */}
                {!isCheckingOut && (
                  <div className="p-6 pt-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="px-3 py-2 border border-gray-200 rounded flex-grow text-sm"
                      />
                      <Button variant="secondary" className="text-sm">
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Need help */}
                <div className="p-6 pt-0">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Need help with your order?</p>
                    <a href="tel:+911234567890" className="text-sm text-bookwala-600 hover:text-bookwala-700 transition-colors">
                      Call us at +91 12345 67890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 animate-fade-in">
              <div className="bg-white rounded-lg border border-gray-100 shadow-subtle overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold mb-1">Shopping Cart</h2>
                  <p className="text-gray-500">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Book image */}
                        <div className="sm:w-[100px] flex-shrink-0">
                          <div className="aspect-[3/4] bg-gray-50 rounded-md overflow-hidden">
                            <img 
                              src={item.book.coverImage || item.book.cover_image} 
                              alt={item.book.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Book details */}
                        <div className="flex-grow">
                          <div className="flex justify-between mb-2">
                            <Link 
                              to={`/books/${item.book.id}`}
                              className="text-lg font-semibold hover:text-bookwala-600 transition-colors"
                            >
                              {item.book.title}
                            </Link>
                            
                            {/* Type badge */}
                            {item.type === "rent" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rent-100 text-rent-800">
                                <BookOpen className="mr-1 h-3 w-3" />
                                Rent
                              </span>
                            ) : item.type === "resell" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-resell-100 text-resell-800">
                                <RotateCw className="mr-1 h-3 w-3" />
                                Resell
                              </span>
                            ) : null}
                          </div>
                          
                          <p className="text-gray-500 mb-2">
                            by {item.book.author}
                          </p>
                          
                          {/* Price display */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.type === "buy" ? (
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold">₹{item.book.price}</span>
                                {item.book.originalPrice > item.book.price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ₹{item.book.originalPrice}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-rent-600 font-semibold">
                                ₹{Math.round(item.book.price * (
                                  item.rentalPeriod === 1 ? 0.4 : 
                                  item.rentalPeriod === 3 ? 0.35 : 0.3
                                ))} / {item.rentalPeriod} {item.rentalPeriod === 1 ? 'month' : 'months'}
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Quantity selector */}
                            <div className="flex items-center">
                              <span className="text-sm mr-2">Qty:</span>
                              <div className="flex border rounded">
                                <button 
                                  className="px-2 py-1 border-r hover:bg-gray-100 transition-colors"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                >
                                  -
                                </button>
                                <span className="w-10 text-center py-1">
                                  {item.quantity}
                                </span>
                                <button 
                                  className="px-2 py-1 border-l hover:bg-gray-100 transition-colors"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            
                            {/* Rental period selector (for rental items) */}
                            {item.type === "rent" && (
                              <div className="flex items-center">
                                <span className="text-sm mr-2">Period:</span>
                                <div className="flex border rounded">
                                  <button 
                                    className={`px-2 py-1 ${item.rentalPeriod === 1 ? 'bg-rent-100 text-rent-800' : 'hover:bg-gray-100'} transition-colors`}
                                    onClick={() => handleRentalPeriodChange(item.id, 1)}
                                  >
                                    1M
                                  </button>
                                  <button 
                                    className={`px-2 py-1 border-l border-r ${item.rentalPeriod === 3 ? 'bg-rent-100 text-rent-800' : 'hover:bg-gray-100'} transition-colors`}
                                    onClick={() => handleRentalPeriodChange(item.id, 3)}
                                  >
                                    3M
                                  </button>
                                  <button 
                                    className={`px-2 py-1 ${item.rentalPeriod === 6 ? 'bg-rent-100 text-rent-800' : 'hover:bg-gray-100'} transition-colors`}
                                    onClick={() => handleRentalPeriodChange(item.id, 6)}
                                  >
                                    6M
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {/* Remove button */}
                            <button 
                              className="text-gray-500 hover:text-red-500 transition-colors flex items-center"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gray-50 flex justify-between items-center">
                  <Link to="/books" className="text-bookwala-600 hover:text-bookwala-700 transition-colors flex items-center">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="animate-fade-in">
              <div className="bg-white rounded-lg border border-gray-100 shadow-subtle sticky top-24">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-semibold">₹{calculateTax().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${calculateShipping().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {calculateSecurityDeposit() > 0 && (
                    <div className="flex justify-between text-rent-600">
                      <span className="flex items-center">
                        Security Deposit
                        <span className="inline-flex items-center ml-1 text-xs bg-rent-100 text-rent-800 rounded-full px-1.5 py-0.5">
                          Refundable
                        </span>
                      </span>
                      <span className="font-semibold">₹{calculateSecurityDeposit().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full btn-primary justify-center h-12 text-base"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
                      <Shield className="h-4 w-4 mr-1 text-gray-400" />
                      Secure checkout with bank-grade encryption
                    </div>
                  </div>
                </div>
                
                {/* Payment methods */}
                <div className="p-6 pt-0">
                  <p className="text-sm text-gray-600 mb-2">We accept:</p>
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">Visa</span>
                    </div>
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">MC</span>
                    </div>
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">UPI</span>
                    </div>
                    <div className="bg-gray-50 h-8 w-12 rounded border flex items-center justify-center">
                      <span className="text-xs font-medium">COD</span>
                    </div>
                  </div>
                </div>
                
                {/* Enter promo code */}
                <div className="p-6 pt-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="px-3 py-2 border border-gray-200 rounded flex-grow text-sm"
                    />
                    <Button variant="secondary" className="text-sm">
                      Apply
                    </Button>
                  </div>
                </div>
                
                {/* Need help */}
                <div className="p-6 pt-0">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Need help with your order?</p>
                    <a href="tel:+911234567890" className="text-sm text-bookwala-600 hover:text-bookwala-700 transition-colors">
                      Call us at +91 12345 67890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
