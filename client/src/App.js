import './App.css';
import Footer from './components/Footer';
import AppHeader from './components/AppHeader';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccountProfilePage from './pages/AccountProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import JournalCreatePage from './pages/JournalCreatePage';
import JournalListPage from './pages/JournalListPage';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';


function AppContent() {
  const location = useLocation();
  const hideHeaderFooterRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldShowHeaderFooter = !hideHeaderFooterRoutes.includes(location.pathname) && !location.pathname.startsWith('/reset-password/');
  return (
    <>
      {shouldShowHeaderFooter && <AppHeader />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<AccountProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
          <Route path="/journal/create" element={<JournalCreatePage />} />
          <Route path="/journal/list" element={<JournalListPage />} />
        </Routes>
      </div>
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
