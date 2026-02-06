import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "";
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || "";

function isConfigured(): boolean {
  return (
    accountSid.startsWith("AC") &&
    !accountSid.includes("xxxx") &&
    authToken.length > 10 &&
    !authToken.includes("your_") &&
    twilioPhoneNumber.length > 5 &&
    adminPhoneNumber.length > 5
  );
}

function getClient() {
  if (!isConfigured()) return null;
  return twilio(accountSid, authToken);
}

export async function sendAdminSms(
  message: string
): Promise<string | null> {
  const client = getClient();

  if (!client) {
    console.log("[DEV MODE] SMS not sent (Twilio not configured):");
    console.log(`  To: ${adminPhoneNumber || "(not set)"}`);
    console.log(`  Message: ${message}`);
    return null;
  }

  const result = await client.messages.create({
    body: message,
    from: twilioPhoneNumber,
    to: adminPhoneNumber,
  });

  return result.sid;
}

export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  if (!isConfigured()) return true; // skip validation in dev mode
  return twilio.validateRequest(authToken, signature, url, params);
}

export { adminPhoneNumber };
