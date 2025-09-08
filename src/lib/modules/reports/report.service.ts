// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\reports\report.service.ts

import { IReport } from './report.interface';
import { Report } from './report.model';
import { ClassifiedAd } from '../classifieds/ad.model';

const createReportInDB = async (payload: Partial<IReport>) => {
  // বিজ্ঞাপনটি আছে কিনা এবং বিজ্ঞাপনের মালিক কে তা খুঁজে বের করা হচ্ছে
  const ad = await ClassifiedAd.findById(payload.ad);
  if (!ad) {
    throw new Error('The ad you are trying to report does not exist.');
  }

  // payload-এর মধ্যে বিজ্ঞাপনের মালিকের ID যোগ করা হচ্ছে
  payload.reportedUser = ad.user;

  const result = await Report.create(payload);
  return result;
};

const getAllReportsFromDB = async () => {
  const result = await Report.find()
    .populate('ad', 'title')
    .populate('reporter', 'name email')
    .populate('reportedUser', 'name email')
    .sort({ createdAt: -1 });
  return result;
};

const updateReportStatusInDB = async (reportId: string, payload: Partial<IReport>) => {
    const result = await Report.findByIdAndUpdate(reportId, payload, { new: true });
    return result;
};

export const ReportServices = {
  createReportInDB,
  getAllReportsFromDB,
  updateReportStatusInDB,
};