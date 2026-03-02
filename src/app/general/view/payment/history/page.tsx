'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CreditCard,
  Smartphone,
  Banknote,
  TrendingUp,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function PaymentHistory() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  // Stats (from current page — or separate summary call)
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0, cod: 0 });

  const fetchData = (p = page, l = limit) => {
    if (!token) return;
    setLoading(true);

    const params = new URLSearchParams({
      page: String(p),
      limit: String(l),
    });
    if (statusFilter !== 'all') params.append('paymentStatus', statusFilter);
    if (search.trim()) params.append('search', search.trim());

    fetch(`/api/v1/product-order?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const result = d.data;
          // Handle both {data: [...]} and direct array
          const list = Array.isArray(result) ? result : (result?.data || result?.orders || []);
          setOrders(list);

          // Pagination meta
          const meta = result?.meta || result?.pagination || {};
          setTotalPages(meta.totalPages || meta.pages || Math.ceil((meta.total || meta.totalDocs || list.length) / l) || 1);
          setTotalDocs(meta.total || meta.totalDocs || list.length);

          // Stats
          setStats({
            total: meta.totalAmount || list.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0),
            paid: list.filter((o: any) => o.paymentStatus === 'paid').length,
            unpaid: list.filter((o: any) => ['unpaid', 'pending'].includes(o.paymentStatus)).length,
            cod: list.filter((o: any) => o.paymentMethod?.toLowerCase() === 'cod').length,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchData(1, limit);
  }, [token]);

  // Re-fetch on filter/search change (reset to page 1)
  useEffect(() => {
    if (!token) return;
    setPage(1);
    fetchData(1, limit);
  }, [statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchData(1, limit);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchData(newPage, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchData(1, newLimit);
  };

  // ── Helpers ──
  const paymentStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">Paid</Badge>;
    if (s === 'pending') return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 text-xs">Pending</Badge>;
    if (s === 'failed') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs">Failed</Badge>;
    return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 text-xs">{status || 'N/A'}</Badge>;
  };

  const orderStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">Delivered</Badge>;
    if (s === 'pending') return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 text-xs">Pending</Badge>;
    if (s === 'processing') return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-xs">Processing</Badge>;
    if (s === 'cancelled') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs">Cancelled</Badge>;
    return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 text-xs">{status || 'N/A'}</Badge>;
  };

  const methodBadge = (method: string) => {
    const m = method?.toLowerCase();
    if (m === 'cod') return <span className="px-2 py-1 text-xs font-semibold bg-orange-50 text-orange-700 rounded-md">COD</span>;
    if (m === 'bkash') return <span className="px-2 py-1 text-xs font-semibold bg-pink-50 text-pink-700 rounded-md">bKash</span>;
    if (m === 'nagad') return <span className="px-2 py-1 text-xs font-semibold bg-orange-50 text-orange-600 rounded-md">Nagad</span>;
    if (m === 'card') return <span className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md">Card</span>;
    return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-md">{method || 'N/A'}</span>;
  };

  const statCards = [
    { title: 'Total Revenue', value: `৳${stats.total.toLocaleString('en-BD')}`, icon: TrendingUp, bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', sub: `${totalDocs} total orders` },
    { title: 'Paid Orders', value: stats.paid, icon: CreditCard, bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600', sub: 'On this page' },
    { title: 'Unpaid / Pending', value: stats.unpaid, icon: Banknote, bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', sub: 'On this page' },
    { title: 'COD Orders', value: stats.cod, icon: Smartphone, bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', sub: 'On this page' },
  ];

  // ── Skeleton ──
  if (loading) return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-10 rounded-lg" />
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
      <Skeleton className="h-12 rounded-lg" />
    </div>
  );

  // Pagination range
  const getPageRange = () => {
    const delta = 2;
    const range: (number | '...')[] = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift('...');
    if (page + delta < totalPages - 1) range.push('...');
    if (totalPages > 1) range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  return (
    <div className="p-5 space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={`flex items-center justify-between p-5 ${s.bg} border rounded-xl`}>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.title}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
              <div className={`p-3 rounded-full ${s.iconBg}`}>
                <Icon className={`h-6 w-6 ${s.iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

        {/* Table Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b bg-gray-50">
          <h1 className="text-base font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
            Order Payment History
          </h1>
          <div className="flex items-center gap-2 flex-wrap">

            {/* Rows per page */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Show</span>
              <select
                value={limit}
                onChange={e => handleLimitChange(Number(e.target.value))}
                className="h-8 text-xs border border-gray-300 rounded-lg px-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-8 text-xs border border-gray-300 rounded-lg px-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Search */}
            <div className="flex items-center gap-1">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-8">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-36 px-3 text-xs outline-none bg-white"
                />
                <button
                  onClick={handleSearch}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchData(page, limit)}
              className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                {['#', 'Order ID', 'Amount', 'Method', 'Payment Status', 'Order Status', 'Transaction ID', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <div className="space-y-2">
                      <CreditCard className="h-12 w-12 text-gray-200 mx-auto" />
                      <p className="text-gray-400 font-medium">No payment records found</p>
                      <p className="text-xs text-gray-300">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : orders.map((o: any, i: number) => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-400 text-xs">
                    {(page - 1) * limit + i + 1}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      #{o._id?.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-gray-900">৳{(o.totalAmount || 0).toLocaleString('en-BD')}</span>
                  </td>
                  <td className="px-4 py-3.5">{methodBadge(o.paymentMethod)}</td>
                  <td className="px-4 py-3.5">{paymentStatusBadge(o.paymentStatus)}</td>
                  <td className="px-4 py-3.5">{orderStatusBadge(o.orderStatus)}</td>
                  <td className="px-4 py-3.5 text-gray-500 font-mono text-xs max-w-[140px] truncate" title={o.transactionId}>
                    {o.transactionId || '-'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50">
          {/* Info */}
          <p className="text-xs text-gray-500">
            Showing{' '}
            <strong>{Math.min((page - 1) * limit + 1, totalDocs)}</strong>
            {' '}–{' '}
            <strong>{Math.min(page * limit, totalDocs)}</strong>
            {' '}of{' '}
            <strong>{totalDocs}</strong> records
          </p>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            {/* First */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="h-4 w-4 text-gray-600" />
            </button>

            {/* Prev */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>

            {/* Page numbers */}
            {getPageRange().map((p, i) =>
              p === '...' ? (
                <span key={`dot-${i}`} className="px-2 text-gray-400 text-xs">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(p as number)}
                  className={`min-w-[32px] h-8 text-xs font-semibold rounded-lg border transition-colors ${
                    page === p
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>

            {/* Last */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}