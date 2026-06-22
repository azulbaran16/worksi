import nodemailer from "nodemailer";

// Optional email notifications. If SMTP env vars are not set, this is a no-op.
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function notifyNewApplication(application) {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New application: ${application.jobTitleSnapshot || "General"} - ${application.firstName} ${application.lastName}`,
      text:
        `New application received.\n\n` +
        `Name: ${application.firstName} ${application.lastName}\n` +
        `Email: ${application.email}\n` +
        `Phone: ${application.phone}\n` +
        `Position: ${application.jobTitleSnapshot || "General application"}\n` +
        `Engagement: ${application.engagementType}\n`,
    });
  } catch (err) {
    console.error("Email notification failed:", err.message);
  }
}
