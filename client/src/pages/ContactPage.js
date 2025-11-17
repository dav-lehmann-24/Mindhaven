import React from 'react';

const ContactPage = () => (
  <main style={{ maxWidth: 700, margin: '40px auto', padding: 32 }}>
    <h1>Contact</h1>
    <p>
      Do you have questions, feedback, or need support? Reach out to us!
    </p>
    <ul>
      <li>Email: <a href="mailto:support@mindhaven.com">support@mindhaven.com</a></li>
      <li>Phone: +49 123 456789</li>
      <li>Address: Mindhaven GmbH, Hauptstraße 1, 74821 Mosbach, Germany</li>
    </ul>
    <p>
      We aim to respond to all inquiries within 2 business days.
    </p>
  </main>
);

export default ContactPage;
