'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReportListing } from '@/types/ReportType';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const getStatusBadge = (status: ReportListing['status']) => {
    switch (status) {
        case 'pending':
            return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        case 'under_review':
            return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
        case 'resolved':
            return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
        case 'rejected':
            return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export const reportListing_columns: ColumnDef<ReportListing>[] = [
    {
        id: 'serial',
        header: 'No.',
        cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
    },
    {
        id: 'reporter',
        header: 'Reported By',
        cell: ({ row }) => (
            <div className="text-sm">
                <div className="font-medium">{row.original.reporter.name}</div>
                <div className="text-gray-500">{row.original.reporter.email}</div>
            </div>
        ),
    },
    {
        id: 'reportedUser',
        header: 'Seller',
        cell: ({ row }) => (
            <div className="text-sm">
                <div className="font-medium">{row.original.reportedUser.name}</div>
                <div className="text-gray-500">{row.original.reportedUser.email}</div>
            </div>
        ),
    },
    {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => {
            const reason = row.getValue('reason') as string;
            return <Badge variant="outline" className="capitalize">{reason.replace('_', ' ')}</Badge>;
        },
    },
    {
        accessorKey: 'details',
        header: 'Details',
        cell: ({ row }) => {
            const details = row.getValue('details') as string;
            return (
                <p className="text-sm max-w-xs truncate" title={details}>
                    {details || 'No details provided'}
                </p>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const report = row.original;

            const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

            return (
                <div className="flex items-center gap-2">
                    {getStatusBadge(status)}

                    {/* Only show eye button when rejected */}
                    {status === 'rejected' && (
                        <>
                            <button
                                onClick={() => setIsViewDialogOpen(true)}
                                className="p-1 rounded hover:bg-gray-100"
                            >
                                <Eye className="w-4 h-4 text-gray-700" />
                            </button>

                            {/* View Dialog */}
                            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Rejection Reason</DialogTitle>
                                        <DialogDescription className="text-sm text-gray-700 mt-2">
                                            {report?.adminNotes || 'No reason provided'}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            );
        },
    },

    {
        accessorKey: 'createdAt',
        header: 'Reported On',
        cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'dd MMM yyyy, hh:mm a'),
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const report = row.original;
            const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
            const [rejectReason, setRejectReason] = useState('');
            const [isLoading, setIsLoading] = useState(false);

            const updateStatus = async (newStatus: 'under_review' | 'resolved' | 'rejected') => {
                setIsLoading(true);

                try {
                    const body: any = { status: newStatus };

                    if (newStatus === 'rejected') {
                        body.adminNotes = rejectReason;
                    }

                    const res = await fetch(`/api/v1/reports/${report._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });

                    if (!res.ok) {
                        const data = await res.json();
                        toast.error(data.message || 'Failed to update');
                    } else {
                        toast.success(`Status updated to: ${newStatus}`);
                        window.location.reload();
                    }
                } catch (err) {
                    toast.error('Something went wrong');
                } finally {
                    setIsLoading(false);
                    setIsRejectDialogOpen(false);
                }
            };

            return (
                <div className="flex items-center gap-2">
                    {/* PENDING → Review + Reject */}
                    {report.status === 'pending' && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus('under_review')}
                                disabled={isLoading}
                            >
                                Under Review
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-500"
                                onClick={() => setIsRejectDialogOpen(true)}
                            >
                                Reject
                            </Button>
                        </>
                    )}

                    {/* UNDER REVIEW → Resolve + Reject */}
                    {report.status === 'under_review' && (
                        <>
                            <Button
                                size="sm"
                                className="bg-green-600 text-white"
                                disabled={isLoading}
                                onClick={() => updateStatus('resolved')}
                            >
                                Resolve
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-500"
                                disabled={isLoading}
                                onClick={() => setIsRejectDialogOpen(true)}
                            >
                                Reject
                            </Button>
                        </>
                    )}

                    {/* Reject Dialog */}
                    <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reject Report</DialogTitle>
                            </DialogHeader>

                            <Textarea
                                placeholder="Write rejection reason..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />

                            <DialogFooter>
                                <Button
                                    className="bg-red-600 text-white"
                                    disabled={!rejectReason.trim() || isLoading}
                                    onClick={() => updateStatus('rejected')}
                                >
                                    Confirm Reject
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
    },


];