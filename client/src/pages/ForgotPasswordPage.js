import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './AuthPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    // Simulate sending email
    setSubmitted(true);
    setError('');
    // TODO: Call backend API to send reset link
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Forgot your password?</h1>
      <Card className={styles.card} style={{ border: 'none' }}>
        <h2 className={styles.title}>Reset your password</h2>
        {submitted ? (
          <div style={{ textAlign: 'center', color: 'var(--mh-primary-500)', fontWeight: 600 }}>
            If the email exists, a reset link has been sent.<br />Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            {error && <div className={styles.error}>{error}</div>}
            <Button text="Send Reset Link" type="submit" className={styles.button} />
          </form>
        )}
        <div className={styles.links} style={{ marginTop: 18, textAlign: 'center' }}>
          <Link to="/login">Back to Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
