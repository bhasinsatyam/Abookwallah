
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminResellPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Resell Feature Removed</h1>
        <p className="text-gray-700 mb-6">
          The book reselling feature has been removed from BookWala. This administrative section is no longer available.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => navigate('/admin')} className="bg-bookwala-600 hover:bg-bookwala-700">
            Return to Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminResellPage;
