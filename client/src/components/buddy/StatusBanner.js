import React from 'react';
import styles from '../../pages/BuddyPage.module.css';

const StatusBanner = ({ statusMessage, errorMessage }) => {
  if (!statusMessage && !errorMessage) return null;
  return (
    <div className={errorMessage ? styles.errorBanner : styles.statusBanner}>
      {errorMessage || statusMessage}
    </div>
  );
};

export default StatusBanner;
