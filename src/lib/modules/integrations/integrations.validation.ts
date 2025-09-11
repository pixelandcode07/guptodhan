// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\integrations\integrations.validation.ts

import { z } from 'zod';

export const updateIntegrationsSchema = z.object({
  googleAnalyticsEnabled: z.boolean().optional(),
  googleAnalyticsId: z.string().optional(),
  googleTagManagerEnabled: z.boolean().optional(),
  gtmId: z.string().optional(),
  facebookPixelEnabled: z.boolean().optional(),
  facebookPixelId: z.string().optional(),
  googleRecaptchaEnabled: z.boolean().optional(),
  recaptchaSiteKey: z.string().optional(),
  recaptchaSecretKey: z.string().optional(),
  googleLoginEnabled: z.boolean().optional(),
  googleClientId: z.string().optional(),
  googleClientSecret: z.string().optional(),
  facebookLoginEnabled: z.boolean().optional(),
  facebookAppId: z.string().optional(),
  facebookAppSecret: z.string().optional(),
  messengerChatEnabled: z.boolean().optional(),
  messengerLink: z.string().optional(),
  tawkToEnabled: z.boolean().optional(),
  tawkToLink: z.string().optional(),
  crispChatEnabled: z.boolean().optional(),
  crispWebsiteId: z.string().optional(),
});