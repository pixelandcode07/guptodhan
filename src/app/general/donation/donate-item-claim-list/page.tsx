"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export default function ClaimListPage() {
    const { data: session } = useSession();
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClaims = async () => {
        try {
            // @ts-ignore
            const token = session?.accessToken;
            if(!token) return;

            const res = await axios.get('/api/v1/donation-claims', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setClaims(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(session) fetchClaims();
    }, [session]);

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        try {
            // @ts-ignore
            const token = session?.accessToken;
            
            // 🔥 NOTE: এই API টি এখনো বানানো হয়নি, নিচে বানিয়ে দিচ্ছি
            await axios.patch(`/api/v1/donation-claims/${id}`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Request ${status}`);
            fetchClaims();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-8">Loading claims...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Donation Claim Requests</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Item Requested</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {claims.map((claim) => (
                        <TableRow key={claim._id}>
                            <TableCell className="font-medium">{claim.name}</TableCell>
                            <TableCell>{claim.phone}</TableCell>
                            <TableCell>{claim.item?.title || 'Unknown Item'}</TableCell>
                            <TableCell className="max-w-xs truncate" title={claim.reason}>{claim.reason}</TableCell>
                            <TableCell>
                                <Badge className={
                                    claim.status === 'approved' ? 'bg-green-500' : 
                                    claim.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                }>
                                    {claim.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                {claim.status === 'pending' && (
                                    <>
                                        <Button 
                                            size="sm" 
                                            className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                            onClick={() => handleStatusUpdate(claim._id, 'approved')}
                                        >
                                            <Check size={16} />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleStatusUpdate(claim._id, 'rejected')}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}