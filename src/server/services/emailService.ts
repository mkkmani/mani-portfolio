import nodemailer from "nodemailer";
import { ENV_CONFIG } from "@/config/envConfig";
import { ContactFormData } from "@/server/utils/contactValidation";

export const sendEmail = async (emailData: ContactFormData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ENV_CONFIG.GMAIL_USER,
      pass: ENV_CONFIG.GMAIL_PASS,
    },
  });

  console.log({ emailData });

  const mailOptions = {
    from: emailData.email,
    to: ENV_CONFIG.GMAIL_USER,
    subject: `💬 New Message from ${emailData.name}`,
    text: emailData.message,
    html: `
        <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: auto; padding: 20px; border-radius: 12px; background-color: #f3f4f6; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            
            <h2 style="color: #2c3e50; text-align: center;">🔔 New Message from ${emailData.name}</h2>
            
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
                You’ve received a new message through your website contact form. Here are the details:
            </p>

            <div style="padding: 15px; background-color: #fff; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 30px;">
                <p style="font-size: 14px; margin: 10px 0; color: #555;">
                    <strong>Name:</strong> ${emailData.name}
                </p>
                <p style="font-size: 14px; margin: 10px 0; color: #555;">
                    <strong>Email:</strong> ${emailData.email}
                </p>
                <p style="font-size: 14px; margin: 10px 0; color: #555;">
                    <strong>Message:</strong><br/>
                    <span style="color: #777;">“${emailData.message}”</span>
                </p>
            </div>

            <p style="font-size: 14px; color: #555;">
                <strong>Tip:</strong> You can reply directly to the sender via email to address their message promptly.
            </p>

            <p style="font-size: 13px; color: #777; text-align: center; margin-top: 40px;">
                🚀 Thanks for staying connected with your audience!
            </p>
        </div>
    `,
  };

  const sendConfirmation = {
    from: ENV_CONFIG.GMAIL_USER,
    to: emailData.email,
    subject: `💖 Thanks for reaching out, ${emailData.name}!`,
    text: "Thank you for your message! I will get back to you as soon as possible.",
    html: `
        <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: auto; padding: 20px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            
            <h2 style="color: #2c3e50; text-align: center;">💬 Hey ${emailData.name}, thanks for your message!</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px; color: #555;">
                I'm excited to hear from you! I will review your message and get back to you as soon as possible.
            </p>
            
            <div style="padding: 15px; background-color: #f7f7f7; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 15px; color: #333;">
                    <strong>Here’s what you sent us:</strong><br/>
                    “${emailData.message}”
                </p>
            </div>

            <p style="font-size: 15px; color: #555; margin-top: 20px;">
                In the meantime, feel free to check out <a href="https://manikantaketha.in/notelogs" style="color: #3498db; text-decoration: none; font-weight: bold;">our Notelogs</a> where I share some interesting insights and blog posts.
            </p>

            <p style="font-size: 15px; color: #555; margin-top: 20px;">
                🚀 If you need help immediately, don’t hesitate to <a href="mailto:${ENV_CONFIG.GMAIL_USER}" style="color: #e74c3c; text-decoration: none; font-weight: bold;">reply to this email</a> directly.
            </p>

            <p style="font-size: 13px; color: #777; text-align: center; margin-top: 40px;">
                I’ll be in touch soon!<br/>
                <strong>Mani</strong>
            </p>
        </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(sendConfirmation);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
