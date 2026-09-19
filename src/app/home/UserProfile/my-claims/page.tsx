"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { ShoppingBag, Package, Mail, Phone, Calendar, User, Clock, CheckCircle, XCircle, PhoneCall } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function MyClaimsPage() {
    const { data: session } = useSession()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [claims, setClaims] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // ✅ Modal States
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedClaim, setSelectedClaim] = useState<any>(null)

    const fetchClaims = useCallback(async () => {
        try {
            setLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session as any)?.accessToken
            if (!token) return

            const res = await api.get('/profile/donation/my-claims', {
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
        if (session) {
            fetchClaims();
        }
    }, [session, fetchClaims]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading your requests...</div>

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500 hover:bg-green-600';
            case 'rejected': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-yellow-500 hover:bg-yellow-600';
        }
    }

    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Claim Requests</h1>
                    <p className="text-sm text-gray-500 mt-1">Review the status of your donation requests</p>
                </div>
                
                <Link 
                    href="/products" 
                    className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md whitespace-nowrap"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                </Link>
            </div>

            {claims.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">No Claims Found</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                        You haven't applied for any donations yet. Browse our active campaigns to find items you need.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[250px] font-semibold text-gray-700">Item Name</TableHead>
                                <TableHead className="font-semibold text-gray-700">Applied Date</TableHead>
                                <TableHead className="font-semibold text-gray-700">Reason</TableHead>
                                <TableHead className="text-right font-semibold text-gray-700">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {claims.map((claim) => (
                                <TableRow key={claim._id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                                {claim.item?.images?.[0] ? (
                                                    <img src={claim.item.images[0]} className="w-full h-full object-cover" alt="Item" />
                                                ) : (
                                                    <Package className="text-gray-400 w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 line-clamp-1">
                                                    {claim.item?.title || 'Unknown Item'}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <User className="w-3 h-3" /> {claim.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(claim.createdAt).toLocaleDateString('en-GB')}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(claim.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <p className="max-w-[300px] truncate text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100" title={claim.reason}>
                                            {claim.reason}
                                        </p>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge className={`px-3 py-1 font-bold tracking-wide uppercase text-[10px] ${getStatusColor(claim.status)} text-white shadow-sm`}>
                                                <span className="flex items-center gap-1.5">
                                                    {claim.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                                    {claim.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                    {claim.status === 'pending' && <Clock className="w-3 h-3" />}
                                                    {claim.status}
                                                </span>
                                            </Badge>
                                            
                                            {/* ✅ MAGIC FIX: Approved হলে Contact Donor বাটন দেখাবে */}
                                            {claim.status === 'approved' && (
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="h-7 text-[11px] border-green-300 text-green-700 hover:bg-green-50 px-2"
                                                    onClick={() => {
                                                        setSelectedClaim(claim);
                                                        setIsContactModalOpen(true);
                                                    }}
                                                >
                                                    <PhoneCall className="w-3 h-3 mr-1.5" /> Contact Donor
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* ✅ Contact Donor Modal */}
            <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Congratulations!
                        </DialogTitle>
                        <DialogDescription className="mt-2">
                            Your claim for <strong>{selectedClaim?.item?.title}</strong> has been approved. Please contact the donor to receive your item.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-green-50/50 border border-green-100 p-5 rounded-xl space-y-4 mt-2">
                        {selectedClaim?.item?.creator ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Donor Name</p>
                                        <p className="font-semibold text-gray-800">{selectedClaim.item.creator.name || 'Not Available'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                                        <p className="font-semibold text-gray-800">{selectedClaim.item.creator.phoneNumber || 'Not Provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                        <p className="font-semibold text-gray-800">{selectedClaim.item.creator.email || 'Not Provided'}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-600 text-center py-4 italic">
                                Donor contact details are currently unavailable.
                            </p>
                        )}
                    </div>
                    
                    <div className="flex justify-end mt-2">
                        <Button variant="default" onClick={() => setIsContactModalOpen(false)}>Done</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}