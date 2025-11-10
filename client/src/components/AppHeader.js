import React from 'react';
import styles from './AppHeader.module.css';
import { MdHomeFilled, MdMenuBook, MdPerson, MdGroup } from 'react-icons/md';

const AppHeader = ({ onHome, onJournal, onProfile, onSOS }) => {
  return (
    <header className={styles.header}>
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
        <button className={styles.sos} aria-label="SOS emergency" onClick={onSOS}>SOS</button>
      </div>
      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="Home" onClick={onHome}>
          <MdHomeFilled size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
        </button>
        <button className={styles.iconButton} aria-label="Journal" onClick={onJournal}>
          <MdMenuBook size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
        </button>
        <button className={styles.iconButton} aria-label="Buddy">
          <MdGroup size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
        </button>
        <button className={styles.iconButton} aria-label="Profile" onClick={onProfile}>
          <MdPerson size={28} color="#fff" style={{ filter: 'drop-shadow(0 0 2px #222)' }} />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
