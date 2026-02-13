export type IJobStatus = 'pending' | 'approved' | 'rejected';

export interface IJob {
  title: string;
  description: string;
  companyName: string;
  location: string;
  category: string;
  salaryRange?: string;
  contactEmail: string; // ✅ নতুন ফিল্ড
  contactPhone: string; // ✅ নতুন ফিল্ড
  status?: IJobStatus; 
  postedBy?: string;
}