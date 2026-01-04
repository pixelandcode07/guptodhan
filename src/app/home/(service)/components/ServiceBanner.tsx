

import { fetchAllPublicServiceBanners } from '@/lib/ServicePageApis/fetchServiceBanner';
import ClientServiceBanner from './ClientServiceBanner';

export default async function ServiceBanner() {
    const banners = await fetchAllPublicServiceBanners();
    // console.log('Banner', banners)
    return <ClientServiceBanner initialBanners={banners} />;
}