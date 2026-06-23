'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { support_tickets_columns } from '@/components/TableHelper/support_tickets_columns';
import { Button } from '@/components/ui/button';
import { Check, Eye, Loader2, Plus, Trash2, XIcon, Search as SearchIcon, PauseCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// টাইপ (আপনার schema অনুযায়ী)
type SupportTicket = {
  _id: string;
  ticketNo: string;
  createdAt: string;
  reporter?: { name?: string; profilePicture?: string }; // ✅ Updated reporter type
  subject: string;
  attachment?: string[];
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

  // ✅ Mapping raw backend tickets to match our column definitions perfectly
  const mappedTickets = tickets.map((t, index) => ({
    _id: t._id,
    sl: index + 1,
    ticketNo: t.ticketNo,
    customer: t.reporter?.name || "Unknown",
    customerImage: t.reporter?.profilePicture || "", // Passed image here
    subject: t.subject,
    attachment: t.attachment && t.attachment.length > 0 ? t.attachment[0] : null,
    status: t.status,
    createdAt: t.createdAt
  }));

  // --- টেবিলের কলাম ডেফিনিশন (অ্যাকশন বাটন সহ) ---
  const columnsWithActions: ColumnDef<any>[] = [
    ...(support_tickets_columns as ColumnDef<any>[]),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const ticket = row.original;
        const isLoading = loadingAction === ticket._id;
        
        if (isLoading) {
            return <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
        }

        switch (ticket.status) {
          case 'Pending':
          case 'In Progress':
            return (
              <div className="flex gap-1.5 items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => router.push(`/general/support/tickets/view/${ticket._id}`)} title="View">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleUpdateStatus(ticket._id, 'Solved')} title="Mark Solved">
                  <Check className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:bg-orange-50" onClick={() => handleUpdateStatus(ticket._id, 'On Hold')} title="Put On Hold">
                  <PauseCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleUpdateStatus(ticket._id, 'Rejected')} title="Reject">
                  <XIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-700 hover:bg-red-100" onClick={() => handleDelete(ticket._id)} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          case 'Solved':
            return (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => router.push(`/general/support/tickets/view/${ticket._id}`)} title="View">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            );
          case 'Rejected':
          case 'On Hold':
            return (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => router.push(`/general/support/tickets/view/${ticket._id}`)} title="View">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-700 hover:bg-red-100" onClick={() => handleDelete(ticket._id)} title="Delete">
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
                <p className="text-xs text-gray-500 font-semibold uppercase">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.count}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* --- টেবিল সেকশন --- */}
      <div className="bg-white p-4 shadow-sm border rounded-xl">
        <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
                {/* Search Bar is actually handled internally by our DataTable component now, 
                    but keeping this placeholder for layout if needed. 
                    However, our DataTable already has a built-in search.
                */}
            </div>
            <Button onClick={() => router.push('/general/support/tickets/new')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> New Ticket
            </Button>
        </div>
        
        {/* টেবিল লোডার */}
        {loadingTable ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <DataTable 
             columns={columnsWithActions} 
             data={mappedTickets} // ✅ Passing perfectly mapped data
             
             // Uncomment below if you want Bulk Action options later
             /*
             onBulkDelete={(rows) => console.log("Delete", rows)}
             onBulkStatusChangeCustom={{
                options: [
                  { label: "Mark Solved", value: "Solved" },
                  { label: "Put On Hold", value: "On Hold" },
                  { label: "Reject Tickets", value: "Rejected" },
                ],
                handler: async (rows, status) => {
                  // Run bulk patch requests here if needed
                }
             }}
             */
          />
        )}
      </div>
    </div>
  );
}