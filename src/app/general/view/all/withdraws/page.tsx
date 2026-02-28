'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Clock, CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function AllWithdrawal() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/withdrawal')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setWithdrawals(d.data);
          setFiltered(d.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(withdrawals); return; }
    const q = search.toLowerCase();
    setFiltered(withdrawals.filter((w: any) =>
      w.paymentMethod?.toLowerCase().includes(q) ||
      w.accountDetails?.toLowerCase().includes(q) ||
      w.status?.toLowerCase().includes(q) ||
      String(w.amount).includes(q)
    ));
  }, [search, withdrawals]);

  const total = (status?: string) =>
    withdrawals
      .filter(w => status ? w.status === status : true)
      .reduce((s: number, w: any) => s + (w.amount || 0), 0);

  const count = (status: string) => withdrawals.filter(w => w.status === status).length;

  const stats = [
    { type: 'approved', title: 'Completed Withdrawal', amount: total('approved'), count: count('approved'), icon: CheckCircle, bg: 'bg-green-50', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
    { type: 'pending', title: 'Pending Withdrawal', amount: total('pending'), count: count('pending'), icon: Clock, bg: 'bg-yellow-50', iconColor: 'text-yellow-600', iconBg: 'bg-yellow-100' },
    { type: 'rejected', title: 'Cancelled Withdrawal', amount: total('rejected'), count: count('rejected'), icon: XCircle, bg: 'bg-red-50', iconColor: 'text-red-600', iconBg: 'bg-red-100' },
    { type: 'all', title: 'Total Withdrawal', amount: total(), count: withdrawals.length, icon: DollarSign, bg: 'bg-blue-50', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  ];

  const statusBadge = (status: string) => {
    if (status === 'approved') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
  };

  if (loading) return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );

  return (
    <div className="p-5 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.type} className={`flex items-center justify-between p-5 ${s.bg} border rounded-xl`}>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 font-medium">{s.title}</p>
                <p className="text-2xl font-bold text-gray-900">৳{s.amount.toLocaleString('en-BD')}</p>
                <p className="text-xs text-gray-400">{s.count} requests</p>
              </div>
              <div className={`p-3 rounded-full ${s.iconBg}`}>
                <Icon className={`h-6 w-6 ${s.iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-base font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
            All Withdrawals
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Search:</span>
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-48 h-8 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['#', 'Amount', 'Method', 'Account', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No withdrawal records found.</td></tr>
              ) : filtered.map((w: any, i: number) => (
                <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">৳{w.amount?.toLocaleString('en-BD')}</td>
                  <td className="px-4 py-3">{w.paymentMethod}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={w.accountDetails}>{w.accountDetails || '-'}</td>
                  <td className="px-4 py-3">{statusBadge(w.status)}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(w.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}