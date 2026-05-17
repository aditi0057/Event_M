import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(to) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'your-email@example.com',
    to,
    subject: 'Welcome!',
    text: 'Thank you for signing up!',
  };

  return transporter.sendMail(mailOptions);
}
