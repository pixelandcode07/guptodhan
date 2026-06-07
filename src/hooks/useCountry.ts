// src/hooks/useCountry.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface ICountry {
  _id: string;
  name: string;
  code?: string;
  flag?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CountryFormData {
  name: string;
  code?: string;
  flag?: string;
  status: 'active' | 'inactive';
}

const API_BASE = '/api/v1/product-config/country';

export const useCountry = () => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── FETCH ALL ─────────────────────────────────────────────────────────────
  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (json.success) {
        setCountries(json.data);
      } else {
        toast.error('Failed to load countries');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // ── CREATE ────────────────────────────────────────────────────────────────
  const createCountry = async (data: CountryFormData): Promise<boolean> => {
    setSubmitting(true);
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`"${data.name}" added successfully!`);
        await fetchCountries();
        return true;
      } else {
        toast.error(json.message || 'Failed to create country');
        return false;
      }
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const updateCountry = async (id: string, data: Partial<CountryFormData>): Promise<boolean> => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        toast.success('Country updated successfully!');
        await fetchCountries();
        return true;
      } else {
        toast.error(json.message || 'Failed to update country');
        return false;
      }
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE ────────────────────────────────────────────────────────────────
  const deleteCountry = async (id: string, name: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (json.success) {
        toast.success(`"${name}" deleted successfully!`);
        setCountries((prev) => prev.filter((c) => c._id !== id));
        return true;
      } else {
        toast.error(json.message || 'Failed to delete country');
        return false;
      }
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  // ── TOGGLE STATUS ─────────────────────────────────────────────────────────
  const toggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return updateCountry(id, { status: newStatus });
  };

  return {
    countries,
    loading,
    submitting,
    fetchCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    toggleStatus,
  };
};