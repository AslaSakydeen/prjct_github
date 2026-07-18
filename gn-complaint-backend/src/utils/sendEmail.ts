import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {

  try {

    console.log("📧 Sending email to:", to);

    await resend.emails.send({
      from: "GN Complaint System <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");

    return true;

  } catch(error){

    console.log("❌ Email Error");
    console.log(error);

    return false;
  }

};