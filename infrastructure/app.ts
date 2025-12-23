#!/usr/bin/env node
/**
 * Safari Index CDK App
 *
 * Deploys the infrastructure for Safari Index decision authority platform.
 *
 * Stacks:
 * - DataStack: DynamoDB tables for decisions and events
 * - ApiStack: API Gateway and Decision Orchestrator Lambda
 * - AssetsStack: S3 + CloudFront CDN for static assets
 *
 * Environment separation:
 * - ENV_NAME=prod (default): Production stacks with observation mode
 * - ENV_NAME=staging: Staging stacks with build mode
 */

import * as cdk from 'aws-cdk-lib';
import { DataStack } from './data-stack';
import { ApiStack } from './api-stack';
import { AssetsStack } from './assets-stack';

const app = new cdk.App();

// Environment name: 'prod' (default) or 'staging'
const envName = process.env.ENV_NAME || 'prod';
const isStaging = envName === 'staging';

// Stack name prefix
const stackPrefix = isStaging ? 'Staging' : '';

// Resource name prefix (lowercase for DynamoDB tables, Lambda, etc.)
const resourcePrefix = isStaging ? 'staging-' : '';

// Environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'eu-central-1',
};

console.log(`[CDK] Deploying ${envName} environment`);
console.log(`[CDK] Stack prefix: "${stackPrefix || '(none)'}"`);
console.log(`[CDK] Resource prefix: "${resourcePrefix || '(none)'}"`);

// Data stack (DynamoDB tables)
const dataStack = new DataStack(app, `${stackPrefix}SafariIndexDataStack`, {
  env,
  description: `Safari Index DynamoDB tables (${envName})`,
  envName,
  resourcePrefix,
});

// API stack (API Gateway + Lambda)
const apiStack = new ApiStack(app, `${stackPrefix}SafariIndexApiStack`, {
  env,
  description: `Safari Index API Gateway and Decision Orchestrator (${envName})`,
  envName,
  resourcePrefix,
  decisionTable: dataStack.decisionTable,
  eventTable: dataStack.eventTable,
  reviewTable: dataStack.reviewTable,
  assuranceTable: dataStack.assuranceTable,
});

// Ensure API stack is deployed after data stack
apiStack.addDependency(dataStack);

// Assets stack (S3 + CloudFront CDN)
// Standalone - no dependencies on other stacks
const assetsStack = new AssetsStack(app, `${stackPrefix}SafariIndexAssetsStack`, {
  env,
  description: `Safari Index S3 + CloudFront CDN for static assets (${envName})`,
  envName,
  resourcePrefix,
});

app.synth();
