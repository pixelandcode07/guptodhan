// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\custom-code\customCode.interface.ts

import { Document } from 'mongoose';

export interface ICustomCode extends Document {
  customCSS?: string;
  headerScript?: string;
  footerScript?: string;
}