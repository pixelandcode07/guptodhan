import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building2, Banknote, Calendar, ArrowLeft } from 'lucide-react';
import { IJob, ApiResponse } from '@/types/job';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// ✅ Import Client Components from the specific path
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link href="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-gray-100 bg-white">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  {/* Category Badge */}
                  <span className="px-3 py-1 text-xs font-semibold text-[#0097e9] bg-blue-50 rounded-full border border-blue-100">
                    {job.category}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                     <Calendar className="w-3 h-3 mr-1" />
                     {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">{job.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{job.companyName}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Card with Client Apply Button */}
              <div className="w-full md:w-64 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {job.salaryRange && (
                   <div className="mb-4 text-center">
                     <p className="text-xs text-gray-500 mb-1">Salary Range</p>
                     <p className="text-lg font-bold text-green-700 flex items-center justify-center gap-1">
                       <Banknote className="w-5 h-5" />
                       {job.salaryRange}
                     </p>
                   </div>
                 )}
                 {/* 🔥 Using Client Component */}
                 <ApplyButton email={job.contactEmail} phone={job.contactPhone} />
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Description</h3>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {job.description}
              </div>
            </div>

            {/* Recruiter Section */}
            <div className="md:col-span-1">
              <div className="bg-[#0097e9]/10 p-5 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Recruiter Info</h4>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={job.postedBy?.profilePicture} />
                    <AvatarFallback className="bg-[#0097e9] text-white text-xs">
                      {getInitials(job.postedBy?.name || 'Recruiter')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{job.postedBy?.name}</p>
                    <p className="text-xs text-gray-500">Hiring Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Client Share Button */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
             <div className="text-xs text-gray-400">ID: {job._id}</div>
             
             {/* 🔥 Using Client Component */}
             <ShareButton title={job.title} company={job.companyName} />
          </div>
        </div>
      </div>
    </div>
  );
}