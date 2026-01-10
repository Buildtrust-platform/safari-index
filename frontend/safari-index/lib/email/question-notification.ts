/**
 * Question Notification Service
 *
 * Sends email notifications to operators when quick questions are received.
 * Uses AWS SES for reliable delivery.
 *
 * Per governance:
 * - Plain text only, no marketing
 * - No sequences, no automation
 * - Single notification per question
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client lazily to pick up env vars at runtime
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
 * Redact email for safe logging
 */
function redactEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const visiblePart = local.substring(0, Math.min(3, local.length));
  return `${visiblePart}***@${domain}`;
}

/**
 * Track sent notifications to prevent duplicates
 */
const sentNotifications = new Set<string>();

interface QuestionNotificationData {
  question_id: string;
  created_at: string;
  email: string;
  question: string;
  source_path?: string;
}

/**
 * Send notification email to operator for new question
 */
export async function sendQuestionNotification(data: QuestionNotificationData): Promise<boolean> {
  const logPrefix = '[Question Notification]';
  const questionId = data.question_id;

  // Idempotency check
  if (sentNotifications.has(questionId)) {
    console.log(`${logPrefix} Already sent for ${questionId}, skipping duplicate`);
    return true;
  }

  const operatorEmail = process.env.OPERATOR_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || 'notifications@safariindex.com';
  const region = process.env.SES_REGION || process.env.DYNAMO_REGION || 'us-east-1';

  console.log(`${logPrefix} Config check:`, {
    question_id: questionId,
    operator_email: operatorEmail ? redactEmail(operatorEmail) : 'NOT_SET',
    from_email: redactEmail(fromEmail),
    region,
    has_credentials: Boolean(process.env.AWS_ACCESS_KEY_ID || process.env.DYNAMO_ACCESS_KEY_ID),
  });

  if (!operatorEmail) {
    console.warn(`${logPrefix} OPERATOR_EMAIL not configured, skipping notification`);
    return false;
  }

  const subject = `Quick question from ${redactEmail(data.email)}`;

  const body = `New question received

Question ID: ${data.question_id}
Received: ${new Date(data.created_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}

FROM
----
${data.email}

QUESTION
--------
${data.question}

SOURCE
------
${data.source_path || '/contact'}

---
Reply directly to this email to respond to the traveler.
`;

  try {
    console.log(`${logPrefix} Sending email for ${questionId}...`);

    const result = await getSesClient().send(
      new SendEmailCommand({
        Source: fromEmail,
        Destination: {
          ToAddresses: [operatorEmail],
        },
        ReplyToAddresses: [data.email], // Reply goes directly to traveler
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

    sentNotifications.add(questionId);

    console.log(`${logPrefix} SUCCESS`, {
      question_id: questionId,
      message_id: result.MessageId,
      to: redactEmail(operatorEmail),
    });

    return true;
  } catch (error: unknown) {
    const errName = error instanceof Error ? error.name : 'UnknownError';
    const errMessage = error instanceof Error ? error.message : String(error);
    const errCode = (error as { Code?: string })?.Code || (error as { code?: string })?.code;

    console.error(`${logPrefix} FAILED`, {
      question_id: questionId,
      error_name: errName,
      error_code: errCode,
      error_message: errMessage,
      from: redactEmail(fromEmail),
      to: redactEmail(operatorEmail),
      region,
    });

    return false;
  }
}
