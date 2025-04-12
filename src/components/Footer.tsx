
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const curYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl mb-4">
              <span className="text-bookwala-600">Book</span>
              <span className="text-bookwala-900">Wala</span>
              <span className="text-bookwala-600 text-sm font-normal">.com</span>
            </div>
            <p className="text-gray-600 mb-4">
              Your one-stop destination for competitive exam books in India. Buy, sell, and  books at the best prices.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-bookwala-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bookwala-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bookwala-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bookwala-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                   Books
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                   Books
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Categories */}
          <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Exam Categories</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  UPSC/IAS
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  SSC & Banking
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  JEE & NEET
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  GATE & ESE
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  State PSC Exams
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  School Books
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-bookwala-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  BookWala.com, Main Market, Mukherjee Nagar, New Delhi - 110009
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-bookwala-500 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-bookwala-500 flex-shrink-0" />
                <a href="mailto:info@bookwala.com" className="text-gray-600 hover:text-bookwala-500 transition-colors">
                  info@bookwala.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              © {curYear} BookWala.com. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Payment Methods:</span>
              <div className="flex gap-2 items-center">
                <div className="bg-white h-8 w-12 rounded border flex items-center justify-center shadow-sm">
                  <span className="text-xs font-medium">Visa</span>
                </div>
                <div className="bg-white h-8 w-12 rounded border flex items-center justify-center shadow-sm">
                  <span className="text-xs font-medium">MC</span>
                </div>
                <div className="bg-white h-8 w-12 rounded border flex items-center justify-center shadow-sm">
                  <span className="text-xs font-medium">UPI</span>
                </div>
                <div className="bg-white h-8 w-12 rounded border flex items-center justify-center shadow-sm">
                  <span className="text-xs font-medium">COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
