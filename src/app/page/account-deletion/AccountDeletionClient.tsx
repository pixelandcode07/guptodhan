'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react'; // ✅ Logout-এর জন্য signOut ইমপোর্ট করা হলো

export default function AccountDeletionClient() {
  const [confirmationText, setConfirmationText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const isConfirmed = confirmationText === 'DELETE';

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setStatus('loading');
    setMessage('');

    try {
      // Sending DELETE request to the profile API
      const response = await fetch('/api/v1/profile/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your account has been deleted successfully.');
        
        // ✅ 2 সেকেন্ড পর সেশন ক্লিয়ার করে হোমপেজে পাঠানো হবে
        setTimeout(async () => {
          await signOut({ redirect: false }); // NextAuth এর সেশন ডিলিট
          window.location.href = '/'; // হোমপেজে রিডাইরেক্ট
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to delete account. Are you sure you are logged in?');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error! Please check your internet connection.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50 border border-green-200 rounded-2xl text-center shadow-sm">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Account Deleted!</h3>
        <p className="text-green-700">{message}</p>
        <p className="text-sm text-green-600 mt-4 animate-pulse">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-800">Account Deletion Warning</h2>
          <p className="text-red-600 mt-1 text-sm">
            Once you delete your account, your profile, order history, and all data will be permanently removed. This action cannot be undone.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleDeleteAccount} className="p-6 space-y-6">
        {status === 'error' && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {message}
          </div>
        )}

        <div className="space-y-3">
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
            To confirm, type <span className="font-bold text-red-600 select-all">DELETE</span> in the box below:
          </label>
          <input
            type="text"
            id="confirm"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="DELETE"
            disabled={status === 'loading'}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={!isConfirmed || status === 'loading'}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Trash2 className="w-5 h-5" />
              Permanently Delete Account
            </>
          )}
        </button>
      </form>
    </div>
  );
}