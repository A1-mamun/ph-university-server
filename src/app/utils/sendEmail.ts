import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production', // true for production phase, false for development phase
    auth: {
      user: '1154almamun@gmail.com',
      pass: 'eyye ekcl xghx ejow',
    },
  });
  // console.log(to);

  await transporter.sendMail({
    from: '1154almamun@gmail.com',
    to,
    subject: 'Reset your password within 10 minutes',
    text: 'Reset your password within 10 minutes',
    html,
  });
};
