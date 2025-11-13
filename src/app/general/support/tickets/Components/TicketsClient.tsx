'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { support_tickets_columns } from '@/components/TableHelper/support_tickets_columns';
import { Button } from '@/components/ui/button';
import { Check, Eye, Loader2, Plus, Trash2, XIcon, Search as SearchIcon, PauseCircle } from 'lucide-react'; // ✅ PauseCircle আইকন যোগ করা হয়েছে
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// টাইপ (আপনার schema অনুযায়ী)
type SupportTicket = {
  _id: string;
  ticketNo: string;
  createdAt: string;
  reporter: { name: string };
  subject: string;
  status: 'Pending' | 'In Progress' | 'Solved' | 'Rejected' | 'On Hold';
};

// স্ট্যাটাস কার্ডের টাইপ
type TicketStats = {
  all: number;
  Pending: number;
  'In Progress': number;
  Solved: number;
  Rejected: number;
  'On Hold': number;
};

interface TicketsClientProps {
    initialTickets: SupportTicket[];
    initialStats: TicketStats;
}

export default function TicketsClient({ initialTickets, initialStats }: TicketsClientProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [stats, setStats] = useState(initialStats);
  const [activeTab, setActiveTab] = useState('All Tickets');
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  // --- API কল ---

  // ট্যাবে ক্লিক করলে টেবিল রিফ্রেশ করার ফাংশন
  const handleTabClick = async (status: string) => {
    setActiveTab(status);
    setLoadingTable(true);
    try {
      let url = '/api/v1/crm-modules/support-ticket';
      if (status !== 'All Tickets') {
        url += `?status=${status}`;
      }
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setTickets(res.data.data);
    } catch (error) {
      toast.error("Failed to load tickets for this tab.");
    } finally {
      setLoadingTable(false);
    }
  };

  // স্ট্যাটাস বা ডিলিট করার পর সব ডেটা রিফ্রেশ করার ফাংশন
  const refreshData = async () => {
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        axios.get(`/api/v1/crm-modules/support-ticket${activeTab !== 'All Tickets' ? `?status=${activeTab}` : ''}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/v1/crm-modules/support-ticket/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTickets(ticketsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error("Failed to refresh data.");
    }
  };

  const handleUpdateStatus = async (id: string, status: SupportTicket['status']) => {
    if (!token) return toast.error("Authentication required.");
    setLoadingAction(id);
    try {
      await axios.patch(`/api/v1/crm-modules/support-ticket/${id}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Ticket marked as ${status}!`);
      await refreshData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = (id: string) => {
    if (!token) return toast.error("Authentication required.");
    toast("Are you sure you want to delete this ticket?", {
        action: {
            label: "Delete",
            onClick: async () => {
                setLoadingAction(id);
                try {
                    await axios.delete(`/api/v1/crm-modules/support-ticket/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Ticket deleted!");
                    await refreshData();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to delete.');
                } finally {
                    setLoadingAction(null);
                }
            }
        },
        cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  // --- টেবিলের কলাম ডেফিনিশন (অ্যাকশন বাটন সহ) ---
  const columnsWithActions: ColumnDef<SupportTicket>[] = [
    ...(support_tickets_columns as ColumnDef<SupportTicket>[]),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const ticket = row.original;
        const isLoading = loadingAction === ticket._id;
        
        if (isLoading) {
            return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
        }

        // ✅ FIX: স্ট্যাটাস অনুযায়ী বাটন দেখানোর লজিক
        switch (ticket.status) {
          case 'Pending':
          case 'In Progress':
            return (
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" onClick={() => router.push(`/general/support/tickets/view/${ticket._id}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleUpdateStatus(ticket._id, 'Solved')}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500" onClick={() => handleUpdateStatus(ticket._id, 'On Hold')}>
                  <PauseCircle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleUpdateStatus(ticket._id, 'Rejected')}>
                  <XIcon className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-red-700" onClick={() => handleDelete(ticket._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          case 'Solved':
            return (
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" onClick={() => router.push(`/general/support/tickets/view/${ticket._id}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            );
          case 'Rejected':
          case 'On Hold':
            return (
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" onClick={() => router.push(`/general/support/tickets/view/${ticket._id}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-red-700" onClick={() => handleDelete(ticket._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          default:
            return null;
        }
      },
    },
  ];

  // স্ট্যাটাস কার্ডের ডেটা
  const statCards = [
    { title: "All Tickets", count: stats.all },
    { title: "Pending", count: stats.Pending },
    { title: "In Progress", count: stats['In Progress'] },
    { title: "Solved", count: stats.Solved },
    { title: "On Hold", count: stats['On Hold'] },
    { title: "Rejected", count: stats.Rejected },
  ];

  return (
    <div className="space-y-6">
      {/* --- স্ট্যাটাস কার্ড (ট্যাব) সেকশন --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => (
          <button 
            key={card.title} 
            onClick={() => handleTabClick(card.title)} 
            disabled={loadingTable}
            className="disabled:opacity-50"
          >
            <Card className={`hover:shadow-lg transition-shadow ${activeTab === card.title ? 'ring-2 ring-blue-600' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold">{card.count}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* --- টেবিল সেকশন --- */}
      <div className="bg-white p-4 shadow-sm border rounded-md">
        <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
                <Input placeholder="Search tickets, customers..." className="pl-10" />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button onClick={() => router.push('/general/support/tickets/new')}>
                <Plus className="w-4 h-4 mr-2" /> New Ticket
            </Button>
        </div>
        
        {/* টেবিল লোডার */}
        {loadingTable ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <DataTable columns={columnsWithActions} data={tickets} />
        )}
      </div>
    </div>
  );
}