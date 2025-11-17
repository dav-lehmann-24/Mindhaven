import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
	const navigate = useNavigate();
	return (
		<footer className={styles.footer}>
			<div className={styles.topRow}>
				<div className={styles.brand}>Mindhaven</div>
				<nav className={styles.links} aria-label="Footer navigation">
					<button type="button" className={styles.link} onClick={() => navigate('/about')}>About Us</button>
					<button type="button" className={styles.link} onClick={() => navigate('/contact')}>Contact</button>
					<button type="button" className={styles.link} onClick={() => navigate('/privacy')}>Privacy</button>
					<button type="button" className={styles.link} onClick={() => navigate('/terms')}>Terms</button>
				</nav>
			</div>
			<div className={styles.bottomRow}>
				<small className={styles.copy}>&copy; {new Date().getFullYear()} Mindhaven. All rights reserved.</small>
			</div>
		</footer>
	);
};

export default Footer;