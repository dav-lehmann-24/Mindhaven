import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './DashboardPage.module.css';
import AlertCard from '../components/AlertCard';

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [journals, setJournals] = useState([]);
  const [journalsLoading, setJournalsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const loadAlerts = () => {
      fetch('/api/tags/trend', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.message && data.trend) {
            setAlerts([{ message: data.message, type: data.trend }]);
          } else {
            setAlerts([]);
          }
        })
        .catch(() => setAlerts([]));
    };
    const loadJournals = () => {
      setJournalsLoading(true);
      fetch('/api/journal/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const mapped = (data.journals || []).map(journal => ({
            ...journal,
            createdAt: journal.created_at
          }));
          mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setJournals(mapped);
        })
        .catch(() => setJournals([]))
        .finally(() => setJournalsLoading(false));
    };
    const handleJournalChanged = () => {
      loadAlerts();
      loadJournals();
    };
    loadAlerts();
    loadJournals();

    window.addEventListener('journalChanged', handleJournalChanged);
    return () => {
      window.removeEventListener('journalChanged', handleJournalChanged);
    };
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getDateKey = (dateInput) => {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const journalsByDate = journals.reduce((acc, journal) => {
    const key = getDateKey(journal.createdAt);
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(journal);
    return acc;
  }, {});
  const selectedKey = getDateKey(selectedDate);
  const selectedJournals = journalsByDate[selectedKey] || [];

  const recentJournals = journals.slice(0, 2);

  return (
    <>
      <main className={styles.page}>
        <Card className={styles.headerCard}>
          <header className={styles.header}>
            <h1 className={styles.title}>Your Dashboard</h1>
            <p className={styles.subtitle}>A calm snapshot of your journaling and support tools.</p>
          </header>
        </Card>

        <section className={styles.layout}>
          <Card className={styles.calendarCard}>
            <div className={styles.calendarHeader}>
              <h2 className={styles.sectionTitle}>Calendar</h2>
              <button
                type="button"
                className={styles.todayButton}
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </button>
            </div>
            <div className={styles.calendarBox}>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                locale="de-DE"
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  const key = getDateKey(date);
                  const count = journalsByDate[key]?.length || 0;
                  if (count === 0) return null;
                  return <span className={styles.entryDot} />;
                }}
              />
            </div>
            <div className={styles.selectedDate}>
              Selected: <strong>{selectedDate.toLocaleDateString()}</strong>
            </div>
            <div className={styles.dayPreview}>
              <div className={styles.dayPreviewHeader}>
                <span>{selectedJournals.length} entries</span>
                {selectedJournals.length === 0 && <span>No entries yet</span>}
              </div>
              {selectedJournals.slice(0, 2).map(journal => (
                <div key={journal.id} className={styles.dayPreviewItem}>
                  <span className={styles.dayPreviewTitle}>{journal.title || 'Untitled entry'}</span>
                  <span className={styles.dayPreviewDate}>{formatDate(journal.createdAt)}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className={styles.rightColumn}>
            <Card className={styles.panelCard}>
              <h2 className={styles.sectionTitle}>AI Alerts</h2>
              <div className={styles.alertsList}>
                {alerts.length === 0 ? (
                  <AlertCard message="No alerts at the moment." type="neutral" />
                ) : (
                  alerts.map((alert, idx) => (
                    <AlertCard key={idx} message={alert.message} type={alert.type} />
                  ))
                )}
              </div>
            </Card>

            <Card className={styles.panelCard}>
              <h2 className={styles.sectionTitle}>Quick Actions</h2>
              <div className={styles.actionsRow}>
                <button type="button" className={styles.primaryAction} onClick={() => navigate('/journal/create')}>
                  New journal entry
                </button>
                <button type="button" className={styles.secondaryAction} onClick={() => navigate('/journal/list')}>
                  Open journal list
                </button>
              </div>
            </Card>

            <Card className={styles.panelCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Entries</h2>
                <button type="button" className={styles.linkButton} onClick={() => navigate('/journal/list')}>
                  See all
                </button>
              </div>
              {journalsLoading && <div className={styles.stateText}>Loading entries...</div>}
              {!journalsLoading && recentJournals.length === 0 && (
                <div className={styles.stateText}>No entries yet. Start your first journal.</div>
              )}
              <div className={styles.recentList}>
                {recentJournals.map(journal => (
                  <div key={journal.id} className={styles.recentItem}>
                    <div className={styles.recentMeta}>{formatDate(journal.createdAt)}</div>
                    <div className={styles.recentTitle}>{journal.title || 'Untitled entry'}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className={styles.chatbotSection}>
          <Card className={styles.chatbotCard}>
            <div className={styles.chatbotCopy}>
              <span className={styles.chatbotEyebrow}>AI Support</span>
              <h2 className={styles.chatbotTitle}>Need a calm check-in?</h2>
              <p className={styles.chatbotText}>
                Chat with Mindhaven&apos;s AI for a supportive response, coping tips, and
                gentle guidance.
              </p>
              <button
                type="button"
                className={styles.chatbotButton}
                onClick={() => navigate('/ai-chatbot')}
              >
                Open AI Chatbot
              </button>
            </div>
            <div className={styles.chatbotVisual}>
              <div className={styles.chatbotOrb} />
              <div className={styles.chatbotPulse} />
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}

export default DashboardPage;
