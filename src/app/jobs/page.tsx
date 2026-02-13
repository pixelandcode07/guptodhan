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
      next: { revalidate: 60 }, // ISR: Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const json: ApiResponse<IJob[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
            <p className="mt-2 text-gray-600">Find your dream job from our latest listings.</p>
          </div>
          <Link 
            href="/jobs/create" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Post a Job
          </Link>
        </div>

        {/* Job List */}
        <div className="grid gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        {job.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {job.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                        {job.companyName}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        {job.location}
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center font-medium text-green-600">
                          <Banknote className="w-4 h-4 mr-1.5" />
                          {job.salaryRange}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center">
                    <Link 
                      href={`/jobs/${job._id}`}
                      className="group flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      View Details
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}