"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  ShieldCheck,
  User,
  Clock,
  RotateCw,
  MessageSquare,
  Lock,
  CheckCheck,
  AlertCircle,
} from "lucide-react";

interface SecureSolutionChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutionId?: string | null;
  solutionTitle?: string;
  problemTitle?: string;
}

interface ChatMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar?: string | null;
  isMe: boolean;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatRoomInfo {
  chatRoomId: string;
  solutionId: string;
  solutionTitle: string;
  solutionStatus: string;
  problemId: string;
  problemTitle: string;
  owner: {
    id: string;
    name: string;
    username: string;
    organizationName?: string | null;
  };
  solver: {
    id: string;
    name: string;
    username: string;
    occupation?: string | null;
  };
  currentUserRole: "OWNER" | "SOLVER" | "ADMIN";
}

export function SecureSolutionChatModal({
  isOpen,
  onClose,
  solutionId,
  solutionTitle,
  problemTitle,
}: SecureSolutionChatModalProps) {
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChat = async (isBackground = false) => {
    if (!solutionId) return;
    if (!isBackground) setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/chat/${solutionId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Chatni yuklab bo'lmadi");
      }

      setRoomInfo({
        chatRoomId: json.data.chatRoomId,
        solutionId: json.data.solutionId,
        solutionTitle: json.data.solutionTitle,
        solutionStatus: json.data.solutionStatus,
        problemId: json.data.problemId,
        problemTitle: json.data.problemTitle,
        owner: json.data.owner,
        solver: json.data.solver,
        currentUserRole: json.data.currentUserRole,
      });

      setMessages(json.data.messages || []);
    } catch (err: any) {
      if (!isBackground) {
        setError(err.message);
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && solutionId) {
      loadChat(false);

      // Har 4 soniyada yangi xabarlarni tekshirish (Real-time polling)
      const interval = setInterval(() => {
        loadChat(true);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isOpen, solutionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || sending || !solutionId) return;

    const text = newMessage.trim();
    setSending(true);

    try {
      const res = await fetch(`/api/v1/chat/${solutionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Xabar yuborishda xatolik");
      }

      setMessages((prev) => [...prev, json.data]);
      setNewMessage("");
      scrollToBottom();
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const partnerName =
    roomInfo?.currentUserRole === "OWNER"
      ? roomInfo?.solver.name
      : roomInfo?.owner.name;

  const partnerRole =
    roomInfo?.currentUserRole === "OWNER"
      ? "Yechimchi (Solver)"
      : "Muammo Egasi (Problem Owner)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col overflow-hidden text-white">
        
        {/* CHAT HEADER */}
        <div className="p-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {partnerName ? partnerName : "Xavfsiz Ichki Muloqot"}
                </h3>
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  Himoyalangan
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {partnerRole} • {solutionTitle || roomInfo?.solutionTitle || "Ma'qullangan yechim"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => loadChat(false)}
              title="Yangilash"
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <RotateCw className={`w-4 h-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY INFO BANNER */}
        <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-sky-400" />
            Faqat muammo egasi va tanlangan yechimchi uchun ochiq shaxsiy kanal
          </span>
          <span className="hidden sm:inline text-slate-400">
            {roomInfo?.problemTitle ? `Muammo: ${roomInfo.problemTitle.substring(0, 30)}...` : ""}
          </span>
        </div>

        {/* MESSAGES FEED */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
          {loading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <RotateCw className="w-6 h-6 animate-spin text-sky-400" />
              <p className="text-xs">Chat xonasi yuklanmoqda...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-400" />
              <p className="text-sm text-rose-300 font-medium">{error}</p>
              <button
                onClick={() => loadChat(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700"
              >
                Qayta urinish
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-sky-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  Ushbu yechim bo'yicha chat ochildi!
                </p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Loyihani amaliy joriy etish, shartnoma shartlari yoki pilot detallarini muhokama qilish uchun birinchi xabarni yuboring.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                    <span>{msg.isMe ? "Siz" : msg.senderName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formattedTime}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                      msg.isMe
                        ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-tr-none"
                        : "bg-slate-800 border border-slate-700/80 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    
                    {msg.isMe && (
                      <div className="flex justify-end mt-1 text-[10px] text-sky-200/70">
                        {msg.isRead ? (
                          <span className="flex items-center gap-0.5 text-sky-300">
                            <CheckCheck className="w-3 h-3" /> o'qildi
                          </span>
                        ) : (
                          <span>yetkazildi</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabaringizni yozing (Enter bosing)..."
            disabled={sending || loading || !!error}
            maxLength={2000}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition"
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || sending || loading || !!error}
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-xl transition shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{sending ? "..." : "Yuborish"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
