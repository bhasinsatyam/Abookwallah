
import { Book } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-float">
        <Book className="h-16 w-16 text-bookwala-500" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-2xl font-heading font-bold flex">
        <span className="text-bookwala-600">Book</span>
        <span className="text-bookwala-900">Wala</span>
        <span className="text-bookwala-600 text-sm font-normal">.com</span>
      </h1>
      <div className="mt-4">
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
      </div>
    </div>
  );
};

export default LoadingScreen;
