'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast'; // অথবা আপনার প্রজেক্টের নোটিফিকেশন লাইব্রেরি

export default function WithdrawalRequestClient() {
  const { data: session } = useSession();
  const vendorId = (session?.user as any)?._id || (session?.user as any)?.id; // আপনার সেশনের স্ট্রাকচার অনুযায়ী দিন

  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [accountDetails, setAccountDetails] = useState('');

  // স্টোরের ডেটা ফেচ করা
  useEffect(() => {
    if (!vendorId) return;

    const fetchStoreData = async () => {
      try {
        const res = await fetch(`/api/v1/vendor-store/vendorId/${vendorId}`);
        const data = await res.json();
        if (data.success) {
          setStoreData(data.data);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [vendorId]);

  // পেমেন্ট মেথড চেঞ্জ হলে অটোমেটিক একাউন্ট নাম্বার বসানো
  useEffect(() => {
    if (storeData?.paymentInfo) {
      const info = storeData.paymentInfo;
      if (paymentMethod === 'bKash') setAccountDetails(info.bkash || '');
      if (paymentMethod === 'Nagad') setAccountDetails(info.nagad || '');
      if (paymentMethod === 'Rocket') setAccountDetails(info.rocket || '');
      if (paymentMethod === 'Bank') {
        setAccountDetails(info.bankAccount ? `Bank: ${info.bankName}, A/C: ${info.bankAccount}, Branch: ${info.bankBranch}` : '');
      }
    }
  }, [paymentMethod, storeData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 100) {
      return toast.error('Minimum withdrawal amount is 100 BDT.');
    }
    if (!accountDetails) {
      return toast.error(`Please update your ${paymentMethod} details in store settings first.`);
    }
    if (Number(amount) > storeData?.availableBalance) {
      return toast.error('Insufficient available balance!');
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendorId,
          storeId: storeData._id,
          amount: Number(amount),
          paymentMethod,
          accountDetails,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Withdrawal request submitted successfully!');
        setAmount('');
        // ব্যালেন্স লোকালি আপডেট করা যাতে ইউজার সাথে সাথে দেখতে পায়
        setStoreData((prev: any) => ({
          ...prev,
          availableBalance: prev.availableBalance - Number(amount)
        }));
      } else {
        toast.error(result.message || 'Failed to submit request.');
      }
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center animate-pulse">Loading request panel...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-md shadow-sm border">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-lg">
        <div>
          <p className="text-sm text-emerald-700 font-medium">Available Balance</p>
          <h2 className="text-3xl font-bold text-emerald-600">৳ {storeData?.availableBalance || 0}</h2>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>Total Earned: ৳ {storeData?.totalEarnings || 0}</p>
          <p>Total Withdrawn: ৳ {storeData?.totalWithdrawn || 0}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount (BDT)</label>
          <input
            type="number"
            min="100"
            max={storeData?.availableBalance || 0}
            required
            className="w-full border p-2.5 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="Enter amount (Min: 100)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            className="w-full border p-2.5 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="Bank">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Details</label>
          <textarea
            readOnly
            rows={2}
            className="w-full border p-2.5 rounded-md bg-gray-50 text-gray-600 outline-none cursor-not-allowed"
            placeholder="No account details found for this method."
            value={accountDetails}
          />
          <p className="text-xs text-gray-400 mt-1">
            * Account details are fetched automatically from your store settings.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !accountDetails || Number(amount) > storeData?.availableBalance}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Send Withdrawal Request'}
        </button>
      </form>
    </div>
  );
}