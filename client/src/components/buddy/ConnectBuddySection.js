import React from 'react';
import Card from '../Card';
import Button from '../Button';
import styles from '../../pages/BuddyPage.module.css';

const ConnectBuddySection = ({ connectBuddyId, onChange, onSubmit, loadingAction }) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2>Connect a Buddy</h2>
      <span>Send a request by id.</span>
    </div>
    <Card className={styles.card}>
      <form className={styles.formRow} onSubmit={onSubmit}>
        <input
          type="number"
          min="1"
          placeholder="Buddy id"
          value={connectBuddyId}
          onChange={onChange}
          className={styles.input}
        />
        <Button
          text={loadingAction ? 'Sending...' : 'Send Request'}
          className={styles.primaryButton}
          type="submit"
          disabled={loadingAction}
        />
      </form>
    </Card>
  </section>
);

export default ConnectBuddySection;
