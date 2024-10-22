import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAuctionEndNotification = async (
  winnerEmail: string,
  bidderEmails: string[],
  auctionTitle: string,
  winningBid: number
) => {
  const winnerSubject = `Congratulations! You've won the auction for ${auctionTitle}`;
  const winnerText = `You've won the auction for ${auctionTitle} with a bid of ${winningBid} coins. Congratulations!`;

  const bidderSubject = `Auction ended: ${auctionTitle}`;
  const bidderText = `The auction for ${auctionTitle} has ended. The winning bid was ${winningBid} coins.`;

  try {
    // Send email to winner
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: winnerEmail,
      subject: winnerSubject,
      text: winnerText,
    });

    // Send emails to other bidders
    for (const email of bidderEmails) {
      if (email !== winnerEmail) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: bidderSubject,
          text: bidderText,
        });
      }
    }

    console.log('Auction end notifications sent successfully');
  } catch (error) {
    console.error('Error sending auction end notifications:', error);
  }
};