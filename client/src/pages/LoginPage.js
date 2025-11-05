import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Loader from '../components/Loader';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (!email || !password) {
        setError('Please enter both email and password.');
      } else {
        setError('');
      }
    }, 1000);
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
          <a href="/register">New to Mindhaven? Register here</a><br />
          <a href="/reset">Forgot password? Reset it here</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
