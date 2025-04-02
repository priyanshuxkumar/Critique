import jwt from "jsonwebtoken";


import { getVerificationEmailTemplate, getWelcomeEmailTemplate } from "./emailTemplate";
import { EMAIL_FROM, JWT_SECRET, resend, SERVER_URL } from "../config";


async function sendVerificationEmail(email: string) : Promise<{status: boolean, message: string}> {
  const VERIFICATION_TOKEN = jwt.sign({ email },  JWT_SECRET, {expiresIn: "10m"});
  const VERIFY_EMAIL_URL = `${SERVER_URL}/verify-email?token=${VERIFICATION_TOKEN}`;
  if(!email) {
    throw new Error("Email is required");
  }
  try {
    const { data, error }  = await resend.emails.send({
      from: EMAIL_FROM as string,
      to: [email],
      subject: "Verify your email of Critique",
      html: getVerificationEmailTemplate(VERIFY_EMAIL_URL)
    });
    if (error) {
      throw error;
    }
    return { status: true, message: `Verification email sent successfully ${data}`,  };
  } catch (error) {
    throw new Error("Failed to send email.");
  }
}


async function sendWelcomeEmail(email : string , name : string) : Promise<{status: boolean, message: string}> {
    if(!email || !name) {
      throw new Error("Email or username is required");
    }
    try {
        await resend.emails.send({
            from: EMAIL_FROM as string,
            to: [email],
            subject: "Welcome to Critique",
            html: getWelcomeEmailTemplate(name)
        });
        return { status: true, message: "Welcome email sent successfully." };
    } catch (error) {
        throw new Error("Failed to send email.");
    }
}

export { sendVerificationEmail , sendWelcomeEmail };
