/**
 * Quick Question Store
 *
 * DynamoDB operations for the questions table.
 * Handles quick questions from the contact page.
 *
 * Uses the same inquiries table with a different record type
 * to avoid creating additional infrastructure.
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
import type { QuickQuestionRecord, QuickQuestionRequest, QuickQuestionStatus } from '../contracts';

// Configuration from environment
const QUESTION_TABLE = process.env.QUESTION_TABLE || 'safari-index-questions';
const REGION = process.env.AWS_REGION || process.env.DYNAMO_REGION || 'eu-central-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

// Get credentials - AWS SDK auto-picks AWS_ vars, but explicitly handle DYNAMO_ for Vercel
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
 * Generate a unique question ID with prefix
 */
function generateQuestionId(): string {
  return `qst_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

/**
 * Create a new quick question record
 */
export async function createQuestion(
  request: QuickQuestionRequest
): Promise<{ question_id: string; created_at: string }> {
  const question_id = generateQuestionId();
  const created_at = new Date().toISOString();

  const record: QuickQuestionRecord = {
    question_id,
    created_at,
    status: 'new',
    email: request.email,
    question: request.question,
    source_path: request.source_path,
  };

  await docClient.send(
    new PutCommand({
      TableName: QUESTION_TABLE,
      Item: record,
    })
  );

  return { question_id, created_at };
}

/**
 * Get a question by ID
 */
export async function getQuestion(question_id: string): Promise<QuickQuestionRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: QUESTION_TABLE,
      Key: { question_id },
    })
  );

  return (result.Item as QuickQuestionRecord) || null;
}

/**
 * List questions by status, newest first
 */
export async function listQuestionsByStatus(
  status: QuickQuestionStatus,
  limit: number = 50
): Promise<QuickQuestionRecord[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: QUESTION_TABLE,
      IndexName: 'status-created-index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      ScanIndexForward: false,
      Limit: limit,
    })
  );

  return (result.Items as QuickQuestionRecord[]) || [];
}

/**
 * List all recent questions
 */
export async function listRecentQuestions(limit: number = 100): Promise<QuickQuestionRecord[]> {
  const statuses: QuickQuestionStatus[] = ['new', 'replied', 'closed'];
  const allQuestions: QuickQuestionRecord[] = [];

  for (const status of statuses) {
    const items = await listQuestionsByStatus(status, limit);
    allQuestions.push(...items);
  }

  allQuestions.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return allQuestions.slice(0, limit);
}

/**
 * Update question status and/or reply
 */
export async function updateQuestion(
  question_id: string,
  updates: { status?: QuickQuestionStatus; reply?: string }
): Promise<QuickQuestionRecord | null> {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  if (updates.status !== undefined) {
    updateExpressions.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = updates.status;
  }

  if (updates.reply !== undefined) {
    updateExpressions.push('#reply = :reply');
    updateExpressions.push('#replied_at = :replied_at');
    expressionAttributeNames['#reply'] = 'reply';
    expressionAttributeNames['#replied_at'] = 'replied_at';
    expressionAttributeValues[':reply'] = updates.reply;
    expressionAttributeValues[':replied_at'] = new Date().toISOString();
  }

  if (updateExpressions.length === 0) {
    return getQuestion(question_id);
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: QUESTION_TABLE,
      Key: { question_id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as QuickQuestionRecord) || null;
}
