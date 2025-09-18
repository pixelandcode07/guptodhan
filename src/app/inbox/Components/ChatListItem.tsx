import Image from 'next/image';

interface ChatListItemProps {
  name: string;
  message: string;
  time: string;
  avatar: string;
  active?: boolean;
}

export default function ChatListItem({
  name,
  message,
  time,
  avatar,
  active,
}: ChatListItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
        active ? 'bg-gray-100' : ''
      }`}>
      <Image
        src={avatar}
        alt={name}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <div className="flex-1">
        <h4 className="text-sm font-medium">{name}</h4>
        <p className="text-xs text-gray-500 truncate">{message}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}
