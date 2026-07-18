import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Connection Failed");
    console.log(error);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"GN Complaint Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);

    return true;

  } catch (error) {

    console.error("❌ Email Error:");
    console.error(error);

    // DON'T throw the error
    return false;
  }
};