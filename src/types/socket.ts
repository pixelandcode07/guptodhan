// নতুন ফাইল তৈরি করুন
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\types\socket.ts

import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

// Next.js-এর ডিফল্ট NextApiResponse-কে এমনভাবে পরিবর্তন করা হচ্ছে
// যাতে এটি একটি Socket.IO সার্ভার ইনস্ট্যান্স ধারণ করতে পারে
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};