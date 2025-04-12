
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Providers
import { AuthProvider } from "./contexts/AuthContext";

// Layout
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./components/admin/AdminLayout";

// Pages - Using lazy loading for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const BookListingPage = lazy(() => import("./pages/BookListingPage"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Policies = lazy(() => import("./pages/PoliciesPage"));


// Admin pages
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminBooksPage = lazy(() => import("./pages/admin/AdminBooksPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const FeatureRemovedPage = lazy(() => import("./pages/FeatureRemovedPage"));

// Loading component
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="books" element={<BookListingPage />} />
                <Route path="books/:id" element={<BookDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="profile" element={<UserProfilePage />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="policies" element={<Policies />} />
                {/* Redirect old resell/rent routes to feature removed notice */}
                {/* <Route path="resell" element={<FeatureRemovedPage />} /> */}
                {/* <Route path="rent" element={<FeatureRemovedPage />} /> */}
              </Route>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="books" element={<AdminBooksPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="resell" element={<FeatureRemovedPage />} />
                <Route path="users" element={<AdminUsersPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
