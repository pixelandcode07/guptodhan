'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Notification {
  _id: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/v1/admin/notifications');
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // প্রতি ১ মিনিট পর পর নতুন নোটিফিকেশন চেক করবে (Polling)
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার জন্য
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string, link: string) => {
    setIsOpen(false);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    await fetch('/api/v1/admin/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id }),
    });
    router.push(link);
  };

  const markAllAsRead = async () => {
    setNotifications([]);
    await fetch('/api/v1/admin/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id: 'all' }),
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id}
                  onClick={() => markAsRead(notif._id, notif.link)}
                  className="p-4 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <p className="text-sm text-gray-800 font-medium leading-snug">{notif.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                      View <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}