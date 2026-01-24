export type IJobStatus = 'pending' | 'approved' | 'rejected';

export interface IJob {
  title: string;
  description: string;
  companyName: string;
  location: string;
  category: string;
  salaryRange?: string;
  status?: IJobStatus; 
  postedBy?: string;
}