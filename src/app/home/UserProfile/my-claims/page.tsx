"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function MyClaimsPage() {
    const { data: session } = useSession()
    const [claims, setClaims] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClaims = async () => {
            try {
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
        }
        if (session) fetchClaims()
    }, [session])

    if (loading) return <div className="p-8 text-center">Loading requests...</div>

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500 hover:bg-green-600';
            case 'rejected': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-yellow-500 hover:bg-yellow-600';
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Claim Requests</h1>

            {claims.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    You haven't applied for any donations yet.
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {claims.map((claim) => (
                                <TableRow key={claim._id}>
                                    <TableCell className="font-medium">
                                        {claim.item?.title || 'Unknown Item'}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(claim.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate" title={claim.reason}>
                                        {claim.reason}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusColor(claim.status)} text-white`}>
                                            {claim.status.toUpperCase()}
                                        </Badge>
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