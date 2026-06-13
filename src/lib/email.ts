import nodemailer, { type Transporter } from "nodemailer";
import { SMTP_CONFIG } from "./config";

let transporter: Transporter | null = null;


export function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.port === 465,
      requireTLS: true,
      pool: true,
      auth: { user: SMTP_CONFIG.user, pass: SMTP_CONFIG.pass },
      tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    });
  }
  return transporter;
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: MailInput): Promise<void> {
  await getTransporter().sendMail({ from: SMTP_CONFIG.from, to, subject, html });
}
