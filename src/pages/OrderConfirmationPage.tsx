
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, ShoppingBag, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const order = location.state?.order || null;
  const [showIssueDialog, setShowIssueDialog] = useState(false);

  // If no order data is present in location state, redirect to home
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  // Format date if available
  const formattedDate = order?.created_at 
    ? format(new Date(order.created_at), 'MMMM dd, yyyy')
    : 'Processing';

  // Helper function to format order ID
  const formatOrderId = (id) => {
    if (!id) return 'Unknown';
    return id.slice(0, 8).toUpperCase();
  };

  if (!order) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-subtle text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Thank you for your purchase
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Order ID</p>
              <p className="text-xl font-semibold">{formatOrderId(order.id)}</p>
              <p className="text-sm text-gray-500 mt-2">Placed on {formattedDate}</p>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Your order has been received</h3>
                  <p className="text-gray-500 text-sm">
                    We'll start processing it right away
                  </p>
                </div>
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-6">
                <p className="text-gray-500 mb-4">
                  A confirmation email has been sent to your registered email address with
                  all the order details.
                </p>
                
                <p className="text-gray-600 font-medium">
                  Expected delivery: 3-5 business days
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/account/orders">
                <Button variant="outline" className="w-full sm:w-auto">
                  Track Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full sm:w-auto text-gray-500"
                onClick={() => setShowIssueDialog(true)}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Need Help?
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for order issues */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Need Help?</DialogTitle>
            <DialogDescription>
              If you're experiencing any issues with your order, our customer service team is here to help.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Contact us at:</p>
            <p className="font-medium">support@bookwala.com</p>
            <p className="font-medium">+91 1234567890</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowIssueDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderConfirmationPage;
