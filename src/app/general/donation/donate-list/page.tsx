"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function DonateListPage() {
    const { data: session } = useSession();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        try {
            // @ts-ignore
            const token = session?.accessToken;
            if(!token) return;

            // অ্যাডমিনের জন্য সব ক্যাম্পেইন আনার আলাদা API দরকার হতে পারে অথবা পাবলিক API ব্যবহার করা যেতে পারে
            const res = await axios.get('/api/v1/public/donation-campaigns');
            if (res.data.success) {
                setCampaigns(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(session) fetchCampaigns();
    }, [session]);

    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure you want to delete this campaign?")) return;
        
        try {
            // @ts-ignore
            const token = session?.accessToken;
            await axios.delete(`/api/v1/donation-campaigns/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Campaign deleted");
            fetchCampaigns(); // Refresh list
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    if (loading) return <div className="p-8">Loading campaigns...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Donation Campaigns List</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.map((camp) => (
                        <TableRow key={camp._id}>
                            <TableCell className="font-medium">{camp.title}</TableCell>
                            <TableCell>{camp.category?.name || 'N/A'}</TableCell>
                            <TableCell className="capitalize">{camp.item}</TableCell>
                            <TableCell>
                                <Badge variant={camp.status === 'active' ? 'default' : 'secondary'}>
                                    {camp.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(camp.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                    <Eye size={16} />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(camp._id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}