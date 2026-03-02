// D:\Guptodhan Project\guptodhan\src\app\general\view\all\notifications\page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from "@/components/TableHelper/data-table";
import { notification_columns } from "@/components/TableHelper/notification_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export default function ViewAllNotificationsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/v1/notifications/my-notifications');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="m-5 p-5 border bg-white shadow-sm">
      <div className="mb-6">
        <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-4">
          View All Previous Push Notifications
        </h1>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm font-medium">Search:</span>
          <Input type="text" className="border border-gray-300" placeholder="Search title..." />
        </div>
        
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 w-full md:w-auto">
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Old Notifications
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <DataTable columns={notification_columns} data={data} />
      )}
    </div>
  );
}