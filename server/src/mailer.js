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
    console.error("Recruiter notification failed:", err.message);
  }
}

// Confirmation email sent to the candidate after they apply.
export async function confirmApplicantReceipt(application) {
  if (!transporter || !application.email) return;
  const position = application.jobTitleSnapshot || "your application";
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: application.email,
      subject: `We received your application — WorkSi`,
      text:
        `Hi ${application.firstName},\n\n` +
        `Thanks for applying to ${position} with WorkSi. We've received your application and our ` +
        `recruitment team will review it shortly. If there's a match, we'll reach out by phone or email.\n\n` +
        `What happens next:\n` +
        `1. We review your profile\n` +
        `2. A recruiter gets in touch if there's a fit\n` +
        `3. Training, onboarding, and matching with the right employer\n\n` +
        `Thanks,\nThe WorkSi Team`,
    });
  } catch (err) {
    console.error("Applicant confirmation failed:", err.message);
  }
}
