'use client';

import { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import BreadcrumbNav from '../ReusableComponents/BreadcrumbNav';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import UserDropdown from './Components/UserDropdown';
import { SITE_CONFIG } from '@/lib/config/siteConfig';
import { toast } from 'sonner';

export default function DashNavbar() {
  const [loading, setLoading] = useState(false);

  const handleFlushCache = async () => {
    if (!confirm('Are you sure you want to clear all Redis cache?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/redis/flush', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Redis cache cleared successfully!');
      } else {
        toast.error('Failed to clear cache');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="flex justify-between p-4 items-center border-[#e3e8f3] border-b-[1px]">
      {/* Left side */}
      <div className="flex justify-center items-center gap-2">
        <SidebarTrigger />
        <BreadcrumbNav />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Redis Flush Button */}
        <Button
          variant="outline"
          onClick={handleFlushCache}
          disabled={loading}
          title="Clear Redis Cache"
          className="text-red-500 border-red-300 hover:bg-red-50"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          {loading ? 'Clearing...' : 'Clear Cache'}
        </Button>

        {/* Visit Website Button */}
        <div className="block">
          <Button variant={'VisitWeb'}>
            <Send className="mr-1" />
            <Link href={SITE_CONFIG.mainUrl}>Visit Website</Link>
          </Button>
        </div>

        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </nav>
  );
}