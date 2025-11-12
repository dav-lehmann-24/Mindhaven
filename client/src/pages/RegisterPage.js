import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Loader from '../components/Loader';
import styles from './AuthPage.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email || !username || !password || !confirmPassword || !country || !gender) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', {
        username,
        email,
        password,
        bio: '',
        profile_picture: '',
        country,
        gender,
      });
      setLoading(false);
      if (res.data.message) {
        navigate('/login'); // Redirect to login after successful registration
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
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
          <div className={styles.field}>
            <label className={styles.label}>Country</label>
            <input
              id="reg-country"
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              className={styles.input}
              placeholder="Enter your country..."
              autoComplete="country"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Gender</label>
            <select
              id="reg-gender"
              value={gender}
              onChange={e => setGender(e.target.value)}
              className={styles.input}
              required
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
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
