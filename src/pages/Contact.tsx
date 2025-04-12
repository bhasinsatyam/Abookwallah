
import React from 'react';
import Navbar from '@/components/Navbar';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the form data to a backend
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you shortly!",
    });
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
    
      
      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <Mail className="h-10 w-10 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600">info@book Wallah.com</p>
                <p className="text-gray-600">support@bookWallah.com</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <Phone className="h-10 w-10 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-gray-600">9910988378</p>
                <p className="text-gray-600">Mon-Fri: 9am - 5pm EST</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <MapPin className="h-10 w-10 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-2">Address</h3>
                <p className="text-gray-600">Mukharjee nagar</p>
                <p className="text-gray-600">Delhi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-book-dark">Send Us a Message</h2>
              <p className="text-gray-700 mb-8">
                Have a question about a book, an order, or anything else? Fill out the form below and our team will get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Write your message here..." rows={5} required />
                </div>
                
                <Button type="submit" className="w-full sm:w-auto">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
            
            <div className="h-full">
              <div className="rounded-lg overflow-hidden shadow-lg h-full">
                <iframe 
                  title="Scholar Books Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47164.42836853742!2d-71.12092891978055!3d42.37205501618595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a5cb30cc5f%3A0xc53a8e6489686c87!2sCambridge%2C%20MA!5e0!3m2!1sen!2sus!4v1686780000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '400px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-book-dark">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "How long does shipping take?",
                answer: "Domestic orders typically arrive within 3-5 business days. International shipping can take 7-14 business days depending on the destination."
              },
              {
                question: "Do you offer returns?",
                answer: "Yes, we accept returns within 30 days of purchase. Books must be in their original condition."
              },
              {
                question: "Do you ship internationally?",
                answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
              },
              {
                question: "How can I track my order?",
                answer: "Once your order ships, you'll receive a confirmation email with tracking information that you can use to monitor your delivery."
              }
            ].map((faq, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
     
    </div>
  );
};

export default Contact;
