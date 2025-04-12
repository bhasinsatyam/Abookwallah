
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, Book, User, LogOut} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateCart, getCartItems } from "@/services/cartService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, signOut, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Check if current path matches the link
  const isActive = (path: string) => location.pathname === path;

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Fetch cart items count when the component mounts or user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setCartItemsCount(0);
        return;
      }

      try {
        // Get or create cart for the current user
        const { cart, error: cartError } = await getOrCreateCart(user.id);
        
        if (cartError || !cart) {
          console.error("Error getting cart:", cartError);
          return;
        }
        
        // Get cart items with their details
        const { items, error: itemsError } = await getCartItems(cart.id);
        
        if (itemsError) {
          console.error("Error getting cart items:", itemsError);
          return;
        }
        
        // Calculate total number of items (considering quantities)
        const totalItems = items.reduce((total, item) => total + item.quantity, 0);
        setCartItemsCount(totalItems);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartItems();
    
    // Setup interval to periodically refresh the cart count (every 30 seconds)
    const intervalId = setInterval(fetchCartItems, 30000);
    
    return () => clearInterval(intervalId);
  }, [user, location.pathname]); // Re-fetch when user or location changes

  // Get user display name from metadata
  const getUserDisplayName = () => {
    if (!user) return "User";
    
    const metadata = user.user_metadata;
    if (metadata?.first_name || metadata?.last_name) {
      return `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim();
    }
    
    // Fall back to email if no name is available
    return user.email?.split('@')[0] || "User";
  };
  
  // Get user initial for avatar
  const getUserInitial = () => {
    if (!user) return "U";
    
    const metadata = user.user_metadata;
    if (metadata?.first_name) {
      return metadata.first_name.charAt(0).toUpperCase();
    }
    
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  // Navigation items - removed resell and rent
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Books", path: "/books" },
    { label: "About us", path: "/About" },
    { label: "Contact us", path: "/Contact" },
    { label: "Policies", path: "/policies" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-heading font-bold text-2xl relative z-50 group"
          >
            <span className="text-bookwala-600">Book</span>
            <span className="text-bookwala-900">Wala</span>
            <span className="text-bookwala-600 text-sm font-normal">.com</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link text-base font-medium",
                  isActive(item.path) && "active"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search books..."
                className="w-48 lg:w-64 pl-10 h-10 rounded-full bg-gray-50 focus:bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            {/* Cart button */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bookwala-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Login/User button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-full w-full items-center justify-center bg-bookwala-100 rounded-full text-bookwala-600 font-semibold">
                      {getUserInitial()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {/* Add Admin Dashboard link if user is logged in */}
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin')}>
                    <Book className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="btn-primary" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu & Search Toggles */}
          <div className="flex items-center gap-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bookwala-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && isMobile && (
          <div className="mt-4 mb-1 animate-fade-in md:hidden">
            <Input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 h-10 rounded-full bg-gray-50"
              autoFocus
            />
            <Search className="absolute left-7 top-[3.75rem] text-gray-400 h-4 w-4" />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="fixed inset-0 bg-white z-40 pt-20 animate-fade-in overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-lg font-medium flex items-center gap-3 py-2 border-b border-gray-100",
                    isActive(item.path) ? "text-bookwala-600" : "text-gray-700"
                  )}
                >
                  {item.label === "Books" && <Book className="h-5 w-5" />}
                  {item.label === "Home" && <span className="h-5 w-5 flex items-center justify-center">🏠</span>}
                  {item.label}
                </Link>
              ))}
              {/* Add Admin link for mobile */}
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={cn(
                    "text-lg font-medium flex items-center gap-3 py-2 border-b border-gray-100",
                    isActive("/admin") ? "text-bookwala-600" : "text-gray-700"
                  )}
                >
                  <Book className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              )}
            </nav>
            
            <div className="mt-8">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{getUserDisplayName()}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Button className="w-full justify-center" variant="outline" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button className="w-full justify-center" variant="outline" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button className="btn-primary w-full justify-center" onClick={() => navigate('/login')}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
