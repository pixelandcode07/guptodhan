'use client';

import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import StoreInformation from './StoreInformation';
import StoreSocialLinks from './StoreSocialLinks';
import StoreMetaInfo from './StoreMetaInfo';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Inputs } from '@/types/Inputs';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function VendorStoreFrom() {
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;
    const vendorId = session?.user?.vendorId as string | undefined;

    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadedStore, setLoadedStore] = useState<any>(null);

    // Payment Info State (আলাদা রাখা হয়েছে কারণ react-hook-form এর Inputs type এ নেই)
    const [paymentInfo, setPaymentInfo] = useState({
        bkash: '',
        nagad: '',
        rocket: '',
        bankName: '',
        bankAccount: '',
        bankBranch: '',
    });
    const [savingPayment, setSavingPayment] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>();

    useEffect(() => {
        if (!vendorId || !token) {
            setLoading(false);
            return;
        }

        const loadStoreById = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/v1/vendor-store/vendorId/${vendorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const store = data.data;
                setLoadedStore(store);

                // ✅ Payment info load করা
                if (store.paymentInfo) {
                    setPaymentInfo({
                        bkash: store.paymentInfo.bkash || '',
                        nagad: store.paymentInfo.nagad || '',
                        rocket: store.paymentInfo.rocket || '',
                        bankName: store.paymentInfo.bankName || '',
                        bankAccount: store.paymentInfo.bankAccount || '',
                        bankBranch: store.paymentInfo.bankBranch || '',
                    });
                }

                reset({
                    store_name: store.storeName || '',
                    store_address: store.storeAddress || '',
                    store_phone: store.storePhone || '',
                    store_email: store.storeEmail || '',
                    short_description: store.vendorShortDescription || '',
                    description: store.fullDescription || '',
                    commission: store.commission || 0,
                    logo: store.storeLogo || null,
                    banner: store.storeBanner || null,
                    facebook_url: store.storeSocialLinks?.facebook || '',
                    whatsapp_url: store.storeSocialLinks?.whatsapp || '',
                    instagram_url: store.storeSocialLinks?.instagram || '',
                    linkedin_url: store.storeSocialLinks?.linkedIn || '',
                    twitter_url: store.storeSocialLinks?.twitter || '',
                    tiktok_url: store.storeSocialLinks?.tiktok || '',
                    store_meta_title: Array.isArray(store.storeMetaTitle)
                        ? store.storeMetaTitle
                        : store.storeMetaTitle ? [store.storeMetaTitle] : [],
                    store_meta_keywords: Array.isArray(store.storeMetaKeywords)
                        ? store.storeMetaKeywords
                        : [],
                    store_meta_description: store.storeMetaDescription || '',
                    selectVendor: {
                        label: store?.storeName || 'My Vendor',
                        value: vendorId,
                    },
                });

                setIsEditMode(true);
                toast.success('Store loaded for editing');
            } catch (err: any) {
                console.error(err);
                toast.error('No existing store found or failed to load');
                setIsEditMode(false);
            } finally {
                setLoading(false);
            }
        };

        loadStoreById();
    }, [vendorId, token, reset]);

    // ✅ Payment Info আলাদাভাবে Save করা
    const handleSavePaymentInfo = async () => {
        if (!loadedStore?._id || !token) {
            toast.error('Store not found!');
            return;
        }

        setSavingPayment(true);
        try {
            const formData = new FormData();

            // শুধু paymentInfo fields পাঠাবো
            Object.entries(paymentInfo).forEach(([key, value]) => {
                if (value && value.trim()) {
                    formData.append(`paymentInfo[${key}]`, value.trim());
                }
            });

            await axios.patch(`/api/v1/vendor-store/${loadedStore._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Payment info saved successfully!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save payment info');
        } finally {
            setSavingPayment(false);
        }
    };

    // Main store form submit
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const formData = new FormData();
        if (!data.selectVendor || !data.selectVendor.value) {
            toast.error("Please select a vendor");
            return;
        }
        formData.append('vendorId', data.selectVendor.value);

        if (data.logo && data.logo instanceof File) formData.append('logo', data.logo);
        if (data.banner && data.banner instanceof File) formData.append('banner', data.banner);

        const fields: Record<string, any> = {
            storeName: data.store_name,
            storeAddress: data.store_address,
            storePhone: data.store_phone,
            storeEmail: data.store_email,
            vendorShortDescription: data.short_description,
            fullDescription: data.description,
            commission: data.commission,
            storeMetaKeywords: data.store_meta_keywords || [],
            storeMetaTitle: data.store_meta_title || [],
            storeMetaDescription: data.store_meta_description,
        };

        Object.entries(fields).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const socials = {
            facebook: data.facebook_url,
            whatsapp: data.whatsapp_url,
            instagram: data.instagram_url,
            linkedIn: data.linkedin_url,
            twitter: data.twitter_url,
            tiktok: data.tiktok_url,
        };

        Object.entries(socials).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                formData.append(`storeSocialLinks[${key}]`, value.trim());
            }
        });

        try {
            if (isEditMode) {
                await axios.patch(`/api/v1/vendor-store/${loadedStore._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
                });
                toast.success('Store updated successfully!');
            } else {
                await axios.post('/api/v1/vendor-store', formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
                });
                toast.success('Store created successfully!');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fb] m-3 md:m-10 space-y-6">

            {/* ── Main Store Form ── */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-10 border border-[#e4e7eb] rounded-lg space-y-8 bg-white"
            >
                <h1 className="text-2xl font-bold text-center">
                    {isEditMode ? 'Update Your Store' : 'Create New Store'}
                </h1>

                <StoreInformation register={register} errors={errors} control={control} />
                <StoreSocialLinks register={register} errors={errors} />
                <StoreMetaInfo register={register} control={control} />

                <div className="text-center pt-6">
                    <Button variant="BlueBtn" type="submit" disabled={isSubmitting} size="lg">
                        <Save className="mr-2 h-5 w-5" />
                        {isSubmitting ? 'Saving...' : isEditMode ? 'Update Store' : 'Create Store'}
                    </Button>
                </div>
            </form>

            {/* ── Payment Info Section (আলাদা Card) ── */}
            {isEditMode && (
                <div className="p-6 md:p-10 border border-[#e4e7eb] rounded-lg bg-white">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            💳 Payment & Withdrawal Info
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            এই তথ্যগুলো withdrawal request করার সময় automatically ব্যবহার হবে।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* bKash */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="inline-flex items-center gap-1">
                                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">B</span>
                                    bKash Number
                                </span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                    +880
                                </span>
                                <input
                                    type="text"
                                    placeholder="01XXXXXXXXX"
                                    value={paymentInfo.bkash}
                                    onChange={(e) => setPaymentInfo(p => ({ ...p, bkash: e.target.value }))}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Nagad */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="inline-flex items-center gap-1">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">N</span>
                                    Nagad Number
                                </span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                    +880
                                </span>
                                <input
                                    type="text"
                                    placeholder="01XXXXXXXXX"
                                    value={paymentInfo.nagad}
                                    onChange={(e) => setPaymentInfo(p => ({ ...p, nagad: e.target.value }))}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Rocket */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="inline-flex items-center gap-1">
                                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">R</span>
                                    Rocket Number
                                </span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                    +880
                                </span>
                                <input
                                    type="text"
                                    placeholder="01XXXXXXXXX"
                                    value={paymentInfo.rocket}
                                    onChange={(e) => setPaymentInfo(p => ({ ...p, rocket: e.target.value }))}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Bank Name */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="inline-flex items-center gap-1">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">🏦</span>
                                    Bank Name
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Dutch-Bangla Bank"
                                value={paymentInfo.bankName}
                                onChange={(e) => setPaymentInfo(p => ({ ...p, bankName: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>

                        {/* Bank Account */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Bank Account Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 1234567890"
                                value={paymentInfo.bankAccount}
                                onChange={(e) => setPaymentInfo(p => ({ ...p, bankAccount: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>

                        {/* Bank Branch */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Bank Branch</label>
                            <input
                                type="text"
                                placeholder="e.g. Motijheel Branch, Dhaka"
                                value={paymentInfo.bankBranch}
                                onChange={(e) => setPaymentInfo(p => ({ ...p, bankBranch: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                        <p className="text-xs text-emerald-700 flex items-start gap-2">
                            <span>✅</span>
                            <span>
                                এই payment details গুলো আপনার withdrawal request form এ automatically populate হবে।
                                কমপক্ষে একটি payment method add করুন।
                            </span>
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSavePaymentInfo}
                            disabled={savingPayment}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            {savingPayment ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Payment Info
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}