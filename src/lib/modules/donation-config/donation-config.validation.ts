import { z } from 'zod';

export const donationConfigSchema = z.object({
  title: z.string({ required_error: 'Title is required.' }).min(1),
  image: z.string({ required_error: 'Image URL is required.' }).url(),
  shortDescription: z.string({ required_error: 'Short description is required.' }).min(1),
  buttonText: z.string({ required_error: 'Button text is required.' }).min(1),
  buttonUrl: z.string({ required_error: 'Button URL is required.' }).url(),
});