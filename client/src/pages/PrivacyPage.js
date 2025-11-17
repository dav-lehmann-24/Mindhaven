import React from 'react';

const PrivacyPage = () => (
  <main style={{ maxWidth: 700, margin: '40px auto', padding: 32 }}>
    <h1>Privacy Policy</h1>
    <p>
      Your privacy is important to us. Mindhaven stores your data securely and never shares personal information with third parties without your consent. All journal entries are encrypted and only accessible to you.
    </p>
    <h2>What data do we collect?</h2>
    <ul>
      <li>Account information (username, email)</li>
      <li>Journal entries and tags</li>
      <li>Usage statistics (anonymized)</li>
    </ul>
    <h2>How is your data used?</h2>
    <ul>
      <li>To provide and improve our services</li>
      <li>To personalize your experience</li>
      <li>To ensure security and prevent misuse</li>
    </ul>
    <p>
      For more details, contact us at <a href="mailto:privacy@mindhaven.com">privacy@mindhaven.com</a>.
    </p>
  </main>
);

export default PrivacyPage;
