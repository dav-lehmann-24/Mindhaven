import React from 'react';
import styles from '../../pages/BuddyPage.module.css';

const BuddySidebar = ({ buddies, selectedBuddyId, onSelectBuddy, loadingBuddies, pendingTotal }) => (
  <aside className={styles.sidebar}>
    <div className={styles.sidebarHeader}>
      <h2>My Buddies</h2>
      <span className={styles.countBadge}>{buddies.length}</span>
    </div>
    <div className={styles.sidebarBody}>
      {loadingBuddies && <div className={styles.note}>Loading buddies...</div>}
      {!loadingBuddies && buddies.length === 0 && (
        <div className={styles.note}>No buddies yet. Send a request to get started.</div>
      )}
      {buddies.map((buddy) => {
        const buddyId = buddy.profile_id;
        const isActive = buddyId === selectedBuddyId;
        return (
          <button
            key={buddyId}
            className={`${styles.buddyItem} ${isActive ? styles.buddyItemActive : ''}`}
            onClick={() => onSelectBuddy(buddyId)}
          >
            <img
              src={buddy.profile_picture || '/default-avatar.png'}
              alt={buddy.username}
              className={styles.avatar}
            />
            <div>
              <div className={styles.buddyName}>{buddy.username}</div>
              <div className={styles.buddyMeta}>Streak: {buddy.streak ?? 0}</div>
            </div>
          </button>
        );
      })}
    </div>
    <div className={styles.sidebarFooter}>
      <div className={styles.pendingSummary}>Pending: {pendingTotal}</div>
    </div>
  </aside>
);

export default BuddySidebar;
