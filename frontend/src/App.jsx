import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './layouts/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import ReportLostPage from './pages/ReportLostPage';
import ReportFoundPage from './pages/ReportFoundPage';
import MyReportsPage from './pages/MyReportsPage';
import ProfilePage from './pages/ProfilePage';
import Logo from './components/Logo';

// 404 Not Found Page
const NotFoundPage = () => (
  <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center p-6 text-center">
    <Logo size="lg" to="/" />
    <div className="mt-8 bg-white p-8 rounded-3xl border border-purple-100 shadow-xl max-w-md w-full">
      <h2 className="text-4xl font-black text-[#6D28D9]">404</h2>
      <h3 className="text-xl font-bold text-gray-900 mt-2">Page Not Found</h3>
      <p className="text-sm text-gray-500 mt-2">
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block w-full py-3 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md transition"
      >
        Return to Home
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing & Auth pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Application & Dashboard Pages with Persistent Sidebar */}
          <Route element={<DashboardLayout />}>
            {/* Search & Item Details accessible from sidebar / navbar */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/items/:id" element={<ItemDetailsPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-lost"
              element={
                <ProtectedRoute>
                  <ReportLostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-found"
              element={
                <ProtectedRoute>
                  <ReportFoundPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reports"
              element={
                <ProtectedRoute>
                  <MyReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
