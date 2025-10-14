// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-team\team.model.ts
import { Schema, model, models } from 'mongoose';
import { ITeamMember } from './team.interface';

const teamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  image: { type: String, required: true },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    facebook: { type: String },
  },
}, { timestamps: true });

export const TeamMember = models.TeamMember || model<ITeamMember>('TeamMember', teamMemberSchema);