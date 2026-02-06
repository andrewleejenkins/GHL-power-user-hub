import { Resend } from "resend";
import { formatDateTime } from "@/lib/utils";

const apiKey = process.env.RESEND_API_KEY || "";
const fromAddress = "calendar@n.andrewleejenkins.com";
const adminEmail = "me@andrewleejenkins.com";

function isConfigured(): boolean {
  return apiKey.startsWith("re_") && apiKey.length > 10;
}

function getClient(): Resend | null {
  if (!isConfigured()) return null;
  return new Resend(apiKey);
}

interface EventForEmail {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  endDateTime: Date;
  location: string;
  organizerName: string;
  organizerEmail: string;
  approvalToken: string;
}

export async function sendAdminNewEventEmail(
  event: EventForEmail
): Promise<string | null> {
  const client = getClient();
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const approveUrl = `${baseUrl}/api/events/${event.id}/approve?token=${event.approvalToken}&action=approve`;
  const rejectUrl = `${baseUrl}/api/events/${event.id}/approve?token=${event.approvalToken}&action=reject`;

  const html = `
    <h2>New Event Submitted</h2>
    <p><strong>${event.title}</strong></p>
    <p>${event.description}</p>
    <ul>
      <li><strong>When:</strong> ${formatDateTime(event.dateTime.toISOString())} &ndash; ${formatDateTime(event.endDateTime.toISOString())}</li>
      <li><strong>Where:</strong> ${event.location}</li>
      <li><strong>By:</strong> ${event.organizerName} (${event.organizerEmail})</li>
    </ul>
    <p>
      <a href="${approveUrl}" style="display:inline-block;padding:12px 24px;background:#22c55e;color:#fff;text-decoration:none;border-radius:6px;margin-right:12px;">Approve</a>
      <a href="${rejectUrl}" style="display:inline-block;padding:12px 24px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px;">Reject</a>
    </p>
  `;

  if (!client) {
    console.log("[DEV MODE] Admin email not sent (Resend not configured):");
    console.log(`  To: ${adminEmail}`);
    console.log(`  Subject: New event: ${event.title}`);
    console.log(`  Approve: ${approveUrl}`);
    console.log(`  Reject: ${rejectUrl}`);
    return null;
  }

  const result = await client.emails.send({
    from: fromAddress,
    to: adminEmail,
    subject: `New event submitted: ${event.title}`,
    html,
  });

  return result.data?.id ?? null;
}

export async function sendSubmitterConfirmationEmail(
  event: EventForEmail
): Promise<string | null> {
  const client = getClient();

  const html = `
    <h2>We received your event submission</h2>
    <p>Hi ${event.organizerName},</p>
    <p>Your event <strong>"${event.title}"</strong> has been submitted and is pending review.</p>
    <ul>
      <li><strong>When:</strong> ${formatDateTime(event.dateTime.toISOString())} &ndash; ${formatDateTime(event.endDateTime.toISOString())}</li>
      <li><strong>Where:</strong> ${event.location}</li>
    </ul>
    <p>You'll receive another email once it's been reviewed.</p>
  `;

  if (!client) {
    console.log(
      "[DEV MODE] Submitter confirmation email not sent (Resend not configured):"
    );
    console.log(`  To: ${event.organizerEmail}`);
    console.log(`  Subject: Event received: ${event.title}`);
    return null;
  }

  const result = await client.emails.send({
    from: fromAddress,
    to: event.organizerEmail,
    subject: `Event received: ${event.title}`,
    html,
  });

  return result.data?.id ?? null;
}

export async function sendSubmitterApprovalEmail(
  event: EventForEmail
): Promise<string | null> {
  const client = getClient();

  const html = `
    <h2>Your event has been approved!</h2>
    <p>Hi ${event.organizerName},</p>
    <p>Great news &mdash; your event <strong>"${event.title}"</strong> has been approved and is now listed on the community calendar.</p>
    <ul>
      <li><strong>When:</strong> ${formatDateTime(event.dateTime.toISOString())} &ndash; ${formatDateTime(event.endDateTime.toISOString())}</li>
      <li><strong>Where:</strong> ${event.location}</li>
    </ul>
  `;

  if (!client) {
    console.log(
      "[DEV MODE] Submitter approval email not sent (Resend not configured):"
    );
    console.log(`  To: ${event.organizerEmail}`);
    console.log(`  Subject: Event approved: ${event.title}`);
    return null;
  }

  const result = await client.emails.send({
    from: fromAddress,
    to: event.organizerEmail,
    subject: `Event approved: ${event.title}`,
    html,
  });

  return result.data?.id ?? null;
}
