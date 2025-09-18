'use client';
import { Send } from 'lucide-react';

export default function ChatInput() {
  return (
    <div className="p-3 border-t bg-white flex items-center gap-2">
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
      />
      <button className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600">
        <Send size={18} />
      </button>
    </div>
  );
}
