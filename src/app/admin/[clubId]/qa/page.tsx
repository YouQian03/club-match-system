"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Send, HelpCircle, Info } from "lucide-react";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const clubs = clubsData as Club[];

interface QAItem {
  id: string;
  question: string;
  asker: string;
  time: string;
  status: "已回复" | "待回复";
  answer?: string;
  answerer?: string;
  answererTag?: string;
  inKnowledgeBase?: boolean;
}

const QA_MAP: Record<string, QAItem[]> = {
  "guitar-club": [
    { id: "1", question: "零基础大概多久能上台表演？", asker: "匿名新生", time: "2025-09-15 10:30", status: "已回复", answer: "一般一个学期就可以参加学期末音乐会了，我们会从最基础的和弦开始教，进度因人而异但大部分人都能跟上。", answerer: "陈悦", answererTag: "教学组长", inKnowledgeBase: true },
    { id: "2", question: "需要自己买吉他吗？", asker: "匿名新生", time: "2025-09-16 14:20", status: "已回复", answer: "不用，社团有公用吉他可以借，等你确定要长期学了再自己买也不迟。", answerer: "陈悦", answererTag: "教学组长", inKnowledgeBase: true },
    { id: "3", question: "每周训练时间是固定的吗？可以请假吗？", asker: "匿名新生", time: "2025-09-17 09:15", status: "待回复" },
    { id: "4", question: "社团有没有参加过校外的音乐比赛？", asker: "匿名新生", time: "2025-09-17 16:40", status: "待回复" },
    { id: "5", question: "弹唱和指弹有什么区别？哪个更适合新手？", asker: "匿名新生", time: "2025-09-18 08:00", status: "已回复", answer: "弹唱是边弹和弦边唱歌，入门更简单；指弹是纯器乐演奏，技巧要求更高。新手建议先从弹唱开始。", answerer: "林浩", answererTag: "社长", inKnowledgeBase: false },
  ],
  "street-dance": [
    { id: "1", question: "完全没有舞蹈基础能加入吗？", asker: "匿名新生", time: "2025-09-10 11:00", status: "已回复", answer: "可以！我们每学期都有零基础班，从体能训练和基础律动开始教。不过街舞确实需要付出时间练习，做好心理准备。", answerer: "张凯", answererTag: "社长", inKnowledgeBase: true },
    { id: "2", question: "面试都考什么？", asker: "匿名新生", time: "2025-09-11 15:30", status: "已回复", answer: "不是考舞蹈水平，主要聊聊你为什么想学街舞、时间安排能不能保证。有基础的同学可以展示一段，没基础的不用紧张。", answerer: "张凯", answererTag: "社长", inKnowledgeBase: true },
    { id: "3", question: "训练会不会容易受伤？", asker: "匿名新生", time: "2025-09-12 09:00", status: "待回复" },
    { id: "4", question: "女生多吗？会不会不太方便？", asker: "匿名新生", time: "2025-09-13 10:20", status: "待回复" },
  ],
  "debate-club": [
    { id: "1", question: "没参加过辩论赛能加入吗？", asker: "匿名新生", time: "2025-09-10 08:30", status: "已回复", answer: "完全可以！我们大部分社员都是大学才开始接触辩论的。面试不考辩论技巧，主要看你的思维方式和学习热情。", answerer: "方远", answererTag: "社长", inKnowledgeBase: true },
    { id: "2", question: "辩论社平时都讨论什么话题？", asker: "匿名新生", time: "2025-09-11 14:00", status: "待回复" },
    { id: "3", question: "参加比赛是必须的吗？还是可以只参加日常讨论？", asker: "匿名新生", time: "2025-09-12 11:30", status: "已回复", answer: "比赛不是强制的，我们有竞赛组和兴趣组。兴趣组主要参加时事圆桌讨论和内部练习赛，不需要打外部比赛。", answerer: "方远", answererTag: "社长", inKnowledgeBase: false },
  ],
};

export default function QAManagePage() {
  const params = useParams();
  const clubId = params.clubId as string;
  const club = clubs.find((c) => c.id === clubId);

  const [qaList, setQaList] = useState<QAItem[]>(() => QA_MAP[clubId] || []);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (!club) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-4">社团不存在</h1>
        <Link href="/admin" className="text-indigo-600 font-bold hover:underline">返回选择</Link>
      </div>
    );
  }

  const pendingCount = qaList.filter((q) => q.status === "待回复").length;

  const handleReply = (id: string) => {
    const content = replyInputs[id]?.trim();
    if (!content) return;
    setQaList((prev) => prev.map((q) =>
      q.id === id ? { ...q, status: "已回复" as const, answer: content, answerer: "你", answererTag: "管理员", inKnowledgeBase: false } : q
    ));
    setReplyInputs((prev) => ({ ...prev, [id]: "" }));
    toast.success("回复成功，已公开展示在学生端");
  };

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">问答板管理</h1>
        <p className="text-slate-500 font-medium">
          共 {qaList.length} 条提问，{pendingCount > 0 ? <span className="text-amber-600">{pendingCount} 条待回复</span> : "全部已回复"}
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-600 text-sm font-medium">
        <Info size={18} className="shrink-0" />
        联络人的回答将公开展示在学生端问答板，高频问答审核后纳入 AI 知识库，帮助更多新生。
      </div>

      <div className="space-y-6">
        {qaList.map((item) => (
          <div key={item.id} className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-6 space-y-4">
            {/* Question */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                  <HelpCircle size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{item.question}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.asker}</span>
                    <span className="text-[10px] text-slate-300">{item.time}</span>
                  </div>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shrink-0",
                item.status === "已回复" ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
              )}>
                {item.status}
              </span>
            </div>

            {/* Answer (if replied) */}
            {item.status === "已回复" && item.answer && (
              <div className="ml-11 p-4 bg-indigo-50 rounded-2xl space-y-2">
                <p className="text-sm text-slate-700 leading-relaxed">{item.answer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    {item.answerer} · {item.answererTag}
                  </span>
                  {item.inKnowledgeBase && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-black uppercase tracking-tight">
                      <CheckCircle2 size={12} /> 已纳入AI知识库
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Reply input (if pending) */}
            {item.status === "待回复" && (
              <div className="ml-11 flex gap-3">
                <input
                  type="text"
                  placeholder="输入回复内容..."
                  value={replyInputs[item.id] || ""}
                  onChange={(e) => setReplyInputs((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleReply(item.id)}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button
                  onClick={() => handleReply(item.id)}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Send size={16} /> 回复
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">此页面为静态展示，演示问答板管理功能</p>
    </div>
  );
}
