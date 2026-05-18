import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendOtp = async (email: string, otp: string) => {
  try {
    const config: SMTPTransport.Options = {
      host: 'smtp.gmail.com',

      port: 587,

      secure: false,

      auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(config);

    await transporter.sendMail({
      from: `"Health Tracking App" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: 'Health Tracking App OTP',

      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Your OTP Code</h2>

          <h1>${otp}</h1>

          <p>
            This OTP expires in 5 minutes.
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
