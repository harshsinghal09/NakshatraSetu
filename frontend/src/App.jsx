import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import KundaliPage from './pages/KundaliPage';
import GeneratePage from './pages/GeneratePage';
import PremiumPage from './pages/PremiumPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner" style={{ width:40, height:40 }} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup"   element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/dashboard"element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/generate" element={<PrivateRoute><GeneratePage /></PrivateRoute>} />
      <Route path="/kundali/:id" element={<PrivateRoute><KundaliPage /></PrivateRoute>} />
      <Route path="/premium"  element={<PrivateRoute><PremiumPage /></PrivateRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#191535',
              color: '#f0eaff',
              border: '1px solid rgba(240,192,96,0.25)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem'
            },
            success: { iconTheme: { primary: '#f0c060', secondary: '#1a0f00' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
