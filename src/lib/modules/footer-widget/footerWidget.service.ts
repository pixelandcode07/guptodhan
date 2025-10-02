// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\footer-widget\footerWidget.service.ts
import { IFooterWidget } from './footerWidget.interface';
import { FooterWidget } from './footerWidget.model';

const createWidgetInDB = async (payload: Partial<IFooterWidget>) => await FooterWidget.create(payload);
const getPublicWidgetsFromDB = async () => await FooterWidget.find({ status: 'active' }).sort({ createdAt: 1 });
const updateWidgetInDB = async (id: string, payload: Partial<IFooterWidget>) => await FooterWidget.findByIdAndUpdate(id, payload, { new: true });
const deleteWidgetFromDB = async (id: string) => await FooterWidget.findByIdAndDelete(id);
const getAllWidgetsForAdminFromDB = async () => {
  // find({}) দিয়ে সব ডকুমেন্ট (active/inactive) আনা হচ্ছে
  return await FooterWidget.find({}).sort({ createdAt: 1 }); 
};
export const FooterWidgetServices = {
  createWidgetInDB,
  getPublicWidgetsFromDB,
  updateWidgetInDB,
  deleteWidgetFromDB,
  getAllWidgetsForAdminFromDB,
};