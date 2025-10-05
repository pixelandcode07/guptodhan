import PromoCodesClient from './PromoCodesClient';
import dbConnect from '@/lib/db';
import { PromoCodeServices } from '@/lib/modules/promo-code/promoCode.service';

export const dynamic = 'force-dynamic';

export default async function ViewAllPromoCodesPage() {
  await dbConnect();
  const items = await PromoCodeServices.getAllPromoCodesFromDB();
  const rows = items.map((it: any, idx: number) => ({
    id: idx + 1,
    title: it.title,
    effective_date: new Date(it.startDate).toISOString().slice(0,10),
    expiry_date: new Date(it.endingDate).toISOString().slice(0,10),
    type: it.type,
    value: it.type === 'Percentage' ? `${it.value}%` : `${it.value}`,
    min_spend: String(it.minimumOrderAmount),
    code: it.code,
    status: it.status === 'active' ? 'Active' : 'Inactive',
    icon: it.icon,
    shortDescription: it.shortDescription,
    _id: (it?._id && typeof it._id === 'object' && 'toString' in it._id) ? (it._id as any).toString() : String(it._id),
  }));
  return (
    <div className="m-5 p-5 border ">
      <PromoCodesClient initialRows={rows} />
    </div>
  );
}
