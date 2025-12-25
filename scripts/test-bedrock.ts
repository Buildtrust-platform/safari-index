#!/usr/bin/env npx ts-node
/**
 * Test Bedrock connectivity
 * Run with: npx ts-node scripts/test-bedrock.ts
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const BEDROCK_REGION = process.env.BEDROCK_REGION || 'us-west-2';
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

async function testBedrock() {
  console.log('Testing Bedrock connectivity...');
  console.log('Region:', BEDROCK_REGION);
  console.log('Model:', MODEL_ID);
  console.log('');

  const client = new BedrockRuntimeClient({ region: BEDROCK_REGION });

  const requestBody = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'Say "Hello, Bedrock is working!" and nothing else.',
      },
    ],
  };

  try {
    console.log('Sending request to Bedrock...');
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    console.log('\n✅ Bedrock responded successfully!');
    console.log('Response:', responseBody.content?.[0]?.text || responseBody);
  } catch (error) {
    console.log('\n❌ Bedrock invocation failed!');
    console.log('Error:', error);

    if (error instanceof Error) {
      console.log('\nError name:', error.name);
      console.log('Error message:', error.message);

      if (error.name === 'AccessDeniedException') {
        console.log('\n🔑 This is an access issue. Make sure:');
        console.log('   1. Claude 3 Sonnet is enabled in your AWS account for us-east-1');
        console.log('   2. Go to AWS Console → Bedrock → Model access → Enable Claude models');
      } else if (error.name === 'ValidationException') {
        console.log('\n⚠️ This is a validation issue. Check:');
        console.log('   1. Model ID is correct');
        console.log('   2. Request format is correct');
      } else if (error.name === 'ThrottlingException') {
        console.log('\n⏱️ Rate limited. Wait and try again.');
      }
    }

    process.exit(1);
  }
}

testBedrock();
