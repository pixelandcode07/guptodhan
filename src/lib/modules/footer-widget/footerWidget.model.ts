// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\footer-widget\footerWidget.model.ts
import { Schema, model, models } from 'mongoose';
import { IFooterWidget } from './footerWidget.interface';

const footerLinkSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const footerWidgetSchema = new Schema<IFooterWidget>({
  widgetTitle: { type: String, required: true, unique: true },
  links: [footerLinkSchema],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const FooterWidget = models.FooterWidget || model<IFooterWidget>('FooterWidget', footerWidgetSchema);