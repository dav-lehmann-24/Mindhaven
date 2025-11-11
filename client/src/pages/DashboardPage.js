import React, { useState } from 'react';
import Card from '../components/Card';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
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
  );
}

export default DashboardPage;
