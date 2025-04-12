
import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const FeatureRemovedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine which feature was removed based on the path
  const featureName = location.pathname.includes('resell') ? 'Book Reselling' : 
                      location.pathname.includes('rent') ? 'Book Rental' : 'Feature';

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">{featureName} Feature Removed</h1>
          <p className="text-gray-700 mb-6">
            We're sorry, but the {featureName.toLowerCase()} feature is no longer available on BookWala. 
            We appreciate your interest and invite you to explore our other services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => navigate('/')} variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
            <Button onClick={() => navigate('/books')} className="bg-bookwala-600 hover:bg-bookwala-700">
              Browse Books
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureRemovedPage;
