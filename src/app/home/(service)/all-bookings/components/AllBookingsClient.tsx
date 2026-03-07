'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { format, isValid } from 'date-fns';
import { Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Booking {
  _id: string;
  order_id: string;
  customer_id: string;
  provider_id: string;
  service_id: any;
  booking_date: string;
  time_slot: string;
  location_details: string;
  estimated_cost: number;
  status: string;
  contact_info: {
    name: string;
    phone: string;
    email?: string;
  };
  customer_notes?: string;
  provider_notes?: string;
  provider_rejection_message?: string;
  createdAt: string;
}

const safeFormat = (dateStr: string) => {
  const date = new Date(dateStr);
  return isValid(date) ? format(date, 'dd MMM yyyy, hh:mm a') : 'N/A';
};

const statusColor: Record<string, string> = {
  'Pending Confirmation': 'bg-yellow-100 text-yellow-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

export default function AllBookingsClient({ token }: { token: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelNote, setCancelNote] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/service-section/service-provider-manage', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data?.data?.bookings || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirm = async (id: string) => {
    setProcessingId(id);
    try {
      await axios.patch(
        `/api/v1/service-section/service-provider-manage/confirmed/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking confirmed!');
      fetchBookings();
    } catch {
      toast.error('Failed to confirm booking');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelTargetId) return;
    setProcessingId(cancelTargetId);
    try {
      await axios.patch(
        `/api/v1/service-section/service-provider-manage/cancel/${cancelTargetId}`,
        { provider_rejection_message: cancelNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking cancelled!');
      setShowCancelDialog(false);
      setCancelNote('');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (id: string) => {
    setProcessingId(id);
    try {
      await axios.patch(
        `/api/v1/service-section/service-provider-manage/complete/${id}`,
        { provider_notes: 'Service completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking marked as completed!');
      fetchBookings();
    } catch {
      toast.error('Failed to complete booking');
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
              <th className="px-4 py-3 text-xs font-semibold text-gray-600">Order ID</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600">Contact</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600">Date & Time</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600">Location</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600">Cost</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-medium text-blue-600">
                      {booking.order_id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{booking.contact_info?.name}</p>
                    <p className="text-xs text-gray-500">{booking.contact_info?.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{safeFormat(booking.booking_date)}</p>
                    <p className="text-xs text-gray-500">{booking.time_slot}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600 max-w-[150px] truncate">
                      {booking.location_details}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-gray-800">
                      ৳{booking.estimated_cost}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end items-center gap-1">
                      {/* View Details */}
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Confirm */}
                      {booking.status === 'Pending Confirmation' && (
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          disabled={processingId === booking._id}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Confirm"
                        >
                          {processingId === booking._id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <CheckCircle className="h-4 w-4" />
                          }
                        </button>
                      )}

                      {/* Complete */}
                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => handleComplete(booking._id)}
                          disabled={processingId === booking._id}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Mark Complete"
                        >
                          {processingId === booking._id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <CheckCircle className="h-4 w-4" />
                          }
                        </button>
                      )}

                      {/* Cancel */}
                      {['Pending Confirmation', 'Confirmed'].includes(booking.status) && (
                        <button
                          onClick={() => {
                            setCancelTargetId(booking._id);
                            setShowCancelDialog(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-mono font-medium text-blue-600">{selectedBooking.order_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selectedBooking.status]}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer Name</p>
                  <p className="font-medium">{selectedBooking.contact_info?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{selectedBooking.contact_info?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedBooking.contact_info?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Booking Date</p>
                  <p className="font-medium">{safeFormat(selectedBooking.booking_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Slot</p>
                  <p className="font-medium">{selectedBooking.time_slot}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estimated Cost</p>
                  <p className="font-bold text-gray-900">৳{selectedBooking.estimated_cost}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">{selectedBooking.location_details}</p>
                </div>
                {selectedBooking.customer_notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Customer Notes</p>
                    <p className="font-medium">{selectedBooking.customer_notes}</p>
                  </div>
                )}
                {selectedBooking.provider_rejection_message && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Cancellation Reason</p>
                    <p className="font-medium text-red-600">{selectedBooking.provider_rejection_message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Please provide a reason for cancellation:</p>
            <textarea
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Reason for cancellation..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Go Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={!cancelNote.trim() || !!processingId}
              >
                {processingId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}