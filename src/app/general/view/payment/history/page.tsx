'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';
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
  Eye,
  CheckCircle,
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function PaymentHistory() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // ✅ Date Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  // ✅ Checkbox & Bulk Updates
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkPaymentStatus, setBulkPaymentStatus] = useState('');
  const [bulkOrderStatus, setBulkOrderStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Stats
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
    
    // ✅ Add Date Filters to API request
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    fetch(`/api/v1/product-order?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const result = d.data;
          const list = Array.isArray(result) ? result : (result?.data || result?.orders || []);
          setOrders(list);

          const meta = result?.meta || result?.pagination || {};
          setTotalPages(meta.totalPages || meta.pages || Math.ceil((meta.total || meta.totalDocs || list.length) / l) || 1);
          setTotalDocs(meta.total || meta.totalDocs || list.length);

          setStats({
            total: meta.totalAmount || list.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0),
            paid: list.filter((o: any) => o.paymentStatus === 'Paid' || o.paymentStatus === 'paid').length,
            unpaid: list.filter((o: any) => ['unpaid', 'pending'].includes(o.paymentStatus?.toLowerCase())).length,
            cod: list.filter((o: any) => o.paymentMethod?.toLowerCase() === 'cod' || o.paymentMethod === 'Cash On Delivery').length,
          });
          
          setSelectedOrders([]); // Reset selections on data fetch
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchData(1, limit);
  }, [token]);

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

  // ✅ Checkbox Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // ✅ Bulk Update Handler
  const handleBulkUpdate = async () => {
    if (!bulkPaymentStatus && !bulkOrderStatus) {
      toast.error("Please select a status to update.");
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading(`Updating ${selectedOrders.length} orders...`);

    try {
      const updateData: any = {};
      if (bulkPaymentStatus) updateData.paymentStatus = bulkPaymentStatus;
      if (bulkOrderStatus) updateData.orderStatus = bulkOrderStatus;

      // Update concurrently
      const promises = selectedOrders.map(id => 
        axios.patch(`/api/v1/product-order/${id}`, updateData, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      
      await Promise.all(promises);

      toast.success("Orders updated successfully!", { id: toastId });
      
      // Reset selections and refetch
      setSelectedOrders([]);
      setBulkPaymentStatus('');
      setBulkOrderStatus('');
      fetchData(page, limit);

    } catch (error) {
      console.error(error);
      toast.error("Failed to update some orders.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
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
    if (s === 'shipped') return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0 text-xs">Shipped</Badge>;
    if (s === 'cancelled') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs">Cancelled</Badge>;
    return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 text-xs">{status || 'N/A'}</Badge>;
  };

  const methodBadge = (method: string) => {
    const m = method?.toLowerCase();
    if (m === 'cod' || m === 'cash on delivery') return <span className="px-2 py-1 text-xs font-semibold bg-orange-50 text-orange-700 rounded-md">COD</span>;
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

  if (loading && orders.length === 0) return (
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

        {/* ── Top Filters Area ── */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
             <h1 className="text-base font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
               Order Payment History
             </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            
            {/* ✅ Date Filters */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="h-7 text-xs px-2 outline-none rounded text-gray-600 cursor-pointer"
                title="From Date"
              />
              <span className="text-gray-400 text-xs font-medium">to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="h-7 text-xs px-2 outline-none rounded text-gray-600 cursor-pointer"
                title="To Date"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-9 text-xs border border-gray-300 rounded-lg px-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            {/* Search */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9 bg-white">
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
                className="px-3 h-full bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-white" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchData(page, limit)}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ✅ Bulk Update Action Bar (Visible when rows selected) */}
        {selectedOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-blue-50 border-b border-blue-100">
            <span className="text-sm font-semibold text-blue-800 bg-white px-2 py-1 rounded shadow-sm">
              {selectedOrders.length} orders selected
            </span>
            <select
              value={bulkPaymentStatus}
              onChange={(e) => setBulkPaymentStatus(e.target.value)}
              className="h-8 text-xs border border-blue-200 rounded px-2 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            >
              <option value="">Update Payment Status...</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            
            <select
              value={bulkOrderStatus}
              onChange={(e) => setBulkOrderStatus(e.target.value)}
              className="h-8 text-xs border border-blue-200 rounded px-2 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            >
              <option value="">Update Order Status...</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            
            <Button 
              size="sm" 
              onClick={handleBulkUpdate} 
              disabled={isUpdating || (!bulkPaymentStatus && !bulkOrderStatus)} 
              className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
            >
              {isUpdating ? 'Applying...' : 'Apply Status'}
            </Button>
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  {/* ✅ Checkbox All */}
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600"
                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                    onChange={handleSelectAll}
                  />
                </th>
                {['Order ID', 'Vendor Name', 'Product Name', 'Amount', 'Method', 'Payment Status', 'Order Status', 'Transaction ID', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-14 text-center">
                    <div className="space-y-2">
                      <CreditCard className="h-12 w-12 text-gray-200 mx-auto" />
                      <p className="text-gray-400 font-medium">No payment records found</p>
                      <p className="text-xs text-gray-300">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : orders.map((o: any) => {
                 
                 // Get Vendor Name
                 const vendorName = o.storeId?.storeName || o.storeName || 'Admin / Unknown';
                 
                 // Get Product Names
                 let productNames = '';
                 if (o.products && o.products.length > 0) {
                   productNames = o.products.map((p: any) => p.productTitle).filter(Boolean).join(', ');
                 } 
                 if (!productNames) {
                   productNames = `${o.orderDetails?.length || 1} Item(s)`;
                 }

                 return (
                  <tr key={o._id} className={`${selectedOrders.includes(o._id) ? 'bg-blue-50/40' : 'hover:bg-gray-50'} transition-colors`}>
                    
                    <td className="px-4 py-3.5">
                      {/* ✅ Checkbox Single */}
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600"
                        checked={selectedOrders.includes(o._id)}
                        onChange={() => handleSelectOne(o._id)}
                      />
                    </td>
                    
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                        #{o.orderId || o._id?.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    
                    {/* ✅ NEW: Vendor Name Column */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px] block" title={vendorName}>
                        {vendorName}
                      </span>
                    </td>

                    {/* ✅ NEW: Product Name Column */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-600 truncate max-w-[150px] block" title={productNames}>
                        {productNames}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900 whitespace-nowrap">৳{(o.totalAmount || 0).toLocaleString('en-BD')}</span>
                    </td>
                    
                    <td className="px-4 py-3.5">{methodBadge(o.paymentMethod)}</td>
                    <td className="px-4 py-3.5">{paymentStatusBadge(o.paymentStatus)}</td>
                    <td className="px-4 py-3.5">{orderStatusBadge(o.orderStatus)}</td>
                    
                    <td className="px-4 py-3.5 text-gray-500 font-mono text-xs max-w-[120px] truncate" title={o.transactionId}>
                      {o.transactionId || '-'}
                    </td>
                    
                    <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '-'}
                    </td>
                    
                    {/* ✅ NEW: Action Column */}
                    <td className="px-4 py-3.5 text-center">
                      <Link href={`/home/UserProfile/orders/${o._id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md" title="View Details">
                           <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Show</span>
            <select
              value={limit}
              onChange={e => handleLimitChange(Number(e.target.value))}
              className="h-7 text-xs border border-gray-300 rounded px-1 text-gray-600 focus:outline-none"
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <p className="text-xs text-gray-500">
            Showing <strong>{Math.min((page - 1) * limit + 1, totalDocs)}</strong> – <strong>{Math.min(page * limit, totalDocs)}</strong> of <strong>{totalDocs}</strong> records
          </p>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="h-3 w-3 text-gray-600" />
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3 w-3 text-gray-600" />
            </button>
            
            {getPageRange().map((p, i) =>
              p === '...' ? (
                <span key={`dot-${i}`} className="px-1 text-gray-400 text-xs">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(p as number)}
                  className={`min-w-[28px] h-7 text-xs font-semibold rounded-md border transition-colors ${
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
              <ChevronRight className="h-3 w-3 text-gray-600" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-3 w-3 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}