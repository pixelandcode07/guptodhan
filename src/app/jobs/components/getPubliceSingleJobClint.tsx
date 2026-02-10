'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Phone, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// ==========================================
// 1. APPLY BUTTON (Client Component)
// ==========================================
export function ApplyButton({ email, phone }: { email: string; phone: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full py-3 px-4 bg-[#0097e9] hover:bg-[#007bb5] text-white font-bold rounded-lg transition shadow-lg shadow-blue-200 cursor-pointer">
          Apply Now
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">Contact Information</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-center text-gray-500 text-sm">
            Please contact the recruiter directly using the information below.
          </p>
          
          {/* Email Section */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Mail className="w-5 h-5 text-[#0097e9]" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-500 font-medium">Send CV via Email</p>
              <a href={`mailto:${email}`} className="text-sm font-bold text-gray-900 hover:text-[#0097e9] hover:underline truncate block">
                {email}
              </a>
            </div>
          </div>

          {/* Phone Section */}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Call for Details</p>
              <a href={`tel:${phone}`} className="text-sm font-bold text-gray-900 hover:text-green-600 hover:underline">
                {phone}
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// 2. SHARE BUTTON (Client Component)
// ==========================================
export function ShareButton({ title, company }: { title: string, company: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Check if running in browser
    if (typeof window === 'undefined') return;

    const shareData = {
      title: title,
      text: `Check out this job: ${title} at ${company}`,
      url: window.location.href,
    };

    // Mobile Native Share
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Desktop Fallback (Clipboard)
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Job link copied to clipboard!");
        
        // Reset icon after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy link.");
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 text-gray-600 hover:text-[#0097e9] transition text-sm font-medium"
      title="Share this job"
    >
      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
      {copied ? <span className="text-green-600">Copied!</span> : <span>Share</span>}
    </button>
  );
}