import React from 'react';
import Card from '../Card';
import Button from '../Button';
import styles from '../../pages/BuddyPage.module.css';

const BuddyDetailsSection = ({ selectedBuddy, onRemoveBuddy, loadingAction }) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2>Buddy Details</h2>
      <span>Overview of your selected buddy.</span>
    </div>
    <Card className={styles.card}>
      {!selectedBuddy && <div className={styles.note}>Select a buddy from the sidebar.</div>}
      {selectedBuddy && (
        <div className={styles.buddyDetails}>
          <img
            src={selectedBuddy.profile_picture || '/default-avatar.png'}
            alt={selectedBuddy.username}
            className={styles.detailAvatar}
          />
          <div>
            <h3>{selectedBuddy.username}</h3>
            <p>{selectedBuddy.bio || 'No bio yet.'}</p>
            <div className={styles.detailMeta}>
              <span>{selectedBuddy.country || 'No country set'}</span>
              <span>{selectedBuddy.gender || 'Not specified'}</span>
              <span>Streak: {selectedBuddy.streak ?? 0}</span>
            </div>
          </div>
          <div className={styles.detailActions}>
            <Button
              text="Remove Buddy"
              className={styles.dangerButton}
              onClick={onRemoveBuddy}
              disabled={loadingAction}
            />
          </div>
        </div>
      )}
    </Card>
  </section>
);

export default BuddyDetailsSection;
