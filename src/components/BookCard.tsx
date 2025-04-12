import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Book, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Book as BookType } from "@/types/book";

interface BookCardProps {
  book: BookType;
  animationDelay?: number;
}

const BookCard = ({ book, animationDelay = 0 }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const discount = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);

  const handleImageError = () => {
    setImageError(true);
    console.log(`Image failed to load for book: ${book.title}`);
  };

  return (
    <div 
      className="group bg-white rounded-xl border border-gray-100 shadow-subtle hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-up flex flex-col"
      style={{ animationDelay: `${animationDelay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card header - Image and badges */}
      <div className="relative pt-4 px-4 overflow-hidden">
        {discount > 0 && (
          <Badge className="absolute top-6 left-6 z-10 bg-red-500 hover:bg-red-600">
            -{discount}%
          </Badge>
        )}
        
        {book.isNew && (
          <Badge className="absolute top-6 right-6 z-10 bg-green-500 hover:bg-green-600">
            New
          </Badge>
        )}
        
        <Link to={`/books/${book.id}`} className="block">
          <div className="relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
            {!imageError ? (
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className={`h-full object-contain transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                onError={handleImageError}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-gray-100">
                <div className="bg-gray-200 p-2 rounded-md">
                  <p className="text-gray-500 text-sm font-medium">{book.title}</p>
                </div>
              </div>
            )}
            
            {/* Quick view overlay */}
            <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center text-amber-400 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(book.rating) ? 'fill-current' : 'stroke-current fill-transparent'}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({book.reviews})</span>
          </div>
          
          <Link to={`/books/${book.id}`}>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-bookwala-600 transition-colors">
              {book.title}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-500 mb-2">
            {book.author}
          </p>
          
          {book.edition && (
            <p className="text-xs text-gray-400 mb-2">
              Edition: {book.edition}
            </p>
          )}
        </div>
        
        <div className="mt-2 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-gray-900">₹{book.price}</span>
              {book.originalPrice > book.price && (
                <span className="text-sm text-gray-400 line-through">₹{book.originalPrice}</span>
              )}
            </div>
            
            {book.hasRentOption && (
              <p className="text-xs text-rent-600 font-medium">
                Rent from ₹{Math.round(book.price * 0.4)}/month
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md border-gray-200"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Book
                      className={`h-4 w-4 ${isWishlisted ? 'fill-bookwala-500 text-bookwala-500' : 'text-gray-500'}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              variant="default"
              size="icon"
              className="h-9 w-9 rounded-md bg-bookwala-500 hover:bg-bookwala-600"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
