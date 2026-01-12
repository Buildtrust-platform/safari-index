/**
 * Debug SES Configuration
 * Temporary endpoint to diagnose email issues
 */

import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export async function GET() {
  const config = {
    SES_REGION: process.env.SES_REGION || 'NOT_SET',
    DYNAMO_REGION: process.env.DYNAMO_REGION || 'NOT_SET',
    AWS_REGION: process.env.AWS_REGION || 'NOT_SET',
    OPERATOR_EMAIL: process.env.OPERATOR_EMAIL ? 'SET' : 'NOT_SET',
    FROM_EMAIL: process.env.FROM_EMAIL || 'NOT_SET',
    HAS_DYNAMO_ACCESS_KEY: !!process.env.DYNAMO_ACCESS_KEY_ID,
    HAS_DYNAMO_SECRET_KEY: !!process.env.DYNAMO_SECRET_ACCESS_KEY,
    computed_ses_region: process.env.SES_REGION || process.env.AWS_REGION || process.env.DYNAMO_REGION || 'us-east-1',
  };

  // Try to send a test email
  let emailResult = 'not_attempted';
  let emailError = null;

  try {
    const region = process.env.SES_REGION || process.env.AWS_REGION || process.env.DYNAMO_REGION || 'us-east-1';
    const credentials = process.env.DYNAMO_ACCESS_KEY_ID && process.env.DYNAMO_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
          secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
        }
      : undefined;

    const sesClient = new SESClient({
      region,
      ...(credentials && { credentials }),
    });

    const fromEmail = process.env.FROM_EMAIL || 'info@vurarasafaris.com';
    const toEmail = process.env.OPERATOR_EMAIL;

    if (!toEmail) {
      emailResult = 'skipped_no_operator_email';
    } else {
      const result = await sesClient.send(
        new SendEmailCommand({
          Source: fromEmail,
          Destination: {
            ToAddresses: [toEmail],
          },
          Message: {
            Subject: {
              Data: 'SES Debug Test from Amplify',
              Charset: 'UTF-8',
            },
            Body: {
              Text: {
                Data: `This is a debug test email sent at ${new Date().toISOString()}.\n\nConfig:\n${JSON.stringify(config, null, 2)}`,
                Charset: 'UTF-8',
              },
            },
          },
        })
      );

      emailResult = 'success';
      emailError = result.MessageId;
    }
  } catch (error: unknown) {
    emailResult = 'failed';
    emailError = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: (error as { Code?: string })?.Code || (error as { code?: string })?.code,
    };
  }

  return NextResponse.json({
    config,
    emailResult,
    emailError,
    timestamp: new Date().toISOString(),
  });
}

export const dynamic = 'force-dynamic';
