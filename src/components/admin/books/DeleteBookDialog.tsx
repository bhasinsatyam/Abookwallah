
import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteBookDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleDeleteBook: () => void;
  isDeleting: boolean;
  resetBookToDelete: () => void;
}

const DeleteBookDialog: React.FC<DeleteBookDialogProps> = ({
  isOpen,
  setIsOpen,
  handleDeleteBook,
  isDeleting,
  resetBookToDelete,
}) => {
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this book? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={resetBookToDelete}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteBook}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBookDialog;
