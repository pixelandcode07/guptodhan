// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-team\team.interface.ts
import { Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  designation: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}