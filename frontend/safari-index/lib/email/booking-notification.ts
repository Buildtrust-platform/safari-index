/**
 * Booking Notification Service
 *
 * Sends confirmation emails for consultation bookings.
 * Sends to both the traveler and the operator.
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client lazily
let _sesClient: SESClient | null = null;
function getSesClient(): SESClient {
  if (!_sesClient) {
    const region = process.env.SES_REGION || process.env.AWS_REGION || process.env.DYNAMO_REGION || 'us-east-1';
    const credentials = process.env.DYNAMO_ACCESS_KEY_ID && process.env.DYNAMO_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
          secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
        }
      : undefined;
    _sesClient = new SESClient({
      region,
      ...(credentials && { credentials }),
    });
  }
  return _sesClient;
}

/**
 * Redact email for logging
 */
function redactEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const visiblePart = local.substring(0, Math.min(3, local.length));
  return `${visiblePart}***@${domain}`;
}

/**
 * Format datetime for display
 */
function formatDateTime(isoString: string, timezone: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short',
  });
}

interface BookingConfirmationData {
  booking_id: string;
  name: string;
  email: string;
  consultation_type: string;
  slot_start: string;
  slot_end: string;
  timezone: string;
  meeting_link?: string;
}

/**
 * Send booking confirmation to traveler and operator
 */
export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
  const logPrefix = '[Booking Notification]';
  const operatorEmail = process.env.OPERATOR_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || 'notifications@vurarasafaris.com';

  if (!operatorEmail) {
    console.warn(`${logPrefix} OPERATOR_EMAIL not configured`);
    return false;
  }

  const formattedStart = formatDateTime(data.slot_start, data.timezone);

  // Send to traveler
  const travelerSubject = `Confirmed: ${data.consultation_type} with Vurara Safaris`;
  const travelerBody = `Hi ${data.name},

Your consultation with Vurara Safaris is confirmed.

BOOKING DETAILS
---------------
Type: ${data.consultation_type}
When: ${formattedStart}
Duration: 30 minutes
${data.meeting_link ? `\nJoin link: ${data.meeting_link}` : ''}

WHAT TO EXPECT
--------------
This is a no-pressure conversation to understand your safari goals.
We'll discuss destinations, timing, budget considerations, and answer any questions.

If you need to reschedule, reply to this email at least 24 hours before.

Looking forward to speaking with you.

Vurara Safaris
`;

  // Send to operator
  const operatorSubject = `New booking: ${data.consultation_type} with ${data.name}`;
  const operatorBody = `New consultation booked

Booking ID: ${data.booking_id}

TRAVELER
--------
Name: ${data.name}
Email: ${data.email}

CONSULTATION
------------
Type: ${data.consultation_type}
When: ${formattedStart}
Timezone: ${data.timezone}
${data.meeting_link ? `Join link: ${data.meeting_link}` : ''}

---
Calendar event has been created automatically.
`;

  try {
    // Send both emails
    await Promise.all([
      // To traveler
      getSesClient().send(
        new SendEmailCommand({
          Source: fromEmail,
          Destination: { ToAddresses: [data.email] },
          ReplyToAddresses: [operatorEmail],
          Message: {
            Subject: { Data: travelerSubject, Charset: 'UTF-8' },
            Body: { Text: { Data: travelerBody, Charset: 'UTF-8' } },
          },
        })
      ),
      // To operator
      getSesClient().send(
        new SendEmailCommand({
          Source: fromEmail,
          Destination: { ToAddresses: [operatorEmail] },
          ReplyToAddresses: [data.email],
          Message: {
            Subject: { Data: operatorSubject, Charset: 'UTF-8' },
            Body: { Text: { Data: operatorBody, Charset: 'UTF-8' } },
          },
        })
      ),
    ]);

    console.log(`${logPrefix} SUCCESS`, {
      booking_id: data.booking_id,
      traveler: redactEmail(data.email),
      operator: redactEmail(operatorEmail),
    });

    return true;
  } catch (error) {
    console.error(`${logPrefix} FAILED`, {
      booking_id: data.booking_id,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
