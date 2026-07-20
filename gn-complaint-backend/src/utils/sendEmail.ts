import nodemailer from "nodemailer";
import axios from "axios";
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
  const apiKey = process.env.BREVO_API_KEY;

  if (apiKey) {
    try {
      console.log("📧 Sending email via Brevo API to:", to);
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { 
            name: "GN Complaint System", 
            email: process.env.EMAIL_USER || "no-reply@gncomplaints.com" 
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
        },
        {
          headers: {
            "accept": "application/json",
            "api-key": apiKey,
            "content-type": "application/json",
          },
        }
      );
      console.log("✅ Email sent successfully via Brevo API:", response.data);
      return true;
    } catch (error: any) {
      console.log("❌ Brevo Email Error");
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      return false;
    }
  } else {
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
  }
};
