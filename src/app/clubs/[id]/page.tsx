"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Star, Clock, Users, CheckCircle2, Heart, Share2,
  Info, HelpCircle, MessageCircle, UserPlus, Zap, ShieldCheck,
  Trophy, CalendarDays, X,
} from "lucide-react";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const clubs = clubsData as Club[];

export default function ClubDetailPage() {
  const params = useParams();
  const club = useMemo(() => clubs.find((c) => c.id === params.id), [params.id]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [isApplied, setIsApplied] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [qaInput, setQaInput] = useState("");
  const userProfile = useMemo(() => {
    if (typeof window === "undefined") return { name: "张小明", studentId: "2025010001", major: "计算机科学与技术", grade: "大一" };
    const saved = sessionStorage.getItem("userProfile");
    if (saved) {
      try { return JSON.parse(saved).profile; } catch { /* ignore */ }
    }
    return { name: "张小明", studentId: "2025010001", major: "计算机科学与技术", grade: "大一" };
  }, [showApplyModal]);

  if (!club) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-4">社团不存在</h1>
        <Link href="/clubs" className="text-indigo-600 font-bold hover:underline">返回列表</Link>
      </div>
    );
  }

  const hasCustomQuestions = club.customQuestions.length > 0;

  const handleApply = () => {
    if (applyStep === 1 && hasCustomQuestions) {
      setApplyStep(2);
    } else {
      setIsApplied(true);

      // Save application to sessionStorage
      const status = club.joinMode === "直接加入" ? "已加入" : "已投递";
      const colorMap: Record<string, string> = {
        "已加入": "bg-green-50 text-green-600 border-green-100",
        "已投递": "bg-blue-50 text-blue-600 border-blue-100",
      };
      const newApp = {
        id: `app-${Date.now()}`,
        clubName: club.name,
        status,
        mode: club.joinMode,
        time: new Date().toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-"),
        color: colorMap[status],
      };
      const existing = JSON.parse(sessionStorage.getItem("myApplications") || "[]");
      // Avoid duplicate
      if (!existing.some((a: { clubName: string }) => a.clubName === club.name)) {
        sessionStorage.setItem("myApplications", JSON.stringify([newApp, ...existing]));
      }

      setTimeout(() => {
        setShowApplyModal(false);
        setApplyStep(1);
        setIsApplied(false);
        setAnswers({});
        if (club.joinMode === "直接加入") {
          toast.success(`已成功加入「${club.name}」！`);
        } else {
          toast.success(`申请已提交至「${club.name}」，请耐心等待审核`);
        }
      }, 2000);
    }
  };

  const avgScores = useMemo(() => {
    if (club.reviews.length === 0) return null;
    const keys = ["活动质量", "氛围友好度", "时间合理性", "收获感"] as const;
    const result: Record<string, number> = {};
    for (const key of keys) {
      result[key] = club.reviews.reduce((sum, r) => sum + r.scores[key], 0) / club.reviews.length;
    }
    return result;
  }, [club.reviews]);

  return (
    <div className="space-y-12 py-6 relative">
      {/* Hero */}
      <section className="bg-white rounded-[1.25rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

        <div className="relative z-10 space-y-8">
          <Link
            href="/clubs"
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            返回列表
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                  {club.category}
                </span>
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                  club.joinMode === "直接加入" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                )}>
                  {club.joinMode}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-slate-800 leading-tight">{club.name}</h1>
                <p className="text-xl text-slate-500 font-medium italic">&ldquo;{club.slogan}&rdquo;</p>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                <HeaderStat icon={<Star className="text-yellow-500" />} value={club.rating.toString()} label="综合评分" />
                <HeaderStat icon={<Users className="text-indigo-500" />} value={club.memberCount.toString()} label="当前成员" />
                <HeaderStat icon={<Clock className="text-blue-500" />} value={`每周 ${club.weeklyHours}h`} label="预计投入" />
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-4">
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full md:w-64 px-8 py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <UserPlus size={24} />
                {club.joinMode === "直接加入" ? "立即加入" : "申请加入"}
              </button>
              <div className="flex gap-3">
                <button className="flex-1 p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                  <Heart size={20} /> 收藏
                </button>
                <button className="flex-1 p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                  <Share2 size={20} /> 分享
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-16">
          {/* Description */}
          <section className="space-y-6">
            <SectionTitle icon={<Info size={24} />} title="社团简介" />
            <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100 shadow-sm leading-relaxed text-slate-600 space-y-6">
              <p>{club.description}</p>
              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                <div className="space-y-2">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">核心活动</h5>
                  <ul className="space-y-3">
                    {club.coreActivities.map((act, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Zap size={12} fill="currentColor" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{act.name}</p>
                          <p className="text-xs text-slate-400">{act.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">招新要求</h5>
                    <div className="flex items-start gap-3">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5", club.requireBasis ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600")}>
                        {club.requireBasis ? <ShieldCheck size={12} /> : <CheckCircle2 size={12} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{club.requireBasis ? "需要基础" : "零基础欢迎"}</p>
                        <p className="text-xs text-slate-400">{club.basisDesc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">社费</h5>
                    <p className="text-sm font-bold text-slate-700">{club.fee === 0 ? "免费" : `¥${club.fee}`}</p>
                    {club.feeUsage && <p className="text-xs text-slate-400">{club.feeUsage}</p>}
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">氛围关键词</h5>
                    <div className="flex flex-wrap gap-2">
                      {club.atmosphere.map((a) => (
                        <span key={a} className="px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold">#{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionTitle icon={<Star size={24} />} title="往届评价" />
              <span className="text-sm font-bold text-slate-400">{club.reviews.length} 条评价</span>
            </div>

            {avgScores && (
              <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-black text-indigo-600">{club.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill={i <= Math.round(club.rating) ? "currentColor" : "none"} className="text-yellow-500" />)}
                    </div>
                    <p className="text-xs text-slate-400 font-bold mt-1">{club.reviews.length} 条真实评价</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  {Object.entries(avgScores).map(([label, score]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i <= Math.round(score) ? "bg-indigo-600" : "bg-slate-100")} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {club.reviews.map((review, i) => (
                <div key={i} className="bg-white rounded-[1.25rem] p-8 border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-indigo-50 transition-colors">
                    <Star size={80} fill="currentColor" />
                  </div>

                  <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                        {review.grade[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{review.grade} 成员</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((j) => <Star key={j} size={12} fill={j <= Math.round(review.overall) ? "currentColor" : "none"} className="text-yellow-500" />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">真实体验</span>
                  </div>

                  <div className="relative z-10 grid sm:grid-cols-2 gap-8">
                    <ReviewItem label="每周实际投入" value={review.weeklyHoursActual} />
                    <ReviewItem label="氛围印象" value={review.threeWords.join("、")} />
                    <ReviewItem label="印象最深的活动" value={review.bestActivity} />
                    <ReviewItem label="最大收获" value={review.gain} />
                    <ReviewItem label="最大遗憾" value={review.regret} />
                  </div>

                  <div className="relative z-10 pt-6 border-t border-slate-50 flex flex-wrap gap-6">
                    {Object.entries(review.scores).map(([label, score]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((j) => <div key={j} className={cn("w-1.5 h-1.5 rounded-full", j <= score ? "bg-indigo-600" : "bg-slate-100")} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Q&A */}
          <section className="space-y-6">
            <SectionTitle icon={<HelpCircle size={24} />} title="问答板" />
            <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-600 text-xs font-medium">
                <Info size={16} />
                社团联络人的回答将沉淀为公开 FAQ，并纳入 AI 助手的知识库，帮助更多新生。
              </div>

              <div className="space-y-8">
                {club.qa.map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 border border-slate-100 max-w-[80%]">
                        <p className="font-bold text-[10px] text-slate-400 mb-1 uppercase tracking-wider">{item.asker}</p>
                        {item.question}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none text-sm text-white shadow-lg shadow-indigo-100 max-w-[80%] relative">
                        <p className="font-bold text-[10px] text-indigo-200 mb-1 uppercase tracking-wider">{item.answerer} · {item.answererTag}</p>
                        {item.answer}
                        {item.inKnowledgeBase && (
                          <div className="absolute -bottom-6 right-0 flex items-center gap-1 text-[10px] text-green-600 font-black uppercase tracking-tight">
                            <CheckCircle2 size={12} /> 已纳入 AI 知识库
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-50 flex gap-4">
                <input
                  type="text"
                  placeholder="向社团提问..."
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  onClick={() => { if (qaInput.trim()) { toast.success("问题已发送，联络人会尽快回复"); setQaInput(""); } }}
                  className="px-8 py-4 rounded-2xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 transition-all"
                >
                  提问
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-12">
          {/* Objective Data */}
          <section className="space-y-6">
            <SectionTitle icon={<Zap size={24} />} title="平台客观数据" />
            <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <DataRow icon={<Users size={18} />} label="当前成员数" value={`${club.memberCount} 人`} />
              <DataRow icon={<CalendarDays size={18} />} label="上学期活动次数" value={club.lastTermActivities.toString()} />
              <DataRow icon={<Trophy size={18} />} label="成员留存率" value={`${(club.retentionRate * 100).toFixed(0)}%`} />
              <DataRow icon={<Star size={18} />} label="综合评分" value={club.rating.toFixed(1)} />
            </div>
          </section>

          {/* Contacts */}
          <section className="space-y-6">
            <SectionTitle icon={<MessageCircle size={24} />} title="联系学长学姐" />
            <div className="space-y-4">
              {club.contacts.map((contact, i) => (
                <ContactCard key={i} contact={contact} />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium text-center">
              AI 先答 → 问答板留言 → 微信私聊
            </p>
          </section>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowApplyModal(false); setApplyStep(1); setAnswers({}); }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[1.25rem] p-10 z-[110] shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800">申请加入 {club.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    步骤 {applyStep} / {hasCustomQuestions ? 2 : 1}
                  </p>
                </div>
                <button onClick={() => { setShowApplyModal(false); setApplyStep(1); setAnswers({}); }} className="p-2 text-slate-300 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              {isApplied ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-800">
                      {club.joinMode === "直接加入" ? "已成功加入！" : "申请已提交！"}
                    </h4>
                    <p className="text-slate-500 text-sm">你可以在&ldquo;我的申请&rdquo;中随时查看进度。</p>
                  </div>
                </div>
              ) : (
                <>
                  {applyStep === 1 ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">基础档案 (已自动带入)</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <ProfileField label="姓名" value={userProfile.name} />
                          <ProfileField label="学号" value={userProfile.studentId} />
                          <ProfileField label="专业" value={userProfile.major} />
                          <ProfileField label="年级" value={userProfile.grade} />
                        </div>
                      </div>
                      <button
                        onClick={handleApply}
                        className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                      >
                        {hasCustomQuestions ? "下一步" : (club.joinMode === "直接加入" ? "确认加入" : "确认提交")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">社团补充问题</h5>
                      {club.customQuestions.map((q, i) => (
                        <div key={i} className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">{q.question}</label>
                          {q.type === "short-answer" ? (
                            <textarea
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24"
                              placeholder="请输入你的回答..."
                              value={answers[i] || ""}
                              onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                            />
                          ) : (
                            <div className="space-y-2">
                              {q.options?.map((opt) => (
                                <label key={opt} className={cn(
                                  "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                                  answers[i] === opt ? "border-indigo-300 bg-indigo-50" : "border-slate-100 hover:bg-slate-50"
                                )}>
                                  <input type="radio" name={`q-${i}`} value={opt} checked={answers[i] === opt} onChange={() => setAnswers({ ...answers, [i]: opt })} className="accent-indigo-500" />
                                  <span className="text-sm">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setApplyStep(1)} className="flex-1 py-5 rounded-2xl bg-slate-100 text-slate-600 font-black text-lg hover:bg-slate-200 transition-all">
                          上一步
                        </button>
                        <button onClick={handleApply} className="flex-[2] py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                          确认提交
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeaderStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-50 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-lg font-black text-slate-800 leading-none">{value}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</p>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">{icon}</div>
      <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm text-slate-600 font-medium leading-relaxed">{value}</p>
    </div>
  );
}

function DataRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">{icon}</div>
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-800">{value}</span>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400 text-[10px] font-bold uppercase">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function ContactCard({ contact }: { contact: Club["contacts"][number] }) {
  const [showWechat, setShowWechat] = useState(false);
  return (
    <div className="bg-white rounded-[1.25rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl">
        {contact.name[0]}
      </div>
      <div className="flex-1">
        <p className="font-black text-slate-800">{contact.name}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{contact.grade} · {contact.tag}</p>
      </div>
      <button
        onClick={() => setShowWechat(!showWechat)}
        className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs font-bold"
      >
        {showWechat ? contact.wechat : "微信"}
      </button>
    </div>
  );
}
