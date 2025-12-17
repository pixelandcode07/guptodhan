'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Loader2 } from 'lucide-react';

interface OrderUpdateModalProps {
    order: {
        id: string;
        orderNo: string;
        orderStatus: string;
        paymentStatus: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function OrderUpdateModal({ order, isOpen, onClose, onSuccess }: OrderUpdateModalProps) {
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    // Sync state when order opens
    useEffect(() => {
        if (order && isOpen) {
            setOrderStatus(order.orderStatus);
            setPaymentStatus(order.paymentStatus);
        }
    }, [order, isOpen]);

    const handleUpdate = async () => {
        if (!order) return;

        try {
            setLoading(true);
            const response = await api.patch(`/product-order/${order.id}`, {
                orderStatus,
                paymentStatus
            });

            if (response.data?.success) {
                toast.success('Order updated successfully');
                onSuccess();
                onClose();
            } else {
                toast.error('Failed to update order');
            }
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Order #{order?.orderNo}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Order Status</Label>
                        <Select value={orderStatus} onValueChange={setOrderStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="Returned">Returned</SelectItem>
                                <SelectItem value="Return Request">Return Request</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Payment Status</Label>
                        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                                <SelectItem value="Refunded">Refunded</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}