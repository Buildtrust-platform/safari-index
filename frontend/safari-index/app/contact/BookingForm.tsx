'use client';

/**
 * Consultation Booking Form
 *
 * Multi-step form for scheduling a consultation call:
 * 1. Select date
 * 2. Select time slot
 * 3. Enter details
 * 4. Confirmation
 *
 * Integrates with Google Calendar for availability.
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, ChevronLeft, ChevronRight, Video, AlertCircle } from 'lucide-react';
import type { ConsultationType } from '@/lib/contracts';

type FormStep = 'date' | 'time' | 'details' | 'success';

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface BookingConfig {
  slotDurationMinutes: number;
  bookingHours: { start: number; end: number };
  bookingDays: number[];
}

interface FormData {
  date: string;
  slot: TimeSlot | null;
  name: string;
  email: string;
  phone: string;
  consultation_type: ConsultationType;
  notes: string;
}

const CONSULTATION_TYPES: { value: ConsultationType; label: string; description: string }[] = [
  { value: 'intro_call', label: 'Introduction Call', description: 'First-time conversation about safari possibilities' },
  { value: 'planning_session', label: 'Planning Session', description: 'Deep dive into destinations, timing, and logistics' },
  { value: 'follow_up', label: 'Follow-up Call', description: 'Continue a previous conversation' },
];

export function BookingForm() {
  const [step, setStep] = useState<FormStep>('date');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [bookingResult, setBookingResult] = useState<{ booking_id: string; meeting_link?: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    date: '',
    slot: null,
    name: '',
    email: '',
    phone: '',
    consultation_type: 'intro_call',
    notes: '',
  });

  // Get next 14 days for date selection
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow
    return date;
  }).filter(date => {
    // Only include booking days (Mon-Fri by default)
    const day = date.getDay();
    return config?.bookingDays.includes(day) ?? [1, 2, 3, 4, 5].includes(day);
  });

  // Fetch config on mount
  useEffect(() => {
    fetch('/api/booking')
      .then(res => res.json())
      .then(data => {
        if (data.config) setConfig(data.config);
      })
      .catch(console.error);
  }, []);

  // Fetch slots when date changes
  useEffect(() => {
    if (!formData.date) return;

    setLoading(true);
    setError('');
    setSlots([]);

    fetch(`/api/booking/slots?date=${formData.date}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setSlots(data.slots || []);
        }
      })
      .catch(() => setError('Unable to load available times'))
      .finally(() => setLoading(false));
  }, [formData.date]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateLong = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: dateStr, slot: null }));
    setStep('time');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setFormData(prev => ({ ...prev, slot }));
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slot) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          consultation_type: formData.consultation_type,
          slot_start: formData.slot.start,
          slot_end: formData.slot.end,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notes: formData.notes || undefined,
          source_path: typeof window !== 'undefined' ? window.location.pathname : '/contact',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      setBookingResult(data);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete booking');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'time') setStep('date');
    if (step === 'details') setStep('time');
  };

  // Step 1: Date Selection
  if (step === 'date') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-stone-600 mb-4">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Select a date</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className="p-3 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-colors text-center"
            >
              <p className="text-xs text-stone-500 uppercase">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-lg font-medium text-stone-900">
                {date.getDate()}
              </p>
              <p className="text-xs text-stone-500">
                {date.toLocaleDateString('en-US', { month: 'short' })}
              </p>
            </button>
          ))}
        </div>

        <p className="text-xs text-stone-400 text-center mt-4">
          All times shown in your local timezone
        </p>
      </div>
    );
  }

  // Step 2: Time Selection
  if (step === 'time') {
    const availableSlots = slots.filter(s => s.available);

    return (
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to date
        </button>

        <div className="flex items-center gap-2 text-stone-600 mb-2">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Select a time</span>
        </div>
        <p className="text-sm text-stone-500 mb-4">
          {formatDateLong(formData.date)}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600 py-4">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <p>No available times on this date.</p>
            <button
              onClick={goBack}
              className="mt-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Select another date
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.start}
                onClick={() => handleSlotSelect(slot)}
                className="p-3 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-stone-900">
                  {formatTime(slot.start)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Step 3: Details Form
  if (step === 'details') {
    return (
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to time
        </button>

        <div className="flex items-center gap-2 text-stone-600 mb-2">
          <User className="w-5 h-5" />
          <span className="font-medium">Your details</span>
        </div>

        {/* Selected slot summary */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
          <p className="font-medium text-amber-900">
            {formatDateLong(formData.date)}
          </p>
          <p className="text-amber-700">
            {formData.slot && formatTime(formData.slot.start)} (30 min)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Consultation type */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              What would you like to discuss?
            </label>
            <div className="space-y-2">
              {CONSULTATION_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.consultation_type === type.value
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="consultation_type"
                    value={type.value}
                    checked={formData.consultation_type === type.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, consultation_type: e.target.value as ConsultationType }))}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-stone-900 text-sm">{type.label}</p>
                    <p className="text-xs text-stone-500">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-300 outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-300 outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-300 outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Anything you'd like us to know? (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-300 outline-none resize-none"
              placeholder="E.g., destinations you're considering, travel dates, group size..."
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.name || !formData.email}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Confirm Booking
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Step 4: Success
  if (step === 'success' && bookingResult) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-2">
          Booking Confirmed
        </h3>
        <p className="text-stone-600 text-sm mb-4">
          {formatDateLong(formData.date)} at {formData.slot && formatTime(formData.slot.start)}
        </p>

        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-left text-sm space-y-2 mb-4">
          <p className="text-stone-500">
            Confirmation sent to <span className="text-stone-900">{formData.email}</span>
          </p>
          {bookingResult.meeting_link && (
            <p className="text-stone-500">
              Meeting link included in email
            </p>
          )}
        </div>

        <p className="text-xs text-stone-400">
          Need to reschedule? Reply to the confirmation email.
        </p>
      </div>
    );
  }

  return null;
}
