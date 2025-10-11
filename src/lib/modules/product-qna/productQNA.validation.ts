import { z } from 'zod';

//Create Product Q&A Validation (when user submits a question)
export const createProductQAValidationSchema = z.object({
  qaId: z.string().min(1, { message: 'QA ID is required.' }),
  productId: z.string({ required_error: 'Product ID is required.' }),
  userId: z.string({ required_error: 'User ID is required.' }),
  userName: z.string().min(1, { message: 'User name is required.' }),
  userEmail: z.string().email({ message: 'Valid user email is required.' }),
  userImage: z.string().optional(),
  question: z.string().min(1, { message: 'Question is required.' }),
  createdAt: z.string().optional(),
  status: z.enum(['pending', 'answered', 'hidden']).default('pending'),
  answer: z
    .object({
      answeredByName: z.string().min(1, { message: 'Answered by name is required.' }),
      answeredByEmail: z.string().email({ message: 'Valid answered by email is required.' }),
      answerText: z.string().min(1, { message: 'Answer text is required.' }),
      createdAt: z.string().optional(),
    })
    .optional(),
});

//Update Product Q&A Validation (when admin adds or edits the answer)
export const updateProductQAValidationSchema = z.object({
  qaId: z.string().optional(),
  productId: z.string().optional(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  userImage: z.string().optional(),
  question: z.string().optional(),
  createdAt: z.string().optional(),
  status: z.enum(['pending', 'answered', 'hidden']).optional(),
  answer: z
    .object({
      answeredByName: z.string().optional(),
      answeredByEmail: z.string().email().optional(),
      answerText: z.string().optional(),
      createdAt: z.string().optional(),
    })
    .optional(),
});
