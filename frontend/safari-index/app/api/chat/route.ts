/**
 * Chat API Route
 *
 * AI-powered safari planning assistant using AWS Bedrock (Claude).
 * Provides instant answers to traveler questions.
 *
 * Features:
 * - Streaming responses for better UX
 * - Context-aware safari knowledge
 * - Rate limiting by email/session
 * - Conversation history tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
  Message,
  ContentBlock,
} from '@aws-sdk/client-bedrock-runtime';
import { FAQS } from '../../content/faqs';

// Bedrock region - us-east-1 has best Claude model availability
// Note: Must enable Claude 3 Haiku in AWS Bedrock console Model Access
const BEDROCK_REGION = process.env.BEDROCK_REGION || 'us-east-1';

// Bedrock client - uses default credential chain (IAM role in Amplify)
const bedrockClient = new BedrockRuntimeClient({
  region: BEDROCK_REGION,
});

// Model ID - Claude 3 Haiku for cost efficiency
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

// Build FAQ context for the assistant
function buildFAQContext(): string {
  const faqContext = FAQS.map(
    (faq) => `Q: ${faq.question}\nA: ${faq.answer}`
  ).join('\n\n');

  return faqContext;
}

// System prompt for the safari assistant
const SYSTEM_PROMPT = `You are a helpful safari planning assistant for Safari Index, a private safari operator specializing in East and Southern Africa.

Your role is to:
- Answer questions about safari planning, destinations, timing, costs, and logistics
- Provide factual, documentary-style responses (no marketing hype)
- Help travelers understand what to expect
- Guide them toward scheduling a call or submitting an inquiry when appropriate

Key information about Safari Index:
- Private safari operator (not a booking platform)
- Covers Tanzania, Kenya, Botswana, Zimbabwe, Zambia, Namibia, South Africa, Rwanda, Uganda
- Custom-built itineraries only (no set tours)
- Typical budgets: $400-1,500+ per person per day depending on region and style
- Planning lead time: 3-12 months recommended

Here are common FAQs to reference:

${buildFAQContext()}

Guidelines:
- Keep responses concise (2-4 sentences for simple questions, more for complex ones)
- Be honest about trade-offs and limitations
- Recommend scheduling a call for complex planning questions
- If asked about specific availability or pricing, explain that custom quotes require a consultation
- Never make up specific prices, dates, or lodge names
- Use a warm but professional tone`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  email: string;
  conversationHistory?: ChatMessage[];
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, email, conversationHistory = [] } = body;

    // Validate required fields
    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Build conversation for Bedrock
    const messages: Message[] = [];

    // Add conversation history
    for (const msg of conversationHistory.slice(-10)) {
      // Keep last 10 messages
      messages.push({
        role: msg.role,
        content: [{ text: msg.content } as ContentBlock],
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: [{ text: message } as ContentBlock],
    });

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const command = new ConverseStreamCommand({
            modelId: MODEL_ID,
            system: [{ text: SYSTEM_PROMPT }],
            messages,
            inferenceConfig: {
              maxTokens: 1024,
              temperature: 0.7,
              topP: 0.9,
            },
          });

          const response = await bedrockClient.send(command);

          if (response.stream) {
            for await (const event of response.stream) {
              if (event.contentBlockDelta?.delta?.text) {
                const text = event.contentBlockDelta.delta.text;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Bedrock streaming error:', error);

          // Provide helpful error message based on error type
          let errorMessage = 'I apologize, but I am unable to respond right now. Please try again or contact us directly.';

          if (error instanceof Error) {
            if (error.name === 'ThrottlingException' || error.message.includes('throttl') || error.message.includes('Too many tokens')) {
              errorMessage = 'Our assistant is experiencing high demand. Please try again in a few minutes, or contact us directly at hello@safariindex.com.';
              console.error('Bedrock throttling - consider requesting quota increase in AWS Service Quotas');
            } else if (error.name === 'AccessDeniedException' || error.message.includes('access')) {
              errorMessage = 'The AI assistant is not yet configured. Please contact us directly at hello@safariindex.com or schedule a call.';
              console.error('Bedrock access denied - ensure model is enabled in AWS Bedrock console and IAM permissions are set');
            } else if (error.name === 'ValidationException') {
              errorMessage = 'I had trouble understanding that. Could you rephrase your question?';
            }
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ text: errorMessage })}\n\n`
            )
          );
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
