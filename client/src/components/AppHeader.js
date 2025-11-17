import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.css';
import { MdHomeFilled, MdMenuBook, MdPerson, MdGroup } from 'react-icons/md';

const AppHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = () => setSidebarOpen('profile');
  const handleJournalClick = () => setSidebarOpen('journal');
  const handleHomeClick = () => {
    setSidebarOpen(null);
    navigate('/dashboard');
  };
  const handleSOSClick = () => {
    setSidebarOpen(null);
    navigate('/sos');
  };
  const handleSidebarClose = () => setSidebarOpen(null);

  const renderSidebar = () => {
    if (!sidebarOpen) return null;
    const isProfile = sidebarOpen === 'profile';
    const isJournal = sidebarOpen === 'journal';
    let options = [];
    let sidebarStyle = {
      position: 'absolute',
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
      top: 72,
      right: isProfile ? 16 : isJournal ? 16 + 44 * 2 : 16,
    };
    if (isProfile) {
      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setSidebarOpen(null);
        window.location.href = '/login';
      };
      const handleProfileNav = () => {
        setSidebarOpen(null);
        navigate('/profile');
      };
      options = [
        { label: 'Profile', href: '#profile', onClick: handleProfileNav },
        { label: 'Settings', href: '#settings', onClick: handleSidebarClose },
        { label: 'Preferences', href: '#preferences', onClick: handleSidebarClose },
        { label: 'Logout', href: '#logout', color: 'var(--mh-red-200)', onClick: handleLogout },
      ];
    } else if (isJournal) {
      const handleCreateJournal = () => {
        navigate('/journal/create');
        setSidebarOpen(null);
      };
      const handleViewJournals = () => {
        navigate('/journal/list');
        setSidebarOpen(null);
      };
      options = [
        { label: 'Create Journal', href: '#create-journal', onClick: handleCreateJournal },
        { label: 'View Journals', href: '#view-journals', onClick: handleViewJournals },
      ];
    }
    return (
      <div style={sidebarStyle}>
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

    return (
      <header className={styles.header} style={{ position: 'relative' }}>
        <div className={styles.left}>
          <span className={styles.logo} aria-label="Logo">
            <img
              src={require('../Logo.png')}
              alt="Mindhaven Logo"
              style={{ width: 56, height: 56, objectFit: 'contain', display: 'block', marginRight: 18 }}
            />
          </span>
          <span className={styles.brand}>Mindhaven</span>
        </div>
        <div className={styles.center}>
          <button className={styles.sos} aria-label="SOS emergency" onClick={handleSOSClick}>SOS</button>
        </div>
        <div className={styles.right}>
          <button className={styles.iconButton} aria-label="Home" onClick={handleHomeClick}>
            <MdHomeFilled size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
          </button>
          <button className={styles.iconButton} aria-label="Journal" onClick={handleJournalClick}>
            <MdMenuBook size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
          </button>
          <button className={styles.iconButton} aria-label="Buddy" onClick={() => { setSidebarOpen(null); navigate('/buddy'); }}>
            <MdGroup size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
          </button>
          <button className={styles.iconButton} aria-label="Profile" onClick={handleProfileClick}>
            <MdPerson size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
          </button>
        </div>
        {renderSidebar()}
      </header>
    );
};

export default AppHeader;
