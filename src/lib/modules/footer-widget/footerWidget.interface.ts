// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\footer-widget\footerWidget.interface.ts
import { Document } from 'mongoose';

export interface IFooterLink {
  title: string;
  url: string;
}

export interface IFooterWidget extends Document {
  widgetTitle: string;
  links: IFooterLink[];
  status: 'active' | 'inactive';
}