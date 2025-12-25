/**
 * Safari Index API Stack
 * API Gateway and Lambda for the Decision Orchestrator
 *
 * Per 11_mvp_build_plan.md Phase 1:
 * - API Gateway
 * - Decision Orchestrator Lambda
 *
 * Single endpoint: POST /decision/evaluate
 * Per task requirements: "Thin handler, no logic duplication"
 */

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
  envName: string;
  resourcePrefix: string;
  decisionTable: dynamodb.ITable;
  eventTable: dynamodb.ITable;
  reviewTable: dynamodb.ITable;
  assuranceTable: dynamodb.ITable;
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  public readonly orchestratorLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { resourcePrefix } = props;
    const exportPrefix = resourcePrefix ? 'Staging' : '';
    const apiNamePrefix = resourcePrefix ? 'Staging ' : '';

    /**
     * Decision Orchestrator Lambda
     *
     * Per governance documents:
     * - Validates inputs before AI invocation
     * - Enforces verdict-or-refusal logic
     * - Persists decisions and logs events
     * - Never runs AI directly from frontend
     */
    this.orchestratorLambda = new lambda.Function(this, 'DecisionOrchestratorLambda', {
      functionName: `${resourcePrefix}safari-index-decision-orchestrator`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('../backend/decision-orchestrator/dist'),
      timeout: cdk.Duration.seconds(60), // AI calls can take time
      memorySize: 512,
      environment: {
        // DynamoDB table names
        DECISION_TABLE: props.decisionTable.tableName,
        EVENT_TABLE: props.eventTable.tableName,
        REVIEW_TABLE: props.reviewTable.tableName,
        ASSURANCE_TABLE: props.assuranceTable.tableName,
        // Version tracking (per 10_data_model.md)
        LOGIC_VERSION: 'rules_v1.0',
        PROMPT_VERSION: 'prompt_v1.0',
        // Bedrock configuration
        BEDROCK_REGION: 'us-west-2',
        BEDROCK_MODEL_ID: 'anthropic.claude-3-haiku-20240307-v1:0',
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    // Grant Lambda permission to write to DynamoDB tables
    props.decisionTable.grantWriteData(this.orchestratorLambda);
    props.eventTable.grantWriteData(this.orchestratorLambda);
    props.reviewTable.grantWriteData(this.orchestratorLambda);
    props.assuranceTable.grantWriteData(this.orchestratorLambda);

    // Grant Lambda permission to read from DynamoDB (for queries)
    props.decisionTable.grantReadData(this.orchestratorLambda);
    props.eventTable.grantReadData(this.orchestratorLambda);
    props.reviewTable.grantReadData(this.orchestratorLambda);
    props.assuranceTable.grantReadData(this.orchestratorLambda);

    // Grant Lambda permission to invoke Bedrock
    this.orchestratorLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: ['*'], // Bedrock doesn't support resource-level permissions
      })
    );

    /**
     * API Gateway
     *
     * Single endpoint per task requirements:
     * POST /decision/evaluate
     *
     * Per 11_mvp_build_plan.md: "Thin handler, no logic duplication"
     * All logic is in the Lambda, API Gateway is passthrough.
     */
    this.api = new apigateway.RestApi(this, 'SafariIndexApi', {
      restApiName: `${apiNamePrefix}Safari Index Decision API`,
      description: 'Decision authority API for Safari Index',
      deployOptions: {
        stageName: 'v1',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Create /decision resource
    const decisionResource = this.api.root.addResource('decision');

    // Create /decision/evaluate endpoint
    const evaluateResource = decisionResource.addResource('evaluate');

    // Lambda integration
    const lambdaIntegration = new apigateway.LambdaIntegration(
      this.orchestratorLambda,
      {
        proxy: true, // Pass through request/response
      }
    );

    // POST /decision/evaluate
    evaluateResource.addMethod('POST', lambdaIntegration, {
      apiKeyRequired: false, // Can be enabled later for rate limiting
    });

    // Create /assurance resource for Decision Assurance
    // Per 02_decision_doctrine.md: paid artifact of professional judgment
    const assuranceResource = this.api.root.addResource('assurance');

    // POST /assurance/generate - Generate assurance from decision_id
    const generateResource = assuranceResource.addResource('generate');
    generateResource.addMethod('POST', lambdaIntegration, {
      apiKeyRequired: false,
    });

    // GET /assurance/{id} - Retrieve assurance artifact
    const assuranceIdResource = assuranceResource.addResource('{assurance_id}');
    assuranceIdResource.addMethod('GET', lambdaIntegration, {
      apiKeyRequired: false,
    });

    // Create /ops resource for operator endpoints
    // Per task: operator-only infrastructure endpoints
    const opsResource = this.api.root.addResource('ops');

    // GET /ops/health - System health snapshot
    const healthResource = opsResource.addResource('health');
    healthResource.addMethod('GET', lambdaIntegration, {
      apiKeyRequired: false, // No auth for MVP (consistent with existing endpoints)
    });

    // Output API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'Safari Index Decision API URL',
      exportName: `${exportPrefix}SafariIndexApiUrl`,
    });

    new cdk.CfnOutput(this, 'DecisionEndpoint', {
      value: `${this.api.url}decision/evaluate`,
      description: 'Decision evaluation endpoint',
      exportName: `${exportPrefix}SafariIndexDecisionEndpoint`,
    });
  }
}
