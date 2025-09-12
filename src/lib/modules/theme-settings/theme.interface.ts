// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\theme-settings\theme.interface.ts

import { Document } from 'mongoose';

export interface IThemeSettings extends Document {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  titleColor: string;
  paragraphColor: string;
  borderColor: string;
}