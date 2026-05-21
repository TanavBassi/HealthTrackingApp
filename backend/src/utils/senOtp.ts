import * as nodemailer from 'nodemailer';

export const sendOtp = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      connectionTimeout: 20000,
    });

    await transporter.sendMail({
      from: `"Health Tracking App" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: 'Health Tracking App OTP',

      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Your OTP Code</h2>

          <h1>${otp}</h1>

          <p>
            <strong>Important:</strong> This OTP expires in 5 minutes.
          </p>
        </div>
      `,
    });

    console.log('OTP EMAIL SENT SUCCESSFULLY');
  } catch (error) {
    console.log('SEND OTP ERROR:', error);
    throw error;
  }
};
