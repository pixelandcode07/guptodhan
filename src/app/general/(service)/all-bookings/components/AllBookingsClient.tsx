'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { format, isValid } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/TableHelper/data-table';
import { getBookingColumns, Booking } from '@/components/TableHelper/booking_columns';

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
  
  // Cancel Modal States
  const [cancelNote, setCancelNote] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  
  // Bulk Cancel States
  const [isBulkCancel, setIsBulkCancel] = useState(false);
  const [bulkCancelTargets, setBulkCancelTargets] = useState<Booking[]>([]);

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

  // --- Single Actions ---
  const handleConfirm = async (id: string) => {
    setProcessingId(id);
    try {
      await axios.patch(
        `/api/v1/service-section/service-provider-manage/confirmed/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking confirmed!');
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Confirmed' } : b));
    } catch {
      toast.error('Failed to confirm booking');
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
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Completed' } : b));
    } catch {
      toast.error('Failed to complete booking');
    } finally {
      setProcessingId(null);
    }
  };

  const openCancelModal = (id: string) => {
    setCancelTargetId(id);
    setIsBulkCancel(false);
    setShowCancelDialog(true);
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
      setBookings(prev => prev.map(b => b._id === cancelTargetId ? { ...b, status: 'Cancelled', provider_rejection_message: cancelNote } : b));
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setProcessingId(null);
    }
  };

  // --- 🌟 Bulk Status Update Handler ---
  const handleCustomBulkStatus = async (selectedRows: Booking[], newStatus: string) => {
    if (selectedRows.length === 0) return;

    if (newStatus === 'Cancelled') {
        setBulkCancelTargets(selectedRows);
        setIsBulkCancel(true);
        setShowCancelDialog(true);
        return;
    }

    const toastId = toast.loading(`Marking ${selectedRows.length} bookings as ${newStatus}...`);

    try {
        const actionPath = newStatus === 'Confirmed' ? 'confirmed' : 'complete';
        const payload = newStatus === 'Completed' ? { provider_notes: 'Service completed via bulk action' } : {};

        const promises = selectedRows.map(row => 
            axios.patch(
                `/api/v1/service-section/service-provider-manage/${actionPath}/${row._id}`, 
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
        );
        
        await Promise.all(promises);

        const updatedIds = selectedRows.map(r => r._id);
        setBookings(prev => prev.map(b => 
            updatedIds.includes(b._id) ? { ...b, status: newStatus } : b
        ));

        toast.success(`Bookings marked as ${newStatus} successfully!`, { id: toastId });
    } catch (error) {
        console.error(error);
        toast.error("Failed to update status for some bookings.", { id: toastId });
    }
  };

  const handleBulkCancel = async () => {
    if (bulkCancelTargets.length === 0) return;
    
    setProcessingId('bulk-cancel');
    const toastId = toast.loading(`Cancelling ${bulkCancelTargets.length} bookings...`);

    try {
        const promises = bulkCancelTargets.map(row => 
            axios.patch(
                `/api/v1/service-section/service-provider-manage/cancel/${row._id}`,
                { provider_rejection_message: cancelNote },
                { headers: { Authorization: `Bearer ${token}` } }
            )
        );
        
        await Promise.all(promises);

        const updatedIds = bulkCancelTargets.map(r => r._id);
        setBookings(prev => prev.map(b => 
            updatedIds.includes(b._id) ? { ...b, status: 'Cancelled', provider_rejection_message: cancelNote } : b
        ));

        toast.success(`Bookings cancelled successfully!`, { id: toastId });
        setShowCancelDialog(false);
        setCancelNote('');
        setIsBulkCancel(false);
    } catch (error) {
        console.error(error);
        toast.error("Failed to cancel some bookings.", { id: toastId });
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

  // Get columns with injected functions
  const columns = getBookingColumns(
      setSelectedBooking, 
      handleConfirm, 
      handleComplete, 
      openCancelModal, 
      processingId
  );

  return (
    <div>
      {/* ── Dynamic Data Table with Custom Bulk Status ── */}
      <div className="mb-4">
            <DataTable 
                columns={columns} 
                data={bookings} 
                setData={setBookings}
                
                // ✅ Passes our custom booking statuses to the global DataTable
                onBulkStatusChangeCustom={{
                  options: [
                    { label: "Confirm Booking", value: "Confirmed" },
                    { label: "Mark Completed", value: "Completed" },
                    { label: "Cancel Booking", value: "Cancelled" }
                  ],
                  handler: handleCustomBulkStatus
                }}
            />
      </div>

      {/* ── Detail Dialog ── */}
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

      {/* ── Cancel Dialog ── */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isBulkCancel ? "Bulk Cancel Bookings" : "Cancel Booking"}</DialogTitle>
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
                onClick={isBulkCancel ? handleBulkCancel : handleCancel}
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