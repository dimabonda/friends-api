import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'friendsappdev24@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD!,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailOptions) => {
  await transporter.sendMail({
    from: '"Friends App" <friendsappdev24@gmail.com>',
    to,
    subject,
    html,
    text,
  });
};
