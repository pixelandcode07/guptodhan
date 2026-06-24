'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/TableHelper/data-table';
import { getSystemUsersColumns, SystemUserRow } from '@/components/TableHelper/system_users_columns';
import { confirmDelete } from '@/components/ReusableComponents/ConfirmToast';

export default function SystemUsersClient({ initialUsers }: { initialUsers: SystemUserRow[] }) {
  const [users, setUsers] = useState<SystemUserRow[]>(initialUsers || []);
  
  // Create User Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phoneNumber: '', password: '', role: 'user' });

  // ==========================================
  //  Single Actions
  // ==========================================
  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      const res = await axios.patch(`/api/v1/users/${id}`, { isActive: newStatus });
      if (res.data.success) {
        toast.success(`User status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: newStatus, updatedAt: new Date().toISOString() } : u));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await axios.patch(`/api/v1/users/${id}`, { role: newRole });
      if (res.data.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole, updatedAt: new Date().toISOString() } : u));
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirmDelete("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`/api/v1/users/${id}`);
      toast.success("User deleted successfully!");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // ==========================================
  //  Bulk Actions
  // ==========================================
  const handleBulkDelete = async (selectedRows: SystemUserRow[]) => {
    if (selectedRows.length === 0) return;
    const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} users?`);
    if (!isConfirmed) return;

    const toastId = toast.loading(`Deleting ${selectedRows.length} users...`);
    try {
        const promises = selectedRows.map(row => axios.delete(`/api/v1/users/${row._id}`));
        await Promise.all(promises);

        const deletedIds = selectedRows.map(r => r._id);
        setUsers(prev => prev.filter(u => !deletedIds.includes(u._id)));
        toast.success("Users deleted successfully!", { id: toastId });
    } catch (error) {
        toast.error("Failed to delete some users.", { id: toastId });
    }
  };

  const handleBulkStatusChange = async (selectedRows: SystemUserRow[], statusStr: 'active' | 'inactive') => {
    if (selectedRows.length === 0) return;
    const isActive = statusStr === 'active';
    const toastId = toast.loading(`Marking ${selectedRows.length} users as ${statusStr}...`);

    try {
        const promises = selectedRows.map(row => axios.patch(`/api/v1/users/${row._id}`, { isActive }));
        await Promise.all(promises);

        const updatedIds = selectedRows.map(r => r._id);
        setUsers(prev => prev.map(u => 
            updatedIds.includes(u._id) ? { ...u, isActive, updatedAt: new Date().toISOString() } : u
        ));
        toast.success(`Users marked as ${statusStr} successfully!`, { id: toastId });
    } catch (error) {
        toast.error("Failed to update status.", { id: toastId });
    }
  };

  // ==========================================
  //  Create New User (Admin Feature)
  // ==========================================
  const handleCreateUser = async () => {
    if (!newUser.name || (!newUser.email && !newUser.phoneNumber) || !newUser.password) {
        return toast.error("Name, Password, and either Email or Phone are required.");
    }
    setIsCreating(true);
    try {
        // Calling the registration endpoint (or admin create endpoint if you have one)
        // Note: For simplicity, we are hitting the standard verify/create logic or a direct creation endpoint.
        // Assuming your backend has a direct way for admin to bypass OTP. 
        // If not, you might need to create an endpoint in user.controller.ts for Admin direct creation.
        
        // Let's assume you've added an admin-specific create endpoint or we use a workaround
        const res = await axios.post('/api/v1/users/admin-create', newUser); 
        
        if(res.data.success) {
            toast.success("User created successfully!");
            setShowCreateModal(false);
            setNewUser({ name: '', email: '', phoneNumber: '', password: '', role: 'user' });
            
            // Add to table instantly
            const addedUser = res.data.data;
            setUsers([{
                _id: addedUser._id,
                sl: 1, // Will be re-indexed below
                name: addedUser.name,
                email: addedUser.email,
                phoneNumber: addedUser.phoneNumber,
                role: addedUser.role,
                isActive: addedUser.isActive,
                createdAt: addedUser.createdAt,
                updatedAt: addedUser.updatedAt
            }, ...users]);
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to create user.");
    } finally {
        setIsCreating(false);
    }
  };

  const columns = getSystemUsersColumns(handleDelete, handleStatusChange, handleRoleChange);

  // Fix Serial Numbers on the fly
  const indexedUsers = users.map((u, i) => ({ ...u, sl: i + 1 }));

  return (
    <div className="space-y-4">
      {/* Top Header with Create Button */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
         <div>
            <h1 className="text-xl font-bold text-gray-800">System Users List</h1>
            <p className="text-sm text-gray-500">Manage all registered users, vendors, and providers</p>
         </div>
         <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add New User
         </Button>
      </div>

      {/* Main Data Table */}
      <DataTable 
          columns={columns} 
          data={indexedUsers} 
          setData={setUsers}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
      />

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                <Input value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input value={newUser.phoneNumber} onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})} placeholder="017XXXXXXX" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Password <span className="text-red-500">*</span></label>
                <Input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} placeholder="******" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Role <span className="text-red-500">*</span></label>
                <select 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                    <option value="service-provider">Service Provider</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreateUser} disabled={isCreating}>
                {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}