import './App.css';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppHeader from './components/AppHeader';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AccountProfilePage from './pages/AccountProfilePage';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(null);

  const handlePreviewDashboard = () => setShowDashboard(true);
  const handleBackToLogin = () => setShowDashboard(false);

  const handleSOS = () => {
    alert('SOS triggered (demo)');
  };
  const handleProfileClick = () => setSidebarOpen('profile');
  const handleJournalClick = () => setSidebarOpen('journal');
  const handleSidebarClose = () => setSidebarOpen(null);

  const renderSidebar = () => {
    if (!sidebarOpen) return null;
    const isProfile = sidebarOpen === 'profile';
    const options = isProfile
      ? [
          { label: 'Profile', href: '#profile', onClick: () => setShowDashboard('profile') },
          { label: 'Settings', href: '#settings' },
          { label: 'Preferences', href: '#preferences' },
          { label: 'Logout', href: '#logout', color: 'var(--mh-red-200)' },
        ]
      : [
          { label: 'Create Journal', href: '#create-journal' },
          { label: 'View Journals', href: '#view-journals' },
        ];
    return (
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: isProfile ? 32 : 88,
          minWidth: 260,
          maxWidth: 320,
          background: 'linear-gradient(135deg, var(--mh-primary-500) 0%, var(--mh-purple-400) 100%)',
          borderRadius: 18,
          boxShadow: '0 8px 32px rgba(79,70,229,0.18)',
          zIndex: 3000,
          padding: '32px 28px 24px 28px',
          animation: 'sidebarFadeIn 0.35s',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <style>{`
          @keyframes sidebarFadeIn {
            from { opacity: 0; transform: translateY(-16px) scale(0.98); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
        <button onClick={handleSidebarClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 26, color: '#fff', cursor: 'pointer', fontWeight: 700 }} aria-label="Close sidebar">×</button>
        <nav style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 22, width: '100%' }}>
          {options.map(opt => (
            <a
              key={opt.label}
              href={opt.href}
              style={{
                color: opt.color || '#fff',
                fontWeight: 600,
                fontSize: 18,
                textDecoration: 'none',
                padding: '6px 0',
                borderRadius: 8,
                transition: 'background 0.18s',
                cursor: 'pointer',
              }}
              onClick={opt.onClick}
            >
              {opt.label}
            </a>
          ))}
        </nav>
      </div>
    );
  };

  const body = showDashboard === 'profile' ? (
    <>
      <AppHeader
        onHome={() => setShowDashboard(true)}
        onJournal={handleJournalClick}
        onProfile={handleProfileClick}
        onSOS={handleSOS}
      />
      <div style={{ display: 'flex', position: 'relative' }}>
        {renderSidebar()}
        <div style={{ flex: 1 }}>
          <AccountProfilePage />
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <button onClick={handleBackToLogin} style={{ background: 'none', color: 'var(--mh-primary-600)', cursor: 'pointer', border: '1px solid var(--mh-primary-300)', padding: '8px 16px', borderRadius: 8 }}>Return to Login</button>
          </div>
        </div>
      </div>
    </>
  ) : showDashboard ? (
    <>
      <AppHeader
        onHome={() => setShowDashboard(true)}
        onJournal={handleJournalClick}
        onProfile={handleProfileClick}
        onSOS={handleSOS}
      />
      <div style={{ display: 'flex', position: 'relative' }}>
        {renderSidebar()}
        <div style={{ flex: 1 }}>
          <DashboardPage />
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <button onClick={handleBackToLogin} style={{ background: 'none', color: 'var(--mh-primary-600)', cursor: 'pointer', border: '1px solid var(--mh-primary-300)', padding: '8px 16px', borderRadius: 8 }}>Return to Login</button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage onPreviewDashboard={handlePreviewDashboard} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );

  return (
    <div className="App">
      {body}
      <Footer />
    </div>
  );
}

export default App;
