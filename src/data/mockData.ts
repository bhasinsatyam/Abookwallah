
import { Book } from "@/types/book";
import { Testimonial } from "@/types/testimonial";

// Use our existing book type definition and remove 'tags' property
export const mockBooks: Book[] = [
  // First book
  {
    id: "1",
    title: "Indian Polity (Civil Services Examination Series)",
    author: "M. Laxmikanth",
    coverImage: "https://m.media-amazon.com/images/I/81U3+6n3s1L._AC_UY436_FMwebp_QL65_.jpg",
    price: 599,
    originalPrice: 830,
    rating: 4.7,
    reviews: 4582,
    description: "The book 'Indian Polity' by M Laxmikanth needs no introduction. It's one of the most popular and comprehensive books on the subject and has been a consistent bestseller for the last two decades. It is a must-read for aspirants appearing for the Civil Services examinations as well as those of the various State Public Service Commissions.",
    category: "UPSC",
    language: "English",
    publisher: "McGraw Hill",
    publicationDate: "2022-01-01",
    isbn: "9789354407727",
    pageCount: 852,
    edition: "1st Edition",
    binding: "Paperback",
    isNew: true,
    hasFreeDelivery: true,
    hasRentOption: true,
    isAvailableForResell: true,
    stockStatus: "in_stock"
  },
  // Add more mock books as needed for fallback
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    text: "BookWala.com has been a game-changer for my UPSC preparation. The collection of books is amazing, and the reselling option helped me save a lot of money. Highly recommended!",
    rating: 5,
    location: "Delhi University",
    date: new Date().toISOString(),
  },
  // Add more mock testimonials as needed for fallback
];

export const mockCategories = [
  { id: "1", name: "UPSC", bookCount: 120 },
  { id: "2", name: "JEE", bookCount: 85 },
  { id: "3", name: "NEET", bookCount: 78 },
  { id: "4", name: "Banking", bookCount: 65 },
  { id: "5", name: "School Books", bookCount: 210 },
  { id: "6", name: "College Books", bookCount: 175 },
  { id: "7", name: "Fiction", bookCount: 97 },
  { id: "8", name: "Non-fiction", bookCount: 83 },
  { id: "9", name: "Self-help", bookCount: 42 },
  { id: "10", name: "Programming", bookCount: 56 },
  { id: "11", name: "Business", bookCount: 38 },
  { id: "12", name: "History", bookCount: 45 },
  { id: "13", name: "Politics", bookCount: 29 },
  { id: "14", name: "Science", bookCount: 67 },
  { id: "15", name: "Engineering", bookCount: 94 }
];
