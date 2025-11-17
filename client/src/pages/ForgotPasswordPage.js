import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './AuthPage.module.css';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    try {
      await axios.post('/api/auth/request-reset', { email });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error while sending reset email.'
      );
    }
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
