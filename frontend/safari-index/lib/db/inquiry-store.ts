/**
 * Inquiry Store
 *
 * DynamoDB operations for the inquiry table.
 * Handles creation, retrieval, and updates of inquiry records.
 *
 * Per governance:
 * - No booking or payment logic
 * - Simple lead capture with decision context
 * - Operator workflow support
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
import type { InquiryRecord, InquiryRequest, InquiryStatus } from '../contracts';

// Configuration from environment
const INQUIRY_TABLE = process.env.INQUIRY_TABLE || 'safari-index-inquiries';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT; // For local testing

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Generate a unique inquiry ID with prefix
 */
function generateInquiryId(): string {
  return `inq_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

/**
 * Create a new inquiry record
 */
export async function createInquiry(
  request: InquiryRequest
): Promise<{ inquiry_id: string; created_at: string }> {
  const inquiry_id = generateInquiryId();
  const created_at = new Date().toISOString();

  const record: InquiryRecord = {
    inquiry_id,
    created_at,
    status: 'new',
    trip_shape_id: request.trip_shape_id,
    budget_band: request.budget_band,
    travel_month: request.travel_month,
    travel_year: request.travel_year,
    traveler_count: request.traveler_count,
    travel_style: request.travel_style,
    email: request.email,
    whatsapp: request.whatsapp,
    linked_decision_ids: request.linked_decision_ids,
    notes: request.notes,
    source_path: request.source_path,
    // Attribution tracking (optional, never fails inquiry creation)
    attribution: request.attribution,
  };

  await docClient.send(
    new PutCommand({
      TableName: INQUIRY_TABLE,
      Item: record,
    })
  );

  return { inquiry_id, created_at };
}

/**
 * Get an inquiry by ID
 */
export async function getInquiry(inquiry_id: string): Promise<InquiryRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: INQUIRY_TABLE,
      Key: { inquiry_id },
    })
  );

  return (result.Item as InquiryRecord) || null;
}

/**
 * List inquiries by status, newest first
 */
export async function listInquiriesByStatus(
  status: InquiryStatus,
  limit: number = 50
): Promise<InquiryRecord[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: INQUIRY_TABLE,
      IndexName: 'status-created-index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      ScanIndexForward: false, // Newest first
      Limit: limit,
    })
  );

  return (result.Items as InquiryRecord[]) || [];
}

/**
 * List all recent inquiries (scan, for ops view)
 * Note: In production with many inquiries, use pagination
 */
export async function listRecentInquiries(limit: number = 100): Promise<InquiryRecord[]> {
  // Query each status and merge, sorted by created_at
  const statuses: InquiryStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost'];
  const allInquiries: InquiryRecord[] = [];

  for (const status of statuses) {
    const items = await listInquiriesByStatus(status, limit);
    allInquiries.push(...items);
  }

  // Sort by created_at descending
  allInquiries.sort((a, b) => b.created_at.localeCompare(a.created_at));

  return allInquiries.slice(0, limit);
}

/**
 * Update inquiry status and/or notes
 */
export async function updateInquiry(
  inquiry_id: string,
  updates: { status?: InquiryStatus; notes?: string | null }
): Promise<InquiryRecord | null> {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  if (updates.status !== undefined) {
    updateExpressions.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = updates.status;
  }

  if (updates.notes !== undefined) {
    updateExpressions.push('#notes = :notes');
    expressionAttributeNames['#notes'] = 'notes';
    expressionAttributeValues[':notes'] = updates.notes;
  }

  if (updateExpressions.length === 0) {
    // Nothing to update, just return current record
    return getInquiry(inquiry_id);
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: INQUIRY_TABLE,
      Key: { inquiry_id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as InquiryRecord) || null;
}
