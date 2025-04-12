
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksService } from '@/services';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getOrCreateCart, addToCart } from '@/services/cartService';

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        setLoading(true);
        const { book, error } = await booksService.getBookById(id);
        if (book) {
          setBook(book);
        } else {
          console.error("Error fetching book:", error);
          toast.error("Error fetching book: " + error);
          // Optionally redirect to a safe route
          navigate('/');
        }
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleAddToCart = async (isRental = false, rentalPeriod = null) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      navigate('/login');
      return;
    }

    if (!book || !book.id) {
      toast.error("Cannot add to cart: Book data is missing");
      return;
    }

    try {
      // First get or create the user's cart
      const { cart, error: cartError } = await getOrCreateCart(user.id);
      
      if (cartError || !cart) {
        toast.error("Error getting cart: " + (cartError || "Unknown error"));
        return;
      }

      // Add the book to the cart
      const { success, error } = await addToCart({
        cartId: cart.id,
        bookId: book.id,
        quantity: 1,
        isRental,
        rentalPeriod
      });

      if (success) {
        toast.success(`${book.title} has been added to your cart`);
      } else {
        toast.error("Failed to add to cart: " + error);
      }
    } catch (err: any) {
      console.error("Add to cart error:", err);
      toast.error("An error occurred while adding to cart");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading book details...</div>;
  }

  if (!book) {
    return <div className="text-center py-10 text-red-500">Book not found</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Cover */}
        <div>
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full rounded-lg shadow-xl"
          />
        </div>

        {/* Book Details */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{book.title}</h1>
          <p className="text-gray-600 mb-2">By {book.author}</p>

          {/* Rating and Reviews */}
          <div className="flex items-center mb-4">
            <div className="flex text-amber-400 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < book.rating ? 'fill-current' : 'stroke-current fill-transparent'}`}
                />
              ))}
            </div>
            <span className="text-gray-700">{book.rating} ({book.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-xl font-bold text-gray-900">${book.price}</span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-gray-500 line-through ml-2">${book.originalPrice}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{book.description}</p>

          {/* Details List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Category: {book.category}</li>
              <li>Language: {book.language}</li>
              <li>Publisher: {book.publisher}</li>
              <li>
                Publication Date:
                <span className="text-gray-700">
                  {book.publicationDate instanceof Date
                    ? book.publicationDate.toLocaleDateString()
                    : typeof book.publicationDate === 'string'
                      ? new Date(book.publicationDate).toLocaleDateString()
                      : ''}
                </span>
              </li>
              <li>ISBN: {book.isbn}</li>
              <li>Page Count: {book.pageCount}</li>
              <li>Edition: {book.edition}</li>
              <li>Binding: {book.binding}</li>
            </ul>
          </div>

          {/* Availability and Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
            <p className="text-gray-700">
              {book.stockStatus === 'in_stock'
                ? 'In Stock'
                : book.stockStatus === 'low_stock'
                  ? 'Low Stock'
                  : 'Out of Stock'}
            </p>
            {book.hasFreeDelivery && <p className="text-green-600">Free Delivery Available</p>}
            {book.hasRentOption && <p className="text-blue-600">Rental Option Available</p>}
            {book.isAvailableForResell && <p className="text-purple-600">Available for Resell</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={() => handleAddToCart(false)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            {book.hasRentOption && (
              <Button variant="secondary" onClick={() => handleAddToCart(true, 3)}>
                Rent for 3 Months
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
