// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\integrations\integrations.interface.ts

import { Document } from 'mongoose';

export interface IIntegrations extends Document {
  // Analytics & Marketing
  googleAnalyticsEnabled: boolean;
  googleAnalyticsId?: string;
  googleTagManagerEnabled: boolean;
  gtmId?: string;
  facebookPixelEnabled: boolean;
  facebookPixelId?: string;
  googleSearchConsoleEnabled: boolean;
  googleSearchConsoleId?: string;
  microsoftClarityEnabled: boolean;
  microsoftClarityId?: string;

  // Security
  googleRecaptchaEnabled: boolean;
  recaptchaSiteKey?: string;
  recaptchaSecretKey?: string;

  // Social Login
  googleLoginEnabled: boolean;
  googleClientId?: string;
  googleClientSecret?: string;
  facebookLoginEnabled: boolean;
  facebookAppId?: string;
  facebookAppSecret?: string;

  // Chat Plugins
  messengerChatEnabled: boolean;
  messengerLink?: string;
  tawkToEnabled: boolean;
  tawkToLink?: string;
  crispChatEnabled: boolean;
  crispWebsiteId?: string;
}