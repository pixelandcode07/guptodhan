// D:\Guptodhan Project\guptodhan\src\app\general\view\all\devices\page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Smartphone, Monitor, Globe } from "lucide-react";

export default function ViewAllDevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('/api/v1/devices');
        const result = await res.json();
        if (result.success) setDevices(result.data);
      } catch (err) {
        console.error("Failed to load devices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  return (
    <div className="m-5 p-5 bg-white border rounded shadow-sm">
      <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-4 mb-6">
        Registered Devices List ({devices.length})
      </h1>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-3 border">Device Type</th>
                <th className="p-3 border">FCM Token</th>
                <th className="p-3 border">User ID</th>
                <th className="p-3 border">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device: any) => (
                <tr key={device._id} className="text-sm hover:bg-gray-50">
                  <td className="p-3 border flex items-center gap-2">
                    {device.deviceType === 'android' ? <Smartphone size={16}/> : <Globe size={16}/>}
                    {device.deviceType}
                  </td>
                  <td className="p-3 border font-mono text-xs truncate max-w-[200px]" title={device.fcmToken}>
                    {device.fcmToken}
                  </td>
                  <td className="p-3 border">{device.userId || 'Guest User'}</td>
                  <td className="p-3 border">{new Date(device.lastUsed).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}