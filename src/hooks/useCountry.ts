'use client';

// src/hooks/useCountry.ts

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

const API_BASE = '/api/v1/product-config/country';

export const useCountry = () => {
  const [countries,  setCountries]  = useState<ICountry[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── GET ALL ──────────────────────────────────────────────────────────────
  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(API_BASE);
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

  useEffect(() => { fetchCountries(); }, [fetchCountries]);

  // ── CREATE ───────────────────────────────────────────────────────────────
  const createCountry = async (formData: FormData): Promise<boolean> => {
    setSubmitting(true);
    try {
      const res  = await fetch(API_BASE, {
        method: 'POST',
        body: formData,   // ✅ No Content-Type header — browser sets multipart boundary
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`"${formData.get('name')}" added successfully!`);
        await fetchCountries();
        return true;
      }
      toast.error(json.message || 'Failed to create country');
      return false;
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── UPDATE ───────────────────────────────────────────────────────────────
  const updateCountry = async (id: string, formData: FormData): Promise<boolean> => {
    setSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Country updated successfully!');
        await fetchCountries();
        return true;
      }
      toast.error(json.message || 'Failed to update country');
      return false;
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE ───────────────────────────────────────────────────────────────
  const deleteCountry = async (id: string, name: string): Promise<boolean> => {
    try {
      const res  = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success(`"${name}" deleted successfully!`);
        setCountries((prev) => prev.filter((c) => c._id !== id));
        return true;
      }
      toast.error(json.message || 'Failed to delete country');
      return false;
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  // ── TOGGLE STATUS ─────────────────────────────────────────────────────────
  const toggleStatus = async (id: string, current: 'active' | 'inactive') => {
    const fd = new FormData();
    fd.append('status', current === 'active' ? 'inactive' : 'active');
    return updateCountry(id, fd);
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