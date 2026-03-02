import { IWithdrawal } from './withdrawal.interface';
import { WithdrawalModel } from './withdrawal.model';
import { StoreModel } from '../vendor-store/vendorStore.model';
import { Types } from 'mongoose';

// ================================================================
// ✅ CREATE WITHDRAWAL REQUEST (Vendor)
// ================================================================
const createWithdrawalRequest = async (payload: Partial<IWithdrawal>) => {
  // ১. প্রথমে স্টোর চেক করব
  const store = await StoreModel.findById(payload.storeId);
  if (!store) throw new Error('Store not found!');

  // ২. ব্যালেন্স চেক করব
  if (store.availableBalance < payload.amount!) {
    throw new Error('Insufficient available balance!');
  }

  // ৩. রিকোয়েস্ট ক্রিয়েট করব
  const newRequest = await WithdrawalModel.create(payload);

  // ৪. স্টোর থেকে ব্যালেন্স কেটে রাখব
  await StoreModel.findByIdAndUpdate(payload.storeId, {
    $inc: { availableBalance: -payload.amount! }
  });

  return newRequest;
};

// ================================================================
// ✅ GET WITHDRAWAL HISTORY BY VENDOR (Vendor)
// ================================================================
const getWithdrawalHistoryByVendor = async (vendorId: string) => {
  return await WithdrawalModel.find({ vendorId: new Types.ObjectId(vendorId) })
    .sort({ createdAt: -1 })
    .lean();
};

// ================================================================
// ✅ GET ALL WITHDRAWAL REQUESTS (Admin)
// ================================================================
const getAllWithdrawalRequests = async (status?: string) => {
  const query = status ? { status } : {};
  return await WithdrawalModel.find(query)
    .populate('storeId', 'storeName storeLogo')
    .sort({ createdAt: -1 })
    .lean();
};

// ================================================================
// ✅ UPDATE STATUS (Approve / Reject by Admin)
// ================================================================
const updateWithdrawalStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected', 
  adminRemarks?: string
) => {
  const withdrawal = await WithdrawalModel.findById(requestId);
  if (!withdrawal) throw new Error('Withdrawal request not found!');

  if (withdrawal.status !== 'pending') {
    throw new Error('This request has already been processed.');
  }

  // স্ট্যাটাস আপডেট করছি
  withdrawal.status = status;
  if (adminRemarks) withdrawal.adminRemarks = adminRemarks;
  await withdrawal.save();

  // যদি অ্যাপ্রুভ হয়, তাহলে totalWithdrawn বাড়াবো
  if (status === 'approved') {
    await StoreModel.findByIdAndUpdate(withdrawal.storeId, {
      $inc: { totalWithdrawn: withdrawal.amount }
    });
  }

  // যদি রিজেক্ট হয়, তাহলে টাকাটা availableBalance-এ ফেরত দেব
  if (status === 'rejected') {
    await StoreModel.findByIdAndUpdate(withdrawal.storeId, {
      $inc: { availableBalance: withdrawal.amount }
    });
  }

  return withdrawal;
};

export const WithdrawalService = {
  createWithdrawalRequest,
  getWithdrawalHistoryByVendor,
  getAllWithdrawalRequests,
  updateWithdrawalStatus,
};