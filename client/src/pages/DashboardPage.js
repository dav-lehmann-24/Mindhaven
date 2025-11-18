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
    loadAlerts();

    window.addEventListener('journalChanged', loadAlerts);
    return () => {
      window.removeEventListener('journalChanged', loadAlerts);
    };
  }, [navigate]);

  return (
    <>
      <h1 style={{
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '2rem',
        margin: '32px 0 0 0',
        letterSpacing: '0.5px',
        color: '#6366f1'
      }}>Your Dashboard</h1>
      <main style={{ padding: '24px' }}>
        <Card style={{ border: 'none', maxWidth: 1200, margin: '24px auto', padding: 32, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 48 }}>
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
          <div className={styles.verticalDivider}></div>
          <div className={styles.centerContent}>
            <h2 className={styles.alertsTitle}>Alerts</h2>
            <div className={styles.alertsList}>
              {alerts.length === 0 ? (
                <AlertCard message="No alerts at the moment." type="neutral" />
              ) : (
                alerts.map((alert, idx) => (
                  <AlertCard key={idx} message={alert.message} type={alert.type} />
                ))
              )}
            </div>
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
  );
}

export default DashboardPage;
