'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2, Mail, Clock } from 'lucide-react';
import { format, isValid } from 'date-fns';

interface DeletionRequest {
  _id: string;
  identifier: string;
  reason?: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

const safeFormat = (dateStr: string) => {
  const date = new Date(dateStr);
  return isValid(date) ? format(date, 'dd MMM yyyy, hh:mm a') : 'N/A';
};

export default function AccountDeletionList() {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/account-deletion');
      if (response.data?.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load deletion requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'completed' | 'rejected') => {
    const confirmMsg = action === 'completed'
      ? 'Are you sure you want to PERMANENTLY delete this user account?'
      : 'Are you sure you want to reject this request?';

    if (!window.confirm(confirmMsg)) return;

    setProcessingId(id);
    try {
      const response = await api.patch(`/admin/account-deletion/${id}`, { action });
      if (response.data?.success) {
        toast.success(`Request ${action === 'completed' ? 'approved' : 'rejected'} successfully`);
        fetchRequests();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">User Identifier</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Reason</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Request Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{request.identifier}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-xs truncate" title={request.reason}>
                      {request.reason || <span className="text-gray-300 italic">No reason provided</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {safeFormat(request.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${request.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                      ${request.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {request.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(request._id, 'completed')}
                          disabled={processingId === request._id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve & Delete"
                        >
                          {processingId === request._id
                            ? <Loader2 className="h-5 w-5 animate-spin" />
                            : <CheckCircle className="h-5 w-5" />
                          }
                        </button>
                        <button
                          onClick={() => handleAction(request._id, 'rejected')}
                          disabled={processingId === request._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Request"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <span className="text-xs text-gray-400 italic">Processed</span>
                    )}
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