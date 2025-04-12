
import React from 'react';
import Navbar from '@/components/Navbar';

import { Card, CardContent } from '@/components/ui/card';
import { Book, Users, Award, Globe, Mail, Phone, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
    
      
      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-book-dark">Our Story</h2>
              <p className="text-gray-700 mb-4">
                book Wallah began with a simple mission: to make educational materials more accessible to students worldwide. 
                What started as a small campus bookstore has grown into an international platform connecting learners with the 
                resources they need to succeed.
              </p>
              <p className="text-gray-700 mb-4">
                Founded by a group of university professors and education enthusiasts, we understand the importance of 
                affordable, high-quality learning materials. Our team is dedicated to curating the best selection of 
                textbooks, reference materials, and academic literature.
              </p>
              <p className="text-gray-700">
                Today, book Wallah serves thousands of students, researchers, and lifelong learners across the globe, 
                maintaining our commitment to education as our core value.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Library with books" 
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-book-dark">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="flex flex-col items-center text-center card-hover">
              <CardContent className="pt-8">
                <Book className="h-12 w-12 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-3">Quality Education</h3>
                <p className="text-gray-600">
                  We curate only the highest quality educational materials, ensuring our customers receive accurate and valuable resources.
                </p>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col items-center text-center card-hover">
              <CardContent className="pt-8">
                <Users className="h-12 w-12 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-3">Accessibility</h3>
                <p className="text-gray-600">
                  We believe education should be accessible to everyone, which is why we offer competitive pricing and global shipping.
                </p>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col items-center text-center card-hover">
              <CardContent className="pt-8">
                <Award className="h-12 w-12 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  From our customer service to our product selection, we strive for excellence in everything we do.
                </p>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col items-center text-center card-hover">
              <CardContent className="pt-8">
                <Globe className="h-12 w-12 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-3">Global Community</h3>
                <p className="text-gray-600">
                  We foster a global community of learners, connecting students and educators across borders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Team section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-book-dark">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
             {
              name: "Dr. Ananya Mehta",
              role: "Founder & CEO",
              image: "https://media.licdn.com/dms/image/v2/C4D03AQGMZSg9FheVWQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1585988232627?e=2147483647&v=beta&t=siybbuCrBO8tNtV0_coFFZz6NEP4v6uuaf5yV6q7SRM"
            },
            {
              name: "Prof. Arvind Krishnan",
              role: "Chief Academic Officer",
              image: "https://doximity-res.cloudinary.com/images/f_auto,q_auto,t_profile_photo_320x320/bqbnlvirqi2q8n5iytua/arvind-krishnan-md-bronx-ny.jpg"
            },
            {
              name: "Riya Sharma",
              role: "Operations Director",
              image: "https://media.licdn.com/dms/image/v2/D5605AQGE_5iaLGQ4Qw/videocover-high/videocover-high/0/1722588740470?e=2147483647&v=beta&t=MTQhAAWYlQOna7gXnkxtrCDZgN2Ce7SoM4ZlO0gnUjs"
            }
            
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden card-hover">
                <div className="h-64">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="text-center py-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact information */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-book-dark">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="card-hover">
              <CardContent className="pt-8 flex flex-col items-center">
                <Mail className="h-10 w-10 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-600">info@bookWallah.com</p>
                <p className="text-gray-600">support@bookWallah.com</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-8 flex flex-col items-center">
                <Phone className="h-10 w-10 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-600">9910988378</p>
                <p className="text-gray-600">Mon-Fri: 9am - 5pm </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-8 flex flex-col items-center">
                <MapPin className="h-10 w-10 text-book-light mb-4" />
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="text-gray-600">Mukhargee nagar</p>
                <p className="text-gray-600">New Delhi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
     
    </div>
  );
};

export default About;
