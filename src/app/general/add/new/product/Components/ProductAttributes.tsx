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
import axios from 'axios';

interface ProductAttributesProps {
  formData: { flag: string; warranty: string; unit: string; };
  handleInputChange: (field: string, value: unknown) => void;
  flags?: any[]; // ✅ FIX: Added the missing 'flags' prop
  units?: any[]; // ✅ FIX: Added the missing 'units' prop
}

type ProductFlag = {
  _id: string;
  productFlagId: string;
  name: string;
  status: 'active' | 'inactive';
};

type ApiWarranty = {
  _id: string;
  warrantyName: string;
  status: 'active' | 'inactive';
  createdAt?: string;
};

type ApiUnit = {
  _id: string;
  productUnitId: string;
  name: string;
  status: 'active' | 'inactive';
};

export default function ProductAttributes({ formData, handleInputChange }: ProductAttributesProps) {
  const [flags, setFlags] = useState<ProductFlag[]>([]);
  const [warranties, setWarranties] = useState<ApiWarranty[]>([]);
  const [loading, setLoading] = useState(false);
  const [warrantyLoading, setWarrantyLoading] = useState(false);
  const [units, setUnits] = useState<ApiUnit[]>([]);
  const [unitLoading, setUnitLoading] = useState(false);

  const { data: session } = useSession();
  type Session = { user?: { role?: string }; accessToken?: string };
  const s = session as Session | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/product-config/productFlag', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      const items: ProductFlag[] = Array.isArray(res.data?.data) ? res.data.data : [];
      const active = items.filter((f) => f.status === 'active');
      setFlags(active);
    } catch {
      setFlags([]);
    } finally {
      setLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const fetchWarranties = useCallback(async () => {
    try {
      setWarrantyLoading(true);
      const res = await axios.get('/api/v1/product-config/warranty', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      const items: ApiWarranty[] = Array.isArray(res.data?.data) ? res.data.data : [];
      const active = items.filter((w) => w.status === 'active');
      setWarranties(active);
    } catch {
      setWarranties([]);
    } finally {
      setWarrantyLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchWarranties();
  }, [fetchWarranties]);

  const fetchUnits = useCallback(async () => {
    try {
      setUnitLoading(true);
      const res = await axios.get('/api/v1/product-config/productUnit', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      const items: ApiUnit[] = Array.isArray(res.data?.data) ? res.data.data : [];
      const active = items.filter((u) => u.status === 'active');
      setUnits(active);
    } catch {
      setUnits([]);
    } finally {
      setUnitLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Product Attributes
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">Product Flag</Label>
          <Select value={formData.flag} onValueChange={(value) => handleInputChange('flag', value)} disabled={loading}>
            <SelectTrigger className="mt-1 bg-white text-gray-900">
              <SelectValue placeholder={loading ? 'Loading flags...' : 'Select Flag'} />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {flags.length > 0 ? (
                flags.map((f) => (
                  <SelectItem key={f._id} value={f._id} className="text-gray-900">
                    {f.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">No flags found</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Warranty Period</Label>
          <Select value={formData.warranty} onValueChange={(value) => handleInputChange('warranty', value)} disabled={warrantyLoading}>
            <SelectTrigger className="mt-1 bg-white text-gray-900">
              <SelectValue placeholder={warrantyLoading ? 'Loading warranties...' : 'Select Warranty'} />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {warranties.length > 0 ? (
                warranties.map((w) => (
                  <SelectItem key={w._id} value={w._id} className="text-gray-900">
                    {w.warrantyName}
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">No warranties found</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Unit of Measurement</Label>
          <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)} disabled={unitLoading}>
            <SelectTrigger className="mt-1 bg-white text-gray-900">
              <SelectValue placeholder={unitLoading ? 'Loading units...' : 'Select Unit'} />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {units.length > 0 ? (
                units.map((u) => (
                  <SelectItem key={u._id} value={u._id} className="text-gray-900">
                    {u.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">No units found</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
