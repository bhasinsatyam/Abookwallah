import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpenText, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import TestimonialCard from "@/components/TestimonialCard";
import { booksService } from "@/services";
import { mockCategories } from "@/data/mockData";

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [booksResult, testimonialsResult, categoriesResult] = await Promise.all([
          booksService.getFeaturedBooks(),
          booksService.getTestimonials(),
          booksService.getCategories(),
        ]);

        if (booksResult.error) {
          setError(booksResult.error);
        } else {
          setFeaturedBooks(booksResult.books);
        }

        if (testimonialsResult.error) {
          setError(testimonialsResult.error);
        } else {
          setTestimonials(testimonialsResult.testimonials);
        }

        if (categoriesResult.error) {
          setError(categoriesResult.error);
          console.error("Error fetching categories:", categoriesResult.error);
        } else {
          // Transform categories data into the format needed for display
          const transformedCategories = categoriesResult.categories.map((catName, index) => ({
            id: index + 1,
            name: catName
          }));
          setCategories(transformedCategories);
          console.log("Fetched categories:", transformedCategories);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        console.error("Error in fetchData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hero Section
  const renderHeroSection = () => (
    <section className="py-24 bg-gradient-to-r from-bookwala-50 to-bookwala-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="md:order-2">
            <img
              src="https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
              alt="BookWala Hero"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Your Next Read with BookWala
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Find the perfect book for your interests, whether it's for
              learning, leisure, or professional development.
            </p>
            <div className="space-x-3">
              <Link to="/books">
                <Button size="lg">Browse Books</Button>
              </Link>
              <Link to="/resell">
                <Button variant="outline" size="lg">
                  Sell Your Books
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Featured Categories Section
  const renderFeaturedCategories = () => {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {loading ? (
              // Show skeleton loaders when loading
              Array(10).fill(0).map((_, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center animate-pulse"
                >
                  <div className="w-16 h-16 mb-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500 py-4">
                Error loading categories: {error}
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-4">
                No categories available
              </div>
            ) : (
              categories.slice(0, 10).map((category) => (
                <Link 
                  key={category.id}
                  to={`/books?category=${category.name}`}
                  className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 mb-3 bg-gradient-to-br from-bookwala-50 to-bookwala-100 rounded-full flex items-center justify-center text-bookwala-600 group-hover:from-bookwala-100 group-hover:to-bookwala-200 transition-colors">
                    <BookOpenText className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </Link>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/books">
              <Button>
                View All Categories
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  // Featured Books Section
  const renderFeaturedBooks = () => (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Featured Books
        </h2>
        {loading ? (
          <div className="text-center">Loading featured books...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} animationDelay={index * 100} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/books">
            <Button>
              View All Books
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );

  // Testimonials Section
  const renderTestimonials = () => (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          What Our Customers Say
        </h2>
        {loading ? (
          <div className="text-center">Loading testimonials...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                animationDelay={index * 200}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div>
      {/* Hero Section */}
      {renderHeroSection()}
      
      {/* Featured Categories */}
      {renderFeaturedCategories()}
      
      {/* Featured Books */}
      {renderFeaturedBooks()}
      
      {/* Testimonials */}
      {renderTestimonials()}
    </div>
  );
};

export default HomePage;
