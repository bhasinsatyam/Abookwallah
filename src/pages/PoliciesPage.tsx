
import React from 'react';
import Layout from '@/components/Layout';
import { FileText, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PoliciesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-display font-bold mb-6">Our Policies</h1>
        
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> 
              <span className="hidden md:inline">Privacy</span>
              <span className="inline md:hidden">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> 
              <span className="hidden md:inline">Terms of Service</span>
              <span className="inline md:hidden">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> 
              <span className="hidden md:inline">Shipping Policy</span>
              <span className="inline md:hidden">Shipping</span>
            </TabsTrigger>
            <TabsTrigger value="returns" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" /> 
              <span className="hidden md:inline">Return Policy</span>
              <span className="inline md:hidden">Returns</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <TabsContent value="privacy" className="space-y-6">
              <h2 className="text-2xl font-semibold">Privacy Policy</h2>
              <p className="text-gray-700">Last Updated: April 12, 2025</p>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-medium mb-2">1. Information We Collect</h3>
                  <p className="text-gray-700 leading-relaxed">
                    At Book Wallah, we collect personal information that you voluntarily provide to us when you register on our website, express interest in obtaining information about us or our products, or otherwise contact us. The personal information we collect may include names, email addresses, phone numbers, billing addresses, and shipping addresses.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">2. How We Use Your Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, including processing transactions, sending order confirmations, and providing customer support. We may also use your information to send you marketing communications, updates, and promotional materials that may be of interest to you.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">3. Cookies and Tracking Technologies</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">4. Data Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee the absolute security of your data.
                  </p>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="terms" className="space-y-6">
              <h2 className="text-2xl font-semibold">Terms of Service</h2>
              <p className="text-gray-700">Last Updated: April 12, 2025</p>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-medium mb-2">1. Acceptance of Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using Book Wallah, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access the website or use any services.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">2. User Accounts</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you create an account with us, you must provide accurate, complete, and up-to-date information. You are responsible for safeguarding the password you use to access our service and for any activities or actions under your password.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">3. Intellectual Property</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The service and its original content, features, and functionality are owned by Book Wallah and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">4. Termination</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
                  </p>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="space-y-6">
              <h2 className="text-2xl font-semibold">Shipping Policy</h2>
              <p className="text-gray-700">Last Updated: April 12, 2025</p>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-medium mb-2">1. Processing Time</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Orders are typically processed within 1-2 business days. During peak seasons or sale events, processing times may be extended to 2-3 business days.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">2. Shipping Methods</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We offer standard shipping (5-7 business days), express shipping (2-3 business days), and same-day delivery (for select areas in Delhi). Shipping costs are calculated based on the weight of your order and your delivery location.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">3. International Shipping</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We currently ship to selected international destinations. International orders may be subject to import duties and taxes, which are the responsibility of the recipient.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">4. Order Tracking</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Once your order has shipped, you will receive a confirmation email with a tracking number that allows you to monitor your shipment's progress.
                  </p>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="returns" className="space-y-6">
              <h2 className="text-2xl font-semibold">Return Policy</h2>
              <p className="text-gray-700">Last Updated: April 12, 2025</p>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-medium mb-2">1. Return Period</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We accept returns within 30 days of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it, with the original packaging intact.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">2. Return Process</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To initiate a return, please email us at returns@Book Wallah.com with your order number and reason for return. Once your return is approved, we will provide instructions on how to ship the item back to us.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">3. Refunds</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will be automatically applied to your original method of payment within 5-7 business days.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-medium mb-2">4. Damaged or Defective Items</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you receive damaged or defective merchandise, please contact our customer service team immediately. We will work with you to resolve the issue by offering a replacement or a refund.
                  </p>
                </section>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PoliciesPage;
