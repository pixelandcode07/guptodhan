'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

export type AppRedirectType = 'Product' | 'Category' | 'Brand' | 'Shop' | 'ExternalUrl' | 'None';

type SelectItem = {
  _id?: string;
  id?: string;
  
  // Names
  name?: string;
  title?: string;
  productTitle?: string;
  storeName?: string;
  
  // Images
  brandLogo?: string;
  categoryIcon?: string;
  storeLogo?: string;
  thumbnailImage?: string;
  
  // Extra
  brandName?: string;
};

type Props = {
  appRedirectType: AppRedirectType;
  setAppRedirectType: (v: AppRedirectType) => void;
  appRedirectValue: string;
  setAppRedirectValue: (v: string) => void;
};

export default function AppActionRow({
  appRedirectType,
  setAppRedirectType,
  appRedirectValue,
  setAppRedirectValue,
}: Props) {
  const [items, setItems] = useState<SelectItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SelectItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemImage, setSelectedItemImage] = useState('');

  // 1. Fetch items when Type changes
  useEffect(() => {
    if (appRedirectType === 'None' || appRedirectType === 'ExternalUrl') {
      setItems([]);
      setFilteredItems([]);
      setAppRedirectValue('');
      setSelectedItemName('');
      setSelectedItemImage('');
      return;
    }
    
    setAppRedirectValue(''); 
    setSelectedItemName('');
    setSelectedItemImage('');
    fetchItems(appRedirectType);
  }, [appRedirectType]);

  // 2. Filter items when Search Term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = items.filter((item) => {
        const name = getDisplayName(item);
        return name.toLowerCase().includes(lowerTerm);
      });
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  // 🔥 Robust Fetch Function
  const fetchItems = async (type: AppRedirectType) => {
    setLoading(true);
    try {
      let apiUrl = '';
      switch (type) {
        case 'Product':
          apiUrl = '/api/v1/product?limit=500'; 
          break;
        case 'Category':
          apiUrl = '/api/v1/ecommerce-category/ecomCategory?limit=500'; 
          break;
        case 'Brand':
          apiUrl = '/api/v1/product-config/brandName/active';
          break;
        case 'Shop':
          apiUrl = '/api/v1/vendor-store?limit=500';
          break;
        default:
          return;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      
      const result = await response.json();
      
      let list: SelectItem[] = [];

      if (Array.isArray(result)) {
        list = result;
      } else if (result.data && Array.isArray(result.data)) {
        list = result.data;
      } else if (result.products && Array.isArray(result.products)) {
        list = result.products;
      } else if (result.categories && Array.isArray(result.categories)) {
        list = result.categories;
      } else if (result.result && Array.isArray(result.result)) {
        list = result.result;
      }

      setItems(list);
      setFilteredItems(list);

    } catch (error) {
      console.error("Fetch error:", error);
      setItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: SelectItem) => {
    const id = item._id || item.id || '';
    const name = getDisplayName(item);
    const image = getDisplayImage(item);
    
    setAppRedirectValue(id);
    setSelectedItemName(name);
    setSelectedItemImage(image);
    setSearchTerm('');
  };

  const getDisplayName = (item: SelectItem) => {
    return item.name || 
           item.productTitle || 
           item.title || 
           item.storeName || 
           item.brandName || 
           'Unknown';
  };

  // 🔥 Helper to get image based on type
  const getDisplayImage = (item: SelectItem) => {
    return item.brandLogo || 
           item.categoryIcon || 
           item.storeLogo || 
           item.thumbnailImage || 
           ''; // Fallback empty
  };

  const showSelector = appRedirectType !== 'None' && appRedirectType !== 'ExternalUrl';

  return (
    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📱</span>
        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
          Mobile App Navigation
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-gray-500">Action Type</Label>
          <Select 
            value={appRedirectType} 
            onValueChange={(v) => setAppRedirectType(v as AppRedirectType)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">No Action</SelectItem>
              <SelectItem value="Product">Product Details</SelectItem>
              <SelectItem value="Category">Category Page</SelectItem>
              <SelectItem value="Brand">Brand Page</SelectItem>
              <SelectItem value="Shop">Shop Profile</SelectItem>
              <SelectItem value="ExternalUrl">External Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* External URL Input */}
        {appRedirectType === 'ExternalUrl' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500">Website URL</Label>
            <Input 
              value={appRedirectValue} 
              onChange={(e) => setAppRedirectValue(e.target.value)}
              placeholder="https://google.com"
              className="bg-white"
            />
          </div>
        )}

        {/* Selected Item Info */}
        {showSelector && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500">Selected Target</Label>
            <div className="flex items-center gap-3 p-2 bg-white border rounded-md h-10 overflow-hidden">
               {selectedItemImage && (
                 <div className="relative w-6 h-6 shrink-0 rounded overflow-hidden border">
                   <Image 
                     src={selectedItemImage} 
                     alt="Icon" 
                     fill 
                     className="object-cover"
                   />
                 </div>
               )}
               {selectedItemName ? (
                 <span className="text-sm font-medium truncate">{selectedItemName}</span>
               ) : (
                 <span className="text-sm text-gray-400">No item selected</span>
               )}
            </div>
            {/* Hidden Input for ID just in case needed */}
            <input type="hidden" value={appRedirectValue} />
          </div>
        )}
      </div>

      {/* Dynamic Item Selector List */}
      {showSelector && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input 
              placeholder={`Search ${appRedirectType}...`} 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-blue-500" />}
          </div>

          <div className="max-h-60 overflow-y-auto border rounded-md bg-white shadow-sm">
            {!loading && filteredItems.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">
                {items.length === 0 ? "No data loaded yet." : "No matching items found."}
              </p>
            ) : (
              <div className="divide-y">
                {filteredItems.map((item, idx) => {
                  const id = item._id || item.id;
                  const isSelected = appRedirectValue === id;
                  const imageUrl = getDisplayImage(item);
                  const name = getDisplayName(item);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectItem(item)}
                      className={`w-full text-left p-2 px-3 text-sm hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                        isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative w-8 h-8 shrink-0 rounded overflow-hidden bg-gray-100 border">
                        {imageUrl ? (
                           <Image 
                             src={imageUrl} 
                             alt={name} 
                             fill 
                             className="object-cover"
                           />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate">{name}</span>
                        <span className="text-[10px] text-gray-400 font-mono truncate">{id}</span>
                      </div>
                      
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}