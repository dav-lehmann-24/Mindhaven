import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Loader from '../components/Loader';
import styles from './AuthPage.module.css';
import { Link } from 'react-router-dom';

const LoginPage = ({ onPreviewDashboard }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setLoading(false);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Welcome to Mindhaven!</h1>
      <Card className={styles.card} style={{ border: 'none' }}>
        <h2 className={styles.title}>Log in to your account</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email..."
            containerClassName={styles.field}
            labelClassName={styles.label}
            inputClassName={styles.input}
            autoComplete="email"
            required
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password..."
            containerClassName={styles.field}
            labelClassName={styles.label}
            inputClassName={styles.input}
            autoComplete="current-password"
            required
          />
          {error && <div className={styles.error}>{error}</div>}
          {loading ? <Loader /> : <Button type="submit" text="Log in" className={styles.button} />}
        </form>
        <div className={styles.links}>
          <Link to="/register">New to Mindhaven? Register here</Link><br />
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Reset password (demo)'); }}>Forgot password? Reset it here</a>
          <br />
          {onPreviewDashboard && (
            <button type="button" onClick={onPreviewDashboard} style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--mh-purple-600)', textDecoration: 'underline', cursor: 'pointer' }}>
              Preview the Dashboard
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
