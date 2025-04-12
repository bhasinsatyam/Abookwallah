
import { Star } from "lucide-react";
import { Testimonial } from "@/types/testimonial";

interface TestimonialCardProps {
  testimonial: Testimonial;
  animationDelay?: number;
}

const TestimonialCard = ({ testimonial, animationDelay = 0 }: TestimonialCardProps) => {
  return (
    <div 
      className="bg-white p-6 rounded-xl border border-gray-100 shadow-subtle hover:shadow-md transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Rating stars */}
      <div className="flex text-amber-400 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'stroke-current fill-transparent'}`}
          />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-gray-700 mb-6 line-clamp-4">"{testimonial.text}"</p>
      
      {/* Customer info */}
      <div className="flex items-center">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="h-10 w-10 rounded-full mr-3 object-cover border border-gray-200"
        />
        <div>
          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
