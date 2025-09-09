// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.validation.ts
import { z } from 'zod';

const bdPhoneNumberRegex = /^(01[3-9]\d{8})$/;

export const registerServiceProviderSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  phoneNumber: z.string().regex(bdPhoneNumberRegex),
  bio: z.string().optional(),
  skills: z.preprocess((val) => {
    if (typeof val === 'string') return val.split(',').map(item => item.trim());
    return val;
  }, z.array(z.string()).min(1)),
});