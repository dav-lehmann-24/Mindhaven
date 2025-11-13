// server/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g. 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendResetEmail(toEmail, resetToken) {
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"MindHaven Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request – MindHaven',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset your MindHaven account password.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p><strong>This link expires in 15 minutes.</strong></p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <br>
      <p>— The MindHaven Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendResetEmail };
