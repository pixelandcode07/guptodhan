"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trash2, Eye, Check, X, Search, RefreshCw, ChevronDown,
  Package, Clock, TrendingUp, Users, ShieldCheck, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  _id: string;
  title: string;
  description?: string;
  category?: { _id: string; name: string };
  item: string;
  status: 'active' | 'inactive' | 'completed' | 'archived';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  creator?: { _id: string; name: string; email?: string };
  rejectionReason?: string;
  goalAmount?: number;
  raisedAmount?: number;
  donorsCount?: number;
  images?: string[];
}

export default function AdminDonateListPage() {
  const { data: session } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [moderationFilter, setModerationFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ✅ Fetch all campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      // @ts-ignore
      const token = session?.accessToken;
      if (!token) return;

      const res = await fetch('/api/v1/donation-campaigns', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data);
        setFilteredCampaigns(data.data);
      } else {
        toast.error(data.message || 'Failed to load campaigns');
      }
    } catch (error) {
      toast.error('Network error while loading campaigns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchCampaigns();
  }, [session]);

  // ✅ Filter campaigns
  useEffect(() => {
    let filtered = campaigns;
    
    if (searchQuery) {
      filtered = filtered.filter(camp => 
        camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.creator?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(camp => camp.status === statusFilter);
    }
    
    if (moderationFilter !== "all") {
      filtered = filtered.filter(camp => camp.moderationStatus === moderationFilter);
    }
    
    setFilteredCampaigns(filtered);
  }, [searchQuery, statusFilter, moderationFilter, campaigns]);

  // ✅ Handle Moderation Status Change from Dropdown
  const handleModerationChange = async (id: string, action: 'approve' | 'reject') => {
    // If rejecting, open dialog for reason
    if (action === 'reject') {
      const camp = campaigns.find(c => c._id === id);
      setSelectedCampaign(camp || null);
      setIsRejectDialogOpen(true);
      return;
    }

    // If approving, directly approve
    setActionLoading(id);
    try {
      // @ts-ignore
      const token = session?.accessToken;
      
      const res = await fetch(`/api/v1/donation-campaigns/${id}/moderate`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'approve' })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success("✅ Campaign approved and activated!");
        fetchCampaigns();
      } else {
        toast.error(data.message || "Approval failed");
      }
    } catch (error: any) {
      toast.error("Network error during approval");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Reject Campaign (called from dialog)
  const handleReject = async () => {
    if (!selectedCampaign || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    setActionLoading(selectedCampaign._id);
    try {
      // @ts-ignore
      const token = session?.accessToken;
      
      const res = await fetch(`/api/v1/donation-campaigns/${selectedCampaign._id}/moderate`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'reject', 
          rejectionReason 
        })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success("❌ Campaign rejected");
        setIsRejectDialogOpen(false);
        setRejectionReason("");
        fetchCampaigns();
      } else {
        toast.error(data.message || "Rejection failed");
      }
    } catch (error: any) {
      toast.error("Network error during rejection");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Change Status via Dropdown (যেকোনো status এ change করা যাবে)
  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoading(id);
    
    try {
      // @ts-ignore
      const token = session?.accessToken;
      
      const res = await fetch(`/api/v1/donation-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success(`✅ Status changed to ${newStatus}`);
        fetchCampaigns();
      } else {
        toast.error(data.message || "Status update failed");
      }
    } catch (error: any) {
      toast.error("Network error during status update");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Delete Campaign
  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Are you sure? This action cannot be undone.")) return;
    
    try {
      // @ts-ignore
      const token = session?.accessToken;
      
      const res = await fetch(`/api/v1/donation-campaigns/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success("🗑️ Campaign deleted successfully");
        fetchCampaigns();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) { 
      toast.error("Network error during deletion");
      console.error(err);
    }
  };

  // Badge helpers
  const getModerationBadge = (s: string) => {
    if (s === 'approved') return <Badge className="bg-green-500 text-white gap-1"><ShieldCheck size={12}/> Approved</Badge>;
    if (s === 'rejected') return <Badge variant="destructive" className="gap-1"><ShieldAlert size={12}/> Rejected</Badge>;
    return <Badge className="bg-yellow-500 text-black gap-1"><Clock size={12}/> Pending</Badge>;
  };

  const getStatusBadge = (s: string) => {
    if (s === 'active') return <Badge className="bg-emerald-600 text-white">Active</Badge>;
    if (s === 'inactive') return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
    if (s === 'completed') return <Badge className="bg-blue-600 text-white">Completed</Badge>;
    return <Badge variant="secondary">Archived</Badge>;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            📦 Donation Campaign Management
          </h1>
          <p className="text-slate-500 text-sm">Review, approve, and manage all user campaigns</p>
        </div>
        <Button onClick={fetchCampaigns} variant="outline" className="gap-2">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh List
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <Package className="text-blue-500" size={20} />
            <span className="text-2xl font-bold">{campaigns.length}</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Campaigns</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex justify-between items-center mb-2">
            <Clock className="text-yellow-500" size={20} />
            <span className="text-2xl font-bold">
              {campaigns.filter(c => c.moderationStatus === 'pending').length}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Awaiting Approval</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-green-500">
          <div className="flex justify-between items-center mb-2">
            <TrendingUp className="text-green-500" size={20} />
            <span className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'active').length}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Currently Live</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <Users className="text-purple-500" size={20} />
            <span className="text-2xl font-bold">
              {campaigns.reduce((acc, curr) => acc + (curr.donorsCount || 0), 0)}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Donors</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <Input 
            placeholder="Search by title or creator..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={moderationFilter} onValueChange={setModerationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Moderation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Moderation</SelectItem>
            <SelectItem value="pending">Pending Only</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[300px]">Campaign Info</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Moderation</TableHead>
              <TableHead>Public Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  <p>Loading campaigns...</p>
                </TableCell>
              </TableRow>
            ) : filteredCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                  No campaigns found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredCampaigns.map((camp) => (
                <TableRow key={camp._id} className="group hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border flex-shrink-0">
                        {camp.images?.[0] ? (
                          <img src={camp.images[0]} className="w-full h-full object-cover" alt={camp.title} />
                        ) : (
                          <Package className="m-auto mt-3 text-slate-300" />
                        )}
                      </div>
                      <div className="max-w-[200px]">
                        <p className="font-semibold text-slate-800 truncate">{camp.title}</p>
                        <p className="text-xs text-slate-500 capitalize">
                          {camp.item} • {camp.category?.name || 'No Category'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-sm font-medium">{camp.creator?.name || 'Anonymous'}</p>
                    <p className="text-[10px] text-slate-400">{camp.creator?.email}</p>
                  </TableCell>
                  
                  <TableCell>
                    {/* ✅ MODERATION DROPDOWN - সব campaigns এর জন্য */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 gap-1 px-2"
                          disabled={actionLoading === camp._id}
                        >
                          {getModerationBadge(camp.moderationStatus)}
                          <ChevronDown size={14} className="ml-1 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleModerationChange(camp._id, 'approve')}
                          disabled={camp.moderationStatus === 'approved'}
                        >
                          <ShieldCheck size={14} className="text-green-600 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleModerationChange(camp._id, 'reject')}
                          disabled={camp.moderationStatus === 'rejected'}
                          className="text-red-600"
                        >
                          <ShieldAlert size={14} className="mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  
                  <TableCell>
                    {/* ✅ STATUS DROPDOWN - সব campaigns এর জন্য */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 gap-1 px-2"
                          disabled={actionLoading === camp._id}
                        >
                          {getStatusBadge(camp.status)}
                          <ChevronDown size={14} className="ml-1 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(camp._id, 'active')}
                          disabled={camp.status === 'active'}
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(camp._id, 'inactive')}
                          disabled={camp.status === 'inactive'}
                        >
                          <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                          Inactive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(camp._id, 'completed')}
                          disabled={camp.status === 'completed'}
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(camp._id, 'archived')}
                          disabled={camp.status === 'archived'}
                        >
                          <div className="w-2 h-2 rounded-full bg-slate-500 mr-2"></div>
                          Archived
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-bold">
                        ৳{camp.raisedAmount || 0} / <span className="text-slate-400">৳{camp.goalAmount || 0}</span>
                      </p>
                      <p className="text-[10px] text-slate-400">{camp.donorsCount || 0} donors</p>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* 👁️ VIEW DETAILS */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { 
                          setSelectedCampaign(camp); 
                          setIsDetailDialogOpen(true); 
                        }}
                      >
                        <Eye size={16} className="text-blue-500" />
                      </Button>
                      
                      {/* 🗑️ DELETE */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:text-red-500" 
                        onClick={() => handleDelete(camp._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ❌ REJECT DIALOG */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Campaign</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting: <strong>"{selectedCampaign?.title}"</strong>
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Write why this campaign is being rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={!rejectionReason.trim() || actionLoading === selectedCampaign?._id}
            >
              {actionLoading === selectedCampaign?._id && (
                <RefreshCw className="animate-spin mr-2" size={14}/>
              )}
              Reject Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 👁️ DETAIL DIALOG */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Campaign Full Overview</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              {/* Images */}
              {selectedCampaign.images && selectedCampaign.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedCampaign.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      className="w-full h-40 object-cover rounded-lg border" 
                      alt={`Campaign image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold">{selectedCampaign.title}</h2>
                <p className="text-slate-600 text-sm whitespace-pre-wrap">
                  {selectedCampaign.description || "No description provided"}
                </p>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                <p><strong>Item Type:</strong> {selectedCampaign.item}</p>
                <p><strong>Category:</strong> {selectedCampaign.category?.name || 'N/A'}</p>
                <p><strong>Goal Amount:</strong> ৳{selectedCampaign.goalAmount || 0}</p>
                <p><strong>Raised Amount:</strong> ৳{selectedCampaign.raisedAmount || 0}</p>
                <p><strong>Donors Count:</strong> {selectedCampaign.donorsCount || 0}</p>
                <p><strong>Creator:</strong> {selectedCampaign.creator?.name || 'Unknown'}</p>
              </div>
              
              {/* Status Badges */}
              <div className="flex gap-3">
                {getModerationBadge(selectedCampaign.moderationStatus)}
                {getStatusBadge(selectedCampaign.status)}
              </div>
              
              {/* Rejection Reason if exists */}
              {selectedCampaign.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-600">{selectedCampaign.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}