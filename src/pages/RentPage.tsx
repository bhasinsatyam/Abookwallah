
import { useState } from "react";
import { 
  Clock, 
  Calendar, 
  ChevronRight, 
  SearchIcon,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBooks } from "@/data/mockData";
import BookCard from "@/components/BookCard";

const RentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(mockBooks.filter(book => book.hasRentOption).slice(0, 8));
  
  const popularBooks = mockBooks.filter(book => book.hasRentOption).sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const newArrivals = mockBooks.filter(book => book.hasRentOption && book.isNew).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockBooks.filter(book => 
      book.hasRentOption && 
      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       book.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredBooks(filtered);
  };

  const rentalPeriods = [
    { id: 1, period: "1 Month", discount: "0%" },
    { id: 2, period: "3 Months", discount: "10%" },
    { id: 3, period: "6 Months", discount: "20%" },
  ];

  const categories = [
    { id: 1, name: "UPSC/IAS", count: 120, icon: "📚" },
    { id: 2, name: "SSC & Banking", count: 95, icon: "🏦" },
    { id: 3, name: "JEE & NEET", count: 85, icon: "🔬" },
    { id: 4, name: "GATE & ESE", count: 70, icon: "🛠️" },
    { id: 5, name: "School Books", count: 150, icon: "🏫" },
    { id: 6, name: "Fiction", count: 50, icon: "📖" },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-rent-50 to-rent-100 rounded-2xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="flex flex-col justify-center animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Rent Books at <span className="text-rent-600">50-70% Less</span> Than Buying
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Access the books you need without paying full price. Perfect for competitive exam preparation.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-rent-500" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Rental Periods</p>
                    <p className="text-sm text-gray-600">Choose from 1, 3, or 6 month rentals</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-rent-500" />
                  </div>
                  <div>
                    <p className="font-medium">Quality Guaranteed</p>
                    <p className="text-sm text-gray-600">All books are in excellent condition</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-rent-500" />
                  </div>
                  <div>
                    <p className="font-medium">Buy Option Available</p>
                    <p className="text-sm text-gray-600">Option to buy at end of rental period</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search for books to rent..."
                  className="pl-10 h-12 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 bg-rent-500 hover:bg-rent-600"
                >
                  Search
                </Button>
              </form>
            </div>
            
            <div className="hidden md:flex items-center justify-center relative animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rent-200/40 to-rent-400/40 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                  alt="Books for rent" 
                  className="rounded-2xl shadow-xl max-w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card rounded-xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-rent-100 h-12 w-12 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-rent-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Save up to</p>
                    <p className="text-lg font-semibold">70% on Rentals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="section-title text-center">How Book Renting Works</h2>
          <p className="section-subtitle text-center">
            Renting books is simple, affordable, and hassle-free
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle text-center animate-fade-up" style={{ animationDelay: "0ms" }}>
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-rent-100 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-rent-600">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Your Books</h3>
              <p className="text-gray-600">
                Browse our collection and select the books you want to rent. Add them to your cart.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle text-center animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-rent-100 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-rent-600">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Select Rental Period</h3>
              <p className="text-gray-600">
                Choose how long you need the books - 1, 3, or 6 months. Longer periods get bigger discounts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-rent-100 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-rent-600">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Use & Return</h3>
              <p className="text-gray-600">
                Use the books during your rental period and return them when done, or choose to buy them.
              </p>
            </div>
          </div>
        </div>

        {/* Rental Period Options */}
        <div className="mb-16">
          <h2 className="section-title text-center">Choose Your Rental Period</h2>
          <p className="section-subtitle text-center">
            Select the rental duration that works best for your study plan
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {rentalPeriods.map((period, index) => (
              <div 
                key={period.id} 
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle relative overflow-hidden animate-fade-up" 
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {period.discount !== "0%" && (
                  <div className="absolute top-0 right-0 bg-rent-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Save {period.discount}
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-rent-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-rent-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{period.period}</h3>
                  <p className="text-gray-600 mb-4">
                    {period.id === 1 && "Perfect for short-term exam preparation"}
                    {period.id === 2 && "Ideal for semester studies or multiple exams"}
                    {period.id === 3 && "Best value for long-term preparation"}
                  </p>
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Rental Rate</span>
                      <span className="text-rent-600 font-semibold">
                        {period.id === 1 && "40% of MRP"}
                        {period.id === 2 && "35% of MRP"}
                        {period.id === 3 && "30% of MRP"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Security Deposit</span>
                      <span className="text-gray-700 font-semibold">
                        {period.id === 1 && "40% of MRP"}
                        {period.id === 2 && "35% of MRP"}
                        {period.id === 3 && "30% of MRP"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Extension Option</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <Button className="mt-6 btn-rent w-full">
                    Browse Books
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Browsing */}
        <div className="mb-16">
          <h2 className="section-title text-center">Browse by Category</h2>
          <p className="section-subtitle text-center">
            Find the perfect books for your specific exam or subject
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="flex flex-col items-center bg-white p-6 rounded-xl border border-gray-100 shadow-subtle hover:shadow-md transition-all cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="h-12 w-12 rounded-full bg-rent-100 flex items-center justify-center mb-3 text-2xl">
                  {category.icon}
                </div>
                <h3 className="text-center font-medium text-gray-900 mb-1">{category.name}</h3>
                <p className="text-xs text-rent-600">{category.count} Books for Rent</p>
              </div>
            ))}
          </div>
        </div>

        {/* Book Listings */}
        <div className="mb-16">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-8">
              <h2 className="section-title">Books Available for Rent</h2>
              <TabsList className="grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="all" className="text-sm py-2 px-4">All Books</TabsTrigger>
                <TabsTrigger value="popular" className="text-sm py-2 px-4">Popular</TabsTrigger>
                <TabsTrigger value="new" className="text-sm py-2 px-4">New Arrivals</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book, index) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      animationDelay={index * 50}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-lg font-medium mb-2">No books found</p>
                    <p className="text-gray-500 mb-4">Try adjusting your search query</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setFilteredBooks(mockBooks.filter(book => book.hasRentOption).slice(0, 8));
                      }}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
              
              {filteredBooks.length > 8 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-10 h-10">
                      1
                    </Button>
                    <Button variant="outline" className="w-10 h-10">
                      2
                    </Button>
                    <Button variant="outline" className="w-10 h-10">
                      3
                    </Button>
                    <Button variant="outline" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {popularBooks.map((book, index) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    animationDelay={index * 50}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map((book, index) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    animationDelay={index * 50}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-8">
            <Button className="btn-rent">
              View All Rentable Books
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <p className="section-subtitle text-center">
            Common questions about our book rental service
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle animate-fade-up" style={{ animationDelay: "0ms" }}>
              <h3 className="text-lg font-semibold mb-3">How does the security deposit work?</h3>
              <p className="text-gray-600">
                We collect a refundable security deposit when you rent a book. This deposit is returned to you when you return the book in good condition. If there's damage beyond normal wear and tear, a portion of the deposit may be kept.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle animate-fade-up" style={{ animationDelay: "100ms" }}>
              <h3 className="text-lg font-semibold mb-3">Can I extend my rental period?</h3>
              <p className="text-gray-600">
                Yes, you can extend your rental period by paying the additional rental fee. Simply contact us before your current rental period expires, and we'll arrange the extension for you.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle animate-fade-up" style={{ animationDelay: "200ms" }}>
              <h3 className="text-lg font-semibold mb-3">What if I want to keep the book?</h3>
              <p className="text-gray-600">
                If you decide to keep the book, you can convert your rental to a purchase. The rental fee you've already paid will be deducted from the purchase price, and you'll only pay the difference.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle animate-fade-up" style={{ animationDelay: "300ms" }}>
              <h3 className="text-lg font-semibold mb-3">Can I highlight or write in the rented books?</h3>
              <p className="text-gray-600">
                We ask that you do not highlight, write, or mark the books in any way. Books returned with markings will be considered damaged, and a portion of your security deposit may be kept.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle animate-fade-up" style={{ animationDelay: "400ms" }}>
              <h3 className="text-lg font-semibold mb-3">What is the condition of the rental books?</h3>
              <p className="text-gray-600">
                All our rental books are in excellent condition. We carefully inspect each book before sending it out to ensure that it meets our quality standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle animate-fade-up" style={{ animationDelay: "500ms" }}>
              <h3 className="text-lg font-semibold mb-3">How do I return the books?</h3>
              <p className="text-gray-600">
                You can return the books at our store in Mukherjee Nagar, New Delhi. For customers outside Delhi, we provide a return shipping label that you can use to send the books back to us.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-rent-800 to-rent-600 rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Save on Your Exam Preparation?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Rent the books you need at a fraction of the cost. Start browsing our collection today!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-rent-700 hover:bg-gray-100 transition-all duration-300 px-8 py-3 rounded-lg font-medium shadow-sm">
                  Browse Rental Books
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 transition-all duration-300 px-8 py-3 rounded-lg font-medium">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;
