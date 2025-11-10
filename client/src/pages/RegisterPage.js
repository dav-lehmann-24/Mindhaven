import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Loader from '../components/Loader';
import styles from './AuthPage.module.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (!email || !username || !password || !confirmPassword) {
        setError('Please fill in all fields.');
      } else if (password !== confirmPassword) {
        setError('Passwords do not match.');
      } else {
        setError('');
        // TODO: call registration API
      }
    }, 800);
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
      <h1 className={styles.pageTitle}>Create your Mindhaven account</h1>
      <Card className={styles.card} style={{ border: 'none' }}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            id="reg-email"
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
            id="reg-username"
            label="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username..."
            containerClassName={styles.field}
            labelClassName={styles.label}
            inputClassName={styles.input}
            autoComplete="username"
            required
          />
          <InputField
            id="reg-password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password..."
            containerClassName={styles.field}
            labelClassName={styles.label}
            inputClassName={styles.input}
            autoComplete="new-password"
            required
          />
          <InputField
            id="reg-confirm"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat password..."
            containerClassName={styles.field}
            labelClassName={styles.label}
            inputClassName={styles.input}
            autoComplete="new-password"
            required
          />

          {error && <div className={styles.error}>{error}</div>}
          {loading ? <Loader /> : <Button type="submit" text="Create account" className={styles.button} />}
        </form>
        <div className={styles.links}>
          <a href="/login">Already have an account? Log in</a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
