'use client';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
}

const messages: Message[] = [
  { id: 1, text: 'Hey, is this still available?', sender: 'me' },
  { id: 2, text: "Yes! It's still available.", sender: 'other' },
  { id: 3, text: 'Great! Can I see more pictures?', sender: 'me' },
];

export default function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
            msg.sender === 'me'
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-white border text-gray-700'
          }`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}
