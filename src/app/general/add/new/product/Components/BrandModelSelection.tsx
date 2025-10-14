'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

interface BrandModelSelectionProps {
  formData: {
    brand: string;
    model: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

interface Brand {
  _id: string;
  brandId: string;
  name: string;
  status: 'active' | 'inactive';
}

interface Model {
  _id: string;
  modelId: string;
  name: string;
  brand: string;
  brandName: string; // Added brandName field
  status: 'active' | 'inactive';
}

export default function BrandModelSelection({ formData, handleInputChange }: BrandModelSelectionProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState({
    brands: false,
    models: false,
  });
  const previousBrandRef = useRef<string>('');

  const { data: session } = useSession();
  type Session = {
    user?: { role?: string; id?: string };
    accessToken?: string;
  };
  const s = session as Session | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  // Fetch brands from API
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, brands: true }));
      
      const response = await axios.get('/api/v1/product-config/brandName', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      
      const activeBrands = response.data?.data?.filter((brand: Brand) => brand.status === 'active') || [];
      setBrands(activeBrands);
    } catch (error) {
      console.error('❌ Failed to fetch brands:', error);
    } finally {
      setLoading(prev => ({ ...prev, brands: false }));
    }
  }, [token, userRole]);

  // Fetch models by brand
  const fetchModelsByBrand = useCallback(async (brandId: string) => {
    if (!brandId) {
      setModels([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, models: true }));
      
      // Find the brand name from the brands array
      const selectedBrand = brands.find(brand => brand._id === brandId);
      const brandName = selectedBrand?.name;
      
      if (!brandName) {
        setModels([]);
        return;
      }
      
      const response = await axios.get('/api/v1/product-config/modelName', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      
      // Filter models by brandName and status
      const allModels = response.data?.data || [];
      const filteredModels = allModels.filter((model: Model) => {
        const brandMatch = model.brandName === brandName;
        const isActive = model.status === 'active';
        return isActive && brandMatch;
      });
      
      setModels(filteredModels);
    } catch (error) {
      console.error('❌ Failed to fetch models:', error);
    } finally {
      setLoading(prev => ({ ...prev, models: false }));
    }
  }, [token, userRole, brands]);

  // Load brands on component mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Load models when brand changes
  useEffect(() => {
    if (formData.brand) {
      fetchModelsByBrand(formData.brand);
    } else {
      setModels([]);
    }
    
    // Only reset model if brand actually changed
    if (previousBrandRef.current !== formData.brand) {
      handleInputChange('model', '');
      previousBrandRef.current = formData.brand;
    }
  }, [formData.brand, fetchModelsByBrand]);

  const handleBrandChange = (value: string) => {
    handleInputChange('brand', value);
  };

  const handleModelChange = (value: string) => {
    handleInputChange('model', value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Brand & Model Selection
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium">Brand</Label>
          <Select 
            value={formData.brand} 
            onValueChange={handleBrandChange}
            disabled={loading.brands}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={loading.brands ? "Loading brands..." : "Select Brand"} />
            </SelectTrigger>
            <SelectContent>
              {loading.brands ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {loading.brands && (
            <p className="text-xs text-blue-600 mt-1">Fetching brands...</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">Model</Label>
          <Select 
            value={formData.model} 
            onValueChange={handleModelChange}
            disabled={!formData.brand || loading.models}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={
                !formData.brand
                  ? "Select brand first"
                  : loading.models
                    ? "Loading models..."
                    : "Select Model"
              } />
            </SelectTrigger>
            <SelectContent>
              {loading.models ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                models.map((model) => (
                  <SelectItem key={model._id} value={model._id}>
                    {model.modelName || model.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {loading.models && (
            <p className="text-xs text-blue-600 mt-1">Fetching models...</p>
          )}
        </div>
      </div>
    </div>
  );
}
