// D:\Guptodhan Project\guptodhan\src\app\general\send\notification\page\page.tsx
'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner'; // আপনি চাইলে অন্য কোনো নোটিফিকেশন লাইব্রেরি ব্যবহার করতে পারেন

function NotificationForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image: '',
  });

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      alert("Title and Message are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/notifications/send-to-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Notification Sent Successfully!");
        setFormData({ title: '', message: '', image: '' });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-[#e4e7eb] rounded-xs bg-white shadow-sm">
      <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
        <p className="text-sm font-medium">Send Push Notification to Mobile Devices</p>
      </header>
      <div className='p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {/* Title Input */}
          <div>
            <label className='mb-1 block text-sm'>Notification Title *</label>
            <input 
              className='h-10 w-full border border-gray-300 rounded px-3 focus:outline-blue-500' 
              placeholder='Notification Title' 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Image URL Input */}
          <div>
            <label className='mb-1 block text-sm'>Image URL (Optional)</label>
            <input 
              className='h-10 w-full border border-gray-300 rounded px-3 focus:outline-blue-500' 
              placeholder='https://example.com/image.png' 
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          {/* Description Textarea */}
          <div className='md:col-span-2'>
            <label className='mb-1 block text-sm'>Notification Description *</label>
            <textarea 
              className='w-full h-28 border border-gray-300 rounded px-3 py-2 focus:outline-blue-500' 
              placeholder='Write Description Here' 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <div className='md:col-span-2'>
            <button 
              disabled={loading}
              onClick={handleSend}
              className='bg-blue-600 hover:bg-blue-700 text-white rounded px-4 h-10 flex items-center gap-2 disabled:bg-gray-400 transition-colors'
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              <span>{loading ? 'Sending...' : 'Send Push Notification'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SendNotificationPage() {
  return (
    <div className='max-w-[1400px] mx-auto m-5 md:m-10'>
      <NotificationForm />
    </div>
  );
}