import React from 'react';

const Footer = () => (
	<footer style={{ textAlign: 'center', padding: '16px', background: '#eee', marginTop: '32px' }}>
		&copy; {new Date().getFullYear()} Mindhaven
	</footer>
);

export default Footer;