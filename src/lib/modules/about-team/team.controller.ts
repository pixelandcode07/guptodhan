// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-team\team.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
  createTeamMemberValidationSchema,
  updateTeamMemberValidationSchema,
} from './team.validation';
import { TeamMemberServices } from './team.service';
import dbConnect from '@/lib/db';

const createTeamMember = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();
  const imageFile = formData.get('image') as File | null;
  if (!imageFile) throw new Error('Member image is required.');

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const uploadResult = await uploadToCloudinary(buffer, 'about-team');

  const socialLinks: any = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('socialLinks.')) {
      socialLinks[key.split('.')[1]] = value as string;
    }
  }

  const payload = {
    name: formData.get('name') as string,
    designation: formData.get('designation') as string,
    image: uploadResult.secure_url,
    socialLinks,
  };

  const validatedData = createTeamMemberValidationSchema.parse(payload);
  const result = await TeamMemberServices.createTeamMemberInDB(validatedData);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Team member added successfully!',
    data: result,
  });
};

const getPublicTeam = async (_req: NextRequest) => {
  await dbConnect();
  const result = await TeamMemberServices.getPublicTeamFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Team members retrieved successfully!',
    data: result,
  });
};

const updateTeamMember = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateTeamMemberValidationSchema.parse(body);
  const result = await TeamMemberServices.updateTeamMemberInDB(
    id,
    validatedData
  );
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Team member updated successfully!',
    data: result,
  });
};

const deleteTeamMember = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  await TeamMemberServices.deleteTeamMemberFromDB(id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Team member deleted successfully!',
    data: null,
  });
};

export const TeamMemberController = {
  createTeamMember,
  getPublicTeam,
  updateTeamMember,
  deleteTeamMember,
};
