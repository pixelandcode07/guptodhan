"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Package, Mail, Phone, Calendar, User, Clock, CheckCircle, XCircle, Bell } from 'lucide-react'
import { toast } from 'sonner'

export default function ReceivedRequestsPage() {
    const { data: session } = useSession()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [claims, setClaims] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchReceivedClaims = useCallback(async () => {
        try {
            setLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session as any)?.accessToken
            if (!token) return

            const res = await api.get('/profile/donation/received-claims', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data.success) {
                setClaims(res.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch claims", error)
        } finally {
            setLoading(false)
        }
    }, [session]);

    useEffect(() => {
        if (session) fetchReceivedClaims();
    }, [session, fetchReceivedClaims]);

    // ✅ অ্যাপ্রুভ বা রিজেক্ট করার ফাংশন (যেটা আপনি অলরেডি অ্যাডমিন প্যানেলে ব্যবহার করেছেন!)
    const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session as any)?.accessToken
            const res = await api.patch(`/donation-claims/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(`Request ${newStatus} successfully!`);
                fetchReceivedClaims(); // রিলোড ডাটা
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading requests...</div>

    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="text-blue-600" /> Received Requests
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage people who requested for your donation items.</p>
                </div>
            </div>

            {claims.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">No Requests Yet</h3>
                    <p className="text-sm text-gray-500 mt-2">When someone claims your item, it will appear here.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[200px]">Item</TableHead>
                                <TableHead>Applicant Details</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead className="text-right">Action / Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {claims.map((claim) => (
                                <TableRow key={claim._id} className="hover:bg-gray-50/50">
                                    {/* Item Info */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded bg-gray-100 border overflow-hidden">
                                                {claim.item?.images?.[0] ? <img src={claim.item.images[0]} className="w-full h-full object-cover" alt="" /> : <Package className="w-full h-full p-3 text-gray-400" />}
                                            </div>
                                            <p className="font-semibold text-sm line-clamp-2">{claim.item?.title}</p>
                                        </div>
                                    </TableCell>
                                    
                                    {/* Applicant Info */}
                                    <TableCell>
                                        <div className="text-sm space-y-1">
                                            <p className="font-bold flex items-center gap-1 text-gray-800"><User className="w-3.5 h-3.5 text-blue-500" /> {claim.name}</p>
                                            <p className="text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-green-500" /> {claim.phone}</p>
                                            <p className="text-gray-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-orange-500" /> {claim.email}</p>
                                        </div>
                                    </TableCell>

                                    {/* Reason */}
                                    <TableCell>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                            <Calendar className="w-3 h-3" /> {new Date(claim.createdAt).toLocaleDateString()}
                                        </div>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border max-w-[250px] line-clamp-3" title={claim.reason}>
                                            {claim.reason}
                                        </p>
                                    </TableCell>

                                    {/* Action Buttons */}
                                    <TableCell className="text-right align-middle">
                                        {claim.status === 'pending' ? (
                                            <div className="flex flex-col gap-2 items-end">
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-24 h-8 text-xs" onClick={() => handleStatusChange(claim._id, 'approved')}>
                                                    <CheckCircle className="w-3 h-3 mr-1.5" /> Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 w-24 h-8 text-xs" onClick={() => handleStatusChange(claim._id, 'rejected')}>
                                                    <XCircle className="w-3 h-3 mr-1.5" /> Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <Badge className={`px-3 py-1 uppercase text-[10px] text-white ${claim.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {claim.status}
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}