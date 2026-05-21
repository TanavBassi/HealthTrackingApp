import * as nodemailer from 'nodemailer';

export const sendOtp = async (email: string, otp: string) => {
  try {
    console.log('HOST:', process.env.EMAIL_HOST);

    console.log('PORT:', process.env.EMAIL_PORT);

    console.log('USER:', process.env.EMAIL_USER);

    console.log('PASS EXISTS:', !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,

      port: Number(process.env.EMAIL_PORT),

      secure: false,

      auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
      },

      connectionTimeout: 30000,
    });

    await transporter.verify();

    console.log('SMTP READY');

    await transporter.sendMail({
      from: `"Health Tracking App" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: 'Health Tracking App OTP',

      html: `
      <div style="font-family:sans-serif;padding:20px">
        <h2>Your OTP Code</h2>

        <h1>${otp}</h1>

        <p>
          <strong>Important:</strong>
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
