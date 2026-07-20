import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,   // 5 seconds
  socketTimeout: 5000,     // 5 seconds
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    console.log("📧 Sending email via Nodemailer SMTP to:", to);

    const info = await transporter.sendMail({
      from: `"ComplaintCore Complaint System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully via SMTP:", info.messageId);
    return true;
  } catch (error) {
    console.log("❌ Nodemailer SMTP Email Error");
    console.log(error);
    return false;
  }
};

