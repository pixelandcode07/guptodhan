'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import AddToCartModal from '@/components/AddToCartModal';
import { useRouter } from 'next/navigation';

export default function CartModalProvider() {
  const {
    showAddToCartModal,
    lastAddedProduct,
    closeAddToCartModal,
    cartItemCount,
  } = useCart();
  const router = useRouter();

  const handleGoToCart = () => {
    closeAddToCartModal();
    router.push('/products/shopping-cart');
  };

  const handleCheckout = () => {
    closeAddToCartModal();
    router.push('/products/checkout');
  };

  if (!lastAddedProduct || !showAddToCartModal) return null;

  return (
    <AddToCartModal
      isOpen={showAddToCartModal}
      onClose={closeAddToCartModal}
      product={{
        id: lastAddedProduct.product.id,
        name: lastAddedProduct.product.name,
        image: lastAddedProduct.product.image,
        price: lastAddedProduct.product.price,
        originalPrice: lastAddedProduct.product.originalPrice,
        quantity: lastAddedProduct.product.quantity,
      }}
      cartItemCount={cartItemCount}
      onGoToCart={handleGoToCart}
      onCheckout={handleCheckout}
    />
  );
}
