import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSubmitterApprovalEmail } from "@/lib/resend";

function htmlResponse(title: string, message: string, status = 200) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>body{font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f9fafb;}
.card{background:#fff;border-radius:12px;padding:2rem;max-width:400px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.1);}</style>
</head><body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html" },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");
  const action = request.nextUrl.searchParams.get("action");

  if (!token || !action || !["approve", "reject"].includes(action)) {
    return htmlResponse("Invalid Request", "Missing or invalid parameters.", 400);
  }

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return htmlResponse("Not Found", "Event not found.", 404);
  }

  if (event.approvalToken !== token) {
    return htmlResponse("Unauthorized", "Invalid approval token.", 403);
  }

  if (event.status !== "pending") {
    return htmlResponse(
      "Already Processed",
      `This event has already been ${event.status}.`
    );
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  await prisma.event.update({
    where: { id },
    data: { status: newStatus },
  });

  if (newStatus === "approved") {
    sendSubmitterApprovalEmail(event).catch((err) =>
      console.error("Failed to send approval email:", err)
    );
  }

  const title = newStatus === "approved" ? "Event Approved" : "Event Rejected";
  const message =
    newStatus === "approved"
      ? `"${event.title}" has been approved and is now on the calendar.`
      : `"${event.title}" has been rejected.`;

  return htmlResponse(title, message);
}
