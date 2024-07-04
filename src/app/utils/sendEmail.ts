import nodemailer from 'nodemailer';
import config from '../config';

export const sendMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'ssa222158@gmail.com',
      pass: 'txgk ztgv bbwf fedf',
    },
  });

  await transporter.sendMail({
    from: 'ssa222158@gmail.com',
    to,
    subject: 'Reset your password in 10 minutes !',
    text: '',
    html,
  });
};
