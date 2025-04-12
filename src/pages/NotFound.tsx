
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-white">
      <div className="text-center max-w-md mx-auto animate-fade-up">
        <h1 className="text-9xl font-bold text-bookwala-500">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! We couldn't find the page you're looking for. Perhaps you entered an incorrect URL or the page has been moved.
        </p>
        <Link to="/">
          <Button className="btn-primary">
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
