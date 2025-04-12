
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getAllBooks, getCategories } from '@/services/adminService';
import { getOrders } from '@/services/adminService';
import { getResellRequests } from '@/services/adminService';
import { getUserProfiles } from '@/services/userService';

const AdminDashboardPage = () => {
  // Fetch data for dashboard
  const { data: booksData, isLoading: booksLoading } = useQuery({
    queryKey: ['adminBooks'],
    queryFn: () => getAllBooks({ limit: 100 }),
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: getOrders,
  });

  const { data: resellData, isLoading: resellLoading } = useQuery({
    queryKey: ['resellRequests'],
    queryFn: getResellRequests,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: getUserProfiles,
  });

  // Prepare data for charts, ensuring valid categories
  const categoryData = React.useMemo(() => {
    if (!booksData?.books) return [];
    
    const categories: Record<string, number> = {};
    booksData.books.forEach(book => {
      // Ensure category is not empty
      const category = book.category || "Uncategorized";
      if (category.trim() !== '') {
        categories[category] = (categories[category] || 0) + 1;
      } else {
        categories["Uncategorized"] = (categories["Uncategorized"] || 0) + 1;
      }
    });
    
    return Object.entries(categories)
      .filter(([name]) => name.trim() !== '')
      .map(([name, value]) => ({ name, value }));
  }, [booksData]);

  // Calculate counts
  const booksCount = booksData?.books?.length || 0;
  const ordersCount = ordersData?.orders?.length || 0;
  const resellCount = resellData?.requests?.length || 0;
  const usersCount = usersData?.profiles?.length || 0;

  const isLoading = booksLoading || ordersLoading || resellLoading || usersLoading;

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{booksCount}</div>
            <p className="text-xs text-muted-foreground">Books in inventory</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount}</div>
            <p className="text-xs text-muted-foreground">Customer orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resell Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellCount}</div>
            <p className="text-xs text-muted-foreground">Pending reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Books by Category</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-10">No category data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
