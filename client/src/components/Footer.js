import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.topRow}>
				<div className={styles.brand}>Mindhaven</div>
				<nav className={styles.links} aria-label="Footer navigation">
					<button type="button" className={styles.link} onClick={() => alert('About (coming soon)')}>About Us</button>
					<button type="button" className={styles.link} onClick={() => alert('Contact (coming soon)')}>Contact</button>
					<button type="button" className={styles.link} onClick={() => alert('Privacy (coming soon)')}>Privacy</button>
					<button type="button" className={styles.link} onClick={() => alert('Terms (coming soon)')}>Terms</button>
				</nav>
			</div>
			<div className={styles.bottomRow}>
				<small className={styles.copy}>&copy; {new Date().getFullYear()} Mindhaven. All rights reserved.</small>
			</div>
		</footer>
	);
};

export default Footer;