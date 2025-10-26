'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    quantity: number;
  };
  cartItemCount: number;
  onGoToCart: () => void;
  onCheckout: () => void;
}

export default function AddToCartModal({
  isOpen,
  onClose,
  product,
  cartItemCount,
  onGoToCart,
  onCheckout
}: AddToCartModalProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Added to Cart!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">
                  ৳ {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xs text-gray-500 line-through">
                      ৳ {product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-xs px-1 py-0">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Quantity: {product.quantity}
              </p>
            </div>
          </div>

          {/* Cart Count */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {cartItemCount} item{cartItemCount > 1 ? 's' : ''} in cart
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onGoToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={onCheckout}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <Link href="/products" className="hover:text-blue-600 transition-colors">
                Browse More Products
              </Link>
              <span>•</span>
              <Link href="/home/product/shopping-cart" className="hover:text-blue-600 transition-colors">
                Manage Cart
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
