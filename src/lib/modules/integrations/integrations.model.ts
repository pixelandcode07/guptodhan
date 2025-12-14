// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\integrations\integrations.model.ts

import { Schema, model, models } from 'mongoose';
import { IIntegrations } from './integrations.interface';

const integrationsSchema = new Schema<IIntegrations>({
  googleAnalyticsEnabled: { type: Boolean, default: false },
  googleAnalyticsId: { type: String },
  googleTagManagerEnabled: { type: Boolean, default: false },
  gtmId: { type: String },
  facebookPixelEnabled: { type: Boolean, default: false },
  facebookPixelId: { type: String },
  googleSearchConsoleEnabled: { type: Boolean, default: false },
  googleSearchConsoleId: { type: String },
  microsoftClarityEnabled: { type: Boolean, default: false },
  microsoftClarityId: { type: String },
  googleRecaptchaEnabled: { type: Boolean, default: false },
  recaptchaSiteKey: { type: String },
  recaptchaSecretKey: { type: String },
  googleLoginEnabled: { type: Boolean, default: false },
  googleClientId: { type: String },
  googleClientSecret: { type: String },
  facebookLoginEnabled: { type: Boolean, default: false },
  facebookAppId: { type: String },
  facebookAppSecret: { type: String },
  messengerChatEnabled: { type: Boolean, default: false },
  messengerLink: { type: String },
  tawkToEnabled: { type: Boolean, default: false },
  tawkToLink: { type: String },
  crispChatEnabled: { type: Boolean, default: false },
  crispWebsiteId: { type: String },
}, { timestamps: true });

export const Integrations = models.Integrations || model<IIntegrations>('Integrations', integrationsSchema);