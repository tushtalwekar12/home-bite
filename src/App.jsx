import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderMenu from "./pages/ProviderMenu";
import DeliveryAreas from "./pages/DeliveryAreas";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthProvider } from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import AllProviders from "./pages/AllProviders";
import Profile from './pages/Profile';
import './App.css';
import Cart from "./pages/Cart";
import OrdersPage from "./pages/OrdersPage";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Role-based Protected Route Component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route element={<Layout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/providers" element={<AllProviders />} />
                  <Route path="/delivery-areas" element={<DeliveryAreas />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/provider/:providerId/menu" element={<ProviderMenu />} />

                  {/* Protected Routes */}
                  <Route path="/subscribe" element={
                    <ProtectedRoute>
                      <div>Subscribe Page</div>
                    </ProtectedRoute>
                  } />

                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />

                  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  
                  <Route path="/reset-password" element={
                    <ProtectedRoute>
                      <div>Reset Password Page</div>
                    </ProtectedRoute>
                  } />

                  {/* Provider Routes */}
                  <Route path="/provider-dashboard" element={
                    <RoleProtectedRoute allowedRoles={['meal_provider']}>
                      <ProviderDashboard />
                    </RoleProtectedRoute>
                  } />
                </Route>
              </Routes>
            </CartProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
