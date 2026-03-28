"use client";

import { Search, Users, Lightbulb, RefreshCw, ArrowDown, AlertTriangle, Zap, MessageSquare, CheckCircle2, ChevronRight } from "lucide-react";

const flywheel = [
  "社团录入信息",
  "同步至AI知识库",
  "新生通过AI/浏览发现社团",
  "问答板提问，联络人回答",
  "问答沉淀纳入知识库",
  "入社后填写引导式评价",
  "评价反哺知识库",
  "AI更精准，档案更真实",
];

export default function DesignSection() {
  return (
    <section className="space-y-16" id="design">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">产品设计思路</h2>
        <p className="text-slate-500">从痛点调研到方案落地的完整推导</p>
      </div>

      {/* Step 1 */}
      <StepBlock step={1} title="需求从哪来" icon={<Search size={24} />}>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          我们通过搜索分析知乎公开讨论、高校官方报道、社团招新策划书、往届成员经历分享等渠道，梳理真实招新全流程，提取高频痛点。不是拍脑袋设计的，每个功能背后都有真实调研支撑。
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "知乎高频讨论",
            "高校官方报道（武汉大学等）",
            "社团招新策划书（30+份）",
            "往届成员真实反馈",
          ].map((tag) => (
            <span key={tag} className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
              {tag}
            </span>
          ))}
        </div>
      </StepBlock>

      <StepArrow />

      {/* Step 2 */}
      <StepBlock step={2} title="我们的用户与核心痛点" icon={<Users size={24} />}>
        {/* User Personas */}
        <div className="space-y-6 mb-8">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">目标用户</h4>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">新生端</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "目标明确型新生", desc: "已知想加什么社团，需要验证这个社团靠不靠谱" },
                { title: "方向模糊型新生", desc: "不知道自己适合什么，面对百团大战无从下手" },
                { title: "社恐/被动型新生", desc: "想了解社团但不敢在线下主动询问" },
              ].map((u) => (
                <div key={u.title} className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="font-black text-sm text-indigo-700 mb-1">{u.title}</p>
                  <p className="text-xs text-indigo-600/80">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">社团端</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "社团负责人", desc: "统筹招新全流程，每年重复大量手工操作（写宣传、收报名、排面试、发通知）" },
                { title: "面试官", desc: "负责筛选候选人，面试前对报名者几乎一无所知" },
              ].map((u) => (
                <div key={u.title} className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <p className="font-black text-sm text-emerald-700 mb-1">{u.title}</p>
                  <p className="text-xs text-emerald-600/80">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Pain Points */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">他们共同面临的核心痛点</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "信息不对称",
                desc: "社团宣传都是包装话术，新生看不到真实的活动频率、留存率、往届体验",
                source: "知乎高频讨论",
              },
              {
                title: "报名流程繁琐",
                desc: "每个社团报名方式不同，重复填表，面试时间靠群通知，录取结果石沉大海",
                source: "社团招新策划书",
              },
              {
                title: "难以匹配兴趣",
                desc: "百团大战信息过载，新生不了解自己的兴趣方向，选择瘫痪",
                source: "高校官方报道",
              },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-[1.25rem] p-6 border border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <p className="font-black text-sm text-slate-800">{p.title}</p>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">来源：{p.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Pain Points */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">调研中还发现的额外痛点</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "社恐新生被线下场景劝退",
              "入社后货不对板",
              "加入过多社团影响学业",
              "兴趣类社团面试流程过重",
            ].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </StepBlock>

      <StepArrow />

      {/* Step 3 */}
      <StepBlock step={3} title="解决方案" icon={<Lightbulb size={24} />}>
        <div className="space-y-6">
          {[
            { pain: "信息不对称", solution: "结构化档案 + 往届引导式评价 + 平台客观数据 + 问答板沉淀" },
            { pain: "报名流程繁琐", solution: "统一基础档案 + 社团自定义补充问题 + 招新模式区分（直接加入/申请审核）" },
            { pain: "难以匹配兴趣", solution: "AI 多维对话匹配（兴趣方向 x 时间承受力 x 社交偏好 x 成长预期）" },
          ].map((item) => (
            <div key={item.pain} className="bg-white rounded-[1.25rem] p-6 border border-slate-100 flex items-start gap-4">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 shrink-0 mt-0.5">
                {item.pain}
              </span>
              <div className="flex items-start gap-2">
                <Zap size={14} className="text-indigo-500 mt-1 shrink-0" />
                <p className="text-sm font-bold text-slate-800">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </StepBlock>

      <StepArrow />

      {/* Step 4 */}
      <StepBlock step={4} title="越用越聪明的数据飞轮" icon={<RefreshCw size={24} />}>
        {/* Flywheel */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {flywheel.map((step, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <div className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 whitespace-nowrap">
                  {step}
                </div>
                {i < flywheel.length - 1 && (
                  <ChevronRight size={16} className="text-indigo-300 shrink-0" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 md:gap-3">
              <ChevronRight size={16} className="text-indigo-300 shrink-0" />
              <div className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold whitespace-nowrap">
                循环
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center mt-6 leading-relaxed max-w-2xl mx-auto">
            每一届新生的问答和评价都在增厚知识库，平台越用越聪明 —— 这不是一个静态工具，而是一个有数据飞轮的智能系统。
          </p>
        </div>
      </StepBlock>

      <StepArrow />

      {/* Architecture (preserved) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
            5
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">产品架构</h3>
        </div>
        <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-8 text-center">
            {[
              { title: "学生端", color: "text-indigo-600", items: ["AI 匹配助手", "社团浏览 + 筛选", "社团档案页", "一键报名", "申请追踪"] },
              { title: "社团端", color: "text-emerald-600", items: ["档案编辑", "报名管理", "面试安排", "问答回复"] },
            ].map((col) => (
              <div key={col.title}>
                <div className={`font-black ${col.color} mb-4 text-sm uppercase tracking-widest`}>{col.title}</div>
                <div className="space-y-2 text-sm">
                  {col.items.map((item) => (
                    <div key={item} className="bg-slate-50 rounded-xl p-3 font-medium text-slate-600">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-block bg-indigo-50 text-indigo-600 rounded-2xl px-6 py-3 text-sm font-black">
              AI 知识库（RAG）— 数据中枢
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              社团信息 + 评价数据 + 问答沉淀 → 持续增厚，形成数据飞轮
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepBlock({ step, title, icon, children }: { step: number; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">
          {step}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-indigo-500">{icon}</span>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Step {step} · {title}</h3>
        </div>
      </div>
      <div className="ml-14">
        {children}
      </div>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-1">
        <div className="w-[2px] h-6 bg-indigo-200" />
        <ArrowDown size={18} className="text-indigo-400" />
      </div>
    </div>
  );
}
