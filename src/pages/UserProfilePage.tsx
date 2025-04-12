
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '@/services/userService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, ShoppingBag, RotateCcw } from 'lucide-react';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  email?: string;
}

const UserProfilePage = () => {
  const { user, isAuthenticated, session } = useAuth();
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    email: '',
  });

  // Fetch user profile
  const { data: profileData, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => getUserProfile(user?.id || ''),
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileData) =>
      updateUserProfile(user?.id || '', data),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  // Update form data when profile data is loaded
  useEffect(() => {
    if (profileData?.profile) {
      setFormData({
        first_name: profileData.profile.first_name || '',
        last_name: profileData.profile.last_name || '',
        phone: profileData.profile.phone || '',
        address: profileData.profile.address || '',
        email: user?.email || profileData.profile.email || '',
      });
    }
  }, [profileData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/login">Sign In</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User size={16} />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag size={16} />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="resell" className="flex items-center gap-2">
            <RotateCcw size={16} />
            <span>Resell Requests</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details here</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {isLoadingProfile ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="ml-auto"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>View your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Your order history will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resell Requests Tab */}
        <TabsContent value="resell">
          <Card>
            <CardHeader>
              <CardTitle>Your Resell Requests</CardTitle>
              <CardDescription>Track the status of books you've submitted for reselling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Your resell requests will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
