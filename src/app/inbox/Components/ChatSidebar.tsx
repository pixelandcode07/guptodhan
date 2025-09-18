import ChatListItem from './ChatListItem';

const chats = [
  {
    id: 1,
    name: 'Elmer Laverty',
    message: 'Haha oh man 🔥',
    time: '12m',
    avatar: '/img/product/p-1.png',
    active: true,
  },
  {
    id: 2,
    name: 'Lavern Laboy',
    message: "Haha that's terrifying 😂",
    time: '1h',
    avatar: '/img/product/p-2.png',
  },
  {
    id: 3,
    name: 'Titus Kitamura',
    message: 'omg, this is amazing',
    time: '5h',
    avatar: '/img/amarPay.png',
  },
];

export default function ChatSidebar() {
  return (
    <div className="w-72 border-r bg-white h-full">
      <h2 className="p-4 text-lg font-semibold">My Chats</h2>
      <div>
        {chats.map(chat => (
          <ChatListItem key={chat.id} {...chat} />
        ))}
      </div>
    </div>
  );
}
