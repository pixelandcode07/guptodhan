import ChatHeader from './Components/ChatHeader';
import ChatInput from './Components/ChatInput';
import ChatMessages from './Components/ChatMessages';
import ChatSidebar from './Components/ChatSidebar';

export default function ChatPage() {
  return (
    <div className="flex h-[800px] my-6 mb-9 border max-w-3xl m-auto bg-gray-100">
      {/* Left Sidebar */}
      <ChatSidebar />

      {/* Right Chat Section */}
      <div className="flex flex-col flex-1">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}
