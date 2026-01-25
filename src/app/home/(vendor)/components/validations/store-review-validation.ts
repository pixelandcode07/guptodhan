import { z } from "zod";

export const createStoreReviewFormSchema = z.object({
  storeId: z.string().min(1),
  userName: z.string().min(1),
  userImage: z.string().url(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500),
});

export type CreateStoreReviewFormValues = z.infer<
  typeof createStoreReviewFormSchema
>;
