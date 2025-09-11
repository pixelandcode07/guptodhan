// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\footer-widget\footerWidget.validation.ts
import { z } from 'zod';

const footerLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
});

export const createFooterWidgetSchema = z.object({
  widgetTitle: z.string().min(1),
  links: z.array(footerLinkSchema).optional(),
});

export const updateFooterWidgetSchema = z.object({
  widgetTitle: z.string().min(1).optional(),
  links: z.array(footerLinkSchema).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});