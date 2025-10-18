import { IContactRequest } from './contactReq.interface';
import { ContactRequest } from './contactReq.model';

const createContactRequestInDB = async (payload: Partial<IContactRequest>) => {
  const result = await ContactRequest.create(payload);
  return result;
};

const getAllContactRequestsFromDB = async () => {
  const result = await ContactRequest.find().sort({ createdAt: -1 });
  return result;
};

const getContactRequestByIdFromDB = async (id: string) => {
  const result = await ContactRequest.findById(id);
  if (!result) {
    throw new Error('Contact request not found');
  }
  return result;
};

const updateContactRequestInDB = async (id: string, payload: Partial<IContactRequest>) => {
  const result = await ContactRequest.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Contact request not found to update.');
  }
  return result;
};

const deleteContactRequestFromDB = async (id: string) => {
  const request = await ContactRequest.findById(id);
  if (!request) {
    throw new Error('Contact request not found');
  }

  await ContactRequest.findByIdAndDelete(id);
  return null;
};

// Get only pending contact requests
const getPendingContactRequestsFromDB = async () => {
  const result = await ContactRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
  return result;
};

// Get only resolved contact requests
const getResolvedContactRequestsFromDB = async () => {
  const result = await ContactRequest.find({ status: 'resolved' }).sort({ createdAt: -1 });
  return result;
};

export const ContactRequestServices = {
  createContactRequestInDB,
  getAllContactRequestsFromDB,
  getContactRequestByIdFromDB,
  updateContactRequestInDB,
  deleteContactRequestFromDB,
  getPendingContactRequestsFromDB,
  getResolvedContactRequestsFromDB,
};
