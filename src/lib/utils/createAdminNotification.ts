import dbConnect from "@/lib/db";
import { Notification } from "../modules/adminNotification/notification/notification.model";

export const createAdminNotification = async (type: string, message: string, link: string) => {
  try {
    // ✅ MAGIC FIX: নোটিফিকেশন সেভ করার আগে নিশ্চিত করা হচ্ছে যে ডাটাবেস কানেক্টেড আছে
    await dbConnect(); 
    
    const newNotif = await Notification.create({ type, message, link });
    console.log('🔔 Notification saved successfully:', newNotif._id);
  } catch (error) {
    console.error('❌ Failed to create notification:', error);
  }
};