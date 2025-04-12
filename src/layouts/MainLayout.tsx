
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const MainLayout = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate page transition with a loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Welcome toast for first-time visitors (using localStorage to show only once)
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    
    if (!hasVisited) {
      setTimeout(() => {
        toast({
          title: "Welcome to BookWala.com",
          description: "Your one-stop destination for competitive exam books in India!",
          duration: 5000,
        });
        localStorage.setItem("hasVisited", "true");
      }, 2000);
    }
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
