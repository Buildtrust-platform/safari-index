/**
 * Booking Store
 *
 * DynamoDB operations for the bookings table.
 * Handles consultation booking records.
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import type { BookingRecord, BookingRequest, BookingStatus } from '../contracts';

// Configuration
const BOOKING_TABLE = process.env.BOOKING_TABLE || 'safari-index-bookings';
const REGION = process.env.AWS_REGION || process.env.DYNAMO_REGION || 'eu-central-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

// Credentials helper
const getCredentials = () => {
  if (process.env.DYNAMO_ACCESS_KEY_ID && process.env.DYNAMO_SECRET_ACCESS_KEY) {
    return {
      accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
      secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
    };
  }
  return undefined;
};

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  region: REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
  ...(getCredentials() && { credentials: getCredentials() }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Generate a unique booking ID
 */
function generateBookingId(): string {
  return `bkg_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

/**
 * Create a new booking record
 */
export async function createBooking(
  request: BookingRequest,
  calendarEventId?: string,
  meetingLink?: string
): Promise<{ booking_id: string; created_at: string }> {
  const booking_id = generateBookingId();
  const created_at = new Date().toISOString();

  const record: BookingRecord = {
    booking_id,
    created_at,
    status: 'confirmed',
    name: request.name,
    email: request.email,
    phone: request.phone,
    consultation_type: request.consultation_type,
    slot_start: request.slot_start,
    slot_end: request.slot_end,
    timezone: request.timezone,
    notes: request.notes,
    source_path: request.source_path,
    calendar_event_id: calendarEventId,
    meeting_link: meetingLink,
  };

  await docClient.send(
    new PutCommand({
      TableName: BOOKING_TABLE,
      Item: record,
    })
  );

  return { booking_id, created_at };
}

/**
 * Get a booking by ID
 */
export async function getBooking(booking_id: string): Promise<BookingRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: BOOKING_TABLE,
      Key: { booking_id },
    })
  );

  return (result.Item as BookingRecord) || null;
}

/**
 * List bookings by status
 */
export async function listBookingsByStatus(
  status: BookingStatus,
  limit: number = 50
): Promise<BookingRecord[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: BOOKING_TABLE,
      IndexName: 'status-slot-index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      ScanIndexForward: true, // Chronological by slot time
      Limit: limit,
    })
  );

  return (result.Items as BookingRecord[]) || [];
}

/**
 * List upcoming confirmed bookings
 */
export async function listUpcomingBookings(limit: number = 50): Promise<BookingRecord[]> {
  const now = new Date().toISOString();

  const result = await docClient.send(
    new QueryCommand({
      TableName: BOOKING_TABLE,
      IndexName: 'status-slot-index',
      KeyConditionExpression: '#status = :status AND slot_start > :now',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'confirmed',
        ':now': now,
      },
      ScanIndexForward: true,
      Limit: limit,
    })
  );

  return (result.Items as BookingRecord[]) || [];
}

/**
 * Check if a slot is already booked
 */
export async function isSlotBooked(slotStart: string, slotEnd: string): Promise<boolean> {
  // Query for confirmed bookings in this time range
  const result = await docClient.send(
    new QueryCommand({
      TableName: BOOKING_TABLE,
      IndexName: 'status-slot-index',
      KeyConditionExpression: '#status = :status AND slot_start = :start',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'confirmed',
        ':start': slotStart,
      },
      Limit: 1,
    })
  );

  return (result.Items?.length || 0) > 0;
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  booking_id: string,
  reason?: string
): Promise<BookingRecord | null> {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: BOOKING_TABLE,
      Key: { booking_id },
      UpdateExpression: 'SET #status = :status, cancelled_at = :cancelled_at, cancel_reason = :reason',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'cancelled',
        ':cancelled_at': new Date().toISOString(),
        ':reason': reason || null,
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as BookingRecord) || null;
}

/**
 * Mark booking as completed
 */
export async function completeBooking(booking_id: string): Promise<BookingRecord | null> {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: BOOKING_TABLE,
      Key: { booking_id },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'completed',
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as BookingRecord) || null;
}

/**
 * List all recent bookings for ops view
 */
export async function listRecentBookings(limit: number = 100): Promise<BookingRecord[]> {
  const statuses: BookingStatus[] = ['confirmed', 'cancelled', 'completed', 'no_show'];
  const allBookings: BookingRecord[] = [];

  for (const status of statuses) {
    const items = await listBookingsByStatus(status, limit);
    allBookings.push(...items);
  }

  // Sort by slot_start descending
  allBookings.sort((a, b) => b.slot_start.localeCompare(a.slot_start));
  return allBookings.slice(0, limit);
}
