'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

interface IJob {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  category: string;
  salaryRange?: string;
  contactEmail: string;
  contactPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  postedBy?: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export default function JobManagementClient() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all jobs for Admin
  const fetchJobs = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/job', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      toast.error('Failed to load jobs data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  // Handle Status Update
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await axios.patch(`/api/v1/job/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        toast.success(`Job status updated to ${newStatus}`);
        // Update local state to reflect changes instantly
        setJobs((prev) => 
          prev.map((job) => job._id === id ? { ...job, status: newStatus as any } : job)
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm min-h-screen">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="text-blue-600" /> Manage Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Approve, reject or view jobs posted by users.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md font-semibold">
          Total Jobs: {jobs.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-600 text-sm">
              <th className="p-4 font-semibold">Job Info</th>
              <th className="p-4 font-semibold">Posted By</th>
              <th className="p-4 font-semibold">Contact Details</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">No jobs found.</td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Job Info */}
                  <td className="p-4">
                    <div className="font-semibold text-gray-800 text-base">{job.title}</div>
                    <div className="text-sm text-gray-600">{job.companyName}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={12} /> {job.location}
                    </div>
                    <div className="mt-1">
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {job.category}
                      </span>
                    </div>
                  </td>

                  {/* Posted By */}
                  <td className="p-4">
                    {job.postedBy ? (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 relative rounded-full overflow-hidden border bg-gray-100">
                          {job.postedBy.profilePicture ? (
                            <Image src={job.postedBy.profilePicture} alt="User" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                              {job.postedBy.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{job.postedBy.name}</p>
                          <p className="text-xs text-gray-500">{job.postedBy.email}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unknown User</span>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={14} className="text-gray-400" /> {job.contactEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone size={14} className="text-gray-400" /> {job.contactPhone}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${job.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                      ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${job.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {job.status}
                    </span>
                  </td>

                  {/* Action Dropdown */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {updatingId === job._id ? (
                        <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                      ) : (
                        <select
                          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none cursor-pointer"
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}