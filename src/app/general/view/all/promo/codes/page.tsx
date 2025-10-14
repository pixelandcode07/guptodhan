
import dbConnect from '@/lib/db';
import { PromoCodeServices } from '@/lib/modules/promo-code/promoCode.service';
import PromoCodesClient from './components/PromoCodesClient';

export const dynamic = 'force-dynamic';

export default async function ViewAllPromoCodesPage() {
  await dbConnect();
  const items = await PromoCodeServices.getAllPromoCodesFromDB();
  const rows = items.map((it: Record<string, unknown>, idx: number) => ({
    id: idx + 1,
    title: it.title,
    effective_date: new Date(it.startDate as string).toISOString().slice(0,10),
    expiry_date: new Date(it.endingDate as string).toISOString().slice(0,10),
    type: it.type,
    value: it.type === 'Percentage' ? `${it.value}%` : `${it.value}`,
    min_spend: String(it.minimumOrderAmount),
    code: it.code,
    status: it.status === 'active' ? 'Active' : 'Inactive',
    icon: it.icon,
    shortDescription: it.shortDescription,
    _id: (it?._id && typeof it._id === 'object' && 'toString' in it._id) ? (it._id as Record<string, unknown>).toString() : String(it._id),
  }));
  return <PromoCodesClient initialRows={rows} />;
}
