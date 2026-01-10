/**
 * Booking API Route
 *
 * POST /api/booking - Create a new consultation booking
 * GET /api/booking?id=xxx - Get booking details
 *
 * Creates booking record in DynamoDB and calendar event in Google Calendar.
 */

import { NextResponse } from 'next/server';
import { BookingRequestSchema } from '@/lib/contracts';
import { createBooking, getBooking, isSlotBooked } from '@/lib/db/booking-store';
import { createCalendarEvent, getBookingConfig } from '@/lib/calendar/google-calendar';
import { sendBookingConfirmation } from '@/lib/email/booking-notification';

/**
 * POST /api/booking
 * Create a new booking
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request
    const parseResult = BookingRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const bookingRequest = parseResult.data;

    // Validate slot is not in the past
    const slotStart = new Date(bookingRequest.slot_start);
    if (slotStart < new Date()) {
      return NextResponse.json(
        { error: 'Cannot book a slot in the past' },
        { status: 400 }
      );
    }

    // Check if slot is already booked (prevent double booking)
    const alreadyBooked = await isSlotBooked(
      bookingRequest.slot_start,
      bookingRequest.slot_end
    );

    if (alreadyBooked) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please select another time.' },
        { status: 409 }
      );
    }

    // Format consultation type for display
    const consultationTypeLabels: Record<string, string> = {
      intro_call: 'Safari Introduction Call',
      planning_session: 'Trip Planning Session',
      follow_up: 'Follow-up Call',
    };
    const consultationLabel = consultationTypeLabels[bookingRequest.consultation_type] || 'Safari Consultation';

    // Create calendar event
    let calendarEventId: string | undefined;
    let meetingLink: string | undefined;

    const calendarResult = await createCalendarEvent({
      summary: `${consultationLabel} - ${bookingRequest.name}`,
      description: `Consultation with ${bookingRequest.name} (${bookingRequest.email})

Type: ${consultationLabel}
Phone: ${bookingRequest.phone || 'Not provided'}

Notes from traveler:
${bookingRequest.notes || 'None'}

Booked via Vurara Safaris`,
      start: bookingRequest.slot_start,
      end: bookingRequest.slot_end,
      attendeeEmail: bookingRequest.email,
      attendeeName: bookingRequest.name,
      createMeetLink: true,
    });

    if (calendarResult) {
      calendarEventId = calendarResult.eventId;
      meetingLink = calendarResult.meetLink;
    }

    // Create booking record in DynamoDB
    const { booking_id, created_at } = await createBooking(
      bookingRequest,
      calendarEventId,
      meetingLink
    );

    // Send confirmation email (fire-and-forget)
    sendBookingConfirmation({
      booking_id,
      name: bookingRequest.name,
      email: bookingRequest.email,
      consultation_type: consultationLabel,
      slot_start: bookingRequest.slot_start,
      slot_end: bookingRequest.slot_end,
      timezone: bookingRequest.timezone,
      meeting_link: meetingLink,
    }).catch((err) => {
      console.error('[Booking API] Failed to send confirmation:', err);
    });

    return NextResponse.json({
      booking_id,
      created_at,
      calendar_event_id: calendarEventId,
      meeting_link: meetingLink,
    });
  } catch (error) {
    console.error('[Booking API] Error creating booking:', error);
    return NextResponse.json(
      { error: 'Unable to create booking. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/booking?id=xxx
 * Get booking details
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const booking_id = searchParams.get('id');

    if (!booking_id) {
      // Return booking config if no ID provided
      const config = getBookingConfig();
      return NextResponse.json({ config });
    }

    const booking = await getBooking(booking_id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Don't expose sensitive fields
    return NextResponse.json({
      booking_id: booking.booking_id,
      status: booking.status,
      consultation_type: booking.consultation_type,
      slot_start: booking.slot_start,
      slot_end: booking.slot_end,
      timezone: booking.timezone,
      meeting_link: booking.meeting_link,
    });
  } catch (error) {
    console.error('[Booking API] Error:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve booking' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
