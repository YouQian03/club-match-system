"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Users, UserPlus, CheckCircle2, TrendingUp, Sparkles, MessageSquare } from "lucide-react";

const barData = [
  { name: "报名", value: 1247 },
  { name: "通过筛选", value: 1050 },
  { name: "参加面试", value: 680 },
  { name: "最终录取", value: 856 },
];

const pieData = [
  { name: "文艺", value: 280 },
  { name: "体育", value: 320 },
  { name: "学术", value: 180 },
  { name: "公益", value: 190 },
  { name: "实践", value: 150 },
  { name: "兴趣", value: 227 },
];

const COLORS = ["#4F46E5", "#818CF8", "#34D399", "#FBBF24", "#F87171", "#FB923C"];

const hotClubs = [
  { name: "烈风篮球社", count: 156, category: "体育" },
  { name: "星火志愿者协会", count: 134, category: "公益" },
  { name: "回声吉他社", count: 92, category: "文艺" },
  { name: "二次元动漫社", count: 87, category: "兴趣" },
  { name: "字节跳动编程社", count: 76, category: "学术" },
];

export default function DashboardSection() {
  return (
    <section className="space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">招新数据概览</h2>
        <p className="text-slate-500">2025 秋季招新实时数据 · 全校维度</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={<UserPlus className="text-indigo-600" />} label="总报名人次" value="1,247" trend="+23%" />
        <StatCard icon={<Users className="text-blue-600" />} label="覆盖社团数" value="18" trend="全部活跃" />
        <StatCard icon={<Sparkles className="text-violet-600" />} label="AI 匹配人次" value="860" trend="+31%" />
        <StatCard icon={<CheckCircle2 className="text-green-600" />} label="成功录取" value="856" trend="68.6%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-[1.25rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">招新转化漏斗</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">实时更新</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }} />
                <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">类别分布</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">按报名量</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Clubs Ranking */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">热门社团排行</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">按报名量</span>
        </div>
        <div className="space-y-4">
          {hotClubs.map((club, idx) => (
            <div key={club.name} className="flex items-center gap-4 group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${idx < 3 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">{club.name}</span>
                  <span className="text-xs font-black text-slate-800">{club.count} 人</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${(club.count / hotClubs[0].count) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 w-12">{club.category}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">以上数据为 Mock 展示数据</p>
    </section>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="bg-white p-6 rounded-[1.25rem] border border-slate-100 shadow-sm space-y-3 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
      <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg inline-block">{trend}</p>
    </div>
  );
}
