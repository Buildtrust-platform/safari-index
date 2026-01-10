/**
 * Chat API Route
 *
 * AI-powered safari planning assistant using Anthropic Claude API directly.
 * Provides instant answers to traveler questions.
 *
 * Features:
 * - Streaming responses for better UX
 * - Context-aware safari knowledge
 * - Conversation history tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { FAQS } from '../../content/faqs';

// Anthropic client - uses ANTHROPIC_API_KEY env var
const anthropic = new Anthropic();

// Model - Claude 3 Haiku for cost efficiency ($0.25/1M input, $1.25/1M output)
const MODEL = 'claude-3-haiku-20240307';

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
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 503 }
      );
    }

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

    // Build messages array for Claude
    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    // Add conversation history (last 10 messages)
    for (const msg of conversationHistory.slice(-10)) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message,
    });

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages,
            stream: true,
          });

          for await (const event of response) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Anthropic streaming error:', error);

          let errorMessage = 'I apologize, but I am unable to respond right now. Please try again or contact us directly at hello@safariindex.com.';

          if (error instanceof Anthropic.RateLimitError) {
            errorMessage = 'Our assistant is experiencing high demand. Please try again in a moment.';
          } else if (error instanceof Anthropic.AuthenticationError) {
            errorMessage = 'The AI assistant is not yet configured. Please contact us directly.';
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: errorMessage })}\n\n`)
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
