'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { support_tickets_columns, SupportTicketRow } from '@/components/TableHelper/support_tickets_columns';
import { Button } from '@/components/ui/button';
import { Check, Eye, Loader2, Plus, Trash2, XIcon, Search as SearchIcon, PauseCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent } from '@/components/ui/card';
import { confirmDelete } from '@/components/ReusableComponents/ConfirmToast';

type SupportTicket = {
  _id: string;
  ticketNo: string;
  createdAt: string;
  reporter?: { name?: string; profilePicture?: string }; 
  subject: string;
  attachment?: string | string[]; // Can be string or array
  status: 'Pending' | 'In Progress' | 'Solved' | 'Rejected' | 'On Hold';
};

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

  // Tab click filter
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

  // Refresh data function
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
      setTickets(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      refreshData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return toast.error("Authentication required.");
    const isConfirmed = await confirmDelete("Are you sure you want to delete this ticket?");
    if (!isConfirmed) return;

    setLoadingAction(id);
    try {
        await axios.delete(`/api/v1/crm-modules/support-ticket/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Ticket deleted!");
        setTickets(prev => prev.filter(t => t._id !== id));
        refreshData();
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete.');
    } finally {
        setLoadingAction(null);
    }
  };

  // Bulk Actions
  const handleBulkDelete = async (selectedRows: SupportTicketRow[]) => {
    if (selectedRows.length === 0) return;
    const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} tickets permanently?`);
    if (!isConfirmed) return;

    const toastId = toast.loading(`Deleting ${selectedRows.length} tickets...`);
    try {
        const promises = selectedRows.map(row => 
            axios.delete(`/api/v1/crm-modules/support-ticket/${row._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        await Promise.all(promises);
        const deletedIds = selectedRows.map(r => r._id);
        setTickets(prev => prev.filter(t => !deletedIds.includes(t._id)));
        refreshData();
        toast.success("Tickets deleted successfully!", { id: toastId });
    } catch (error) {
        toast.error("Failed to delete some tickets.", { id: toastId });
    }
  };

  const handleBulkStatusChange = async (selectedRows: SupportTicketRow[], newStatus: string) => {
    if (selectedRows.length === 0) return;
    const toastId = toast.loading(`Marking ${selectedRows.length} tickets as ${newStatus}...`);
    try {
        const promises = selectedRows.map(row => 
            axios.patch(
                `/api/v1/crm-modules/support-ticket/${row._id}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
        );
        await Promise.all(promises);
        const updatedIds = selectedRows.map(r => r._id);
        setTickets(prev => prev.map(t => 
            updatedIds.includes(t._id) ? { ...t, status: newStatus as SupportTicket['status'] } : t
        ));
        refreshData();
        toast.success(`Tickets marked as ${newStatus} successfully!`, { id: toastId });
    } catch (error) {
        toast.error("Failed to update status for some tickets.", { id: toastId });
    }
  };

  // ✅ FIX: Safe parsing for attachment (String or Array) to prevent 'h' single char slicing
  const mappedTickets: SupportTicketRow[] = tickets.map((t, index) => {
    let ticketAttachment: string | null = null;
    if (typeof t.attachment === 'string') {
      ticketAttachment = t.attachment;
    } else if (Array.isArray(t.attachment) && t.attachment.length > 0) {
      ticketAttachment = t.attachment[0];
    }

    return {
      _id: t._id,
      sl: index + 1,
      ticketNo: t.ticketNo,
      customer: t.reporter?.name || "Unknown",
      customerImage: t.reporter?.profilePicture || "", 
      subject: t.subject,
      attachment: ticketAttachment, // ✅ Full URL passed securely
      status: t.status,
      createdAt: t.createdAt
    };
  });

  // ✅ FIX: Changed ColumnDef typing to SupportTicketRow to fix strict generic mismatch
  const columnsWithActions: ColumnDef<SupportTicketRow, any>[] = [
    ...(support_tickets_columns as ColumnDef<SupportTicketRow, any>[]),
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
      {/* Tab Section */}
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

      {/* Table Section */}
      <div className="bg-white p-4 shadow-sm border rounded-xl">
        <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm"></div>
            <Button onClick={() => router.push('/general/support/tickets/new')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> New Ticket
            </Button>
        </div>
        
        {loadingTable ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <DataTable 
             columns={columnsWithActions} 
             data={mappedTickets}
             onBulkDelete={handleBulkDelete}
             onBulkStatusChangeCustom={{
                options: [
                  { label: "Mark In Progress", value: "In Progress" },
                  { label: "Mark Solved", value: "Solved" },
                  { label: "Put On Hold", value: "On Hold" },
                  { label: "Reject Tickets", value: "Rejected" },
                ],
                handler: handleBulkStatusChange
             }}
          />
        )}
      </div>
    </div>
  );
}