import React from 'react';
import styles from './AlertCard.module.css';

const AlertCard = ({ message, type }) => {
  return (
    <div className={styles.card + ' ' + styles[type]}>
      <span className={styles.icon}>{type === 'positive' ? '🌟' : type === 'negative' ? '💙' : '⚠️'}</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default AlertCard;
