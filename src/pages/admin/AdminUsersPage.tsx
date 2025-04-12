
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserProfiles } from '@/services/userService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const AdminUsersPage = () => {
  // Query user profiles
  const { data, isLoading } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: getUserProfiles,
  });

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Profiles</h1>

      {isLoading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.profiles.map((profile: any) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    {profile.first_name || profile.last_name 
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
                      : 'Not provided'}
                  </TableCell>
                  <TableCell>{profile.email || 'Not provided'}</TableCell>
                  <TableCell>{profile.phone || 'Not provided'}</TableCell>
                  <TableCell>{profile.address || 'Not provided'}</TableCell>
                  <TableCell>{formatDate(profile.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {(!data?.profiles || data.profiles.length === 0) && (
            <div className="text-center py-10">No user profiles found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
