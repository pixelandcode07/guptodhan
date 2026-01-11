import { Job } from './job.model';
import { IJob } from './job.interface';

// User job post korbe
const createJobIntoDB = async (payload: IJob) => {
  return await Job.create(payload);
};

// Public sudhu approved gulo dekhbe
const getApprovedJobsFromDB = async () => {
  return await Job.find({ status: 'approved' }).sort({ createdAt: -1 });
};

// Admin panel-er jonno shob status-er job
const getAllJobsForAdminFromDB = async () => {
  return await Job.find().sort({ createdAt: -1 });
};

const updateJobStatusInDB = async (id: string, status: string) => {
  return await Job.findByIdAndUpdate(id, { status }, { new: true });
};

const getSingleJobByIdFromDB = async (id: string) => {
  return await Job.findOne({ _id: id, status: 'approved' }).populate('postedBy', 'name profilePicture'); 
};
export const JobService = {
  createJobIntoDB,
  getApprovedJobsFromDB,
  getAllJobsForAdminFromDB,
  updateJobStatusInDB,
  getSingleJobByIdFromDB,
};