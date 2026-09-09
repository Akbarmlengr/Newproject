import nodemailer from "nodemailer";

function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const transporter = buildTransport();

export async function sendPriceAlert({ title, url, oldPrice, newPrice, currency }) {
  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM;
  const subject = `Price drop: ${title}`;
  const text =
    `${title} dropped from ${oldPrice} to ${newPrice} ${currency ?? ""}.\n\n${url}`;

  if (!transporter || !to || !from) {
    // No SMTP configured yet — log instead of failing so the poller keeps running.
    console.log(`[mailer] SMTP not configured, would have sent:\n${subject}\n${text}`);
    return;
  }

  await transporter.sendMail({ from, to, subject, text });
}
