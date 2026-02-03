import { Conversation } from './conversation.model';
import { Types } from 'mongoose';

// ✅ কমন লুকআপ স্টেজ (Code Reusability)
const commonPipeline = [
  // ১. Ad Details আনো (classifiedads কালেকশন থেকে)
  {
    $lookup: {
      from: 'classifiedads', // DB collection name (lowercase & plural)
      localField: 'ad',
      foreignField: '_id',
      as: 'ad',
      pipeline: [
        { $project: { title: 1, images: 1, user: 1 } } // শুধু টাইটেল আর ছবি
      ]
    }
  },
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
          $lookup: { // Last Message এর Sender এর নাম জানা দরকার
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

// ✅ আমার সব চ্যাট লিস্ট (Aggregation দিয়ে)
const getMyConversationsFromDB = async (userId: string) => {
  console.log('🔍 Searching conversations for userId:', userId);
  
  const result = await Conversation.aggregate([
    // ১. Match: যেখানে আমি পার্টিসিপেন্ট হিসেবে আছি
    { $match: { participants: new Types.ObjectId(userId) } },
    
    // ২. Sort: লেটেস্ট মেসেজ সবার উপরে
    { $sort: { updatedAt: -1 } },

    // ৩. Join Data (Common Logic)
    ...commonPipeline,

    // ৪. Final Projection (Optional cleanup)
    {
      $project: {
        _id: 1,
        ad: 1,
        participants: 1,
        lastMessage: 1,
        updatedAt: 1
      }
    }
  ]);

  console.log('📊 Found conversations:', result.length);
  return result;
};

// ✅ নির্দিষ্ট একটি চ্যাট (Aggregation দিয়ে)
const getConversationFromDB = async (conversationId: string, userId: string) => {
  console.log('🔍 Getting conversation:', conversationId);

  const result = await Conversation.aggregate([
    { 
      $match: { 
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(userId) // সিকিউরিটি চেক: ইউজার অবশ্যই পার্টিসিপেন্ট হতে হবে
      } 
    },
    ...commonPipeline
  ]);

  if (!result.length) {
    console.error('❌ Conversation not found or access denied');
    throw new Error('Conversation not found or access denied.');
  }

  console.log('✅ Conversation found');
  return result[0]; // Array থেকে Object রিটার্ন
};

// ✅ নতুন চ্যাট শুরু করা
const startConversationInDB = async (
  adId: string,
  buyerId: string,
  sellerId: string
) => {
  console.log('🆕 Starting conversation check...');

  // এখানে findOne ব্যবহার করাই ভালো কারণ এটি শুধু অস্তিত্ব চেক করছে
  let conversation = await Conversation.findOne({
    ad: new Types.ObjectId(adId),
    participants: { $all: [new Types.ObjectId(buyerId), new Types.ObjectId(sellerId)] },
  });

  if (conversation) {
    console.log('📌 Conversation already exists:', conversation._id);
    return conversation;
  }

  // Create new
  conversation = await Conversation.create({
    ad: new Types.ObjectId(adId),
    participants: [new Types.ObjectId(buyerId), new Types.ObjectId(sellerId)],
  });

  console.log('✅ New Conversation created:', conversation._id);
  
  // রিটার্ন করার সময় একটু ডাটা পপুলেট করে দিই যাতে ফ্রন্টএন্ড এরর না খায় (এখানে সাধারণ populate যথেষ্ট)
  return await Conversation.findById(conversation._id)
    .populate('ad', 'title images')
    .populate('participants', 'name profilePicture');
};

export const ConversationServices = {
  getMyConversationsFromDB,
  getConversationFromDB,
  // getMessagesFromDB, // এটি এখন MessageService হ্যান্ডেল করছে, তাই এখানে দরকার নেই
  startConversationInDB,
};