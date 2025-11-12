import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './DashboardPage.module.css';
import AppHeader from '../components/AppHeader';
import JournalCreatePage from './JournalCreatePage';
import JournalListPage from './JournalListPage';

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(null);
  const [activeJournalPage, setActiveJournalPage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleProfileClick = () => {
    setSidebarOpen(null);
    navigate('/profile');
  };
  const handleJournalClick = () => setSidebarOpen('journal');
  const handleHomeClick = () => {
    setSidebarOpen(null);
    setActiveJournalPage(null);
  };
  const handleSOS = () => alert('SOS triggered (demo)');
  const handleSidebarClose = () => setSidebarOpen(null);

  const renderSidebar = () => {
    if (!sidebarOpen) return null;
    const isProfile = sidebarOpen === 'profile';
    const isJournal = sidebarOpen === 'journal';
    const isHome = sidebarOpen === 'home';
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
    };
    if (isProfile) {
      sidebarStyle.top = 72;
      sidebarStyle.right = 16 + 44 * 0;
        const handleLogout = () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setSidebarOpen(null);
          navigate('/login');
        };
        options = [
          { label: 'Profile', href: '#profile', onClick: handleSidebarClose },
          { label: 'Settings', href: '#settings', onClick: handleSidebarClose },
          { label: 'Preferences', href: '#preferences', onClick: handleSidebarClose },
          { label: 'Logout', href: '#logout', color: 'var(--mh-red-200)', onClick: handleLogout },
        ];
    } else if (isJournal) {
      sidebarStyle.top = 72;
      sidebarStyle.right = 16 + 44 * 2;
      const handleCreateJournal = () => {
        setActiveJournalPage('create');
        setSidebarOpen(null);
      };
      const handleViewJournals = () => {
        setActiveJournalPage('view');
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
    <>
      <AppHeader
        onHome={handleHomeClick}
        onJournal={handleJournalClick}
        onProfile={handleProfileClick}
        onSOS={handleSOS}
      />
      {renderSidebar()}
      {activeJournalPage === 'create' ? (
        <JournalCreatePage />
      ) : activeJournalPage === 'view' ? (
        <JournalListPage />
      ) : (
        <>
          <main style={{ padding: '24px' }}>
            <Card style={{ border: 'none', maxWidth: 1200, margin: '24px auto', padding: 32, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
              <div className={styles.calendarBox}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.35rem', margin: '0 auto 18px auto', letterSpacing: '0.5px', textAlign: 'center', width: 'fit-content' }}>Your Calendar</h3>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  locale="de-DE"
                />
                <div className={styles.selectedDate}>
                  Chosen Date: <b>{selectedDate.toLocaleDateString()}</b>
                </div>
              </div>
              <div className={styles.centerContent}>
                <h2 className={styles.welcomeTitle}>Welcome back</h2>
                <p className={styles.welcomeText}>Here you can access your journal quickly, see recent activity, or jump to profile settings.</p>
              </div>
            </Card>
          </main>
          <div style={{
            width: '100vw',
            margin: '36px 0 0 0',
            left: '50%',
            right: '50%',
            transform: 'translateX(-50%)',
            position: 'relative',
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.15rem',
            letterSpacing: '2px',
            boxShadow: '0 2px 12px rgba(79,70,229,0.10)',
            padding: '16px 0',
            textAlign: 'center',
            marginBottom: '16px',
            zIndex: 10,
          }}>
            ! UNDER CONSTRUCTION !
          </div>
        </>
      )}
    </>
  );
}

export default DashboardPage;
