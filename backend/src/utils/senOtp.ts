import * as nodemailer from 'nodemailer';

export const sendOtp = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: 'Health Tracking App OTP',

    html: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>This OTP expires soon.</p>
    `,
  });
};
