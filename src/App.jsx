// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import RootLayout from './layouts/root-layout';
import Home from './pages/home';
import CategoryPage from './pages/category/[slug]'; // Note: This might conflict with AllListingsPage's category filter
import ListingPage from './pages/listing/[id]';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import CreateListingPage from './pages/create-listing';
import PostAdPage from './pages/PostAdPage';
import { AuthProvider, AuthContext } from './layouts/AuthProvider';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast'; // Import Toaster for notifications

// --- New imports for dropdown pages ---
import AllListingsPage from './pages/ListingsPage'; // Renamed and imported
import ManageAdsPage from './pages/menu/manage-ads';
import FavouritesPage from './pages/menu/favourites';
import MyAlertsPage from './pages/menu/my-alerts';
import MyDetailsPage from './pages/menu/my-details';
import ManageJobAdsPage from './pages/menu/manage-job-ads';
import HelpContactPage from './pages/menu/help-contact';
import EditListingPage from './pages/EditListingPage';
// --- End new imports ---


// ProtectedRoute component to ensure only authenticated users can access
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Using `location` directly from window object for simplicity here,
  // alternatively, you can import `useLocation` from 'react-router-dom'
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />

              {/* All Listings Page - will handle category filtering via query params */}
              {/* This route will also handle the category links like /listings?category=Cars */}
              <Route path="listings" element={<AllListingsPage />} />
              {/* If you use "/products" in your RootLayout, ensure you have a route for it too */}
              <Route path="products" element={<AllListingsPage />} /> {/* Example if your RootLayout uses /products */}

              {/* Individual Listing Details Page */}
              <Route path="listing/:id" element={<ListingPage />} />

              {/* Note: The CategoryPage component (e.g., /category/cars-vehicles)
                  might now be redundant if AllListingsPage handles all category filtering
                  via query parameters. You might want to remove it if it's no longer used.
                  If you still use it for specific purposes (e.g., dedicated backend API call for that specific slug),
                  keep it. But typically, /listings?category=SLUG is more flexible.
              */}
              <Route path="category/:slug" element={<CategoryPage />} />


              {/* Posting an Ad - could be protected */}
              <Route path="post-ad" element={<PostAdPage />} />

              {/* Authentication related routes - accessible to all */}
              <Route path="auth/login" element={<LoginPage />} />
              <Route path="auth/register" element={<RegisterPage />} />

              {/* Protected Routes - only accessible to authenticated users */}
              <Route
                path="create-listing"
                element={
                  <ProtectedRoute>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    {/* If you already have a MessagesPage component, use it here */}
                    <div>User Messages Page (Placeholder)</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="manage-ads"
                element={
                  <ProtectedRoute>
                    <ManageAdsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="favourites"
                element={
                  <ProtectedRoute>
                    <FavouritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-alerts"
                element={
                  <ProtectedRoute>
                    <MyAlertsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-details"
                element={
                  <ProtectedRoute>
                    <MyDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manage-job-ads"
                element={
                  <ProtectedRoute>
                    <ManageJobAdsPage />
                  </ProtectedRoute>
                }
              />
              {/* NEW: Route for editing a listing - Ensure this path is unique and not conflicting with /listing/:id */}
              {/* It's good practice to have edit routes under /manage-ads/edit/:id or similar */}
              <Route
                path="edit-listing/:id" // Changed from 'listings/:id' to 'edit-listing/:id' to avoid conflict
                element={
                  <ProtectedRoute>
                    <EditListingPage /> {/* Render the new EditListingPage component */}
                  </ProtectedRoute>
                }
              />

              {/* Public routes for Help & Contact - might not need protection */}
              <Route path="help-contact" element={<HelpContactPage />} />

              {/* Catch-all route for any undefined paths */}
              <Route path="*" element={<div>404: Not Found</div>} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
      <Toaster /> {/* Place Toaster ideally near the root of your app */}
    </AuthProvider>
  );
}