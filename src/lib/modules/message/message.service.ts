import { Types } from 'mongoose';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { IMessage } from './message.interface';

// ✅ কমন লুকআপ স্টেজ (রিপিটেশন কমানোর জন্য)
const commonLookups = [
  {
    $lookup: {
      from: 'users', // collection name in DB
      localField: 'sender',
      foreignField: '_id',
      as: 'sender',
      pipeline: [
        { $project: { name: 1, profilePicture: 1 } } // শুধু নাম আর ছবি নিবো
      ]
    }
  },
  { $unwind: '$sender' },
  {
    $lookup: {
      from: 'users',
      localField: 'receiver',
      foreignField: '_id',
      as: 'receiver',
      pipeline: [
        { $project: { name: 1, profilePicture: 1 } }
      ]
    }
  },
  { $unwind: '$receiver' }
];

// ✅ নতুন মেসেজ তৈরি করা
const createMessageInDB = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<IMessage> => {
  // ১. Conversation verify
  const conversation = await Conversation.findOne({
    _id: new Types.ObjectId(conversationId),
    participants: { $in: [senderId, receiverId] },
  });

  if (!conversation) {
    throw new Error('Conversation not found or you are not a participant.');
  }

  // ২. Message তৈরি
  const newMessage = await Message.create({
    conversation: new Types.ObjectId(conversationId),
    sender: new Types.ObjectId(senderId),
    receiver: new Types.ObjectId(receiverId),
    content,
    isRead: false,
  });

  // ৩. Aggregation দিয়ে ডাটা আনা (Populate এর বদলে)
  const result = await Message.aggregate([
    { $match: { _id: newMessage._id } },
    ...commonLookups
  ]);

  return result[0] as IMessage;
};

// ✅ একটা চ্যাটের সমস্ত মেসেজ পাওয়া (Lookup দিয়ে)
const getMessagesFromDB = async (
  conversationId: string,
  userId: string
): Promise<IMessage[]> => {
  // ১. User verify
  const conversation = await Conversation.findOne({
    _id: new Types.ObjectId(conversationId),
    participants: new Types.ObjectId(userId),
  });

  if (!conversation) {
    throw new Error('Conversation not found or you are not a participant.');
  }

  // ২. Aggregation Pipeline
  const messages = await Message.aggregate([
    { 
      $match: { conversation: new Types.ObjectId(conversationId) } 
    },
    { $sort: { createdAt: 1 } }, // সময় অনুযায়ী সাজানো
    ...commonLookups,
    {
      $project: {
        _id: 1,
        content: 1,
        isRead: 1,
        createdAt: 1,
        sender: 1,   // populated sender object
        receiver: 1, // populated receiver object
        conversation: 1
      }
    }
  ]);

  return messages;
};

// ✅ মেসেজ পড়া হিসেবে মার্ক করা
const markAsReadInDB = async (
  messageId: string,
  userId: string
): Promise<IMessage | null> => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error('Message not found.');
  }

  if (message.receiver.toString() !== userId) {
    throw new Error('Only receiver can mark message as read.');
  }

  // Update
  await Message.updateOne(
    { _id: new Types.ObjectId(messageId) },
    { $set: { isRead: true } }
  );

  // Fetch Updated Data with Lookup
  const updatedMessage = await Message.aggregate([
    { $match: { _id: new Types.ObjectId(messageId) } },
    ...commonLookups
  ]);

  return updatedMessage[0] || null;
};

// ✅ অপঠিত মেসেজ সংখ্যা পাওয়া (Fast Count)
const getUnreadCountInDB = async (userId: string): Promise<number> => {
  // Indexing { receiver: 1, isRead: 1 } থাকার কারণে এটি সুপার ফাস্ট হবে
  const count = await Message.countDocuments({
    receiver: new Types.ObjectId(userId),
    isRead: false,
  });

  return count;
};

// ✅ সমস্ত অপঠিত মেসেজ পাওয়া
const getUnreadMessagesFromDB = async (
  userId: string
): Promise<IMessage[]> => {
  const unreadMessages = await Message.aggregate([
    { 
      $match: { 
        receiver: new Types.ObjectId(userId), 
        isRead: false 
      } 
    },
    { $sort: { createdAt: -1 } },
    // Sender Lookup
    {
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'sender',
        pipeline: [{ $project: { name: 1, profilePicture: 1 } }]
      }
    },
    { $unwind: '$sender' },
    // Conversation Lookup (with Ad details)
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversation',
        foreignField: '_id',
        as: 'conversationData',
        pipeline: [
          {
            $lookup: {
              from: 'classifiedads', // Ad collection name check করে নিবেন
              localField: 'ad',
              foreignField: '_id',
              as: 'ad',
              pipeline: [{ $project: { title: 1, images: 1 } }]
            }
          },
          { $unwind: { path: '$ad', preserveNullAndEmptyArrays: true } }
        ]
      }
    },
    { $unwind: '$conversationData' },
    {
      $project: {
        content: 1,
        isRead: 1,
        createdAt: 1,
        sender: 1,
        conversation: {
          _id: '$conversationData._id',
          ad: '$conversationData.ad'
        }
      }
    }
  ]);

  return unreadMessages;
};

export const MessageServices = {
  createMessageInDB,
  getMessagesFromDB,
  markAsReadInDB,
  getUnreadCountInDB,
  getUnreadMessagesFromDB,
};