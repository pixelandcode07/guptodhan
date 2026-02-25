import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building2, Banknote, Calendar, ArrowLeft, Mail, PhoneCall, Briefcase } from 'lucide-react';
import { IJob, ApiResponse } from '@/types/job';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// ✅ Import Client Components
import { ApplyButton, ShareButton } from '../components/getPubliceSingleJobClint';

// Base URL Helper
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return 'http://localhost:3000';
};

// Fetch Function
async function getJob(id: string): Promise<IJob | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/v1/public/job/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json: ApiResponse<IJob> = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return null;
  }
}

// Helper for Name Initials
const getInitials = (name: string) => name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'JP';

// Main Page Component
export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* ✅ Exactly aligned with NavMain & JobsPage */}
      <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto px-4">
        
        {/* Navigation */}
        <Link 
          href="/jobs" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all jobs
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-6 md:p-10 border-b border-gray-100 bg-white relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-70 pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-8 relative z-10">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* Category Badge */}
                  <span className="px-3 py-1 text-xs font-bold text-[#00005E] bg-blue-50 rounded-md border border-blue-100 uppercase tracking-wider">
                    {job.category}
                  </span>
                  <span className="flex items-center text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                     <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                     Posted on {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                  {job.title}
                </h1>
                
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-600">
                  <div className="flex items-center font-medium">
                    <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                    {job.companyName}
                  </div>
                  <div className="flex items-center font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-red-400" />
                    {job.location}
                  </div>
                </div>
              </div>

              {/* Action Card with Client Apply Button */}
              <div className="w-full lg:w-72 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner flex flex-col items-center justify-center shrink-0">
                {job.salaryRange && (
                   <div className="mb-5 text-center w-full">
                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Salary Offer</p>
                     <p className="text-xl font-extrabold text-green-600 flex items-center justify-center gap-1.5 bg-white py-2 rounded-lg border border-green-100 shadow-sm">
                       <Banknote className="w-5 h-5" />
                       {job.salaryRange}
                     </p>
                   </div>
                 )}
                 <div className="w-full">
                   {/* 🔥 Client Component */}
                   <ApplyButton email={job.contactEmail} phone={job.contactPhone} />
                 </div>
              </div>
            </div>
          </div>

          {/* Body Content Section */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Job Description (Left - 2 Columns) */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 border-b pb-3">
                <Briefcase className="w-5 h-5 text-blue-600" /> Job Description
              </h3>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {job.description}
              </div>
            </div>

            {/* Sidebar Info (Right - 1 Column) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Recruiter Info */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider border-b pb-2">Hiring Manager</h4>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-blue-50 shadow-sm">
                    <AvatarImage src={job.postedBy?.profilePicture} className="object-cover" />
                    <AvatarFallback className="bg-[#00005E] text-white text-sm font-bold">
                      {getInitials(job.postedBy?.name || 'Recruiter')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-base font-bold text-gray-900 truncate">{job.postedBy?.name || 'Hidden Profile'}</p>
                    <p className="text-xs font-medium text-blue-600 mt-0.5">Verified Recruiter ✓</p>
                  </div>
                </div>
              </div>

              {/* Direct Contact Info (If public) */}
              <div className="bg-[#f8faff] p-6 rounded-xl border border-blue-100 shadow-sm">
                 <h4 className="text-sm font-bold text-[#00005E] mb-5 uppercase tracking-wider border-b border-blue-200 pb-2">Contact Info</h4>
                 <ul className="space-y-4">
                   <li className="flex items-start gap-3 text-sm text-gray-700">
                     <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                     <span className="break-all font-medium">{job.contactEmail}</span>
                   </li>
                   <li className="flex items-start gap-3 text-sm text-gray-700">
                     <PhoneCall className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                     <span className="font-medium">{job.contactPhone}</span>
                   </li>
                 </ul>
              </div>

            </div>
          </div>

          {/* Footer Section */}
          <div className="px-6 md:px-10 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="text-xs font-medium text-gray-400">
               Job ID: <span className="text-gray-500 font-mono">{job._id}</span>
             </div>
             
             <div className="flex gap-3">
               {/* 🔥 Client Component */}
               <ShareButton title={job.title} company={job.companyName} />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}