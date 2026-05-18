import React from 'react';
import Card from '../Card';
import Button from '../Button';
import styles from '../../pages/BuddyPage.module.css';

const PendingRequestsSection = ({
  loadingPending,
  incomingRequests,
  outgoingRequests,
  onAccept,
  onReject,
  onCancel,
  loadingAction,
}) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2>Pending Requests</h2>
      <span>Incoming and outgoing buddy requests.</span>
    </div>
    <Card className={styles.card}>
      {loadingPending && <div className={styles.note}>Loading requests...</div>}
      {!loadingPending && incomingRequests.length === 0 && outgoingRequests.length === 0 && (
        <div className={styles.note}>No pending requests.</div>
      )}
      {incomingRequests.map((request) => (
        <div key={`in-${request.profile_id}`} className={styles.requestItem}>
          <div>
            <strong>{request.username}</strong>
            <div className={styles.requestMeta}>Incoming request</div>
          </div>
          <div className={styles.requestActions}>
            <Button
              text="Accept"
              className={styles.primaryButton}
              onClick={() => onAccept(request.profile_id)}
              disabled={loadingAction}
            />
            <Button
              text="Reject"
              className={styles.secondaryButton}
              onClick={() => onReject(request.profile_id)}
              disabled={loadingAction}
            />
          </div>
        </div>
      ))}
      {outgoingRequests.map((request) => (
        <div key={`out-${request.profile_id}`} className={styles.requestItem}>
          <div>
            <strong>{request.username}</strong>
            <div className={styles.requestMeta}>Outgoing request</div>
          </div>
          <div className={styles.requestActions}>
            <span className={styles.pendingPill}>Pending</span>
            <Button
              text="Cancel"
              className={styles.secondaryButton}
              onClick={() => onCancel(request.profile_id)}
              disabled={loadingAction}
            />
          </div>
        </div>
      ))}
    </Card>
  </section>
);

export default PendingRequestsSection;
