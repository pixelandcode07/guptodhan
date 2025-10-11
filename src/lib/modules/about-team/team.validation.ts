import { z } from 'zod';

export const createTeamMemberValidationSchema = z.object({
  name: z.string().min(1),
  designation: z.string().min(1),
  image: z.string().url(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
    })
    .optional(),
});

export const updateTeamMemberValidationSchema = z.object({
  name: z.string().min(1).optional(),
  designation: z.string().min(1).optional(),
  image: z.string().url().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
    })
    .optional(),
});
