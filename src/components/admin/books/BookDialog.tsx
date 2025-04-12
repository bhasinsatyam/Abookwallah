
import React from 'react';
import { Book } from '@/types/book';
import BookForm from './BookForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface BookDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  formData: Partial<Book>;
  categories: string[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleNumberChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  bookToEdit: Book | null;
  resetForm: () => void;
  ensureValidCategory: (category: string | null | undefined) => string;
}

const BookDialog: React.FC<BookDialogProps> = ({
  isOpen,
  setIsOpen,
  formData,
  categories,
  handleChange,
  handleSwitchChange,
  handleNumberChange,
  handleSubmit,
  isSubmitting,
  bookToEdit,
  resetForm,
  ensureValidCategory,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  // Fix: Modified to handle string values correctly instead of treating them as booleans
  const handleCategoryChange = (value: string) => {
    // Update the category in the form data
    handleChange({ target: { name: 'category', value } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bookToEdit ? 'Edit Book' : 'Add New Book'}
          </DialogTitle>
          <DialogDescription>
            {bookToEdit
              ? 'Update the book information.'
              : 'Fill in the details to add a new book.'}
          </DialogDescription>
        </DialogHeader>

        <BookForm
          formData={formData}
          categories={categories}
          handleChange={handleChange}
          handleSwitchChange={handleSwitchChange}
          handleNumberChange={handleNumberChange}
          handleSubmit={handleSubmit}
          handleCategoryChange={handleCategoryChange}
          isSubmitting={isSubmitting}
          bookToEdit={bookToEdit}
          ensureValidCategory={ensureValidCategory}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookDialog;
