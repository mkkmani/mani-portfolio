import { escapeHtml } from "./escape";

const shell = (inner: string) =>
  `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">${inner}</div>`;

/** OTP verification email. The OTP is generated server-side (digits only). */
export function otpEmailHtml(otp: string, resend = false): string {
  return shell(`
    <h2 style="color: #f9ce20;">Verification Code</h2>
    <p>Your ${resend ? "new " : ""}verification code is:</p>
    <div style="background: #000; color: #f9ce20; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold;">
      ${escapeHtml(otp)}
    </div>
    <p style="color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
    <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
  `);
}

/** Admin reply email. Both reply and the original message are escaped (the
 * original is attacker-controlled from the contact submission). */
export function replyEmailHtml(reply: string, originalMessage: string): string {
  return shell(`
    <h2 style="color: #f9ce20;">Response from Manikanta</h2>
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #f9ce20; white-space: pre-wrap;">
      ${escapeHtml(reply)}
    </div>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
    <p style="color: #666; font-size: 14px;">Your original message:</p>
    <div style="background: #f9f9f9; padding: 15px; color: #666; font-size: 14px; white-space: pre-wrap;">
      ${escapeHtml(originalMessage)}
    </div>
  `);
}
