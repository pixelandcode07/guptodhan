import { z } from 'zod';

export const createPageSeoSchema = z.object({
  pageTitle: z.string().min(1),
  pageContent: z.string().min(1),
  featureImage: z.string().url().optional(),
  metaTitle: z.string().min(1),
  metaKeywords: z.preprocess((val) => (typeof val === 'string' ? val.split(',') : val), z.array(z.string()).optional()),
  metaDescription: z.string().min(1),
  showInHeader: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  showInFooter: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
});