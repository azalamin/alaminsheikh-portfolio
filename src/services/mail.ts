import nodemailer from "nodemailer";
import { formatCurrency } from "@/lib/currency";

// Gmail SMTP with an app password. Isolated here so a later swap to
// another provider (e.g. Resend) only touches this file.
const GMAIL_USER = process.env.GOOGLE_CLIENT_ID;
const GMAIL_APP_PASSWORD = process.env.GOOGLE_CLIENT_SECRET;

// A bare email address (no display name) is a common spam-filter signal.
const FROM_ADDRESS = `"Al Amin Sheikh" <${GMAIL_USER}>`;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function sendEditorInviteEmail(params: {
  to: string;
  name: string;
  tempPassword: string;
}) {
  const loginUrl = new URL("/login", process.env.BETTER_AUTH_URL).toString();

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: params.to,
    subject: "Your dashboard access",
    text: [
      `Hi ${params.name},`,
      "",
      "An editor account has been created for you.",
      "",
      `Email: ${params.to}`,
      `Temporary password: ${params.tempPassword}`,
      "",
      `Sign in at ${loginUrl} — you'll be asked to set a new password on first login.`,
    ].join("\n"),
  });
}

export async function sendVideoAssignedEmail(params: {
  to: string;
  editorName: string;
  projectTitle: string;
  description: string;
  amount: string;
  deadline: Date;
}) {
  const dashboardUrl = new URL("/editor/videos", process.env.BETTER_AUTH_URL).toString();

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: params.to,
    replyTo: process.env.ADMIN_EMAIL,
    subject: `New video project assigned: ${params.projectTitle}`,
    text: [
      `Hi ${params.editorName},`,
      "",
      `You've been assigned a new video project: "${params.projectTitle}".`,
      "",
      params.description,
      "",
      `Agreed amount: ${formatCurrency(params.amount)}`,
      `Deadline: ${params.deadline.toLocaleDateString()}`,
      "",
      `View it in your dashboard: ${dashboardUrl}`,
    ].join("\n"),
  });
}

export async function sendVideoStatusChangeEmail(params: {
  projectTitle: string;
  editorName: string;
  editorEmail: string;
  status: string;
  progress: number;
  note: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const dashboardUrl = new URL("/admin/videos", process.env.BETTER_AUTH_URL).toString();

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: adminEmail,
    replyTo: params.editorEmail,
    subject: `${params.projectTitle}: ${params.status} (${params.progress}%)`,
    text: [
      `${params.editorName} posted an update on "${params.projectTitle}".`,
      "",
      `Status: ${params.status}`,
      `Progress: ${params.progress}%`,
      "",
      params.note,
      "",
      `View: ${dashboardUrl}`,
    ].join("\n"),
  });
}

export async function sendContactNotificationEmail(params: {
  name: string;
  email: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: adminEmail,
    replyTo: params.email,
    subject: `New contact form submission from ${params.name}`,
    text: [
      `Name: ${params.name}`,
      `Email: ${params.email}`,
      "",
      params.message,
    ].join("\n"),
  });
}
