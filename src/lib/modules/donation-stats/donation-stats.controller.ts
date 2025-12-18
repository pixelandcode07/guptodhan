import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { DonationCampaign } from '../donation-campaign/donation-campaign.model';
import { DonationClaim } from '../donation-claim/donation-claim.model';

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// 🔥 Helper to format date for chart
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

const getAdminDashboardStats = async (req: NextRequest) => {
  await dbConnect();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfYesterday = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);

  // 1. Basic Stats Calculation (Previous Logic)
  const totalCampaigns = await DonationCampaign.countDocuments();
  const totalCampaignsLastMonth = await DonationCampaign.countDocuments({ createdAt: { $lt: thirtyDaysAgo } });
  const totalCampaignsChange = calculateChange(totalCampaigns, totalCampaignsLastMonth);

  const totalClaims = await DonationClaim.countDocuments();
  const totalClaimsLastMonth = await DonationClaim.countDocuments({ createdAt: { $lt: thirtyDaysAgo } });
  const totalClaimsChange = calculateChange(totalClaims, totalClaimsLastMonth);

  const pendingClaims = await DonationClaim.countDocuments({ status: 'pending' });
  const pendingClaimsChange = totalClaimsChange; 

  const completedCampaigns = await DonationCampaign.countDocuments({ status: 'completed' });
  const completedLastMonth = await DonationCampaign.countDocuments({ status: 'completed', createdAt: { $lt: thirtyDaysAgo } });
  const completedCampaignsChange = calculateChange(completedCampaigns, completedLastMonth);

  const newClaimsToday = await DonationClaim.countDocuments({ createdAt: { $gte: startOfDay } });
  const newClaimsYesterday = await DonationClaim.countDocuments({ createdAt: { $gte: startOfYesterday, $lt: startOfDay } });
  const newClaimsTodayChange = calculateChange(newClaimsToday, newClaimsYesterday);

  // ==========================================
  // 🔥 2. Dynamic Chart Data (Last 30 Days)
  // ==========================================
  // Aggregation to get daily counts
  const donationChartData = await DonationCampaign.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
  ]);

  const claimChartData = await DonationClaim.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
  ]);

  // Merge and Format for Recharts
  const chartData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const displayDate = formatDate(d); // "18 Dec"

    const donationCount = donationChartData.find((item) => item._id === dateStr)?.count || 0;
    const claimCount = claimChartData.find((item) => item._id === dateStr)?.count || 0;

    chartData.push({
      name: displayDate,
      donations: donationCount,
      claims: claimCount
    });
  }

  // ==========================================
  // 🔥 3. Dynamic Recent Activity (Combined)
  // ==========================================
  // Fetch latest 5 campaigns
  const recentCampaigns = await DonationCampaign.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('creator', 'name profilePicture')
    .lean();

  // Fetch latest 5 claims
  const recentClaims = await DonationClaim.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('item', 'title') // Populate item title
    .lean();

  // Combine, standardize, sort, and slice
  const activities = [
    ...recentCampaigns.map((c: any) => ({
      id: c._id,
      user: c.creator?.name || 'Unknown',
      avatar: c.creator?.name?.charAt(0) || 'U',
      action: 'donated',
      item: c.title,
      time: c.createdAt,
      status: c.status
    })),
    ...recentClaims.map((c: any) => ({
      id: c._id,
      user: c.name, // Claimer Name
      avatar: c.name?.charAt(0) || 'U',
      action: 'claimed',
      item: c.item?.title || 'Donation Item',
      time: c.createdAt,
      status: c.status
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   .slice(0, 6); // Take top 6 latest activities

  const stats = {
    totalCampaigns, totalCampaignsChange,
    totalClaims, totalClaimsChange,
    pendingClaims, pendingClaimsChange,
    completedCampaigns, completedCampaignsChange,
    newClaimsToday, newClaimsTodayChange,
    chartData,      // ✅ Full Dynamic
    activities      // ✅ Full Dynamic
  };

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Stats retrieved!',
    data: stats,
  });
};

export const DonationStatsController = {
  getAdminDashboardStats,
};