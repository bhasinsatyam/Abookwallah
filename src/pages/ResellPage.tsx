
import { useState, useRef } from "react";
import { 
  ArrowRight, 
  Upload, 
  Trash, 
  RotateCw, 
  Check, 
  Camera, 
  IndianRupee,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { submitResellRequest, uploadResellImage } from "@/services/userService";
import { v4 as uuidv4 } from 'uuid';

const ResellPage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [bookInfo, setBookInfo] = useState({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    condition: "",
    category: "",
    description: "",
    askingPrice: "",
    contactPhone: ""
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setBookInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Limit to 5 images total
    if (images.length + e.target.files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImgLoading(true);
    setUploadError(null);
    
    const newFiles = Array.from(e.target.files);
    
    // Preview images
    for (const file of newFiles) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError("Only image files are allowed");
          setImgLoading(false);
          return;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("Image size must be less than 5MB");
          setImgLoading(false);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
            setImageFiles(prev => [...prev, file]);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        setUploadError("Error processing image. Please try another file.");
      }
    }
    
    setImgLoading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitResellRequestWithImages = async () => {
    try {
      if (!user) {
        toast.error("Please log in to submit a resell request");
        return;
      }
      
      const resellRequestId = uuidv4();
      let imageUrls: string[] = [];
      
      // Upload images to Supabase Storage
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file, index) => 
          uploadResellImage(resellRequestId, file, index)
        );
        
        const results = await Promise.all(uploadPromises);
        imageUrls = results.filter(url => url !== null) as string[];
      }
      
      // Submit resell request with image URLs
      const { request, error } = await submitResellRequest({
        userId: user.id,
        bookTitle: bookInfo.title,
        bookAuthor: bookInfo.author,
        bookIsbn: bookInfo.isbn,
        bookCondition: bookInfo.condition,
        askingPrice: bookInfo.askingPrice ? parseFloat(bookInfo.askingPrice) : undefined,
        description: bookInfo.description,
        contactPhone: bookInfo.contactPhone || "Not provided",
        imageUrls: imageUrls
      });
      
      if (error) {
        toast.error("Failed to submit: " + error);
        return;
      }
      
      // Success
      toast.success("Resell request submitted successfully!");
      
      // Reset form
      setStep(1);
      setBookInfo({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        condition: "",
        category: "",
        description: "",
        askingPrice: "",
        contactPhone: ""
      });
      setImages([]);
      setImageFiles([]);
    } catch (error: any) {
      console.error("Error submitting resell request:", error);
      toast.error("Error submitting request: " + error.message);
    }
  };

  const isFormValid = () => {
    if (step === 1) {
      return bookInfo.title && bookInfo.author && bookInfo.condition && bookInfo.category && bookInfo.contactPhone;
    }
    if (step === 2) {
      return images.length > 0;
    }
    if (step === 3) {
      return bookInfo.askingPrice !== "";
    }
    return true;
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Info */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-subtle p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sell Your Books</h1>
              <p className="text-gray-600 mb-6">
                Turn your used books into cash or store credit. Our team will evaluate your books and offer you the best price.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step >= 1 ? 'bg-bookwala-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <div>
                    <h3 className={`font-medium ${step === 1 ? 'text-bookwala-600' : 'text-gray-700'}`}>
                      Book Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      Provide information about your book
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step >= 2 ? 'bg-bookwala-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <div>
                    <h3 className={`font-medium ${step === 2 ? 'text-bookwala-600' : 'text-gray-700'}`}>
                      Upload Photos
                    </h3>
                    <p className="text-sm text-gray-500">
                      Add photos of the book
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step >= 3 ? 'bg-bookwala-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > 3 ? <Check className="h-5 w-5" /> : "3"}
                  </div>
                  <div>
                    <h3 className={`font-medium ${step === 3 ? 'text-bookwala-600' : 'text-gray-700'}`}>
                      Set Your Price
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose how much you want for your book
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step >= 4 ? 'bg-bookwala-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > 4 ? <Check className="h-5 w-5" /> : "4"}
                  </div>
                  <div>
                    <h3 className={`font-medium ${step === 4 ? 'text-bookwala-600' : 'text-gray-700'}`}>
                      Review & Submit
                    </h3>
                    <p className="text-sm text-gray-500">
                      Confirm your details and submit
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Have questions about selling your books?
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-2/3 xl:w-3/4 animate-fade-in">
            <div className="bg-white rounded-xl border border-gray-100 shadow-subtle p-6 md:p-8">
              {/* Step 1: Book Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Book Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Book Title*</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={bookInfo.title} 
                        onChange={handleChange}
                        placeholder="Enter the title of the book"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Author*</Label>
                      <Input 
                        id="author" 
                        name="author" 
                        value={bookInfo.author} 
                        onChange={handleChange}
                        placeholder="Enter the author's name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="publisher">Publisher</Label>
                      <Input 
                        id="publisher" 
                        name="publisher" 
                        value={bookInfo.publisher} 
                        onChange={handleChange}
                        placeholder="Enter the publisher's name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input 
                        id="isbn" 
                        name="isbn" 
                        value={bookInfo.isbn} 
                        onChange={handleChange}
                        placeholder="Enter the ISBN (if available)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition*</Label>
                      <Select 
                        value={bookInfo.condition} 
                        onValueChange={(value) => handleSelectChange("condition", value)}
                      >
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="very-good">Very Good</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category*</Label>
                      <Select 
                        value={bookInfo.category} 
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upsc">UPSC/IAS</SelectItem>
                          <SelectItem value="ssc">SSC & Banking</SelectItem>
                          <SelectItem value="jee">JEE & NEET</SelectItem>
                          <SelectItem value="gate">GATE & ESE</SelectItem>
                          <SelectItem value="psc">State PSC</SelectItem>
                          <SelectItem value="school">School Books</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone*</Label>
                      <Input 
                        id="contactPhone" 
                        name="contactPhone" 
                        value={bookInfo.contactPhone} 
                        onChange={handleChange}
                        placeholder="Enter your contact number"
                        type="tel"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={bookInfo.description} 
                        onChange={handleChange}
                        placeholder="Provide additional details about the book (e.g., edition, markings, damage if any)"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button 
                      onClick={nextStep} 
                      disabled={!isFormValid()}
                      className="btn-primary"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Upload Photos */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Upload Photos</h2>
                  <p className="text-gray-600 mb-6">
                    Please upload clear images of the book. Include the front cover, back cover, and any pages with notes or damage.
                  </p>
                  
                  {uploadError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {images.map((img, index) => (
                      <div 
                        key={index} 
                        className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img 
                          src={img} 
                          alt={`Book image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => removeImage(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <button 
                        type="button"
                        onClick={triggerFileInput}
                        disabled={imgLoading}
                        className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-bookwala-500 transition-colors cursor-pointer p-4"
                      >
                        {imgLoading ? (
                          <div className="animate-spin">
                            <RotateCw className="h-8 w-8 text-gray-400" />
                          </div>
                        ) : (
                          <>
                            <Camera className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 text-center">
                              {images.length === 0 ? "Add book photos" : "Add more photos"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 text-center">
                              {images.length}/5 images
                            </p>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-700 mb-2">Tips for Good Photos</h3>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Use good lighting to show the book clearly</li>
                      <li>• Capture all corners and edges to show condition</li>
                      <li>• Include images of any damage or markings</li>
                      <li>• Make sure ISBN is visible in one of the photos</li>
                    </ul>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={!isFormValid()}
                      className="btn-primary"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Set Price */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Set Your Price</h2>
                  <p className="text-gray-600 mb-6">
                    How much would you like to get for your book? Our team will review your price and may suggest adjustments based on market value.
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold mb-4">Suggested Prices Based on Condition</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-md p-4 bg-white">
                        <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-200">Like New</Badge>
                        <p className="font-medium text-lg">50-70%</p>
                        <p className="text-sm text-gray-500">of original price</p>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 bg-white">
                        <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-200">Good</Badge>
                        <p className="font-medium text-lg">30-50%</p>
                        <p className="text-sm text-gray-500">of original price</p>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 bg-white">
                        <Badge className="mb-2 bg-orange-100 text-orange-800 hover:bg-orange-200">Fair</Badge>
                        <p className="font-medium text-lg">10-30%</p>
                        <p className="text-sm text-gray-500">of original price</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <Label htmlFor="askingPrice">Your Asking Price (₹)*</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="askingPrice" 
                        name="askingPrice" 
                        type="number"
                        min="1"
                        value={bookInfo.askingPrice} 
                        onChange={handleChange}
                        placeholder="Enter your asking price"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      You can choose to receive the amount as store credit (get 10% extra) or direct bank transfer.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="border border-resell-200 rounded-lg p-4 bg-resell-50">
                      <h4 className="font-medium text-resell-700 mb-2">Store Credit</h4>
                      <p className="text-sm text-resell-600 mb-2">
                        Get {bookInfo.askingPrice ? `₹${Math.round(parseInt(bookInfo.askingPrice) * 1.1)}` : '10% extra'} as store credit for future purchases.
                      </p>
                      <div className="text-xs text-resell-500">
                        Valid for 1 year from date of issue
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-2">Bank Transfer</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Get {bookInfo.askingPrice ? `₹${bookInfo.askingPrice}` : 'the exact amount'} transferred to your bank account.
                      </p>
                      <div className="text-xs text-gray-500">
                        Usually processed within 2-3 business days
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={!isFormValid()}
                      className="btn-primary"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Review & Submit */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Review & Submit</h2>
                  <p className="text-gray-600 mb-6">
                    Please review your book details before submitting. Our team will assess your book and get back to you with a final offer.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">Book Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium">{bookInfo.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Author</p>
                        <p className="font-medium">{bookInfo.author}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Publisher</p>
                        <p className="font-medium">{bookInfo.publisher || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ISBN</p>
                        <p className="font-medium">{bookInfo.isbn || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Condition</p>
                        <p className="font-medium">
                          {bookInfo.condition === "like-new" ? "Like New" : 
                           bookInfo.condition === "very-good" ? "Very Good" :
                           bookInfo.condition === "good" ? "Good" :
                           bookInfo.condition === "fair" ? "Fair" :
                           bookInfo.condition === "poor" ? "Poor" : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">
                          {bookInfo.category === "upsc" ? "UPSC/IAS" : 
                           bookInfo.category === "ssc" ? "SSC & Banking" :
                           bookInfo.category === "jee" ? "JEE & NEET" :
                           bookInfo.category === "gate" ? "GATE & ESE" :
                           bookInfo.category === "psc" ? "State PSC" :
                           bookInfo.category === "school" ? "School Books" :
                           bookInfo.category === "other" ? "Other" : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact Phone</p>
                        <p className="font-medium">{bookInfo.contactPhone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="font-medium">{bookInfo.description || "-"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">Photos</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {images.map((img, index) => (
                        <div 
                          key={index} 
                          className="aspect-[3/4] rounded-md overflow-hidden"
                        >
                          <img 
                            src={img} 
                            alt={`Book image ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">Price Information</h3>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Your Asking Price</span>
                      <span className="font-medium">₹{bookInfo.askingPrice}</span>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p className="mb-2">
                        Our team will review your book details and photos to determine the final offer price.
                        We'll contact you within 1-2 business days with our assessment.
                      </p>
                      <p>
                        If you accept our offer, you can choose to receive the amount as store credit (with 10% extra) or as a direct bank transfer.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 mb-6">
                    <p className="text-sm text-orange-700">
                      By submitting this form, you confirm that you own this book and that all information provided is accurate.
                      You also agree to our terms and conditions for book reselling.
                    </p>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={submitResellRequestWithImages}
                      className="btn-resell"
                    >
                      Submit Resell Request
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellPage;
