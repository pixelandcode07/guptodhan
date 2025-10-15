'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import axios from 'axios';

interface StoreSelectionProps {
  formData: {
    store: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function StoreSelection({ formData, handleInputChange }: StoreSelectionProps) {
  const [stores, setStores] = useState<{ _id: string; storeName: string; status: 'active' | 'inactive' }[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session['user'] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/vendor-store', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      type ApiStore = { _id: string; storeName: string; status: 'active' | 'inactive' };
      const items: ApiStore[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setStores(items.filter((st) => st.status === 'active'));
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Store Selection
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">Select Store</Label>
          <Select value={formData.store} onValueChange={(value) => handleInputChange('store', value)} disabled={loading}>
            <SelectTrigger className="mt-1 bg-white text-gray-900">
              <SelectValue placeholder={loading ? 'Loading stores...' : 'Select Store'} />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {stores.length > 0 ? (
                stores.map((st) => (
                  <SelectItem key={st._id} value={st._id} className="text-gray-900">
                    {st.storeName}
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">No stores found</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
