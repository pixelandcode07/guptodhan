'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import axios from 'axios';
import { Vendor } from '@/types/VendorType';

const API_BASE = process.env.NEXTAUTH_URL;

const ensureAdmin = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error('Please log in.');
    if (session.user.role !== 'admin') throw new Error('Admin access required.');
    return session.accessToken as string;
};

export async function approveVendor(vendorId: string) {
    let token: string;
    try {
        token = await ensureAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    try {
        const res = await axios.patch(
            `${API_BASE}/api/v1/vendors/${vendorId}`,
            { status: 'approved' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        revalidatePath('/admin/vendors');
        return { success: true, message: res.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'Failed to approve' };
    }
}

export async function rejectVendor(vendorId: string) {
    let token: string;
    try {
        token = await ensureAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    try {
        const res = await axios.patch(
            `${API_BASE}/api/v1/vendors/${vendorId}`,
            { status: 'rejected' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        revalidatePath('/admin/vendors');
        return { success: true, message: res.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'Failed to reject' };
    }
}

export async function deleteVendor(vendorId: string) {
    let token: string;
    try {
        token = await ensureAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    try {
        const res = await axios.delete(`${API_BASE}/api/v1/vendors/${vendorId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        revalidatePath('/admin/vendors');
        return { success: true, message: res.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'Failed to delete' };
    }
}

// src/lib/MultiVendorApi/fetchVendorById.ts
// import axios from 'axios';
// import { Vendor } from '@/types/VendorType';

// const API_BASE = process.env.NEXTAUTH_URL;

export async function fetchVendorById(vendorId: string, token: string): Promise<Vendor | null> {
    try {
        const res = await axios.get(`${API_BASE}/api/v1/vendors/${vendorId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    } catch (error: any) {
        console.error('Failed to fetch vendor:', error.response?.data || error.message);
        return null;
    }
}