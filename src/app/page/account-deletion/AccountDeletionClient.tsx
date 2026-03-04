'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, CheckCircle, Loader2, Mail, Phone } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AccountDeletionClient() {
  const [identifier, setIdentifier] = useState('');
  const [reason, setReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // The button will only be active if identifier is provided and user types 'DELETE'
  const isConfirmed = confirmationText === 'DELETE' && identifier.trim().length > 0;

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setStatus('loading');
    setMessage('');

    try {
      // Sending DELETE request
      // Note: We are sending the identifier and reason in the body. 
      // Ensure your backend controller handles this if you want to save the reason.
      const response = await fetch('/api/v1/profile/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier, 
          reason 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your account has been deleted successfully.');
        
        // Clear session and redirect to home after 2 seconds
        setTimeout(async () => {
          await signOut({ redirect: false });
          window.location.href = '/'; 
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
        <div className="bg-red-100 p-3 rounded-full shrink-0">
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
      <form onSubmit={handleDeleteAccount} className="p-6 space-y-5">
        {status === 'error' && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        {/* Email or Phone Input */}
        <div className="space-y-1.5">
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Registered Email or Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="h-5 w-5 hidden sm:block" />
              <Phone className="h-4 w-4 sm:hidden" />
            </div>
            <input
              type="text"
              id="identifier"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-400"
              placeholder="e.g. user@example.com or 017XXXXXXXX"
              disabled={status === 'loading'}
            />
          </div>
        </div>

        {/* Reason Textarea (Optional) */}
        <div className="space-y-1.5">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason for leaving (Optional)
          </label>
          <textarea
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-400 resize-none"
            placeholder="Please tell us why you are deleting your account..."
            disabled={status === 'loading'}
          />
        </div>

        <hr className="border-gray-100 my-4" />

        {/* Confirmation Input */}
        <div className="space-y-1.5">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isConfirmed || status === 'loading'}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 mt-2"
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