'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

// ✅ বিশাল ক্যাটাগরি লিস্ট (A-Z সাজানো)
const JOB_CATEGORIES = [
  "Accounting & Finance",
  "Administrative & Data Entry",
  "Agriculture & Farming",
  "Architecture & Engineering",
  "Art, Design & Creative",
  "Bank & Non-Bank Fin. Inst.",
  "Beauty, Spa & Salon",
  "Chef, Cook & Restaurant",
  "Construction & Labor",
  "Customer Support & Call Center",
  "Delivery & Logistics",
  "Driver & Transport",
  "Education & Teaching",
  "Electrician, Plumber & Mechanic",
  "Garments & Textile",
  "Government Jobs",
  "Healthcare, Pharma & Medical",
  "Hotel, Tourism & Hospitality",
  "HR & Recruitment",
  "IT & Software",
  "Legal Services",
  "Maid, Caregiver & Housekeeping",
  "Management & Leadership",
  "Marketing, Sales & Business",
  "Media, News & Event Mgt.",
  "NGO & Development",
  "Security & Safety",
  "Skilled Trade & Technician",
  "Writing, Content & Editing",
  "Others" // ✅ সবার শেষে Others রাখা হয়েছে
];

export default function CreateJobPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    category: '',
    salaryRange: '',
    contactEmail: '', 
    contactPhone: '', 
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': (session?.user as any)?.id || '', 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Job posted successfully! Waiting for admin approval.');
        router.push('/jobs');
        router.refresh();
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Failed to post job.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Job Title *</label>
              <input name="title" required onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Senior Developer / Driver" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name *</label>
              <input name="companyName" required onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Tech Ltd. / Personal" />
            </div>
          </div>

          {/* Location & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location *</label>
              <input name="location" required onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Dhaka, Gulshan" />
            </div>
            
            {/* ✅ Updated Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select 
                name="category" 
                required 
                onChange={handleChange} 
                defaultValue="" 
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="" disabled>Select Category</option>
                {JOB_CATEGORIES.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contact Email *</label>
              <input type="email" name="contactEmail" required onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="hr@company.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contact Phone *</label>
              <input type="tel" name="contactPhone" required onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="01XXXXXXXXX" />
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Salary Range</label>
            <input name="salaryRange" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. 15k - 25k BDT / Negotiable" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Job Description *</label>
            <textarea name="description" required rows={6} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Describe the job responsibilities and requirements..." />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Posting...' : 'Submit Job Post'}
          </button>
        </form>
      </div>
    </div>
  );
}