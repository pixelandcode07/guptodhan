'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  CircleDollarSign,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export default function WithdrawalRequestClient() {
  const { data: session } = useSession();

  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [accountDetails, setAccountDetails] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    const user = session?.user as any;
    const vendorId = user?.vendorId;
    if (!vendorId) { setLoading(false); return; }

    fetch(`/api/v1/vendor-store/vendorId/${vendorId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setStoreData(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => {
    if (!storeData?.paymentInfo) { setAccountDetails(''); return; }
    const info = storeData.paymentInfo;
    if (paymentMethod === 'bKash') setAccountDetails(info.bkash || '');
    else if (paymentMethod === 'Nagad') setAccountDetails(info.nagad || '');
    else if (paymentMethod === 'Rocket') setAccountDetails(info.rocket || '');
    else if (paymentMethod === 'Bank') {
      setAccountDetails(info.bankAccount
        ? `${info.bankName || 'Bank'} · A/C: ${info.bankAccount} · ${info.bankBranch || ''}`
        : '');
    }
  }, [paymentMethod, storeData]);

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = Number(val);
    if (val && num < 500) setAmountError('Minimum withdrawal is ৳500');
    else if (val && num > (storeData?.availableBalance || 0)) setAmountError('Exceeds available balance');
    else setAmountError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 500) return toast.error('Minimum withdrawal is ৳500');
    if (!accountDetails) return toast.error(`Add your ${paymentMethod} number in Store Settings first.`);
    if (Number(amount) > (storeData?.availableBalance || 0)) return toast.error('Insufficient balance!');

    const vendorId = (session?.user as any)?.vendorId;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, storeId: storeData._id, amount: Number(amount), paymentMethod, accountDetails }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Withdrawal request submitted!');
        setAmount('');
        setStoreData((prev: any) => ({
          ...prev,
          availableBalance: prev.availableBalance - Number(amount),
          totalWithdrawn: (prev.totalWithdrawn || 0) + Number(amount),
        }));
      } else {
        toast.error(result.message || 'Failed to submit.');
      }
    } catch { toast.error('Something went wrong!'); }
    finally { setSubmitting(false); }
  };

  const availableBalance = storeData?.availableBalance || 0;
  const totalEarned = storeData?.totalEarned || 0;
  const totalWithdrawn = storeData?.totalWithdrawn || 0;
  const hasPaymentInfo = storeData?.paymentInfo && (
    storeData.paymentInfo.bkash || storeData.paymentInfo.nagad ||
    storeData.paymentInfo.rocket || storeData.paymentInfo.bankAccount
  );
  const withdrawPercent = totalEarned > 0 ? Math.min((totalWithdrawn / totalEarned) * 100, 100) : 0;

  const methods = [
    { id: 'bKash',  activeClass: 'bg-pink-600 text-black border-pink-600',   idleClass: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100' },
    { id: 'Nagad',  activeClass: 'bg-orange-500 text-white border-orange-500', idleClass: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100' },
    { id: 'Rocket', activeClass: 'bg-purple-600 text-white border-purple-600', idleClass: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
    { id: 'Bank',   activeClass: 'bg-blue-600 text-white border-blue-600',    idleClass: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
  ];

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Card className="border border-gray-200">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <Skeleton className="h-11 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Withdrawal</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your earnings and request withdrawals</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Available Balance</p>
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Wallet className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">৳{availableBalance.toLocaleString('en-BD')}</p>
            <p className="text-blue-200 text-xs mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Ready to withdraw
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Earned</p>
              <div className="bg-green-50 p-1.5 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">৳{totalEarned.toLocaleString('en-BD')}</p>
            <p className="text-gray-400 text-xs mt-2">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Withdrawn</p>
              <div className="bg-purple-50 p-1.5 rounded-lg">
                <ArrowUpRight className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">৳{totalWithdrawn.toLocaleString('en-BD')}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{withdrawPercent.toFixed(1)}% of total earned</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-700" style={{ width: `${withdrawPercent}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Form */}
        <div className="lg:col-span-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <CircleDollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Request Withdrawal</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Min ৳500 · Processed in 1–3 business days</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5">
              {!hasPaymentInfo && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-5">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Payment info missing</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Go to <span className="font-semibold">Store Settings</span> to add bKash / Nagad / Bank details.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Withdrawal Amount</label>
                  <div className={`flex items-center border rounded-lg overflow-hidden transition-all ${
                    amountError ? 'border-red-400 ring-1 ring-red-400' :
                    amount ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'
                  }`}>
                    <span className="px-4 py-3 bg-gray-50 border-r border-gray-200 text-lg font-bold text-blue-600 select-none">৳</span>
                    <input
                      type="number"
                      min="500"
                      max={availableBalance}
                      required
                      placeholder="0"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="flex-1 px-4 py-3 text-xl font-bold text-gray-900 outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAmountChange(String(availableBalance))}
                      className="px-3 py-1.5 m-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  {amountError ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {amountError}
                    </p>
                  ) : amount && Number(amount) >= 500 ? (
                    <p className="text-xs text-gray-400">
                      Remaining: <span className="font-medium text-gray-600">৳{(availableBalance - Number(amount)).toLocaleString('en-BD')}</span>
                    </p>
                  ) : null}
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {methods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`py-2.5 px-2 text-xs font-semibold border rounded-lg transition-all ${
                          paymentMethod === m.id ? m.activeClass : m.idleClass
                        }`}
                      >
                        {m.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Account Details</label>
                  {accountDetails ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800 font-medium">{accountDetails}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-400">No {paymentMethod} account found in store settings.</span>
                    </div>
                  )}
                </div>

                {/* Summary Box */}
                {amount && Number(amount) >= 500 && accountDetails && !amountError && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2.5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Summary</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-semibold text-gray-900">৳{Number(amount).toLocaleString('en-BD')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment via</span>
                      <Badge variant="secondary" className="text-xs">{paymentMethod}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-700">You'll receive</span>
                      <span className="text-base font-bold text-blue-600">৳{Number(amount).toLocaleString('en-BD')}</span>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !accountDetails || !amount || Number(amount) < 500 || Number(amount) > availableBalance || !!amountError}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <>Send Withdrawal Request <ChevronRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panels */}
        <div className="lg:col-span-2 space-y-4">

          {/* How it works */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-900">How it works</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {[
                { step: '1', title: 'Submit Request', desc: 'Fill the form and submit your withdrawal.' },
                { step: '2', title: 'Admin Review', desc: 'Our team reviews within 24 hours.' },
                { step: '3', title: 'Payment Sent', desc: 'Funds sent to your selected account.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Methods Status */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-900">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                { id: 'bkash',       label: 'bKash',  badgeClass: 'bg-pink-100 text-pink-700' },
                { id: 'nagad',       label: 'Nagad',  badgeClass: 'bg-orange-100 text-orange-700' },
                { id: 'rocket',      label: 'Rocket', badgeClass: 'bg-purple-100 text-purple-700' },
                { id: 'bankAccount', label: 'Bank',   badgeClass: 'bg-blue-100 text-blue-700' },
              ].map((m) => {
                const configured = !!storeData?.paymentInfo?.[m.id];
                return (
                  <div key={m.id} className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${m.badgeClass}`}>{m.label}</span>
                    <span className={`text-xs font-medium flex items-center gap-1 ${configured ? 'text-green-600' : 'text-gray-400'}`}>
                      {configured
                        ? <><CheckCircle2 className="h-3.5 w-3.5" /> Configured</>
                        : <><AlertCircle className="h-3.5 w-3.5" /> Not set</>
                      }
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-900">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {[
                  'Minimum withdrawal is ৳500',
                  'Processing takes 1–3 business days',
                  'Ensure your payment details are correct',
                  'Rejected requests restore your balance',
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}