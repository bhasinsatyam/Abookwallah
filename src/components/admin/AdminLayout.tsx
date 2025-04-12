
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Book, Package, RotateCcw, ShoppingBag, Users, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const location = useLocation();

  // Authentication check removed to allow access without login

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/books', label: 'Books', icon: Book },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/resell', label: 'Resell Requests', icon: RotateCcw },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = 
                (item.path === '/admin' && location.pathname === '/admin') || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path));
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors",
                      isActive && "bg-gray-100 font-medium"
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t mt-auto">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
