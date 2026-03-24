'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, Users, Smartphone, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SendNotificationPage() {
  const [loading, setLoading] = useState(false);
  const [sendTo, setSendTo] = useState<'all' | 'specific'>('all');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image: '',
    fcmToken: '',
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });

    const apiUrl = sendTo === 'all' 
      ? '/api/v1/notifications/send-to-all' //
      : '/api/v1/notifications/send-to-device'; //

    try {
      const response = await axios.post(apiUrl, formData); // Axios integration

      if (response.data.success) {
        setStatus({ type: 'success', msg: response.data.message || 'Notification sent successfully!' });
        setFormData({ title: '', message: '', image: '', fcmToken: '' });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto m-5 md:m-10'>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Send size={24} />
            Guptodhan Notification Center
          </h1>
          <p className="text-blue-100 text-sm mt-1">Manage and push messages to registered devices securely.</p>
        </div>

        <form onSubmit={handleSend} className="p-8">
          {/* Target Selection Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-8 max-w-sm">
            <button
              type="button"
              onClick={() => setSendTo('all')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${sendTo === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users size={16} /> Broadcast All
            </button>
            <button
              type="button"
              onClick={() => setSendTo('specific')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${sendTo === 'specific' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Smartphone size={16} /> Specific Device
            </button>
          </div>

          {/* Feedback Messages */}
          {status.type && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-medium">{status.msg}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Specific Device Token Input */}
            {sendTo === 'specific' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target FCM Token *</label>
                <input
                  required
                  type="text"
                  className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-xs"
                  placeholder="e.g. fXz2a8Lp1_..."
                  value={formData.fcmToken}
                  onChange={(e) => setFormData({ ...formData, fcmToken: e.target.value })}
                />
              </div>
            )}

            {/* Notification Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Title *</label>
              <input
                required
                type="text"
                className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter compelling title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Image URL with Icon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon size={16} className="text-gray-400" /> Image URL (Optional)
              </label>
              <input
                type="url"
                className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="https://guptodhan.com/banner.png"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            {/* Notification Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Description *</label>
              <textarea
                required
                className="w-full h-32 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Write your message detail here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className={`w-full h-12 rounded-lg font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Send Notification Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}