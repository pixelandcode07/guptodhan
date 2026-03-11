import { Conversation } from './conversation.model';
import { Types } from 'mongoose';

// ✅ কমন লুকআপ স্টেজ (Code Reusability)
const commonPipeline = [
  // ১. Ad Details আনো (classifiedads কালেকশন থেকে)
  {
    $lookup: {
      from: 'classifiedads', 
      localField: 'ad',
      foreignField: '_id',
      as: 'ad',
      pipeline: [
        { $project: { title: 1, images: 1, user: 1 } }
      ]
    }
  },
  // preserveNullAndEmptyArrays: true রাখা হলো, যাতে অ্যাড ডিলিট হলেও চ্যাট হিস্টোরি থেকে যায়
  { $unwind: { path: '$ad', preserveNullAndEmptyArrays: true } },

  // ২. Participants Details আনো (users কালেকশন থেকে)
  {
    $lookup: {
      from: 'users',
      localField: 'participants',
      foreignField: '_id',
      as: 'participants',
      pipeline: [
        { $project: { name: 1, profilePicture: 1, email: 1 } }
      ]
    }
  },

  // ৩. Last Message Details আনো (messages কালেকশন থেকে)
  {
    $lookup: {
      from: 'messages',
      localField: 'lastMessage',
      foreignField: '_id',
      as: 'lastMessage',
      pipeline: [
        {
          $lookup: { 
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender',
            pipeline: [{ $project: { name: 1 } }]
          }
        },
        { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
        { $project: { content: 1, createdAt: 1, isRead: 1, sender: 1 } }
      ]
    }
  },
  { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } }
];

const getMyConversationsFromDB = async (userId: string) => {
  const result = await Conversation.aggregate([
    { $match: { participants: new Types.ObjectId(userId) } },
    { $sort: { updatedAt: -1 } },
    ...commonPipeline,
    {
      $project: {
        _id: 1,
        ad: { $ifNull: ['$ad', { title: 'Deleted Ad', images: [] }] }, // ✅ FIX: অ্যাড ডিলিট হলে 'Deleted Ad' দেখাবে
        participants: 1,
        lastMessage: 1,
        updatedAt: 1
      }
    }
  ]);
  return result;
};

const getConversationFromDB = async (conversationId: string, userId: string) => {
  const result = await Conversation.aggregate([
    { 
      $match: { 
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(userId)
      } 
    },
    ...commonPipeline,
    {
      $project: {
        _id: 1,
        ad: { $ifNull: ['$ad', { title: 'Deleted Ad', images: [] }] }, // ✅ FIX
        participants: 1,
        lastMessage: 1,
        updatedAt: 1
      }
    }
  ]);

  if (!result.length) {
    throw new Error('Conversation not found or access denied.');
  }
  return result[0]; 
};

const startConversationInDB = async (
  adId: string,
  buyerId: string,
  sellerId: string
) => {
  let conversation = await Conversation.findOne({
    ad: new Types.ObjectId(adId),
    participants: { $all: [new Types.ObjectId(buyerId), new Types.ObjectId(sellerId)] },
  });

  if (conversation) {
    return conversation;
  }

  conversation = await Conversation.create({
    ad: new Types.ObjectId(adId),
    participants: [new Types.ObjectId(buyerId), new Types.ObjectId(sellerId)],
  });

  return await Conversation.findById(conversation._id)
    .populate('ad', 'title images')
    .populate('participants', 'name profilePicture');
};

export const ConversationServices = {
  getMyConversationsFromDB,
  getConversationFromDB,
  startConversationInDB,
};