// এই ফাইলটিকে src/app/api থেকে src/pages/api-তে সরিয়ে আনুন
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\pages\api\socket.ts

import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Message } from "@/lib/modules/message/message.model";
import dbConnect from "@/lib/db";
import { NextApiResponseServerIO } from "@/types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("Setting up socket.io server for the first time...");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    
    await dbConnect(); // Socket.IO সার্ভার চালু হওয়ার সময় ডেটাবেস কানেক্ট করুন

    io.on("connection", (socket) => {
      console.log("✅ A user connected:", socket.id);

      socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined room ${conversationId}`);
      });

      socket.on("sendMessage", async (data) => {
        try {
          const { conversation, sender, receiver, content } = data;
          const message = new Message({ conversation, sender, receiver, content });
          await message.save();
          
          // মেসেজটি ওই রুমের সবাইকে পাঠানো হচ্ছে (নিজেকে সহ)
          io.to(conversation).emit("receiveMessage", message);
        } catch (error) {
            console.error("Error saving or sending message:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("🔌 A user disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io server already running.");
  }
  res.end();
};

export default ioHandler;