'use client';

/**
 * useInquiries Hook
 *
 * Data fetching and mutations for inquiries.
 * Provides list, detail, and update functions.
 */

import { useState, useEffect, useCallback } from 'react';
import type { InquiryRecord, InquiryStatus } from '../../../../lib/contracts';

interface UseInquiriesOptions {
  opsKey: string | null;
  status?: InquiryStatus | 'all';
  limit?: number;
}

interface TripMatch {
  trip_id: string;
  trip_title: string;
  match_score: number;
  reasons: {
    positive: string[];
    concerns: string[];
  };
  trip_details: {
    subtitle: string;
    regions: string[];
    duration_days: number | [number, number];
    cost_band: { low: number; high: number };
    core_parks_or_areas: string[];
    what_this_trip_is_for: string;
  } | null;
}

export function useInquiries({ opsKey, status = 'all', limit = 50 }: UseInquiriesOptions) {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    if (!opsKey) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.set('status', status);
      params.set('limit', String(limit));

      const response = await fetch(`/api/ops/inquiries?${params}`, {
        headers: { 'x-ops-key': opsKey },
      });

      if (!response.ok) throw new Error('Failed to load inquiries');

      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, [opsKey, status, limit]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const updateStatus = useCallback(
    async (inquiryId: string, newStatus: InquiryStatus) => {
      if (!opsKey) return false;

      try {
        const response = await fetch(`/api/ops/inquiries/${inquiryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-ops-key': opsKey,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error('Failed to update status');

        // Update local state
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.inquiry_id === inquiryId ? { ...inq, status: newStatus } : inq
          )
        );

        return true;
      } catch (err) {
        console.error('Failed to update status:', err);
        return false;
      }
    },
    [opsKey]
  );

  return {
    inquiries,
    loading,
    error,
    refresh: fetchInquiries,
    updateStatus,
  };
}

export function useInquiryDetail(inquiryId: string | null, opsKey: string | null) {
  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null);
  const [matches, setMatches] = useState<TripMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!opsKey || !inquiryId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [inquiryRes, matchesRes] = await Promise.all([
        fetch(`/api/ops/inquiries/${inquiryId}`, {
          headers: { 'x-ops-key': opsKey },
        }),
        fetch(`/api/ops/inquiries/${inquiryId}/matches?limit=3`, {
          headers: { 'x-ops-key': opsKey },
        }),
      ]);

      if (!inquiryRes.ok) throw new Error('Failed to load inquiry');

      const inquiryData = await inquiryRes.json();
      setInquiry(inquiryData);

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData.matches || []);
      }
    } catch (err) {
      console.error('Failed to fetch inquiry detail:', err);
      setError('Failed to load inquiry');
    } finally {
      setLoading(false);
    }
  }, [opsKey, inquiryId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateInquiry = useCallback(
    async (updates: Partial<Pick<InquiryRecord, 'status' | 'ops_notes'>>) => {
      if (!opsKey || !inquiryId) return false;

      try {
        const response = await fetch(`/api/ops/inquiries/${inquiryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-ops-key': opsKey,
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Failed to update');

        const updated = await response.json();
        setInquiry(updated);
        return true;
      } catch (err) {
        console.error('Failed to update inquiry:', err);
        return false;
      }
    },
    [opsKey, inquiryId]
  );

  return {
    inquiry,
    matches,
    loading,
    error,
    refresh: fetchDetail,
    updateInquiry,
  };
}

export default useInquiries;
