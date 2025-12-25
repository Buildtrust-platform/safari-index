/**
 * Inquiry Notification Service
 *
 * Sends email notifications to operators when new inquiries are received.
 * Uses AWS SES for reliable delivery.
 *
 * Per governance:
 * - Plain text only, no marketing
 * - No sequences, no automation
 * - Single notification per inquiry
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { InquiryRecord } from '../contracts';

// Initialize SES client lazily to pick up env vars at runtime
// SES may be in a different region than DynamoDB (SES_REGION takes precedence)
let _sesClient: SESClient | null = null;
function getSesClient(): SESClient {
  if (!_sesClient) {
    const region = process.env.SES_REGION || process.env.AWS_REGION || 'us-east-1';
    _sesClient = new SESClient({ region });
  }
  return _sesClient;
}

/**
 * Redact email for safe logging (shows first 3 chars + domain)
 */
function redactEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const visiblePart = local.substring(0, Math.min(3, local.length));
  return `${visiblePart}***@${domain}`;
}

/**
 * Track sent notifications to prevent duplicates (in-memory for single instance)
 * In production with multiple instances, use DynamoDB attribute instead
 */
const sentNotifications = new Set<string>();

/**
 * Format budget band for display
 */
function formatBudgetBand(band: string): string {
  const labels: Record<string, string> = {
    'under-5k': 'Under $5,000',
    '5k-10k': '$5,000 – $10,000',
    '10k-20k': '$10,000 – $20,000',
    '20k-35k': '$20,000 – $35,000',
    'above-35k': 'Above $35,000',
    'flexible': 'Flexible',
  };
  return labels[band] || band;
}

/**
 * Format travel style for display
 */
function formatTravelStyle(style: string): string {
  const labels: Record<string, string> = {
    'solo': 'Solo traveler',
    'couple': 'Couple',
    'family-young-kids': 'Family with young children',
    'family-teens': 'Family with teens',
    'multigenerational': 'Multigenerational group',
    'friends-group': 'Friends group',
    'honeymoon': 'Honeymoon',
  };
  return labels[style] || style;
}

/**
 * Format month number to name
 */
function formatMonth(month: number | null): string {
  if (!month) return 'Not specified';
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || 'Unknown';
}

/**
 * Build date window string
 */
function formatDateWindow(month: number | null, year: number | null): string {
  if (!month && !year) return 'Not specified';
  if (month && year) return `${formatMonth(month)} ${year}`;
  if (year) return `${year}`;
  return formatMonth(month);
}

/**
 * Send notification email to operator for new inquiry
 *
 * Includes:
 * - Idempotency check (prevents duplicate sends)
 * - Structured debug logging (safe for production)
 * - Graceful failure (inquiry creation succeeds even if email fails)
 */
export async function sendInquiryNotification(inquiry: InquiryRecord): Promise<boolean> {
  const logPrefix = '[Inquiry Notification]';
  const inquiryId = inquiry.inquiry_id;

  // Idempotency check - prevent duplicate sends for same inquiry
  if (sentNotifications.has(inquiryId)) {
    console.log(`${logPrefix} Already sent for ${inquiryId}, skipping duplicate`);
    return true;
  }

  // Configuration validation with structured logging
  const operatorEmail = process.env.OPERATOR_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || 'notifications@safariindex.com';
  const region = process.env.SES_REGION || process.env.AWS_REGION || 'us-east-1';

  console.log(`${logPrefix} Config check:`, {
    inquiry_id: inquiryId,
    operator_email: operatorEmail ? redactEmail(operatorEmail) : 'NOT_SET',
    from_email: redactEmail(fromEmail),
    region,
    has_aws_credentials: Boolean(process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE),
  });

  if (!operatorEmail) {
    console.warn(`${logPrefix} OPERATOR_EMAIL not configured, skipping notification`);
    return false;
  }

  const dateWindow = formatDateWindow(inquiry.travel_month, inquiry.travel_year);
  const siteOrigin = process.env.SITE_ORIGIN || process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://safariindex.com';
  const opsUrl = `${siteOrigin}/ops/inquiries/${inquiry.inquiry_id}`;

  // Build linked decisions list
  const decisionsText = inquiry.linked_decision_ids.length > 0
    ? inquiry.linked_decision_ids
        .map(id => `  - ${siteOrigin}/decisions/${id}`)
        .join('\n')
    : '  (none linked)';

  const subject = `New Safari Index inquiry: ${formatBudgetBand(inquiry.budget_band)}, ${dateWindow}`;

  const body = `New inquiry received

Inquiry ID: ${inquiry.inquiry_id}
Created: ${new Date(inquiry.created_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}

TRAVELER DETAILS
----------------
Email: ${inquiry.email}
WhatsApp: ${inquiry.whatsapp || 'Not provided'}
Travelers: ${inquiry.traveler_count}
Style: ${formatTravelStyle(inquiry.travel_style)}

TRIP DETAILS
------------
Trip Shape: ${inquiry.trip_shape_id || 'Not selected'}
Budget: ${formatBudgetBand(inquiry.budget_band)}
Date Window: ${dateWindow}

LINKED DECISIONS
----------------
${decisionsText}

${inquiry.notes ? `NOTES\n-----\n${inquiry.notes}\n` : ''}
SOURCE
------
${inquiry.source_path || 'Direct'}

---
View in ops: ${opsUrl}
`;

  try {
    console.log(`${logPrefix} Sending email for ${inquiryId}...`);

    const result = await getSesClient().send(
      new SendEmailCommand({
        Source: fromEmail,
        Destination: {
          ToAddresses: [operatorEmail],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: body,
              Charset: 'UTF-8',
            },
          },
        },
      })
    );

    // Mark as sent to prevent duplicates
    sentNotifications.add(inquiryId);

    console.log(`${logPrefix} SUCCESS`, {
      inquiry_id: inquiryId,
      message_id: result.MessageId,
      to: redactEmail(operatorEmail),
    });

    return true;
  } catch (error: unknown) {
    // Extract error details safely
    const errName = error instanceof Error ? error.name : 'UnknownError';
    const errMessage = error instanceof Error ? error.message : String(error);
    const errCode = (error as { Code?: string })?.Code || (error as { code?: string })?.code;

    console.error(`${logPrefix} FAILED`, {
      inquiry_id: inquiryId,
      error_name: errName,
      error_code: errCode,
      error_message: errMessage,
      from: redactEmail(fromEmail),
      to: redactEmail(operatorEmail),
      region,
    });

    // Provide actionable guidance in development
    if (process.env.NODE_ENV === 'development') {
      if (errCode === 'MessageRejected' || errMessage.includes('not verified')) {
        console.error(`${logPrefix} HINT: Email identities must be verified in SES. Run:`);
        console.error(`  aws ses verify-email-identity --email-address ${operatorEmail} --region ${region}`);
        console.error(`  aws ses verify-email-identity --email-address ${fromEmail} --region ${region}`);
        console.error(`  Then click the verification link in your email inbox.`);
      }
      if (errCode === 'InvalidClientTokenId' || errMessage.includes('security token')) {
        console.error(`${logPrefix} HINT: AWS credentials not found. Check AWS_PROFILE or AWS_ACCESS_KEY_ID.`);
      }
    }

    // Return false but don't throw - inquiry creation should still succeed
    return false;
  }
}
