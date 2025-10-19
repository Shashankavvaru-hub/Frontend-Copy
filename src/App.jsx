import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashBoardPage'; // <-- FIX #1: Corrected casing
import CompleteProfilePage from './pages/CompleteProfilePage';
import BecomeArtistPage from './pages/BecomeArtistPage';
import PortfolioManagementPage from './pages/PortfolioManagementPage';
import EditArtistProfilePage from './pages/EditArtistProfilePage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminArtistListPage from './pages/AdminArtistListPage';
import AdminArticleListPage from './pages/AdminArticleListPage';
import ArticleEditorPage from './pages/ArticleEditorPage';
import BankDetailsPage from './pages/BankDetailsPage';
import AdminPayoutsPage from './pages/AdminPayoutsPage';
import AvailabilityPage from './pages/AvailabilityPage';


function App() {
  // We don't need the token logic here anymore, the AdminRoute handles it.
  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Navbar />
      <main className="container my-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/artists/:id" element={<ArtistDetailPage />} />
          <Route path="/articles" element={<ArticlesListPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />

          {/* Protected User Routes (we will secure these later) */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/become-artist" element={<BecomeArtistPage />} />
          <Route path="/dashboard/portfolio" element={<PortfolioManagementPage />} />
          <Route path="/dashboard/edit-profile" element={<EditArtistProfilePage />} />
          <Route path="/dashboard/bank-details" element={<BankDetailsPage />} />
          <Route path="/dashboard/availability" element={<AvailabilityPage />} />

          {/* --- FIX #2: All admin routes are now nested correctly --- */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUserListPage />} />
            <Route path="artists" element={<AdminArtistListPage />} />
            <Route path="articles" element={<AdminArticleListPage />} />
            <Route path="articles/new" element={<ArticleEditorPage />} />
            <Route path="articles/edit/:id" element={<ArticleEditorPage />} />
            <Route path="payouts" element={<AdminPayoutsPage />} />
          </Route>

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;