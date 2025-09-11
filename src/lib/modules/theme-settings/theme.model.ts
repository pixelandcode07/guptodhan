// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\theme-settings\theme.model.ts

import { Schema, model, models } from 'mongoose';
import { IThemeSettings } from './theme.interface';

const themeSettingsSchema = new Schema<IThemeSettings>({
  primaryColor: { type: String, required: true, default: '#00005e' },
  secondaryColor: { type: String, required: true, default: '#3d85c6' },
  tertiaryColor: { type: String, required: true, default: '#ba2a2a' },
  titleColor: { type: String, required: true, default: '#222831' },
  paragraphColor: { type: String, required: true, default: '#252a34' },
  borderColor: { type: String, required: true, default: '#eeeeee' },
}, { timestamps: true });

export const ThemeSettings = models.ThemeSettings || model<IThemeSettings>('ThemeSettings', themeSettingsSchema);