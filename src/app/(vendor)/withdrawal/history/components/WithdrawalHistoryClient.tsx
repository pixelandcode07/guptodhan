'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  History,
  RefreshCw,
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function WithdrawalHistoryClient() {
  const { data: session } = useSession();
  const vendorId = (session?.user as any)?.vendorId;
  const token = (session as any)?.accessToken;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  // Summary stats
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  const fetchHistory = (p = page, l = limit) => {
    if (!vendorId) { setLoading(false); return; }
    setLoading(true);

    const params = new URLSearchParams({ page: String(p), limit: String(l) });

    fetch(`/api/v1/withdrawal/vendor/${vendorId}?${params.toString()}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const list = Array.isArray(d.data) ? d.data : (d.data?.data || []);
          setHistory(list);

          const meta = d.data?.meta || d.data?.pagination || {};
          setTotalPages(meta.totalPages || meta.pages || 1);
          setTotalDocs(meta.total || meta.totalDocs || list.length);

          setSummary({
            total: list.reduce((s: number, w: any) => s + (w.amount || 0), 0),
            approved: list.filter((w: any) => w.status === 'approved').length,
            pending: list.filter((w: any) => w.status === 'pending').length,
            rejected: list.filter((w: any) => w.status === 'rejected').length,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (vendorId) fetchHistory(1, limit);
  }, [vendorId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchHistory(newPage, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchHistory(1, newLimit);
  };

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

  const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-700',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-700',
      icon: <Clock className="h-3 w-3" />,
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-700',
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const methodBadgeClass: Record<string, string> = {
    bKash: 'bg-pink-50 text-pink-700',
    Nagad: 'bg-orange-50 text-orange-600',
    Rocket: 'bg-purple-50 text-purple-700',
    Bank: 'bg-blue-50 text-blue-700',
  };

  // ── Skeleton ──
  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full mt-px" />)}
        <Skeleton className="h-12 w-full mt-px" />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">Total Requested</p>
          <p className="text-2xl font-bold">৳{summary.total.toLocaleString('en-BD')}</p>
          <p className="text-blue-200 text-xs mt-1">{totalDocs} requests</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">{summary.approved}</p>
          <p className="text-gray-400 text-xs mt-1">On this page</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
          <p className="text-gray-400 text-xs mt-1">Awaiting review</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{summary.rejected}</p>
          <p className="text-gray-400 text-xs mt-1">Balance restored</p>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <History className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Withdrawal History</h2>
              <p className="text-xs text-gray-400">{totalDocs} total requests</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Show entries */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Show</span>
              <select
                value={limit}
                onChange={e => handleLimitChange(Number(e.target.value))}
                className="h-7 text-xs border border-gray-300 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchHistory(page, limit)}
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                {['#', 'Date', 'Amount', 'Method', 'Account', 'Status', 'Admin Remarks'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <div className="space-y-2">
                      <History className="h-12 w-12 text-gray-200 mx-auto" />
                      <p className="text-gray-400 font-medium">No withdrawal history</p>
                      <p className="text-xs text-gray-300">Your requests will appear here once submitted</p>
                    </div>
                  </td>
                </tr>
              ) : history.map((req: any, i: number) => {
                const sc = statusConfig[req.status] || statusConfig['pending'];
                return (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-400 text-xs">
                      {(page - 1) * limit + i + 1}
                    </td>

                    <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900">৳{(req.amount || 0).toLocaleString('en-BD')}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${methodBadgeClass[req.paymentMethod] || 'bg-gray-100 text-gray-600'}`}>
                        {req.paymentMethod}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-gray-600 max-w-[160px]">
                      <span className="truncate block text-xs" title={req.accountDetails}>
                        {req.accountDetails || '-'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${sc.className}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs max-w-[180px]">
                      {req.adminRemarks ? (
                        <span className={`block truncate ${req.status === 'rejected' ? 'text-red-500' : 'text-gray-500'}`} title={req.adminRemarks}>
                          {req.adminRemarks}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        {totalDocs > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing{' '}
              <strong>{Math.min((page - 1) * limit + 1, totalDocs)}</strong>
              {' '}–{' '}
              <strong>{Math.min(page * limit, totalDocs)}</strong>
              {' '}of{' '}
              <strong>{totalDocs}</strong> records
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>

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

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}