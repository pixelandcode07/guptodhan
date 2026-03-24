'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function WithdrawRequests() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [requests, setRequests] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedAction, setSelectedAction] = useState<'approved' | 'rejected'>('approved');
  const [remarks, setRemarks] = useState('');

  const fetchData = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/v1/withdrawal?status=pending', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setRequests(d.data);
          setFiltered(d.data);
        } else {
          toast.error(d.message || 'Failed to load requests');
        }
      })
      .catch(() => toast.error('Network error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(requests); return; }
    const q = search.toLowerCase();
    setFiltered(requests.filter((w: any) =>
      w.paymentMethod?.toLowerCase().includes(q) ||
      w.accountDetails?.toLowerCase().includes(q) ||
      String(w.amount).includes(q)
    ));
  }, [search, requests]);

  const openModal = (id: string, action: 'approved' | 'rejected') => {
    setSelectedId(id);
    setSelectedAction(action);
    setRemarks('');
    setShowModal(true);
  };

  const handleAction = async () => {
    setProcessing(selectedId);
    setShowModal(false);
    try {
      // ✅ route: /api/v1/withdrawal/[id]/status
      const res = await fetch(`/api/v1/withdrawal/${selectedId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedAction, adminRemarks: remarks }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Request ${selectedAction === 'approved' ? 'approved' : 'rejected'} successfully!`);
        fetchData(); // list refresh
      } else {
        toast.error(result.message || 'Action failed');
      }
    } catch {
      toast.error('Something went wrong!');
    } finally {
      setProcessing(null);
    }
  };

  // ── Skeleton ──
  if (loading) return (
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-40" />
      </div>
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg w-full" />)}
    </div>
  );

  return (
    <div className="p-5">

      {/* ── Remarks Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              {selectedAction === 'approved'
                ? <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="h-5 w-5 text-green-600" /></div>
                : <div className="p-2 bg-red-100 rounded-full"><XCircle className="h-5 w-5 text-red-600" /></div>
              }
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {selectedAction === 'approved' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedAction === 'approved'
                    ? 'Confirm approval and add a note (optional)'
                    : 'Please provide a reason for rejection'}
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder={selectedAction === 'approved' ? 'Admin note (optional)...' : 'Rejection reason...'}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors ${
                  selectedAction === 'approved'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {selectedAction === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Summary Bar ── */}
      <div className="mb-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-full">
            <Loader2 className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">Pending Requests</p>
            <p className="text-2xl font-bold text-yellow-700">
              ৳{requests.reduce((s, w) => s + (w.amount || 0), 0).toLocaleString('en-BD')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-yellow-600 font-medium">{requests.length} requests waiting</p>
            <p className="text-xs text-yellow-500">Needs admin review</p>
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-yellow-700" />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h1 className="text-base font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
              Withdrawal Requests
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 pl-4">{filtered.length} pending</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Search:</span>
            <Input
              type="text"
              placeholder="Amount, method..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-44 h-8 text-sm border-gray-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                {['#', 'Amount', 'Method', 'Account Details', 'Requested On', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-green-200 mx-auto" />
                      <p className="text-gray-400 font-medium">No pending requests</p>
                      <p className="text-xs text-gray-300">All withdrawal requests have been processed</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((w: any, i: number) => (
                <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-400 text-xs">{i + 1}</td>

                  <td className="px-4 py-3.5">
                    <span className="font-bold text-gray-900 text-base">৳{w.amount?.toLocaleString('en-BD')}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md">
                      {w.paymentMethod}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-gray-600 max-w-[200px]">
                    <span className="truncate block" title={w.accountDetails}>
                      {w.accountDetails || '-'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(w.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>

                  <td className="px-4 py-3.5">
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">
                      Pending
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5">
                    {processing === w._id ? (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(w._id, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => openModal(w._id, 'rejected')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}