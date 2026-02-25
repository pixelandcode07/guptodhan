import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import VendorOrderDetailsClient from './components/VendorOrderDetailsClient';

async function getOrderById(orderId: string, token?: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://guptodhandigital.com';

  try {
    const res = await fetch(`${baseUrl}/api/v1/product-order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch {
    return null;
  }
}

export default async function VendorOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;  // ✅ Next.js 16 — Promise type
}) {
  // ✅ await করতে হবে
  const { id } = await params;

  const session = await getServerSession(authOptions);

  // ✅ token বের করার সব possible path চেক করা হচ্ছে
  const token =
    (session as any)?.accessToken ||
    (session as any)?.token ||
    (session as any)?.user?.accessToken ||
    undefined;

  if (!id) return notFound();

  const order = await getOrderById(id, token);

  if (!order) return notFound();

  return <VendorOrderDetailsClient order={order} />;
}