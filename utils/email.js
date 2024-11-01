// utils/email.js
import nodemailer from 'nodemailer';

export const sendEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Ganti dengan host SMTP yang benar
    port: 587, // Gunakan 465 untuk secure: true
    secure: false, // true untuk port 465
    auth: {
      user: 'your_email@example.com', // Ganti dengan email Anda
      pass: 'your_password', // Ganti dengan password Anda
    },
  });

  const mailOptions = {
    from: '"Your Name" <your_email@example.com>',
    to: to,
    subject: 'Password Reset',
    text: `Reset your password using this token: ${token}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error(`Error sending email: ${error.message}`);
  }
};
