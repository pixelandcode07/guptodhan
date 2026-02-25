import Link from 'next/link';
import { MapPin, Building2, Banknote, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { IJob, ApiResponse } from '@/types/job';

// Helper to get Base URL
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return 'http://localhost:3000';
};

// Fetch Jobs
async function getJobs(): Promise<IJob[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/v1/public/job`, {
      cache: 'no-store', // 🔥 CRITICAL FIX: Disable caching so it always fetches fresh data with the 'status' field
    });

    if (!res.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const json: ApiResponse<IJob[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export default async function JobsPage() {
  const allJobs = await getJobs();
  
  // ✅ Only show jobs that have status 'approved'
  const approvedJobs = allJobs.filter((job) => job.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* ✅ Exact Alignment matching NavMain */}
      <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
            <p className="mt-2 text-gray-600">Find your dream job from our latest listings.</p>
          </div>
          <Link 
            href="/jobs/create" 
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-[#00005E] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-[#000045] focus:outline-none focus:ring-2 focus:ring-[#00005E] focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 shadow-md hover:shadow-lg"
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Post a Job
          </Link>
        </div>

        {/* Job List */}
        <div className="grid gap-6">
          {approvedJobs.length > 0 ? (
            approvedJobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 group"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold border border-blue-100">
                        {job.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-gray-600 mt-3">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="font-medium">{job.companyName}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        {job.location}
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          <Banknote className="w-4 h-4 mr-1.5" />
                          {job.salaryRange}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 md:mt-0 flex items-center justify-end md:pl-6 md:border-l border-gray-100">
                    <Link 
                      href={`/jobs/${job._id}`}
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:shadow-md w-full md:w-auto"
                    >
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                There are no approved jobs available right now. Check back later for exciting new opportunities.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}