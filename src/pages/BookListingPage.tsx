import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Filter, SlidersHorizontal, ShoppingCart, BookOpen, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import BookCard from "@/components/BookCard";
import { useQuery } from "@tanstack/react-query";
import { booksService } from "@/services";
import { Loader2 } from "lucide-react";
import { Book } from "@/types/book";
import Pagination from "@/components/admin/books/Pagination";

const BookListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'all' | 'resell' | 'rent'>('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // Show more books per page

  // Fetch books from API
  const { data: booksData, isLoading, isError } = useQuery({
    queryKey: ['books', page, limit, searchQuery, selectedCategories.length === 1 ? selectedCategories[0] : ''],
    queryFn: () => booksService.getAllBooks({ 
      page, 
      limit, 
      search: searchQuery,
      category: selectedCategories.length === 1 ? selectedCategories[0] : '',
      sortBy: 'title',
      sortOrder: 'asc'
    }),
  });

  // Fetch categories from database instead of extracting from books
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => booksService.getCategories(),
  });

  // Handle initial search params
  useEffect(() => {
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const view = searchParams.get("view") as 'all' | 'resell' | 'rent';
    
    if (category) {
      setSelectedCategories([category]);
      // Show a toast notification when a category is selected from URL
      toast({
        title: `Browsing ${category} books`,
        description: `Showing all books in ${category} category`,
        duration: 3000,
      });
    }
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (view && ['all', 'resell', 'rent'].includes(view)) {
      setViewType(view);
    }
  }, [searchParams, toast]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0]);
    }
    
    if (searchQuery) {
      params.set("query", searchQuery);
    }
    
    if (viewType !== 'all') {
      params.set("view", viewType);
    }
    
    // Update URL without page reload
    setSearchParams(params);
  }, [selectedCategories, searchQuery, viewType, setSearchParams]);

  // Filter books based on filters
  useEffect(() => {
    if (!booksData?.books) return;
    
    let result = [...booksData.books];
    
    // We already filter by search and category in the API call, so we only need to filter by viewType and priceRange here
    
    // Filter by price range
    result = result.filter(book => 
      book.price >= priceRange[0] && book.price <= priceRange[1]
    );
    
    // Filter by viewType
    if (viewType === 'resell') {
      result = result.filter(book => book.isAvailableForResell);
    } else if (viewType === 'rent') {
      result = result.filter(book => book.hasRentOption);
    }
    
    setFilteredBooks(result);
  }, [booksData, priceRange, viewType]);

  // Helper function to ensure we never have empty category values
  const ensureValidCategory = (category: string | null | undefined): string => {
    return category && category.trim() !== '' ? category : 'uncategorized';
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [category]; // Changed to only select one category at a time
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, 2000]);
    setViewType('all');
    setSearchParams({});
  };

  // Handle pagination
  const handleNextPage = () => {
    if (booksData?.totalPages && page < booksData.totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Mobile Filter Toggle */}
          <div className="w-full md:hidden mb-4">
            <Button 
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full flex justify-between items-center"
            >
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </span>
              <Badge className="ml-2 bg-bookwala-100 text-bookwala-800 hover:bg-bookwala-200">
                {filteredBooks.length}
              </Badge>
            </Button>
          </div>

          {/* Sidebar - Filters */}
          <div className={`${
            isFiltersOpen ? 'block' : 'hidden md:block'
          } w-full md:w-64 lg:w-72 bg-white p-4 rounded-lg border border-gray-100 shadow-subtle animate-fade-in sticky top-24`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm text-gray-500">
                Clear All
              </Button>
            </div>

            {/* View Type */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700">View</h3>
              <div className="flex gap-2">
                <Button 
                  variant={viewType === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewType('all')}
                  className={viewType === 'all' ? "bg-bookwala-500 text-white" : ""}
                >
                  All Books
                </Button>
                <Button 
                  variant={viewType === 'rent' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewType('rent')}
                  className={viewType === 'rent' ? "bg-rent-500 text-white" : ""}
                >
                  <BookOpen className="h-3.5 w-3.5 mr-1" />
                  Rent
                </Button>
                <Button 
                  variant={viewType === 'resell' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewType('resell')}
                  className={viewType === 'resell' ? "bg-resell-500 text-white" : ""}
                >
                  <RotateCw className="h-3.5 w-3.5 mr-1" />
                  Resell
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Search</h3>
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search books..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Price Range</h3>
              <Slider 
                defaultValue={[0, 2000]} 
                max={2000} 
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Categories</h3>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  categoriesData?.categories?.map((category: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${index}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label
                        htmlFor={`category-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow"
                      >
                        {category || "Uncategorized"}
                      </label>
                      <span className="text-xs text-gray-500">
                        ({categoriesData?.bookCounts?.[category] || 0})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Language */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Language</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="lang-english" />
                  <label
                    htmlFor="lang-english"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    English
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lang-hindi" />
                  <label
                    htmlFor="lang-hindi"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hindi
                  </label>
                </div>
              </div>
            </div>

            {/* Binding */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Binding</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="bind-paperback" />
                  <label
                    htmlFor="bind-paperback"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Paperback
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="bind-hardcover" />
                  <label
                    htmlFor="bind-hardcover"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hardcover
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategories.length === 1 
                    ? `${selectedCategories[0]} Books` 
                    : "Browse Books"}
                </h1>
                <p className="text-gray-500">
                  {isLoading 
                    ? "Loading books..." 
                    : `Showing ${filteredBooks.length} ${selectedCategories.length > 0 ? `books in ${selectedCategories.join(", ")}` : "books"}`
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select defaultValue="featured">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || searchQuery || viewType !== 'all') && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(category => (
                  <Badge 
                    key={category} 
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    {category}
                    <button 
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      onClick={() => handleCategoryChange(category)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {searchQuery && (
                  <Badge 
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    Search: "{searchQuery}"
                    <button 
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {viewType !== 'all' && (
                  <Badge 
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    {viewType === 'rent' ? 'Rentable Books' : 'Resellable Books'}
                    <button 
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      onClick={() => setViewType('all')}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-gray-500">Loading books...</p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="p-12 text-center bg-red-50 rounded-lg animate-fade-in">
                <div className="mb-4 text-red-500">
                  <span className="h-12 w-12 mx-auto block">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Error loading books</h3>
                <p className="text-gray-500 mb-4">
                  Something went wrong when trying to load the books. Please try again.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            )}

            {/* Book Grid */}
            {!isLoading && !isError && filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {filteredBooks.map((book, index) => (
                  <BookCard 
                    key={book.id} 
                    book={book}
                    animationDelay={index * 50}
                  />
                ))}
              </div>
            ) : (!isLoading && !isError && (
              <div className="p-12 text-center bg-gray-50 rounded-lg animate-fade-in">
                <div className="mb-4 text-gray-400">
                  <ShoppingCart className="h-12 w-12 mx-auto" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No books found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ))}

            {/* Pagination */}
            {!isLoading && !isError && booksData?.totalPages && booksData.totalPages > 1 && (
              <Pagination 
                currentPage={page}
                totalPages={booksData.totalPages}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookListingPage;
