'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { getSystemUsersColumns, User } from '@/components/TableHelper/system_users_columns';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface UserTableProps {
    data: User[];
}

export default function UserTabile({ data }: UserTableProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [users, setUsers] = useState(data);

  const handleStatusToggle = async (id: string, newStatus: boolean) => {
    if (!token) return toast.error("Authentication failed. Please log in again.");
    
    toast.info(`Updating status for user ${id}...`);
    try {
        await axios.patch(`/api/v1/users/${id}`, { isActive: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("User status updated successfully!");
        // Update the local state to reflect the change immediately
        setUsers(prev => prev.map(user => 
            user._id === id ? { ...user, isActive: newStatus } : user
        ));
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to update user status.");
    }
  };

  const handleDelete = (id: string) => {
    if (!token) return toast.error("Authentication failed. Please log in again.");
    
    toast("Are you sure you want to delete this user?", {
        description: "This action cannot be undone.",
        action: {
            label: "Delete",
            onClick: async () => {
                try {
                    await axios.delete(`/api/v1/users/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('User deleted successfully!');
                    // Remove the user from the local state
                    setUsers(prev => prev.filter(user => user._id !== id));
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to delete user.');
                }
            }
        },
        cancel: { 
            label: "Cancel",
            onClick: () => {}, // Required for sonner
        }
    });
  };

  // Call the function to get the columns and pass the action handlers
  const columns = getSystemUsersColumns(handleStatusToggle, handleDelete);

  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}