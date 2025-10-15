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
  formData: {
    flag: string;
    warranty: string;
    unit: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

type ProductFlag = {
  _id: string;
  productFlagId: string;
  name: string;
  status: 'active' | 'inactive';
};

export default function ProductAttributes({ formData, handleInputChange }: ProductAttributesProps) {
  const [flags, setFlags] = useState<ProductFlag[]>([]);
  const [loading, setLoading] = useState(false);

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
    } catch (_e) {
      setFlags([]);
    } finally {
      setLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Product Attributes
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">Product Flag</Label>
          <Select value={formData.flag} onValueChange={(value) => handleInputChange('flag', value)} disabled={loading}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={loading ? 'Loading flags...' : 'Select Flag'} />
            </SelectTrigger>
            <SelectContent>
              {flags.length > 0 ? (
                flags.map((f) => (
                  <SelectItem key={f._id} value={f._id}>
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
          <Select value={formData.warranty} onValueChange={(value) => handleInputChange('warranty', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Warranty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-warranty">No Warranty</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="2year">2 Years</SelectItem>
              <SelectItem value="3year">3 Years</SelectItem>
              <SelectItem value="5year">5 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Unit of Measurement</Label>
          <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="piece">Piece</SelectItem>
              <SelectItem value="kg">Kilogram</SelectItem>
              <SelectItem value="gram">Gram</SelectItem>
              <SelectItem value="liter">Liter</SelectItem>
              <SelectItem value="ml">Milliliter</SelectItem>
              <SelectItem value="meter">Meter</SelectItem>
              <SelectItem value="cm">Centimeter</SelectItem>
              <SelectItem value="inch">Inch</SelectItem>
              <SelectItem value="box">Box</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
