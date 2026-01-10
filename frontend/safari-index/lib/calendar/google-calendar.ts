/**
 * Google Calendar Integration
 *
 * Handles OAuth2 authentication and calendar operations for booking system.
 * Uses Google Calendar API to:
 * - Fetch free/busy information for availability
 * - Create calendar events for confirmed bookings
 * - Optionally create Google Meet links
 *
 * Required env vars:
 * - GOOGLE_CLIENT_ID: OAuth2 client ID
 * - GOOGLE_CLIENT_SECRET: OAuth2 client secret
 * - GOOGLE_REFRESH_TOKEN: Long-lived refresh token for calendar access
 * - GOOGLE_CALENDAR_ID: Calendar ID to use (default: 'primary')
 */

import { google, calendar_v3 } from 'googleapis';

// Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

// Booking configuration
const SLOT_DURATION_MINUTES = 30;
const BOOKING_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
};
const BOOKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday (0 = Sunday)
const BOOKING_TIMEZONE = process.env.BOOKING_TIMEZONE || 'Africa/Nairobi';

// Buffer time between slots (minutes)
const BUFFER_MINUTES = 15;

/**
 * Check if Google Calendar is configured
 */
export function isCalendarConfigured(): boolean {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN);
}

/**
 * Get authenticated Google Calendar client
 */
function getCalendarClient(): calendar_v3.Calendar | null {
  if (!isCalendarConfigured()) {
    console.warn('[Google Calendar] Not configured - missing credentials');
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Generate time slots for a given date
 */
function generateTimeSlots(date: Date): { start: Date; end: Date }[] {
  const slots: { start: Date; end: Date }[] = [];
  const dayOfWeek = date.getDay();

  // Skip weekends
  if (!BOOKING_DAYS.includes(dayOfWeek)) {
    return slots;
  }

  // Generate slots for the day
  for (let hour = BOOKING_HOURS.start; hour < BOOKING_HOURS.end; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
      // Don't create slots that would end after closing
      if (hour === BOOKING_HOURS.end - 1 && minute + SLOT_DURATION_MINUTES > 60) {
        continue;
      }

      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + SLOT_DURATION_MINUTES);

      // Skip if slot ends after closing time
      if (end.getHours() > BOOKING_HOURS.end ||
          (end.getHours() === BOOKING_HOURS.end && end.getMinutes() > 0)) {
        continue;
      }

      slots.push({ start, end });
    }
  }

  return slots;
}

/**
 * Check slot availability against busy times
 */
function isSlotAvailable(
  slot: { start: Date; end: Date },
  busyTimes: { start: string; end: string }[]
): boolean {
  const slotStart = slot.start.getTime();
  const slotEnd = slot.end.getTime();

  // Add buffer time
  const bufferedStart = slotStart - BUFFER_MINUTES * 60 * 1000;
  const bufferedEnd = slotEnd + BUFFER_MINUTES * 60 * 1000;

  for (const busy of busyTimes) {
    const busyStart = new Date(busy.start).getTime();
    const busyEnd = new Date(busy.end).getTime();

    // Check for overlap (with buffer)
    if (bufferedStart < busyEnd && bufferedEnd > busyStart) {
      return false;
    }
  }

  return true;
}

export interface AvailableSlot {
  start: string; // ISO datetime
  end: string; // ISO datetime
  available: boolean;
}

/**
 * Get available time slots for a given date
 */
export async function getAvailableSlots(date: string): Promise<AvailableSlot[]> {
  const calendar = getCalendarClient();
  const targetDate = new Date(date);

  // Generate all possible slots for the day
  const allSlots = generateTimeSlots(targetDate);

  if (allSlots.length === 0) {
    return [];
  }

  // If no calendar configured, return all slots as available (manual mode)
  if (!calendar) {
    return allSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      available: true,
    }));
  }

  // Get busy times from Google Calendar
  const timeMin = allSlots[0].start.toISOString();
  const timeMax = allSlots[allSlots.length - 1].end.toISOString();

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: BOOKING_TIMEZONE,
        items: [{ id: GOOGLE_CALENDAR_ID }],
      },
    });

    const busyTimes = response.data.calendars?.[GOOGLE_CALENDAR_ID]?.busy || [];

    // Mark slots as available/unavailable based on busy times
    return allSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      available: isSlotAvailable(slot, busyTimes as { start: string; end: string }[]),
    }));
  } catch (error) {
    console.error('[Google Calendar] Error fetching free/busy:', error);
    // Fall back to all available on error
    return allSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      available: true,
    }));
  }
}

export interface CreateEventParams {
  summary: string;
  description: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  attendeeEmail: string;
  attendeeName: string;
  createMeetLink?: boolean;
}

export interface CreateEventResult {
  eventId: string;
  meetLink?: string;
  htmlLink: string;
}

/**
 * Create a calendar event for a booking
 */
export async function createCalendarEvent(
  params: CreateEventParams
): Promise<CreateEventResult | null> {
  const calendar = getCalendarClient();

  if (!calendar) {
    console.warn('[Google Calendar] Not configured - skipping event creation');
    return null;
  }

  try {
    const event: calendar_v3.Schema$Event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.start,
        timeZone: BOOKING_TIMEZONE,
      },
      end: {
        dateTime: params.end,
        timeZone: BOOKING_TIMEZONE,
      },
      attendees: [
        {
          email: params.attendeeEmail,
          displayName: params.attendeeName,
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours
          { method: 'email', minutes: 60 }, // 1 hour
        ],
      },
    };

    // Add Google Meet link if requested
    if (params.createMeetLink) {
      event.conferenceData = {
        createRequest: {
          requestId: `safari-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: params.createMeetLink ? 1 : 0,
      sendUpdates: 'all', // Send email invites to attendees
    });

    return {
      eventId: response.data.id || '',
      meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || undefined,
      htmlLink: response.data.htmlLink || '',
    };
  } catch (error) {
    console.error('[Google Calendar] Error creating event:', error);
    return null;
  }
}

/**
 * Cancel a calendar event
 */
export async function cancelCalendarEvent(eventId: string): Promise<boolean> {
  const calendar = getCalendarClient();

  if (!calendar) {
    return false;
  }

  try {
    await calendar.events.delete({
      calendarId: GOOGLE_CALENDAR_ID,
      eventId,
      sendUpdates: 'all', // Notify attendees
    });
    return true;
  } catch (error) {
    console.error('[Google Calendar] Error cancelling event:', error);
    return false;
  }
}

/**
 * Get booking configuration for client
 */
export function getBookingConfig() {
  return {
    slotDurationMinutes: SLOT_DURATION_MINUTES,
    bookingHours: BOOKING_HOURS,
    bookingDays: BOOKING_DAYS,
    timezone: BOOKING_TIMEZONE,
    isConfigured: isCalendarConfigured(),
  };
}
