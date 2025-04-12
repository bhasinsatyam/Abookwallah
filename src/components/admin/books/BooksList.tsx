
import React from 'react';
import { Book } from '@/types/book';
import { Loader2, FileEdit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface BooksListProps {
  books: Book[];
  isLoading: boolean;
  isError: boolean;
  openEditBookModal: (book: Book) => void;
  openDeleteConfirm: (id: string) => void;
}

const BooksList: React.FC<BooksListProps> = ({
  books,
  isLoading,
  isError,
  openEditBookModal,
  openDeleteConfirm,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading books. Please try again.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books?.length > 0 ? (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>₹{book.price}</TableCell>
                <TableCell>{book.category || "Uncategorized"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        book.stockStatus === 'in_stock'
                          ? 'bg-green-500'
                          : book.stockStatus === 'low_stock'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                    {book.stockStatus === 'in_stock'
                      ? 'In Stock'
                      : book.stockStatus === 'low_stock'
                      ? 'Low Stock'
                      : 'Out of Stock'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditBookModal(book)}
                      title="Edit book"
                    >
                      <FileEdit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => openDeleteConfirm(book.id)}
                      title="Delete book"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No books found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BooksList;
