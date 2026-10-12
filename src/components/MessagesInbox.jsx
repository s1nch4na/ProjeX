
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getMessageConversations,
  startMessageConversation,
  getConversationMessages,
  sendChatMessage,
} from "../utils/api";

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("projex_user") || "null");
  } catch {
    return null;
  }
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date().toDateString();

  return date.toDateString() === today
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function MessagesInbox({ accountType = "student" }) {
  const user = readCurrentUser();
  const userId = user?.id;
  const [searchParams] = useSearchParams();
  const requestedUserId = searchParams.get("with");

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const handledRequestRef = useRef("");

  const activeChat = conversations.find(
    (chat) => String(chat.id) === String(activeId)
  );

  const loadConversations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const result = await getMessageConversations(userId);
      setConversations(result);
      setError("");

      setActiveId((current) => {
        if (current && result.some((chat) => String(chat.id) === String(current))) {
          return current;
        }
        return result.length ? result[0].id : null;
      });
    } catch (err) {
      setError(err.message || "Could not load your inbox.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConversations();

    const timer = window.setInterval(loadConversations, 5000);
    return () => window.clearInterval(timer);
  }, [loadConversations]);

  const openConversation = useCallback(async (otherId) => {
    if (!userId || !otherId || String(userId) === String(otherId)) {
      setError("Enter a different user's valid ID.");
      return;
    }

    try {
      setError("");
      const conversation = await startMessageConversation(userId, otherId);
      await loadConversations();
      setActiveId(conversation.id);
      setRecipientId("");
    } catch (err) {
      setError(err.message || "Could not start conversation.");
    }
  }, [userId, loadConversations]);

  useEffect(() => {
    if (
      requestedUserId &&
      userId &&
      handledRequestRef.current !== `${userId}:${requestedUserId}`
    ) {
      handledRequestRef.current = `${userId}:${requestedUserId}`;
      openConversation(requestedUserId);
    }
  }, [requestedUserId, userId, openConversation]);

  const loadMessages = useCallback(async () => {
    if (!userId || !activeId) {
      setMessages([]);
      return;
    }

    try {
      const result = await getConversationMessages(activeId, userId);
      setMessages(result);
    } catch (err) {
      setError(err.message || "Could not load this conversation.");
    }
  }, [userId, activeId]);

  useEffect(() => {
    loadMessages();

    if (!activeId) return undefined;

    const timer = window.setInterval(loadMessages, 3000);
    return () => window.clearInterval(timer);
  }, [loadMessages, activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(event) {
    event.preventDefault();
    const body = input.trim();

    if (!body || !activeId || sending) return;

    setSending(true);
    setError("");

    try {
      await sendChatMessage(activeId, userId, body);
      setInput("");
      await Promise.all([loadMessages(), loadConversations()]);
    } catch (err) {
      setError(err.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  const filteredConversations = conversations.filter((chat) =>
    (chat.other_name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!userId) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Log in to view messages</h2>
          <p className="text-neutral-500">
            Your ProjeX inbox is available after you sign in.
          </p>
          <a className="inline-block mt-4 underline" href="/login">Go to login</a>
        </div>
      </div>
    );
  }

  const ownerView = accountType === "owner";

  return (
    <div className="min-h-[75vh] bg-[#F3F3EF] text-black px-3 py-5 md:px-8 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-3 border-b border-black pb-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-mono">
              ProjeX / Collaboration
            </p>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Messages</h1>
          </div>
          <span className="text-xs font-mono uppercase border border-black px-3 py-2">
            {conversations.length} conversations
          </span>
        </div>

        {error && (
          <div role="alert" className="mb-4 border border-red-300 bg-red-50 text-red-800 p-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 border border-black bg-white min-h-[620px]">
          <aside className={`${activeId ? "hidden md:flex" : "flex"} md:col-span-4 flex-col border-b md:border-b-0 md:border-r border-black min-h-[300px]`}>
            <div className="p-4 bg-[#F3F3EF] border-b border-black">
              <h2 className="text-xs font-mono uppercase tracking-widest mb-3">
                Inbox
              </h2>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openConversation(recipientId.trim());
                }}
                className="flex gap-2 mt-3"
              >
                <input
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="Start chat: user ID"
                  inputMode="numeric"
                  className="min-w-0 flex-1 border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-3 py-2 text-xs"
                >
                  New
                </button>
              </form>
              <p className="text-[10px] text-neutral-500 mt-2">
                You can also open a conversation from a user's profile.
              </p>
            </div>

            <div className="flex-1 divide-y divide-neutral-200 overflow-y-auto">
              {loading && conversations.length === 0 && (
                <p className="p-4 text-sm text-neutral-500">Loading inbox...</p>
              )}

              {!loading && conversations.length === 0 && (
                <p className="p-5 text-sm text-neutral-500">
                  No conversations yet. Start one using the other user's account ID.
                </p>
              )}

              {filteredConversations.map((chat) => {
                const selected = String(chat.id) === String(activeId);

                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setActiveId(chat.id)}
                    className={`w-full text-left p-4 transition-colors ${
                      selected ? "bg-black text-white" : "hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm">
                        {chat.other_name || "ProjeX user"}
                      </span>
                      <span className={`text-[10px] font-mono ${selected ? "text-neutral-300" : "text-neutral-500"}`}>
                        {formatTime(chat.last_message_at)}
                      </span>
                    </div>

                    <p className={`text-[10px] uppercase tracking-wide mt-1 ${
                      selected ? "text-neutral-300" : "text-neutral-500"
                    }`}>
                      {chat.other_role === "investor"
                        ? "Project Owner"
                        : chat.other_position || "Student"}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <p className={`text-xs truncate flex-1 ${
                        selected ? "text-neutral-200" : "text-neutral-600"
                      }`}>
                        {chat.last_message || "Conversation started"}
                      </p>

                      {Number(chat.unread_count) > 0 && (
                        <span className="min-w-5 h-5 rounded-full bg-black text-white border border-white text-[10px] grid place-items-center">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className={`${activeId ? "flex" : "hidden md:flex"} md:col-span-8 flex-col min-h-[620px]`}>
            {activeChat ? (
              <>
                <header className="p-4 border-b border-black bg-[#F3F3EF] flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="md:hidden border border-black px-3 py-2 text-xs"
                  >
                    Back
                  </button>
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm">
                      {activeChat.other_name || "ProjeX user"}
                    </h2>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                      {activeChat.other_role === "investor"
                        ? "Project Owner"
                        : activeChat.other_position || "Student"}
                    </p>
                  </div>
                  <span className="ml-auto text-[10px] font-mono border border-black px-2 py-1">
                    DIRECT MESSAGE
                  </span>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                  {messages.length === 0 && (
                    <p className="text-center text-sm text-neutral-500 py-10">
                      No messages yet. Start the conversation.
                    </p>
                  )}

                  {messages.map((message) => {
                    const mine = String(message.sender_id) === String(userId);

                    return (
                      <div
                        key={message.id}
                        className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
                      >
                        <div className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 border border-black ${
                          mine ? "bg-black text-white" : "bg-[#F3F3EF] text-black"
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.body}
                          </p>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono mt-1">
                          {mine ? "YOU" : activeChat.other_name?.toUpperCase()} · {formatTime(message.created_at)}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="border-t border-black p-3 md:p-4 flex gap-2 md:gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={5000}
                    placeholder={`Message ${activeChat.other_name || "user"}...`}
                    className="min-w-0 flex-1 border border-black bg-[#F3F3EF] px-3 md:px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="bg-black text-white px-4 md:px-6 py-3 text-xs font-mono uppercase disabled:opacity-40"
                  >
                    {sending ? "Sending..." : "Send →"}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 grid place-items-center p-8 text-center">
                <div>
                  <h2 className="text-xl font-bold">Your messages</h2>
                  <p className="text-sm text-neutral-500 mt-2">
                    Select a conversation or start a new one.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
        <p className="text-[10px] text-neutral-500 font-mono mt-3">
          Messages refresh automatically. {ownerView ? "PROJECT OWNER INBOX" : "STUDENT INBOX"}
        </p>
      </div>
    </div>
  );
}