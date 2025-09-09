// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-team\team.service.ts
import { ITeamMember } from './team.interface';
import { TeamMember } from './team.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createTeamMemberInDB = async (payload: Partial<ITeamMember>) => {
  return await TeamMember.create(payload);
};
const getPublicTeamFromDB = async () => {
  return await TeamMember.find().sort({ createdAt: 1 });
};
const updateTeamMemberInDB = async (id: string, payload: Partial<ITeamMember>) => {
  return await TeamMember.findByIdAndUpdate(id, payload, { new: true });
};
const deleteTeamMemberFromDB = async (id: string) => {
  const member = await TeamMember.findById(id);
  if (!member) { throw new Error("Team member not found"); }
  await deleteFromCloudinary(member.image);
  await TeamMember.findByIdAndDelete(id);
  return null;
};

export const TeamMemberServices = {
  createTeamMemberInDB,
  getPublicTeamFromDB,
  updateTeamMemberInDB,
  deleteTeamMemberFromDB,
};