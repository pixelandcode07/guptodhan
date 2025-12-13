
import { IReport } from './report.interface';
import { Report } from './report.model';
import { ClassifiedAd } from '../classifieds/ad.model';

const createReportInDB = async (payload: Partial<IReport>) => {
  const ad = await ClassifiedAd.findById(payload.ad);
  if (!ad) {
    throw new Error('The ad you are trying to report does not exist.');
  }

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