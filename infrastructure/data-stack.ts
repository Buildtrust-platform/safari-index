/**
 * Safari Index Data Stack
 * DynamoDB tables for decisions and events
 *
 * Per 10_data_model.md:
 * - decision table with GSIs for traveler, lead, and review queries
 * - event_log table for immutable audit trail
 *
 * Per 11_mvp_build_plan.md Phase 1:
 * - Decision schema + DB
 * - Event logging
 */

import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface DataStackProps extends cdk.StackProps {
  envName: string;
  resourcePrefix: string;
}

export class DataStack extends cdk.Stack {
  public readonly decisionTable: dynamodb.Table;
  public readonly eventTable: dynamodb.Table;
  public readonly reviewTable: dynamodb.Table;
  public readonly assuranceTable: dynamodb.Table;
  public readonly snapshotTable: dynamodb.Table;
  public readonly inquiryTable: dynamodb.Table;
  public readonly proposalTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    const { resourcePrefix } = props;
    const exportPrefix = resourcePrefix ? 'Staging' : '';

    /**
     * Decision Table
     * Per 10_data_model.md Table 4
     *
     * PK: decision_id
     * GSI1: traveler_id + created_at (query decisions by traveler)
     * GSI2: lead_id + created_at (query decisions by lead)
     * GSI3: needs_review + created_at (query decisions needing review)
     */
    this.decisionTable = new dynamodb.Table(this, 'DecisionTable', {
      tableName: `${resourcePrefix}safari-index-decisions`,
      partitionKey: {
        name: 'decision_id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Decisions are critical data
      pointInTimeRecovery: true, // Enable PITR for audit compliance
    });

    // GSI1: Query by traveler_id + created_at
    this.decisionTable.addGlobalSecondaryIndex({
      indexName: 'traveler-created-index',
      partitionKey: {
        name: 'traveler_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI2: Query by lead_id + created_at
    this.decisionTable.addGlobalSecondaryIndex({
      indexName: 'lead-created-index',
      partitionKey: {
        name: 'lead_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    /**
     * Event Log Table
     * Per 10_data_model.md Table 7
     *
     * Events are IMMUTABLE. Once written, they cannot be modified.
     *
     * PK: event_id
     * GSI1: traveler_id + created_at
     * GSI2: event_type + created_at
     * GSI3: session_id + created_at
     */
    this.eventTable = new dynamodb.Table(this, 'EventTable', {
      tableName: `${resourcePrefix}safari-index-events`,
      partitionKey: {
        name: 'event_id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Events are audit data
      pointInTimeRecovery: true,
    });

    // GSI1: Query by traveler_id + created_at
    this.eventTable.addGlobalSecondaryIndex({
      indexName: 'traveler-created-index',
      partitionKey: {
        name: 'traveler_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI2: Query by event_type + created_at
    this.eventTable.addGlobalSecondaryIndex({
      indexName: 'type-created-index',
      partitionKey: {
        name: 'event_type',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI3: Query by session_id + created_at
    this.eventTable.addGlobalSecondaryIndex({
      indexName: 'session-created-index',
      partitionKey: {
        name: 'session_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    /**
     * Review Queue Table
     * Per 10_data_model.md Table 8: review_queue
     * Per 06_review_correction.md: track decisions needing human review
     *
     * PK: review_id
     * GSI1: topic_id + created_at
     * GSI2: status + created_at
     */
    this.reviewTable = new dynamodb.Table(this, 'ReviewTable', {
      tableName: `${resourcePrefix}safari-index-reviews`,
      partitionKey: {
        name: 'review_id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI1: Query by topic_id + created_at
    this.reviewTable.addGlobalSecondaryIndex({
      indexName: 'topic-created-index',
      partitionKey: {
        name: 'topic_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI2: Query by status + created_at
    this.reviewTable.addGlobalSecondaryIndex({
      indexName: 'status-created-index',
      partitionKey: {
        name: 'status',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Output table names for reference
    new cdk.CfnOutput(this, 'DecisionTableName', {
      value: this.decisionTable.tableName,
      description: 'DynamoDB table for storing decisions',
      exportName: `${exportPrefix}SafariIndexDecisionTableName`,
    });

    new cdk.CfnOutput(this, 'EventTableName', {
      value: this.eventTable.tableName,
      description: 'DynamoDB table for event logging',
      exportName: `${exportPrefix}SafariIndexEventTableName`,
    });

    new cdk.CfnOutput(this, 'ReviewTableName', {
      value: this.reviewTable.tableName,
      description: 'DynamoDB table for review queue',
      exportName: `${exportPrefix}SafariIndexReviewTableName`,
    });

    /**
     * Assurance Table
     * Per 02_decision_doctrine.md: Decision Assurance is a paid artifact
     * Per 11_mvp_build_plan.md: Monetization without undermining authority
     *
     * PK: assurance_id
     * GSI1: decision_id (lookup assurance by decision)
     * GSI2: traveler_id + created_at (query assurances by traveler)
     */
    this.assuranceTable = new dynamodb.Table(this, 'AssuranceTable', {
      tableName: `${resourcePrefix}safari-index-assurances`,
      partitionKey: {
        name: 'assurance_id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI1: Query by decision_id
    this.assuranceTable.addGlobalSecondaryIndex({
      indexName: 'decision-index',
      partitionKey: {
        name: 'decision_id',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI2: Query by traveler_id + created_at
    this.assuranceTable.addGlobalSecondaryIndex({
      indexName: 'traveler-created-index',
      partitionKey: {
        name: 'traveler_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    new cdk.CfnOutput(this, 'AssuranceTableName', {
      value: this.assuranceTable.tableName,
      description: 'DynamoDB table for decision assurance artifacts',
      exportName: `${exportPrefix}SafariIndexAssuranceTableName`,
    });

    /**
     * Snapshot Cache Table
     * Stores pre-computed decision snapshots for default inputs per topic.
     * Used to serve instant responses and prevent evaluation stampedes.
     *
     * PK: topic_id
     * Attributes:
     * - decision_response: The cached DecisionResponse
     * - inputs_hash: Hash of the default inputs used
     * - created_at: When the snapshot was generated
     * - expires_at: TTL for automatic expiration
     * - lock_until: In-flight lock expiration (for request coalescing)
     */
    this.snapshotTable = new dynamodb.Table(this, 'SnapshotTable', {
      tableName: `${resourcePrefix}safari-index-snapshots`,
      partitionKey: {
        name: 'topic_id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Snapshots are regenerable cache
      timeToLiveAttribute: 'expires_at_epoch', // TTL attribute for auto-expiration
    });

    new cdk.CfnOutput(this, 'SnapshotTableName', {
      value: this.snapshotTable.tableName,
      description: 'DynamoDB table for decision snapshot cache',
      exportName: `${exportPrefix}SafariIndexSnapshotTableName`,
    });

    /**
     * Inquiry Table
     * Per Business Coat: captures trip inquiry intent for operator follow-up.
     * No booking, no quotes - just lead capture with decision context.
     *
     * PK: inquiry_id
     * GSI1: status + created_at (query by status, newest first)
     */
    this.inquiryTable = new dynamodb.Table(this, 'InquiryTable', {
      tableName: `${resourcePrefix}safari-index-inquiries`,
      partitionKey: {
        name: 'inquiry_id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Inquiries are business-critical leads
      pointInTimeRecovery: true,
    });

    // GSI1: Query by status + created_at (for ops listing by status)
    this.inquiryTable.addGlobalSecondaryIndex({
      indexName: 'status-created-index',
      partitionKey: {
        name: 'status',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    new cdk.CfnOutput(this, 'InquiryTableName', {
      value: this.inquiryTable.tableName,
      description: 'DynamoDB table for trip inquiries',
      exportName: `${exportPrefix}SafariIndexInquiryTableName`,
    });

    /**
     * Proposal Table
     * Stores Safari Proposal Packs generated from inquiries.
     * Shareable via public token, downloadable as PDF.
     *
     * PK: proposal_id
     * GSI1: inquiry_id + created_at (find proposals for an inquiry)
     */
    this.proposalTable = new dynamodb.Table(this, 'ProposalTable', {
      tableName: `${resourcePrefix}safari-index-proposals`,
      partitionKey: {
        name: 'proposal_id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Proposals are business-critical
      pointInTimeRecovery: true,
    });

    // GSI1: Query by inquiry_id + created_at (find proposals for an inquiry)
    this.proposalTable.addGlobalSecondaryIndex({
      indexName: 'inquiry-created-index',
      partitionKey: {
        name: 'inquiry_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    new cdk.CfnOutput(this, 'ProposalTableName', {
      value: this.proposalTable.tableName,
      description: 'DynamoDB table for safari proposals',
      exportName: `${exportPrefix}SafariIndexProposalTableName`,
    });
  }
}
