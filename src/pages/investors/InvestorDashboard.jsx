import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard";
import HorizontalScroller from "../../components/HorizontalScroller";
import mockTalents from "../../data/mockTalents";

const mockChats = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Full-Stack Builder",
    lastMessage: "I've pushed the latest commit to the repo.",
    messages: [
      { sender: "them", text: "Hey! Saw your project listing." },
      { sender: "me", text: "Hey Alex, ready to review the build?" },
      { sender: "them", text: "I've pushed the latest commit to the repo." }
    ]
  }
];

export default function InvestorDashboard() {
  // Chat Widget States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState(mockChats);

  // Post Project Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Backend submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Hook up your backend API call here
      // await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      console.log("Submitting project to backend:", formData);
      await new Promise((resolve) => setTimeout(resolve, 800));

      alert("Project posted successfully!");
      setFormData({ title: "", description: "", budget: "", deadline: "" });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error posting project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const updatedMessages = [...activeChat.messages, { sender: "me", text: chatInput }];
    const updatedChat = { ...activeChat, messages: updatedMessages, lastMessage: chatInput };
    setActiveChat(updatedChat);
    setChats(chats.map(c => c.id === updatedChat.id ? updatedChat : c));
    setChatInput("");
  };

  return (
    <div className={`min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-12 relative selection:bg-black selection:text-white ${
      isModalOpen ? "overflow-hidden" : ""
    }`}>
      
      {/* BACKGROUND DASHBOARD (Blurs when modal opens) */}
      <div className={`transition-all duration-300 ${isModalOpen ? "filter blur-sm pointer-events-none select-none" : ""}`}>
        
        {/* Dashboard Top Banner */}
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-black">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Registry / Control Center</span>
            <h1 className="text-3xl font-bold tracking-tight uppercase mt-1">Investor Dashboard</h1>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 bg-black text-white">
            Status: Active Partner
          </span>
        </div>

        {/* Discover Talent Section */}
        <div className="mb-14">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Pool</span>
              <h2 className="text-2xl font-bold tracking-tight uppercase mt-1">Discover Talent</h2>
            </div>
            <Link to="/student" className="text-xs font-mono uppercase tracking-wider underline underline-offset-4 hover:text-neutral-600">
              View All →
            </Link>
          </div>

          <div className="border border-black bg-white p-6">
            <HorizontalScroller>
              {mockTalents.map((talent) => (
                <ProfileCard
                  key={talent.id}
                  id={talent.id}
                  name={talent.name}
                  role={talent.role}
                  skills={talent.skills}
                  image={talent.image}
                />
              ))}
            </HorizontalScroller>
          </div>
        </div>

        {/* Main Grid Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* Post a Project Card -> Opens the Modal */}
          <div className="border border-black bg-white p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-neutral-300 px-2 py-0.5 inline-block mb-3">
                Action 01
              </span>
              <h3 className="font-bold text-lg uppercase tracking-tight mb-2">Post a Project</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                Short quick post to receive rapid student execution submissions.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2.5 bg-black text-white text-center text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors block cursor-pointer"
            >
              Post a Project →
            </button>
          </div>

          {/* My Posted Projects */}
          <div className="border border-black bg-white p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-neutral-300 px-2 py-0.5 inline-block">
                  Action 02
                </span>
                <Link to="/investor/projects" className="text-xs font-mono uppercase tracking-wider underline">
                  View All →
                </Link>
              </div>
              <h3 className="font-bold text-lg uppercase tracking-tight mb-2">My Posted Projects</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                Track active deployments, review candidate artifacts, and settle completed deals.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-neutral-300 bg-[#F3F3EF] p-3 text-xs font-mono">
                <span className="block font-bold text-black">EcoKart App</span>
                <span className="text-[10px] text-neutral-500">In Progress</span>
              </div>
              <div className="border border-neutral-300 bg-[#F3F3EF] p-3 text-xs font-mono">
                <span className="block font-bold text-black">Dashboard UI</span>
                <span className="text-[10px] text-neutral-500">Review Phase</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* STARK EDITORIAL MODAL POPUP (Matches your PostProject layout exactly) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white border border-black p-8 relative shadow-2xl">
            
            {/* Header with Close Button */}
            <div className="mb-6 pb-4 border-b border-black flex justify-between items-end">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Registry System</span>
                <h3 className="text-2xl font-bold tracking-tight uppercase mt-1">Create a Project</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-[#F3F3EF] border border-black text-black font-mono flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer text-sm font-bold"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Title"
                  className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Description & Scope</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the project"
                  className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black resize-none"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    placeholder="Budget (₹)"
                    className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Target Deadline</label>
                  <input
                    type="text"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    placeholder="Deadline"
                    className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-none disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Posting..." : "Post →"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-black text-xs font-mono uppercase tracking-wider hover:bg-neutral-100 transition-colors rounded-none cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FLOATING REDDIT-STYLE CHAT WIDGET (Bottom Right Overlay) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-12 h-12 bg-black text-white border border-black flex items-center justify-center shadow-xl hover:bg-neutral-800 transition-all font-mono text-lg cursor-pointer"
            title="Open Chats"
          >
            ▲
          </button>
        ) : (
          <div className="w-[360px] sm:w-[480px] h-[420px] bg-white border-2 border-black shadow-2xl flex flex-col">
            <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-mono uppercase tracking-widest">
                Direct Messages ({chats.length})
              </span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-7 h-7 bg-white text-black font-mono flex items-center justify-center hover:bg-neutral-200 transition-colors text-xs font-bold cursor-pointer"
                title="Minimize Chat"
              >
                ▼
              </button>
            </div>

            <div className="grid grid-cols-12 flex-1 overflow-hidden">
              <div className="col-span-5 border-r border-black overflow-y-auto bg-[#F3F3EF] divide-y divide-neutral-200">
                {chats.map((c) => {
                  const isSelected = activeChat.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveChat(c)}
                      className={`p-3 cursor-pointer text-xs transition-colors ${
                        isSelected ? "bg-black text-white" : "hover:bg-neutral-200 text-black"
                      }`}
                    >
                      <p className="font-bold uppercase truncate">{c.name}</p>
                      <p className={`text-[10px] truncate ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                        {c.lastMessage}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="col-span-7 flex flex-col justify-between bg-white">
                <div className="p-3 overflow-y-auto flex-1 space-y-2 max-h-[260px]">
                  {activeChat.messages.map((m, idx) => {
                    const mine = m.sender === "me";
                    return (
                      <div key={idx} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                        <div className={`p-2 text-[11px] border max-w-[90%] ${
                          mine ? "bg-black text-white border-black" : "bg-[#F3F3EF] text-black border-neutral-300"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendChatMessage} className="p-2 border-t border-black bg-white flex gap-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 px-3 py-1.5 bg-[#F3F3EF] border border-black text-xs text-black placeholder-neutral-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-black text-white text-[10px] font-mono uppercase hover:bg-neutral-800 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}