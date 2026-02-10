export type IJobStatus = 'pending' | 'approved' | 'rejected';

export interface IJob {
  _id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  category: string;
  salaryRange?: string;
  status: IJobStatus;
  postedBy: {
    _id: string;
    name: string;
    profilePicture?: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}