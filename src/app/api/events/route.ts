import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventSubmissionSchema } from "@/lib/validators";
// import { sendAdminSms } from "@/lib/twilio";
import {
  sendAdminNewEventEmail,
  sendSubmitterConfirmationEmail,
} from "@/lib/resend";
// import { formatDateTime } from "@/lib/utils";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { status: "approved" },
    orderBy: { dateTime: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      dateTime: true,
      endDateTime: true,
      location: true,
      organizerName: true,
      organizerEmail: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = eventSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        dateTime: new Date(data.dateTime),
        endDateTime: new Date(data.endDateTime),
        location: data.location,
        organizerName: data.organizerName,
        organizerEmail: data.organizerEmail,
      },
    });

    // SMS approval disabled until Twilio phone number is approved
    // const smsMessage = [
    //   `New event submitted: "${event.title}"`,
    //   `When: ${formatDateTime(event.dateTime.toISOString())}`,
    //   `Where: ${event.location}`,
    //   `By: ${event.organizerName}`,
    //   ``,
    //   `Reply 1 to approve or APPROVE ${event.approvalToken}`,
    // ].join("\n");
    //
    // const messageSid = await sendAdminSms(smsMessage);
    //
    // if (messageSid) {
    //   await prisma.event.update({
    //     where: { id: event.id },
    //     data: { twilioMessageSid: messageSid },
    //   });
    // }

    // Send email notifications
    Promise.allSettled([
      sendAdminNewEventEmail(event),
      sendSubmitterConfirmationEmail(event),
    ]).catch((err) => console.error("Email notification error:", err));

    return NextResponse.json(
      { message: "Event submitted for review", id: event.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
