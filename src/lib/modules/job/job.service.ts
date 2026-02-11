import mongoose from 'mongoose';
import { Job } from './job.model';
import { IJob } from './job.interface';

// 🔥🔥🔥 CRITICAL FIX 🔥🔥🔥
// এই লাইনটি থাকতেই হবে, নাহলে populate করার সময় "Schema hasn't been registered" এরর আসবে।
import "@/lib/modules/user/user.model"; 

const createJobIntoDB = async (payload: IJob) => {
  return await Job.create(payload);
};

// Public: Aggregation (Faster)
const getApprovedJobsFromDB = async () => {
  return await Job.aggregate([
    { $match: { status: 'approved' } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users', // MongoDB তে collection নাম always lowercase plural হয়
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedByDetails'
      }
    },
    { 
      $unwind: {
        path: '$postedByDetails',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        companyName: 1,
        location: 1,
        category: 1,
        salaryRange: 1,
        createdAt: 1,
        postedBy: {
          _id: '$postedByDetails._id',
          name: '$postedByDetails.name',
          profilePicture: '$postedByDetails.profilePicture'
        }
      }
    }
  ]);
};

// 🔥 Admin: Get All Jobs (Populate Fixed)
const getAllJobsForAdminFromDB = async () => {
  // যেহেতু উপরে User মডেল ইমপোর্ট করা আছে, তাই এখন populate কাজ করবে
  return await Job.find()
    .sort({ createdAt: -1 })
    .populate('postedBy', 'name email phoneNumber profilePicture role');
};

const updateJobStatusInDB = async (id: string, status: string) => {
  return await Job.findByIdAndUpdate(id, { status }, { new: true });
};

// Single Job
const getSingleJobByIdFromDB = async (id: string) => {
  const result = await Job.aggregate([
    { 
      $match: { 
        _id: new mongoose.Types.ObjectId(id), 
        status: 'approved' 
      } 
    },
    {
      $lookup: {
        from: 'users',
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedByDetails'
      }
    },
    { 
      $unwind: {
        path: '$postedByDetails',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        companyName: 1,
        location: 1,
        category: 1,
        salaryRange: 1,
        description: 1,
        createdAt: 1,
        contactEmail: 1,
        contactPhone: 1,
        postedBy: {
          _id: '$postedByDetails._id',
          name: '$postedByDetails.name',
          profilePicture: '$postedByDetails.profilePicture',
          email: '$postedByDetails.email'
        }
      }
    }
  ]);

  return result[0];
};

export const JobService = {
  createJobIntoDB,
  getApprovedJobsFromDB,
  getAllJobsForAdminFromDB,
  updateJobStatusInDB,
  getSingleJobByIdFromDB,
};