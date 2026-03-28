"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Send, Sparkles, User, Bot, RefreshCw, Clock, Users, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";

const clubs = clubsData as Club[];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Recommendation {
  id: string;
  name: string;
  reason: string;
}

function parseRecommendations(text: string): { cleanText: string; recommendations: Recommendation[]; isLoadingCards: boolean } {
  const match = text.match(/\[RECOMMEND\]\s*([\s\S]*?)\s*\[\/RECOMMEND\]/);
  if (match) {
    try {
      const recommendations = JSON.parse(match[1]);
      const cleanText = text.replace(/\[RECOMMEND\][\s\S]*?\[\/RECOMMEND\]/, "").trim();
      return { cleanText, recommendations, isLoadingCards: false };
    } catch {
      const cleanText = text.replace(/\[RECOMMEND\][\s\S]*?\[\/RECOMMEND\]/, "").trim();
      return { cleanText, recommendations: [], isLoadingCards: false };
    }
  }
  // If [RECOMMEND] started but not closed yet (streaming), show loading
  const partialMatch = text.indexOf("[RECOMMEND]");
  if (partialMatch !== -1) {
    const cleanText = text.substring(0, partialMatch).trim();
    return { cleanText, recommendations: [], isLoadingCards: true };
  }
  return { cleanText: text, recommendations: [], isLoadingCards: false };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("chat-messages");
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendWithContent = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const err = await response.json();
        setMessages([...newMessages, { role: "assistant", content: `抱歉，出了点问题：${err.error || "请稍后再试"}` }]);
        setIsStreaming(false);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === "data: [DONE]") continue;
          if (trimmedLine.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmedLine.slice(6));
              if (data.content) {
                assistantContent += data.content;
                setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "网络错误，请检查连接后重试。" }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput("");
    sendWithContent(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
    sessionStorage.removeItem("chat-messages");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-[1.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">AI 社团匹配助手</h2>
            <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              在线为你匹配中
            </p>
          </div>
        </div>
        <button onClick={handleReset} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
              <Sparkles size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800">嗨，欢迎来到社团通！</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">聊聊你的兴趣和想法，我来帮你找到最合适的社团。你也可以直接问我任何社团相关的问题。</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto pt-4">
              {[
                "我想找一个轻松的社团",
                "有没有不需要基础的社团？",
                "我喜欢运动但课业压力大",
                "想认识更多朋友",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { if (!isStreaming) sendWithContent(q); }}
                  className="text-sm border-2 border-slate-100 rounded-2xl px-4 py-2 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-slate-500 hover:text-indigo-600 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={cn(
                "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
                msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-indigo-100 text-indigo-600"
              )}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <MessageContent message={msg} />
            </div>
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <div className="relative flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的想法..."
            rows={1}
            className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
          AI 助手基于社团知识库提供推荐，仅供参考
        </p>
      </div>
    </div>
  );
}

function MessageContent({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const { cleanText, recommendations, isLoadingCards } = isUser
    ? { cleanText: message.content, recommendations: [], isLoadingCards: false }
    : parseRecommendations(message.content);

  return (
    <div className="space-y-4">
      {cleanText && (
        <div className={cn(
          "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-indigo-600 text-white rounded-tr-none"
            : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
        )}>
          <p className="whitespace-pre-wrap">{cleanText}</p>
        </div>
      )}

      {isLoadingCards && (
        <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm text-indigo-600 font-medium">正在为你匹配社团...</span>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="grid gap-4 pt-1">
          {recommendations.map((rec, idx) => {
            const club = clubs.find((c) => c.id === rec.id);
            return (
              <div key={rec.id}>
                <Link
                  href={`/clubs/${rec.id}`}
                  className="block bg-white rounded-[1.25rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 hover:border-indigo-200 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                  <div className="relative z-10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {rec.name}
                        </h4>
                        {club && (
                          <p className="text-slate-500 text-xs font-medium italic">
                            &ldquo;{club.slogan}&rdquo;
                          </p>
                        )}
                      </div>
                      {club && (
                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm shrink-0">
                          <Star size={14} fill="currentColor" />
                          {club.rating}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed">{rec.reason}</p>

                    {club && (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
                            {club.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {club.timeLevel}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {club.memberCount}人
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-lg text-[10px] font-black",
                            club.joinMode === "直接加入" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {club.joinMode}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          查看详情 <ChevronRight size={14} />
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
