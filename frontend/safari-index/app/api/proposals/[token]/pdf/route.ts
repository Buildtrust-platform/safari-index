/**
 * Proposal PDF Generation API
 *
 * GET /api/proposals/[token]/pdf - Get print-friendly HTML for PDF generation
 *
 * Returns a standalone HTML page optimized for printing/PDF conversion.
 * Client can use window.print() or browser's Save as PDF feature.
 *
 * No authentication required - token serves as authorization.
 * Only returns proposals with status='sent' (not drafts).
 */

import { NextResponse } from 'next/server';
import { getProposalByToken } from '@/lib/db/proposal-store';
import { getInquiry } from '@/lib/db/inquiry-store';
import { getTripById } from '../../../../content/trip-shapes/trips';
import { getPublishedTopics } from '../../../../content/decision-topics';
import { BUDGET_BANDS, TRAVEL_STYLES, MONTH_OPTIONS } from '@/lib/inquiry';

interface RouteParams {
  params: Promise<{ token: string }>;
}

function formatBudgetBand(band: string): string {
  const found = BUDGET_BANDS.find((b) => b.value === band);
  return found?.label || band;
}

function formatTravelStyle(style: string): string {
  const found = TRAVEL_STYLES.find((s) => s.value === style);
  return found?.label || style;
}

function formatMonth(month: number | null): string | null {
  if (!month) return null;
  const found = MONTH_OPTIONS.find((m) => m.value === month);
  return found?.label || null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * GET /api/proposals/[token]/pdf
 * Get print-friendly HTML for PDF generation
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { token } = await params;

    // Validate token format
    if (!token || !/^[a-f0-9]{16}$/.test(token)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const proposal = await getProposalByToken(token);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Only return sent proposals
    if (proposal.status !== 'sent') {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Fetch associated inquiry
    const inquiry = await getInquiry(proposal.inquiry_id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Get content data
    const allTopics = getPublishedTopics();
    const recommendedTrips = proposal.recommended_trip_ids
      .map((id) => getTripById(id))
      .filter(Boolean);

    const recommendedDecisions = proposal.recommended_decision_ids
      .map((id) => allTopics.find((t) => t.slug === id || t.topic_id === id))
      .filter(Boolean);

    const travelWindow = [
      formatMonth(inquiry.travel_month),
      inquiry.travel_year?.toString(),
    ]
      .filter(Boolean)
      .join(' ') || 'Flexible';

    // Generate print-friendly HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Safari Proposal - ${escapeHtml(proposal.traveler_name || 'Traveler')}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1c1917;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      margin-top: 32px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e7e5e4;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 2px solid #d6d3d1;
    }
    .meta {
      color: #78716c;
      font-size: 14px;
    }
    .section {
      margin-bottom: 24px;
    }
    .intro {
      background: #fafaf9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .grid-item {
      padding: 12px;
      background: #fafaf9;
      border-radius: 6px;
    }
    .grid-label {
      font-size: 12px;
      color: #78716c;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .grid-value {
      font-weight: 500;
      margin-top: 4px;
    }
    .list-item {
      padding: 12px 16px;
      background: #fafaf9;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .list-item-title {
      font-weight: 500;
    }
    .list-item-subtitle {
      font-size: 14px;
      color: #78716c;
    }
    .note-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      padding: 16px;
      border-radius: 8px;
    }
    .placeholder {
      color: #a8a29e;
      font-style: italic;
      padding: 16px;
      background: #f5f5f4;
      border-radius: 6px;
      border: 1px dashed #d6d3d1;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #e7e5e4;
      text-align: center;
      font-size: 12px;
      color: #a8a29e;
    }
    .print-btn {
      display: inline-block;
      margin-bottom: 24px;
      padding: 12px 24px;
      background: #1c1917;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    .print-btn:hover {
      background: #292524;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center;">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header">
    <h1>Safari Proposal</h1>
    ${proposal.traveler_name ? `<p style="font-size: 18px; margin-top: 8px;">Prepared for ${escapeHtml(proposal.traveler_name)}</p>` : ''}
    ${proposal.operator_name ? `<p class="meta">By ${escapeHtml(proposal.operator_name)}</p>` : ''}
    <p class="meta" style="margin-top: 8px;">${new Date(proposal.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  ${proposal.intro_note ? `
  <div class="intro">
    <p>${escapeHtml(proposal.intro_note).replace(/\n/g, '<br>')}</p>
  </div>
  ` : ''}

  <h2>Trip Overview</h2>
  <div class="grid">
    <div class="grid-item">
      <div class="grid-label">Budget Range</div>
      <div class="grid-value">${escapeHtml(formatBudgetBand(inquiry.budget_band))}</div>
    </div>
    <div class="grid-item">
      <div class="grid-label">Travelers</div>
      <div class="grid-value">${inquiry.traveler_count} ${inquiry.traveler_count === 1 ? 'person' : 'people'}</div>
    </div>
    <div class="grid-item">
      <div class="grid-label">Travel Style</div>
      <div class="grid-value">${escapeHtml(formatTravelStyle(inquiry.travel_style))}</div>
    </div>
    <div class="grid-item">
      <div class="grid-label">Travel Window</div>
      <div class="grid-value">${escapeHtml(travelWindow)}</div>
    </div>
  </div>

  <h2>Recommended Trip Shapes</h2>
  ${recommendedTrips.length > 0 ? recommendedTrips.map((trip) => `
  <div class="list-item">
    <div class="list-item-title">${escapeHtml(trip!.title)}</div>
    <div class="list-item-subtitle">${escapeHtml(trip!.subtitle)}</div>
  </div>
  `).join('') : '<div class="placeholder">No trip recommendations specified</div>'}

  <h2>Decisions to Consider</h2>
  ${recommendedDecisions.length > 0 ? recommendedDecisions.map((topic) => `
  <div class="list-item">
    <div class="list-item-title">${escapeHtml(topic!.question)}</div>
  </div>
  `).join('') : '<div class="placeholder">No decision recommendations specified</div>'}

  <h2>Pricing Context</h2>
  ${proposal.pricing_notes ? `
  <div class="section">
    <p>${escapeHtml(proposal.pricing_notes).replace(/\n/g, '<br>')}</p>
  </div>
  ` : '<div class="placeholder">No pricing notes specified</div>'}

  <h2>Next Steps</h2>
  ${proposal.next_steps ? `
  <div class="note-box">
    <p>${escapeHtml(proposal.next_steps).replace(/\n/g, '<br>')}</p>
  </div>
  ` : '<div class="placeholder">No next steps specified</div>'}

  <div class="footer">
    <p>Proposal prepared via Safari Index</p>
    <p>Proposal ID: ${escapeHtml(proposal.proposal_id)}</p>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('[Proposal PDF API] Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Unable to generate PDF' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
