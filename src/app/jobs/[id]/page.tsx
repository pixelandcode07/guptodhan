import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building2, Banknote, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { IJob, ApiResponse } from '@/types/job';

// Helper to get Base URL
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return 'http://localhost:3000';
};

// Fetch Single Job
async function getJob(id: string): Promise<IJob | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/v1/public/job/${id}`, {
      cache: 'no-store', // SSR: Always fetch fresh data
    });

    if (!res.ok) return null;

    const json: ApiResponse<IJob> = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link href="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Job Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-blue-800 bg-blue-100 rounded-full">
                  {job.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{job.title}</h1>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="font-medium">{job.companyName}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Apply Button & Salary */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                 <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-200">
                   Apply Now
                 </button>
                 {job.salaryRange && (
                   <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                     <p className="text-xs text-green-600 uppercase font-bold tracking-wider">Salary</p>
                     <p className="text-green-800 font-bold flex items-center justify-center gap-1">
                       <Banknote className="w-4 h-4" />
                       {job.salaryRange}
                     </p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Job Description</h3>
            <div 
              className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap"
            >
              {job.description}
            </div>
          </div>

          {/* Footer / Share */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
             <p className="text-sm text-gray-500">
               Job ID: <span className="font-mono text-gray-400">{job._id}</span>
             </p>
             <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
               <Share2 className="w-4 h-4" />
               <span className="text-sm font-medium">Share this job</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}