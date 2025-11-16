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
  const [activeJournalPage, setActiveJournalPage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleHomeClick = () => {
    setActiveJournalPage(null);
  };
  const handleSOS = () => alert('SOS triggered (demo)');
  const handleJournalCreate = () => setActiveJournalPage('create');
  const handleJournalView = () => setActiveJournalPage('view');

  return (
    <>
      <AppHeader
        onHome={handleHomeClick}
        onSOS={handleSOS}
        onJournalCreate={handleJournalCreate}
        onJournalView={handleJournalView}
      />
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
