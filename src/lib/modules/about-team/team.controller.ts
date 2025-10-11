// ফাইল: src/lib/modules/about-team/team.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from '@/lib/utils/cloudinary';
import {
  createTeamMemberValidationSchema,
  updateTeamMemberValidationSchema,
} from './team.validation';
import { TeamMemberServices } from './team.service';
import dbConnect from '@/lib/db';

// ================= CREATE =================
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

// ================= GET PUBLIC TEAM =================
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

// ================= UPDATE =================
const updateTeamMember = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;

  const existingMember = await TeamMemberServices.getTeamMemberById(id);
  if (!existingMember) throw new Error('Team member not found');

  const formData = await req.formData();

  const socialLinks: any = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('socialLinks.')) {
      socialLinks[key.split('.')[1]] = value as string;
    }
  }

  const payload: any = {
    name: (formData.get('name') as string) || existingMember.name,
    designation:
      (formData.get('designation') as string) || existingMember.designation,
    socialLinks:
      Object.keys(socialLinks).length > 0
        ? socialLinks
        : existingMember.socialLinks,
    image: existingMember.image, // keep old image by default
  };

  const imageFile = formData.get('image') as File | null;
  if (imageFile) {
    if (existingMember.image) {
      await deleteFromCloudinary(existingMember.image);
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'about-team');
    payload.image = uploadResult.secure_url;
  }

  const validatedData = updateTeamMemberValidationSchema.parse(payload);
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

// ================= DELETE =================
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
