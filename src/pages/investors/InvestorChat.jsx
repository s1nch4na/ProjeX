import React, { useState } from "react";

const mockChats = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Full-Stack Builder • Jain Univ",
    lastMessage: "I've pushed the latest commit to the repo. Let me know what you think of the dashboard layout.",
    time: "10:42 AM",
    unread: 2,
    messages: [
      { sender: "them", text: "Hey! Saw your project listing for the analytics micro-service.", time: "10:30 AM" },
      { sender: "me", text: "Hey Alex, glad you reached out. Have you worked with Neon PostgreSQL before?", time: "10:35 AM" },
      { sender: "them", text: "I've pushed the latest commit to the repo. Let me know what you think of the dashboard layout.", time: "10:42 AM" }
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "UI/UX & React Dev",
    lastMessage: "The design system tokens are updated. Ready for code handoff whenever you are.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { sender: "them", text: "Working on the high-contrast variant now.", time: "Yesterday" },
      { sender: "them", text: "The design system tokens are updated. Ready for code handoff whenever you are.", time: "Yesterday" }
    ]
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Backend Engineer",
    lastMessage: "ETL pipeline script is optimized. Processing CSV records under 200ms.",
    time: "3 days ago",
    unread: 0,
    messages: [
      { sender: "them", text: "ETL pipeline script is optimized. Processing CSV records under 200ms.", time: "3 days ago" }
    ]
  }
];

export default function InvestorChat() {
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [inputText, setInputText] = useState("");
  const [chats, setChats] = useState(mockChats);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const updatedMessages = [
      ...activeChat.messages,
      { sender: "me", text: inputText, time: "Just now" }
    ];

    const updatedChat = {
      ...activeChat,
      messages: updatedMessages,
      lastMessage: inputText,
      time: "Just now"
    };

    setActiveChat(updatedChat);
    setChats(chats.map(c => c.id === updatedChat.id ? updatedChat : c));
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-10 selection:bg-black selection:text-white">
      
      {/* Header Banner */}
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-black">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Secure Comm-Link</span>
          <h1 className="text-3xl font-bold tracking-tight uppercase mt-1">Direct Messages</h1>
        </div>
        <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 bg-black text-white">
          Active Sessions: {chats.length}
        </span>
      </div>

      {/* Reddit-Style Split Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border border-black bg-white min-h-[600px]">
        
        {/* Left Sidebar: Conversations List */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-black flex flex-col">
          <div className="p-4 border-b border-black bg-[#F3F3EF] font-mono text-xs uppercase tracking-wider text-neutral-600">
            [ Inbox / Conversations ]
          </div>
          
          <div className="overflow-y-auto divide-y divide-neutral-200 flex-1">
            {chats.map((chat) => {
              const isActive = activeChat.id === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 cursor-pointer transition-colors flex flex-col justify-between ${
                    isActive ? "bg-black text-white" : "hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold tracking-tight text-sm uppercase ${isActive ? "text-white" : "text-black"}`}>
                      {chat.name}
                    </span>
                    <span className={`text-[10px] font-mono ${isActive ? "text-neutral-400" : "text-neutral-500"}`}>
                      {chat.time}
                    </span>
                  </div>

                  <p className={`text-[11px] font-mono mb-2 uppercase tracking-tight ${isActive ? "text-neutral-300" : "text-neutral-500"}`}>
                    {chat.role}
                  </p>

                  <p className={`text-xs line-clamp-1 ${isActive ? "text-neutral-200" : "text-neutral-600"}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Panel: Active Thread */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-black bg-[#F3F3EF] flex justify-between items-center">
            <div>
              <h2 className="font-bold text-sm uppercase tracking-tight">{activeChat.name}</h2>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                {activeChat.role}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-black bg-white">
              Encrypted Session
            </span>
          </div>

          {/* Message Stream */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4 max-h-[440px]">
            {activeChat.messages.map((msg, idx) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md p-3.5 border ${
                      isMe
                        ? "bg-black text-white border-black"
                        : "bg-[#F3F3EF] text-black border-black"
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase">
                    {msg.sender === "me" ? "You" : activeChat.name} • {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-black bg-white flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeChat.name}...`}
              className="flex-1 px-4 py-2.5 bg-[#F3F3EF] border border-black text-sm text-black placeholder-neutral-500 rounded-none focus:outline-none focus:ring-1 focus:ring-black font-sans"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-none"
            >
              Send →
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}