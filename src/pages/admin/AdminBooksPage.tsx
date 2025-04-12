
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services';
import { Book } from '@/types/book';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BookFilters from '@/components/admin/books/BookFilters';
import BooksList from '@/components/admin/books/BooksList';
import Pagination from '@/components/admin/books/Pagination';
import BookDialog from '@/components/admin/books/BookDialog';
import DeleteBookDialog from '@/components/admin/books/DeleteBookDialog';

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  
  // State for dialogs
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // State for selection and pagination
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    coverImage: '',
    price: 0,
    originalPrice: 0,
    description: '',
    category: 'uncategorized',
    language: '',
    publisher: '',
    publicationDate: new Date().toISOString().split('T')[0],
    isbn: '',
    pageCount: 0,
    edition: '',
    binding: '',
    isNew: true,
    hasFreeDelivery: false,
    hasRentOption: false,
    isAvailableForResell: false,
    stockStatus: 'in_stock'
  });

  // Fetch books data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminBooks', page, limit, search, category],
    queryFn: () => adminService.getAllBooks({ page, limit, search, category }),
  });

  // Fetch categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminService.getCategories(),
  });

  // Mutations
  const createBookMutation = useMutation({
    mutationFn: (bookData: Partial<Book>) => adminService.createBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      setIsAddBookModalOpen(false);
      resetForm();
      toast.success('Book created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create book: ' + error.message);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, bookData }: { id: string; bookData: Partial<Book> }) =>
      adminService.updateBook(id, bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      setIsEditBookModalOpen(false);
      resetForm();
      toast.success('Book updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update book: ' + error.message);
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      setIsDeleteConfirmOpen(false);
      setBookToDelete(null);
      toast.success('Book deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete book: ' + error.message);
    },
  });

  // Reset search results when filters change
  useEffect(() => {
    if (search || category) {
      setPage(1);
    }
  }, [search, category]);

  // Helper function to ensure we never have empty category values
  const ensureValidCategory = (category: string | null | undefined): string => {
    const validCategory = category?.trim();
    return validCategory && validCategory !== '' ? validCategory : 'uncategorized';
  };

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      coverImage: '',
      price: 0,
      originalPrice: 0,
      description: '',
      category: 'uncategorized',
      language: '',
      publisher: '',
      publicationDate: new Date().toISOString().split('T')[0],
      isbn: '',
      pageCount: 0,
      edition: '',
      binding: '',
      isNew: true,
      hasFreeDelivery: false,
      hasRentOption: false,
      isAvailableForResell: false,
      stockStatus: 'in_stock'
    });
    setBookToEdit(null);
  };

  // Modal handlers
  const openAddBookModal = () => {
    resetForm();
    setIsAddBookModalOpen(true);
  };

  const openEditBookModal = (book: Book) => {
    setBookToEdit(book);
    setFormData({
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      price: book.price,
      originalPrice: book.originalPrice,
      description: book.description,
      category: ensureValidCategory(book.category),
      language: book.language,
      publisher: book.publisher,
      publicationDate: book.publicationDate instanceof Date
        ? book.publicationDate.toISOString().split('T')[0]
        : book.publicationDate,
      isbn: book.isbn,
      pageCount: book.pageCount,
      edition: book.edition || '',
      binding: book.binding,
      isNew: book.isNew,
      hasFreeDelivery: book.hasFreeDelivery,
      hasRentOption: book.hasRentOption,
      isAvailableForResell: book.isAvailableForResell,
      stockStatus: book.stockStatus
    });
    setIsEditBookModalOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    console.log("Opening delete confirmation for book ID:", id);
    setBookToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookToEdit) {
      updateBookMutation.mutate({
        id: bookToEdit.id,
        bookData: formData
      });
    } else {
      createBookMutation.mutate(formData);
    }
  };

  // Delete book
  const handleDeleteBook = () => {
    if (bookToDelete) {
      console.log("Confirming deletion of book ID:", bookToDelete);
      deleteBookMutation.mutate(bookToDelete);
    }
  };

  // Pagination handlers
  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (data?.totalPages && page < data.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <Button onClick={openAddBookModal} className="flex items-center gap-1">
          <Plus size={18} />
          Add New Book
        </Button>
      </div>

      <BookFilters 
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categoriesQuery.data?.categories || []}
        count={data?.books?.length || 0}
        totalCount={data?.count || 0}
        ensureValidCategory={ensureValidCategory}
      />

      <BooksList 
        books={data?.books || []}
        isLoading={isLoading}
        isError={isError}
        openEditBookModal={openEditBookModal}
        openDeleteConfirm={openDeleteConfirm}
      />

      <Pagination 
        currentPage={page}
        totalPages={data?.totalPages || 0}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />

      <BookDialog 
        isOpen={isAddBookModalOpen || isEditBookModalOpen}
        setIsOpen={(open) => {
          if (bookToEdit) {
            setIsEditBookModalOpen(open);
          } else {
            setIsAddBookModalOpen(open);
          }
        }}
        formData={formData}
        categories={categoriesQuery.data?.categories || []}
        handleChange={handleChange}
        handleSwitchChange={handleSwitchChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
        isSubmitting={createBookMutation.isPending || updateBookMutation.isPending}
        bookToEdit={bookToEdit}
        resetForm={resetForm}
        ensureValidCategory={ensureValidCategory}
      />

      <DeleteBookDialog 
        isOpen={isDeleteConfirmOpen}
        setIsOpen={setIsDeleteConfirmOpen}
        handleDeleteBook={handleDeleteBook}
        isDeleting={deleteBookMutation.isPending}
        resetBookToDelete={() => setBookToDelete(null)}
      />
    </div>
  );
}
