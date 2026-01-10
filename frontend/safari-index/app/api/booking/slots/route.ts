/**
 * Booking Slots API Route
 *
 * GET /api/booking/slots?date=YYYY-MM-DD
 *
 * Returns available time slots for a given date.
 * Checks Google Calendar for busy times and marks slots accordingly.
 */

import { NextResponse } from 'next/server';
import { getAvailableSlots, getBookingConfig } from '@/lib/calendar/google-calendar';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Missing date parameter (format: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Don't allow dates in the past
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book slots in the past' },
        { status: 400 }
      );
    }

    // Don't allow dates more than 60 days out
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);

    if (requestedDate > maxDate) {
      return NextResponse.json(
        { error: 'Cannot book more than 60 days in advance' },
        { status: 400 }
      );
    }

    const config = getBookingConfig();
    const slots = await getAvailableSlots(date);

    return NextResponse.json({
      date,
      timezone: config.timezone,
      slots,
      config: {
        slotDurationMinutes: config.slotDurationMinutes,
        bookingHours: config.bookingHours,
        bookingDays: config.bookingDays,
      },
    });
  } catch (error) {
    console.error('[Booking Slots API] Error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch available slots' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
