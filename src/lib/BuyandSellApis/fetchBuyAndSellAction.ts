// lib/BuyandSellApis/fetchBuyAndSellAction.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import axios from 'axios';

const REVALIDATE_PATH = '/general/buy/sell/listing';

const ensureAdmin = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error('Authentication required.');
    if (session.user.role !== 'admin') throw new Error('Admin access required.');
    return session.accessToken as string;
};

const API_BASE = process.env.NEXTAUTH_URL!;

export async function approveAd(adId: string) {
    const token = await ensureAdmin();

    try {
        await axios.patch(
            `${API_BASE}/api/v1/classifieds/ads/status/${adId}`,
            { status: 'active' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        revalidatePath(REVALIDATE_PATH);
        return { success: true, message: 'Ad approved successfully!' };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'Failed to approve ad' };
    }
}

export async function rejectAd(adId: string) {
    const token = await ensureAdmin();

    try {
        await axios.patch(
            `${API_BASE}/api/v1/classifieds/ads/status/${adId}`,
            { status: 'inactive' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        revalidatePath(REVALIDATE_PATH);
        return { success: true, message: 'Ad rejected successfully!' };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'Failed to reject ad' };
    }
}

export async function deleteAd(adId: string) {
    const token = await ensureAdmin();
    // E:\Guptodhan\Main-Project\src\app\api\v1\classifieds\ads\[id]\route.ts
    try {
        await axios.delete(`${API_BASE}/api/v1/classifieds/ads/${adId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        revalidatePath(REVALIDATE_PATH);
        return { success: true, message: 'Ad deleted permanently!' };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'Failed to delete ad' };
    }
}


export async function markAdAsSold(adId: string) {
    const token = await ensureAdmin();
    try {
        await axios.patch(
            `${API_BASE}/api/v1/classifieds/ads/status/${adId}`,
            { status: 'sold' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        revalidatePath(REVALIDATE_PATH);
        return { success: true, message: 'Ad marked as sold!' };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'Failed to mark as sold' };
    }
}