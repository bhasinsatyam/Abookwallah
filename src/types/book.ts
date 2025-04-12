
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  language: string;
  publisher: string;
  publicationDate: string | Date;
  isbn: string;
  pageCount: number;
  edition: string;
  binding: string;
  isNew: boolean;
  hasFreeDelivery: boolean;
  hasRentOption: boolean;
  isAvailableForResell: boolean;
  stockStatus: string;
  created_at?: string;
  updated_at?: string;
}

// Database to model mapper function
export function mapDatabaseBookToModel(dbBook: any): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    coverImage: dbBook.cover_image,
    price: dbBook.price,
    originalPrice: dbBook.original_price,
    rating: dbBook.rating || 0,
    reviews: dbBook.reviews || 0,
    description: dbBook.description,
    category: dbBook.category,
    language: dbBook.language,
    publisher: dbBook.publisher,
    publicationDate: dbBook.publication_date,
    isbn: dbBook.isbn,
    pageCount: dbBook.page_count,
    edition: dbBook.edition || '',
    binding: dbBook.binding,
    isNew: dbBook.is_new,
    hasFreeDelivery: dbBook.has_free_delivery,
    hasRentOption: dbBook.has_rent_option,
    isAvailableForResell: dbBook.is_available_for_resell,
    stockStatus: dbBook.stock_status,
    created_at: dbBook.created_at,
    updated_at: dbBook.updated_at
  };
}

// Model to database mapper function
export function mapModelBookToDatabase(book: Partial<Book>): any {
  const result: any = {};
  
  if (book.id !== undefined) result.id = book.id;
  if (book.title !== undefined) result.title = book.title;
  if (book.author !== undefined) result.author = book.author;
  if (book.coverImage !== undefined) result.cover_image = book.coverImage;
  if (book.price !== undefined) result.price = book.price;
  if (book.originalPrice !== undefined) result.original_price = book.originalPrice;
  if (book.rating !== undefined) result.rating = book.rating;
  if (book.reviews !== undefined) result.reviews = book.reviews;
  if (book.description !== undefined) result.description = book.description;
  if (book.category !== undefined) result.category = book.category;
  if (book.language !== undefined) result.language = book.language;
  if (book.publisher !== undefined) result.publisher = book.publisher;
  
  // Handle date conversion properly
  if (book.publicationDate !== undefined) {
    if (typeof book.publicationDate === 'string') {
      result.publication_date = book.publicationDate;
    } else if (book.publicationDate instanceof Date) {
      result.publication_date = book.publicationDate.toISOString().split('T')[0];
    }
  }
  
  if (book.isbn !== undefined) result.isbn = book.isbn;
  if (book.pageCount !== undefined) result.page_count = book.pageCount;
  if (book.edition !== undefined) result.edition = book.edition;
  if (book.binding !== undefined) result.binding = book.binding;
  if (book.isNew !== undefined) result.is_new = book.isNew;
  if (book.hasFreeDelivery !== undefined) result.has_free_delivery = book.hasFreeDelivery;
  if (book.hasRentOption !== undefined) result.has_rent_option = book.hasRentOption;
  if (book.isAvailableForResell !== undefined) result.is_available_for_resell = book.isAvailableForResell;
  if (book.stockStatus !== undefined) result.stock_status = book.stockStatus;
  
  return result;
}
