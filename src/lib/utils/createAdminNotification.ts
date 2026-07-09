import { Notification } from "../modules/adminNotification/notification/notification.model";

export const createAdminNotification = async (type: string, message: string, link: string) => {
  try {
    await Notification.create({ type, message, link });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};