
import React from 'react';
import { Book } from '@/types/book';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

interface BookFormProps {
  formData: Partial<Book>;
  categories: string[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleNumberChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCategoryChange: (value: string) => void;
  isSubmitting: boolean;
  bookToEdit: Book | null;
  ensureValidCategory: (category: string | null | undefined) => string;
}

const BookForm: React.FC<BookFormProps> = ({
  formData,
  categories,
  handleChange,
  handleSwitchChange,
  handleNumberChange,
  handleSubmit,
  handleCategoryChange,
  isSubmitting,
  bookToEdit,
  ensureValidCategory,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleNumberChange('price', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={(e) =>
                handleNumberChange('originalPrice', e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={ensureValidCategory(formData.category)}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat: string) => (
                  <SelectItem key={cat} value={ensureValidCategory(cat)}>
                    {ensureValidCategory(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="pageCount">Page Count</Label>
            <Input
              id="pageCount"
              name="pageCount"
              type="number"
              value={formData.pageCount}
              onChange={(e) =>
                handleNumberChange('pageCount', e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="publicationDate">Publication Date</Label>
            <Input
              id="publicationDate"
              name="publicationDate"
              type="date"
              value={typeof formData.publicationDate === 'string' ? formData.publicationDate : formData.publicationDate?.toString()}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="edition">Edition</Label>
            <Input
              id="edition"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="binding">Binding</Label>
            <Input
              id="binding"
              name="binding"
              value={formData.binding}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="stockStatus">Stock Status</Label>
            <Select
              value={formData.stockStatus}
              onValueChange={(value) =>
                handleSwitchChange('stockStatus', value as any)
              }
            >
              <SelectTrigger id="stockStatus">
                <SelectValue placeholder="Select Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isNew"
              checked={formData.isNew}
              onCheckedChange={(checked) =>
                handleSwitchChange('isNew', checked)
              }
            />
            <Label htmlFor="isNew">New Book</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasFreeDelivery"
              checked={formData.hasFreeDelivery}
              onCheckedChange={(checked) =>
                handleSwitchChange('hasFreeDelivery', checked)
              }
            />
            <Label htmlFor="hasFreeDelivery">Free Delivery</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasRentOption"
              checked={formData.hasRentOption}
              onCheckedChange={(checked) =>
                handleSwitchChange('hasRentOption', checked)
              }
            />
            <Label htmlFor="hasRentOption">Rental Option</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailableForResell"
              checked={formData.isAvailableForResell}
              onCheckedChange={(checked) =>
                handleSwitchChange('isAvailableForResell', checked)
              }
            />
            <Label htmlFor="isAvailableForResell">Available for Resell</Label>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {bookToEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : bookToEdit ? (
            'Update Book'
          ) : (
            'Add Book'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BookForm;
