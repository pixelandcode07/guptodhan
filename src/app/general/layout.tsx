'use client';
import Header from '@/Components/header';
import Sidebar from '@/Components/sideber';
import { useState } from 'react';

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen text-[#171717] bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 bg-[#F8F9FB] overflow-y-auto">
          <div className="bg-white pt-3 pb-3">{children}</div>
        </main>
      </div>
    </div>
  );
}
