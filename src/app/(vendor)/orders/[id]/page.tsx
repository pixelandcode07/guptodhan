import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import VendorOrderDetailsClient from './VendorOrderDetailsClient';

async function getOrderById(orderId: string, token?: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://guptodhandigital.com';

  const res = await fetch(
    `${baseUrl}/api/v1/product-order/${orderId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data?.data || null;
}

export default async function VendorOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const order = await getOrderById(params.id, session?.accessToken);

  if (!order) return notFound();

  return <VendorOrderDetailsClient order={order} />;
}