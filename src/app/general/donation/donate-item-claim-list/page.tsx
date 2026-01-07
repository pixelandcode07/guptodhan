"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye, Trash2, Search, RefreshCw, ChevronDown,
  Package, Clock, CheckCircle, XCircle, Mail, Phone, User, Calendar
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Claim {
  _id: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  item?: {
    _id: string;
    title: string;
    images?: string[];
  };
  user?: {
    name: string;
    email: string;
  };
}

export default function ClaimListPage() {
  const { data: session } = useSession();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ✅ Fetch Claims
  const fetchClaims = async () => {
    try {
      setLoading(true);
      // @ts-ignore
      const token = session?.accessToken;
      if (!token) return;

      const res = await fetch('/api/v1/donation-claims', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.success) {
        setClaims(data.data);
        setFilteredClaims(data.data);
      } else {
        toast.error(data.message || 'Failed to load claims');
      }
    } catch (error) {
      toast.error('Network error while loading claims');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchClaims();
  }, [session]);

  // ✅ Filter Claims
  useEffect(() => {
    let filtered = claims;
    
    if (searchQuery) {
      filtered = filtered.filter(claim => 
        claim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.phone.includes(searchQuery) ||
        claim.item?.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }
    
    setFilteredClaims(filtered);
  }, [searchQuery, statusFilter, claims]);

  // ✅ Update Claim Status (Approve/Reject/Pending)
  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setActionLoading(id);
    
    try {
      // @ts-ignore
      const token = session?.accessToken;
      
      const res = await fetch(`/api/v1/donation-claims/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success(`✅ Claim ${newStatus} successfully!`);
        fetchClaims();
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

  // ✅ Delete Claim
  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this claim? This action cannot be undone.")) return;
    
    try {
      // @ts-ignore
      const token = session?.accessToken;
      
      const res = await fetch(`/api/v1/donation-claims/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success("🗑️ Claim deleted successfully");
        fetchClaims();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) { 
      toast.error("Network error during deletion");
      console.error(err);
    }
  };

  // Badge helpers
  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <Badge className="bg-green-500 text-white gap-1"><CheckCircle size={12}/> Approved</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-500 text-white gap-1"><XCircle size={12}/> Rejected</Badge>;
    return <Badge className="bg-yellow-500 text-black gap-1"><Clock size={12}/> Pending</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            📋 Donation Claim Requests
          </h1>
          <p className="text-slate-500 text-sm">Review and manage claim requests from users</p>
        </div>
        <Button onClick={fetchClaims} variant="outline" className="gap-2">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh List
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <Package className="text-blue-500" size={20} />
            <span className="text-2xl font-bold">{claims.length}</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Claims</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex justify-between items-center mb-2">
            <Clock className="text-yellow-500" size={20} />
            <span className="text-2xl font-bold">
              {claims.filter(c => c.status === 'pending').length}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Pending Review</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-green-500">
          <div className="flex justify-between items-center mb-2">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-2xl font-bold">
              {claims.filter(c => c.status === 'approved').length}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Approved</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-red-500">
          <div className="flex justify-between items-center mb-2">
            <XCircle className="text-red-500" size={20} />
            <span className="text-2xl font-bold">
              {claims.filter(c => c.status === 'rejected').length}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Rejected</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <Input 
            placeholder="Search by name, email, phone or item..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending Only</SelectItem>
            <SelectItem value="approved">Approved Only</SelectItem>
            <SelectItem value="rejected">Rejected Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[250px]">Item Requested</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  <p>Loading claims...</p>
                </TableCell>
              </TableRow>
            ) : filteredClaims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                  <Package className="mx-auto mb-3 text-slate-300" size={48} />
                  <p className="font-medium">No claim requests found</p>
                  <p className="text-sm mt-1">Claim requests will appear here once users submit them</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredClaims.map((claim) => (
                <TableRow key={claim._id} className="group hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border flex-shrink-0">
                        {claim.item?.images?.[0] ? (
                          <img src={claim.item.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <Package className="m-auto mt-3 text-slate-300" />
                        )}
                      </div>
                      <div className="max-w-[180px]">
                        <p className="font-semibold text-slate-800 truncate">
                          {claim.item?.title || 'Unknown Item'}
                        </p>
                        <p className="text-xs text-slate-400">ID: {claim._id.slice(-8)}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <User size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{claim.name}</p>
                        <p className="text-xs text-slate-500">{claim.user?.name || 'Guest User'}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        <span className="truncate max-w-[150px]" title={claim.email}>
                          {claim.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-400" />
                        <span>{claim.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <p className="max-w-[200px] truncate text-sm text-slate-600" title={claim.reason}>
                      {claim.reason}
                    </p>
                  </TableCell>
                  
                  <TableCell>
                    {/* ✅ STATUS DROPDOWN */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 gap-1 px-2"
                          disabled={actionLoading === claim._id}
                        >
                          {getStatusBadge(claim.status)}
                          <ChevronDown size={14} className="ml-1 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(claim._id, 'pending')}
                          disabled={claim.status === 'pending'}
                        >
                          <Clock size={14} className="text-yellow-600 mr-2" />
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(claim._id, 'approved')}
                          disabled={claim.status === 'approved'}
                        >
                          <CheckCircle size={14} className="text-green-600 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(claim._id, 'rejected')}
                          disabled={claim.status === 'rejected'}
                          className="text-red-600"
                        >
                          <XCircle size={14} className="mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={12} />
                      <span>{formatDate(claim.createdAt)}</span>
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
                          setSelectedClaim(claim); 
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
                        onClick={() => handleDelete(claim._id)}
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

      {/* 👁️ DETAIL DIALOG */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Claim Request Details</DialogTitle>
            <DialogDescription>Complete information about this claim request</DialogDescription>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="space-y-6 py-4">
              {/* Status & Date Header */}
              <div className="flex justify-between items-start pb-4 border-b">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-slate-500">Current Status</div>
                  {getStatusBadge(selectedClaim.status)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 mb-1">Submitted On</div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Calendar size={14} />
                    {formatDate(selectedClaim.createdAt)}
                  </div>
                </div>
              </div>

              {/* Item Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Package size={16} />
                  Requested Item
                </h3>
                <div className="flex items-center gap-3">
                  {selectedClaim.item?.images?.[0] && (
                    <img 
                      src={selectedClaim.item.images[0]} 
                      className="w-16 h-16 rounded-lg object-cover border"
                      alt=""
                    />
                  )}
                  <div>
                    <p className="text-blue-900 font-medium">{selectedClaim.item?.title || 'Unknown Item'}</p>
                    <p className="text-xs text-blue-700 mt-1">Item ID: {selectedClaim.item?._id}</p>
                  </div>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <User size={16} />
                  Applicant Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border rounded-lg p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">Full Name</p>
                    <p className="text-sm text-slate-900 font-medium">{selectedClaim.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">User Account</p>
                    <p className="text-sm text-slate-900">{selectedClaim.user?.name || 'Guest User'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Mail size={12} /> Email Address
                    </p>
                    <p className="text-sm text-slate-900">{selectedClaim.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Phone size={12} /> Phone Number
                    </p>
                    <p className="text-sm text-slate-900">{selectedClaim.phone}</p>
                  </div>
                </div>
              </div>

              {/* Reason for Claim */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Reason for Requesting</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedClaim.reason}
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              {selectedClaim.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleStatusChange(selectedClaim._id, 'approved');
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Approve Claim
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleStatusChange(selectedClaim._id, 'rejected');
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    <XCircle className="mr-2" size={16} />
                    Reject Claim
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}