import React from 'react';
import OrderDetailsPageClient from '../components/OrderDetailsPageClient';

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderDetailsPageClient orderId={orderId} />;
}

