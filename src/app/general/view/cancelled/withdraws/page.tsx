'use client';

// ================================================================
// CancelledWithdrawals — copy this to:
// src/app/general/view/cancelled/withdraws/page.tsx
// ================================================================

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { XCircle } from 'lucide-react';

export default function CancelledWithdrawals() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/withdrawal?status=rejected')
      .then(r => r.json())
      .then(d => { if (d.success) { setData(d.data); setFiltered(d.data); } })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(data); return; }
    const q = search.toLowerCase();
    setFiltered(data.filter((w: any) =>
      w.paymentMethod?.toLowerCase().includes(q) ||
      w.accountDetails?.toLowerCase().includes(q) ||
      String(w.amount).includes(q)
    ));
  }, [search, data]);

  const totalAmount = data.reduce((s: number, w: any) => s + (w.amount || 0), 0);

  if (loading) return (
    <div className="p-5 space-y-3">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
    </div>
  );

  return (
    <div className="p-5">
      {/* Summary */}
      <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Total Rejected</p>
            <p className="text-2xl font-bold text-red-700">৳{totalAmount.toLocaleString('en-BD')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-red-600 font-medium">{data.length} requests</p>
          <p className="text-xs text-red-400">Balance restored to vendors</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-base font-semibold text-gray-900 border-l-4 border-red-500 pl-3">
            Rejected Withdrawals
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Search:</span>
            <Input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 h-8 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['#', 'Amount', 'Method', 'Account Details', 'Reject Reason', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No rejected withdrawals found.</td></tr>
              ) : filtered.map((w: any, i: number) => (
                <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">৳{w.amount?.toLocaleString('en-BD')}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md">{w.paymentMethod}</span></td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={w.accountDetails}>{w.accountDetails || '-'}</td>
                  <td className="px-4 py-3 text-red-500 text-xs">{w.adminRemarks || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(w.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3"><Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}