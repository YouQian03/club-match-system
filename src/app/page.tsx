"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Compass, ClipboardList, ChevronRight, Star, Zap } from "lucide-react";
import DashboardSection from "@/components/DashboardSection";

const features = [
  {
    icon: <Sparkles className="text-indigo-600" size={32} />,
    title: "AI 智能匹配",
    desc: "通过 3-5 轮自然对话，从兴趣、时间、社交、成长四个维度为你推荐最契合的社团。",
    color: "bg-indigo-50",
  },
  {
    icon: <Compass className="text-violet-600" size={32} />,
    title: "结构化浏览",
    desc: "拒绝杂乱的推文，所有社团信息结构化呈现。客观数据、往届评价一目了然。",
    color: "bg-violet-50",
  },
  {
    icon: <ClipboardList className="text-blue-600" size={32} />,
    title: "一键报名管理",
    desc: "统一基础档案，告别重复填表。全流程进度追踪，招新结果实时掌握。",
    color: "bg-blue-50",
  },
];

const painPoints = [
  { pain: "社团宣传都是包装话术，入社后发现'货不对板'", source: "知乎高频讨论", solution: "结构化档案 + 往届真实评价 + 平台客观数据" },
  { pain: "百团大战信息过载，不知道自己适合什么", source: "高校官方报道", solution: "AI 四维匹配对话 + 结构化浏览筛选" },
  { pain: "每个社团报名方式不同，重复填表", source: "社团招新策划书", solution: "统一基础档案 + 自定义补充问题 + 全流程追踪" },
  { pain: "社恐新生被线下招新的高压社交场景劝退", source: "知乎多个讨论帖", solution: "全流程线上完成，AI 对话零社交压力" },
];

const decisions = [
  { choice: "AI 对话 vs 问卷", reason: "问卷死板且无法处理模糊表达，对话能理解'想学点东西但不想太累'这种表述" },
  { choice: "多维匹配 vs 纯兴趣匹配", reason: "新生选社团的决策因子远不止兴趣，时间投入、氛围、成长预期同样关键" },
  { choice: "引导式评价 vs 自由文字", reason: "结构化的体验切片比笼统好评更有决策参考价值，每条评价自动回答新生最关心的问题" },
  { choice: "问答纳入知识库 vs 仅作展示", reason: "形成数据飞轮，平台越用越聪明，每一届新生的问答都在增厚 AI 能力" },
];

export default function Home() {
  return (
    <div className="space-y-20 py-10">
      {/* Hero */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold border border-indigo-100"
        >
          <Zap size={16} fill="currentColor" />
          <span>2026 招新季正式开启</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]"
        >
          找到属于你的 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            大学第二课堂
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          社团通通过 AI 智能匹配与结构化浏览，帮你从百团大战中精准锁定最适合你的社团。
          告别信息不对称，开启精彩大学生活。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/chat"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            开始 AI 智能匹配
          </Link>
          <Link
            href="/clubs"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold text-lg border-2 border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Compass size={20} />
            浏览全部社团
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[
          { number: "18+", label: "覆盖社团" },
          { number: "1200+", label: "已入驻学生" },
          { number: "860+", label: "成功匹配" },
          { number: "98%", label: "好评率" },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-100 text-center space-y-2 shadow-sm">
            <p className="text-3xl font-black text-indigo-600">{s.number}</p>
            <p className="text-sm text-slate-500 font-medium">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">核心功能</h2>
          <p className="text-slate-500">全方位助力你的社团探索之旅</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8 rounded-[1.25rem] border border-slate-100 space-y-6 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${f.color}`}>
                {f.icon}
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-slate-800">{f.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-indigo-600 rounded-[1.25rem] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={20} fill="currentColor" className="text-yellow-400" />
              ))}
            </div>
            <h3 className="text-3xl md:text-4xl font-bold leading-tight">
              &ldquo;以前参加百团大战总是看花了眼，用了社团通后，AI 推荐的吉他社简直就是我的天选社团！&rdquo;
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30" />
              <div>
                <p className="font-bold text-lg">李同学</p>
                <p className="text-indigo-100 text-sm">计算机学院 · 大一新生</p>
              </div>
            </div>
          </div>
          <Link
            href="/chat"
            className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-lg hover:bg-indigo-50 transition-all flex items-center gap-2 shrink-0"
          >
            我也要试试
            <ChevronRight size={20} />
          </Link>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
      </section>

      {/* Dashboard Overview */}
      <DashboardSection />

      {/* Design Section */}
      <section className="space-y-12" id="design">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">设计说明</h2>
          <p className="text-slate-500">调研洞察与核心设计决策</p>
        </div>

        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">调研洞察</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <div key={i} className="bg-white rounded-[1.25rem] p-6 border border-slate-100 space-y-3 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                <p className="font-bold text-sm text-slate-800">{p.pain}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">来源：{p.source}</p>
                <div className="flex items-start gap-2 pt-2 border-t border-slate-50">
                  <Zap size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-indigo-600 font-medium">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">核心设计决策</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {decisions.map((d, i) => (
              <div key={i} className="bg-white rounded-[1.25rem] p-6 border border-slate-100 space-y-2 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                <p className="font-black text-indigo-600 text-sm">{d.choice}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{d.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">产品架构</h3>
          <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { title: "学生端", color: "text-indigo-600", items: ["AI 匹配助手", "社团浏览 + 筛选", "社团档案页", "一键报名", "申请追踪"] },
                { title: "社团端", color: "text-emerald-600", items: ["档案编辑", "报名管理", "面试安排", "问答回复", "数据统计"] },
                { title: "管理端", color: "text-amber-600", items: ["全校数据看板", "社团考核", "资源分配"] },
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

        {/* User Roles */}
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">用户角色地图</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "目标明确型新生", need: "真实评价 + 客观数据 + 学长学姐交流", border: "border-indigo-200" },
              { title: "方向模糊型新生", need: "AI 引导发现兴趣 + 多维匹配推荐", border: "border-indigo-200" },
              { title: "社恐/被动型新生", need: "线上全流程 + 匿名提问 + 零压力", border: "border-indigo-200" },
              { title: "社团负责人", need: "一站式招新管理 + 报名者筛选", border: "border-emerald-200" },
              { title: "面试官", need: "提前查看报名者档案 + 针对性回答", border: "border-emerald-200" },
              { title: "社联/团委管理者", need: "全局数据看板 + 流程标准化", border: "border-amber-200" },
            ].map((role) => (
              <div key={role.title} className={`bg-white border-2 ${role.border} rounded-2xl p-5 hover:shadow-md transition-all`}>
                <p className="font-black text-sm text-slate-800 mb-1">{role.title}</p>
                <p className="text-xs text-slate-500">{role.need}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white rounded-t-[1.25rem] py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="text-lg font-bold text-slate-800">社团通</span>
        </div>
        <p className="text-slate-500 text-sm mb-6">连接兴趣，开启精彩大学生活</p>
        <div className="flex justify-center gap-8 text-sm text-slate-400">
          <span className="hover:text-indigo-600 cursor-pointer">关于我们</span>
          <span className="hover:text-indigo-600 cursor-pointer">使用协议</span>
          <span className="hover:text-indigo-600 cursor-pointer">隐私政策</span>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-100 text-xs text-slate-400">
          &copy; 2026 社团通. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
