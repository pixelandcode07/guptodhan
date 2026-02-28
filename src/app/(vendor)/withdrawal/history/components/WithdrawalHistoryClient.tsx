'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns'; // date-fns থাকলে ভালো, না থাকলে নরমাল Date ব্যবহার করতে পারেন

export default function WithdrawalHistoryClient() {
  const { data: session } = useSession();
  const vendorId = (session?.user as any)?._id || (session?.user as any)?.id;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/v1/withdrawal/vendor/${vendorId}`);
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [vendorId]);

  if (loading) return <div className="p-6 text-center animate-pulse">Loading history...</div>;

  return (
    <div className="bg-white rounded-md shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Account Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Admin Remarks</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No withdrawal history found.
                </td>
              </tr>
            ) : (
              history.map((req) => (
                <tr key={req._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">৳ {req.amount}</td>
                  <td className="px-6 py-4">{req.paymentMethod}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={req.accountDetails}>
                    {req.accountDetails}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${req.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                      ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${req.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {req.adminRemarks || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}