import { ISubscriber } from './subscribedUser.interface';
import { Subscriber } from './subscribedUser.model';

const createSubscriberInDB = async (payload: Partial<ISubscriber>) => {
  const result = await Subscriber.create(payload);
  return result;
};

// Get all subscribers (admin view - includes active and inactive)
const getAllSubscribersFromDB = async () => {
  const result = await Subscriber.find().sort({ subscribedOn: -1 });
  return result;
};

// Get only active subscribers (public/user view)
const getActiveSubscribersFromDB = async () => {
  const result = await Subscriber.find({ isActive: true }).sort({ subscribedOn: -1 });
  return result;
};

const getSubscriberByIdFromDB = async (id: string) => {
  const result = await Subscriber.findById(id);
  if (!result) {
    throw new Error('Subscriber not found');
  }
  return result;
};

const updateSubscriberInDB = async (id: string, payload: Partial<ISubscriber>) => {
  const result = await Subscriber.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Subscriber not found to update.');
  }
  return result;
};

const deleteSubscriberFromDB = async (id: string) => {
  const subscriber = await Subscriber.findById(id);
  if (!subscriber) {
    throw new Error('Subscriber not found');
  }

  await Subscriber.findByIdAndDelete(id);
  return null;
};

export const SubscriberServices = {
  createSubscriberInDB,
  getAllSubscribersFromDB,
  getActiveSubscribersFromDB,
  getSubscriberByIdFromDB,
  updateSubscriberInDB,
  deleteSubscriberFromDB,
};
