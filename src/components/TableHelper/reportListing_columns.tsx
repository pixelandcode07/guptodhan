// src/components/reports/reportListing_columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ReportListing } from '@/types/ReportType';

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
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
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
            return (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                        <Link href={`/home/buyandsell/ad-details/${report._id}`}>
                            <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            );
        },
    },
];