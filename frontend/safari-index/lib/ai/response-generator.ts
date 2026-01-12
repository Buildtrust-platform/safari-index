/**
 * Response Generator
 *
 * Generates personalized email responses using Claude AI.
 * Combines inquiry context with trip matches to create helpful drafts.
 *
 * Per governance:
 * - AI-assisted drafting, human approval required
 * - Clear, expert tone without sales pressure
 * - References specific traveler context for personalization
 */

import Anthropic from '@anthropic-ai/sdk';
import type { InquiryRecord } from '../contracts';
import type { TripMatch } from './trip-matcher';
import { buildResponseContext, buildSystemPrompt, extractFirstName } from './context-builder';

/**
 * Response template types
 */
export type ResponseTemplate =
  | 'first_response'
  | 'follow_up'
  | 'quote_sent'
  | 'checking_in';

/**
 * Generated response result
 */
export interface GeneratedResponse {
  subject: string;
  body: string;
  template: ResponseTemplate;
  metadata: {
    model: string;
    generated_at: string;
    trip_id?: string;
  };
}

/**
 * Template-specific prompts
 */
const TEMPLATE_PROMPTS: Record<ResponseTemplate, string> = {
  first_response: `
Generate a warm first response email to this safari inquiry.

Structure your response:
1. Greeting with their name
2. Thank them for reaching out and acknowledge their specific interest
3. If a trip is recommended, briefly explain why it fits their situation
4. Mention one or two highlights relevant to their group type
5. End with a clear next step (suggest a call, ask a clarifying question, or provide next action)

Keep it under 200 words. Sound like a helpful expert, not a salesperson.
`,

  follow_up: `
Generate a gentle follow-up email for this inquiry.

The traveler hasn't responded yet. Be helpful, not pushy.

Structure your response:
1. Friendly greeting
2. Brief check-in - mention you wanted to see if they had questions
3. Offer one specific helpful detail about their trip or timing
4. End with easy ways to reconnect

Keep it under 100 words. Respectful of their time.
`,

  quote_sent: `
Generate a follow-up email after sending a quote/proposal.

Structure your response:
1. Reference that you sent the proposal
2. Highlight one key point about why this trip works for them
3. Offer to walk through the details on a call
4. Mention your availability

Keep it under 100 words.
`,

  checking_in: `
Generate a brief check-in email.

They've been in contact but it's been a while. Keep it short and helpful.

Structure:
1. Friendly hello
2. One helpful piece of information (timing, availability, etc.)
3. Open door for questions

Under 75 words.
`,
};

/**
 * Generate subject line based on template and context
 */
function generateSubject(
  template: ResponseTemplate,
  inquiry: InquiryRecord,
  tripMatch?: TripMatch
): string {
  const firstName = extractFirstName(inquiry.email);

  switch (template) {
    case 'first_response':
      if (tripMatch) {
        return `Your ${tripMatch.trip_title} inquiry`;
      }
      return `Your safari inquiry`;

    case 'follow_up':
      return `Following up on your safari plans`;

    case 'quote_sent':
      return `Your safari proposal - next steps`;

    case 'checking_in':
      return `Quick check-in on your safari`;

    default:
      return `Your safari inquiry`;
  }
}

/**
 * Generate a response using Claude AI
 */
export async function generateResponse(
  inquiry: InquiryRecord,
  template: ResponseTemplate,
  selectedTrip?: TripMatch
): Promise<GeneratedResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const client = new Anthropic({ apiKey });

  // Build context
  const context = buildResponseContext(inquiry, selectedTrip);
  const systemPrompt = buildSystemPrompt(context);

  // Get template-specific prompt
  const templatePrompt = TEMPLATE_PROMPTS[template];
  const firstName = extractFirstName(inquiry.email);

  // Build the user prompt
  const userPrompt = `${templatePrompt}

The traveler's first name is: ${firstName}
Their email is: ${inquiry.email}

Generate the email body only (no subject line). Start with "Hi ${firstName}," and end with a signature line "Best regards," (I'll add my name after).`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === 'text');
    const body = textContent?.type === 'text' ? textContent.text : '';

    return {
      subject: generateSubject(template, inquiry, selectedTrip),
      body: body.trim(),
      template,
      metadata: {
        model: response.model,
        generated_at: new Date().toISOString(),
        trip_id: selectedTrip?.trip_id,
      },
    };
  } catch (error) {
    console.error('[Response Generator] Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}

/**
 * Generate a basic template response (no AI)
 * Fallback for when AI is unavailable or for quick templates
 */
export function generateBasicResponse(
  inquiry: InquiryRecord,
  template: ResponseTemplate,
  selectedTrip?: TripMatch
): GeneratedResponse {
  const firstName = extractFirstName(inquiry.email);

  let body: string;

  switch (template) {
    case 'first_response':
      if (selectedTrip) {
        body = `Hi ${firstName},

Thank you for reaching out about your safari plans. Based on what you've shared - ${inquiry.traveler_count} travelers${inquiry.travel_month ? ` planning for ${getMonthName(inquiry.travel_month)}` : ''} - I think our ${selectedTrip.trip_title} would be an excellent fit.

${selectedTrip.reasons.positive.length > 0 ? `This trip works well for you because ${selectedTrip.reasons.positive[0].toLowerCase()}.` : ''}

I'd love to learn more about your group and what you're hoping to experience. Would you be available for a brief call this week to discuss the details?

Best regards,`;
      } else {
        body = `Hi ${firstName},

Thank you for reaching out about your safari plans. I'm excited to help you create an unforgettable African adventure.

Based on your preferences - ${inquiry.traveler_count} travelers with a ${formatBudget(inquiry.budget_band)} budget - I have some ideas that would work wonderfully for your group.

Could we schedule a quick call to discuss your trip in more detail? I'd love to understand more about what experiences matter most to you.

Best regards,`;
      }
      break;

    case 'follow_up':
      body = `Hi ${firstName},

I wanted to check in and see if you had any questions about your safari plans. I'm here to help whenever you're ready.

If anything has changed with your timeline or preferences, just let me know and I can adjust my recommendations.

Best regards,`;
      break;

    case 'quote_sent':
      body = `Hi ${firstName},

I hope you've had a chance to review the proposal I sent over. I'm happy to walk through any of the details or answer questions.

Would a quick call be helpful to discuss the itinerary options?

Best regards,`;
      break;

    case 'checking_in':
      body = `Hi ${firstName},

Just a quick note to check in on your safari plans. I'm here if you have any questions.

Best regards,`;
      break;

    default:
      body = `Hi ${firstName},

Thank you for your interest in an African safari. I'd love to help you plan an unforgettable trip.

Please let me know if you have any questions.

Best regards,`;
  }

  return {
    subject: generateSubject(template, inquiry, selectedTrip),
    body,
    template,
    metadata: {
      model: 'basic-template',
      generated_at: new Date().toISOString(),
      trip_id: selectedTrip?.trip_id,
    },
  };
}

/**
 * Helper: Get month name
 */
function getMonthName(month: number): string {
  const months = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month] || '';
}

/**
 * Helper: Format budget for display
 */
function formatBudget(budget: string): string {
  const labels: Record<string, string> = {
    // Legacy values
    'under-5k': 'under $5,000/person',
    '5k-10k': '$5,000-$10,000/person',
    '10k-20k': '$10,000-$20,000/person',
    '20k-35k': '$20,000-$35,000/person',
    'above-35k': 'above $35,000/person',
    'flexible': 'flexible',
    // New values
    '3k-6k': '$3,000-$6,000/person',
    '6k-10k': '$6,000-$10,000/person',
    '10k-15k': '$10,000-$15,000/person',
    '15k-plus': '$15,000+/person',
    'not-sure': 'flexible',
  };
  return labels[budget] || budget;
}
