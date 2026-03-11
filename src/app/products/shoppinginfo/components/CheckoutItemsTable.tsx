'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../shopping-cart/ShoppingCartContent';

const hasVariant = (value: string | undefined): boolean => {
  const v = value != null ? String(value).trim() : '';
  return v !== '' && v !== '—';
};

type CartItemWithShipping = CartItem & {
  product: CartItem['product'] & { shippingCost?: number };
};

export default function CheckoutItemsTable({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: {
  items: CartItemWithShipping[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const totalItems = items.reduce((s, i) => s + i.product.quantity, 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-700">Image</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Product Name</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Unit Price</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Quantity</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Subtotal</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CheckoutItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CheckoutItemRow({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: CartItemWithShipping;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const [quantity, setQuantity] = React.useState(item.product.quantity);
  React.useEffect(() => {
    setQuantity(item.product.quantity);
  }, [item.product.quantity]);
  const subtotal = item.product.price * quantity;
  const savings = (item.product.originalPrice - item.product.price) * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemoveItem(item.id);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-2">
        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            aria-label="Remove item"
          >
            ×
          </button>
        </div>
      </td>
      <td className="py-4 px-2">
        <div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">{item.product.name}</h3>
          {(hasVariant(item.product.size) || hasVariant(item.product.color)) && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {hasVariant(item.product.size) && <span>Size: {item.product.size}</span>}
              {hasVariant(item.product.size) && hasVariant(item.product.color) && <span>•</span>}
              {hasVariant(item.product.color) && <span>Color: {item.product.color}</span>}
            </div>
          )}
          {savings > 0 && (
            <div className="text-xs text-green-600 mt-1">
              Save ৳{savings.toLocaleString()}
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="text-sm">
          <div className="font-medium text-gray-900">৳ {item.product.price.toLocaleString()}</div>
          {item.product.originalPrice > item.product.price && (
            <div className="text-xs text-gray-500 line-through">
              ৳ {item.product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="flex items-center border border-gray-300 rounded-md w-fit">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="px-3 py-1 text-sm font-medium min-w-8 text-center border-x border-gray-300">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="font-semibold text-gray-900">
          ৳ {subtotal.toLocaleString()}
        </div>
      </td>
      <td className="py-4 px-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-red-500 p-1"
          onClick={handleRemove}
          aria-label="Remove from checkout"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
