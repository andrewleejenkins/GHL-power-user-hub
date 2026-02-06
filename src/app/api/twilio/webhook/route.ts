import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTwilioSignature, adminPhoneNumber } from "@/lib/twilio";
import { escapeXml } from "@/lib/utils";

function twimlResponse(message: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
  return new NextResponse(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const signature = request.headers.get("x-twilio-signature") || "";
    const baseUrl = process.env.BASE_URL || request.nextUrl.origin;
    const webhookUrl = `${baseUrl}/api/twilio/webhook`;

    if (!validateTwilioSignature(webhookUrl, params, signature)) {
      return twimlResponse("Unauthorized");
    }

    const from = params.From || "";
    const body = (params.Body || "").trim();

    // Only accept messages from the admin phone number
    if (adminPhoneNumber && from !== adminPhoneNumber) {
      return twimlResponse("Unauthorized number.");
    }

    // Handle "1" — approve most recent pending event
    if (body === "1") {
      const pendingEvent = await prisma.event.findFirst({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      });

      if (!pendingEvent) {
        return twimlResponse("No pending events to approve.");
      }

      await prisma.event.update({
        where: { id: pendingEvent.id },
        data: { status: "approved" },
      });

      return twimlResponse(`Approved: "${pendingEvent.title}"`);
    }

    // Handle "APPROVE <token>"
    const approveMatch = body.match(/^APPROVE\s+(.+)$/i);
    if (approveMatch) {
      const token = approveMatch[1].trim();
      const event = await prisma.event.findUnique({
        where: { approvalToken: token },
      });

      if (!event) {
        return twimlResponse("Event not found for that token.");
      }

      if (event.status === "approved") {
        return twimlResponse(`"${event.title}" is already approved.`);
      }

      await prisma.event.update({
        where: { id: event.id },
        data: { status: "approved" },
      });

      return twimlResponse(`Approved: "${event.title}"`);
    }

    // Handle "REJECT" — reject most recent pending
    if (body.toUpperCase() === "REJECT" || body === "0") {
      const pendingEvent = await prisma.event.findFirst({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      });

      if (!pendingEvent) {
        return twimlResponse("No pending events to reject.");
      }

      await prisma.event.update({
        where: { id: pendingEvent.id },
        data: { status: "rejected" },
      });

      return twimlResponse(`Rejected: "${pendingEvent.title}"`);
    }

    return twimlResponse(
      'Reply "1" to approve the latest pending event, or "APPROVE <token>" for a specific event.'
    );
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return twimlResponse("An error occurred processing your request.");
  }
}
