
// This file is now just a placeholder since we're using real database data
// The functions are used as fallbacks in case the real data fetching fails

import { Book } from "@/types/book";
import { Testimonial } from "@/types/testimonial";

export function getMockBooks(): Book[] {
  return [];
}

export function getMockTestimonials(): Testimonial[] {
  return [];
}

export function getMockCategories() {
  return [];
}
