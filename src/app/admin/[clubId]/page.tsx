"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";
import { cn } from "@/lib/utils";

const clubs = clubsData as Club[];

const roleMap: Record<string, string> = {
  "guitar-club": "社长",
  "street-dance": "副社长",
  "debate-club": "宣传部长",
};

// Mock applicants per club
const APPLICANTS_MAP: Record<string, { id: string; name: string; grade: string; major: string; status: string; time: string; weeklyTime: string }[]> = {
  "guitar-club": [
    { id: "1", name: "张小明", grade: "大一", major: "计算机科学", status: "待面试", time: "2025-09-10 09:15", weeklyTime: "2-5小时" },
    { id: "2", name: "李佳慧", grade: "大一", major: "英语", status: "已录取", time: "2025-09-10 10:30", weeklyTime: "2小时以内" },
    { id: "3", name: "王浩然", grade: "大一", major: "数学", status: "已投递", time: "2025-09-10 14:20", weeklyTime: "2-5小时" },
    { id: "4", name: "赵心怡", grade: "大一", major: "新闻学", status: "待面试", time: "2025-09-11 08:45", weeklyTime: "5小时以上" },
    { id: "5", name: "刘思远", grade: "大一", major: "物理", status: "已录取", time: "2025-09-11 11:00", weeklyTime: "2-5小时" },
    { id: "6", name: "陈雨萱", grade: "大一", major: "设计", status: "未通过", time: "2025-09-11 16:30", weeklyTime: "2小时以内" },
  ],
  "street-dance": [
    { id: "1", name: "周小凡", grade: "大一", major: "体育教育", status: "已录取", time: "2025-09-10 08:00", weeklyTime: "5小时以上" },
    { id: "2", name: "吴佳琪", grade: "大一", major: "艺术设计", status: "待面试", time: "2025-09-10 09:30", weeklyTime: "2-5小时" },
    { id: "3", name: "孙明宇", grade: "大一", major: "软件工程", status: "已投递", time: "2025-09-11 10:00", weeklyTime: "5小时以上" },
    { id: "4", name: "郑小雅", grade: "大二", major: "传播学", status: "待面试", time: "2025-09-11 14:15", weeklyTime: "2-5小时" },
  ],
  "debate-club": [
    { id: "1", name: "黄思源", grade: "大一", major: "法学", status: "已录取", time: "2025-09-10 07:30", weeklyTime: "5小时以上" },
    { id: "2", name: "马晓丽", grade: "大一", major: "哲学", status: "已投递", time: "2025-09-10 11:00", weeklyTime: "2-5小时" },
    { id: "3", name: "林浩宇", grade: "大一", major: "经济学", status: "待面试", time: "2025-09-11 09:45", weeklyTime: "2-5小时" },
    { id: "4", name: "徐文婷", grade: "大一", major: "中文", status: "未通过", time: "2025-09-11 15:20", weeklyTime: "2小时以内" },
    { id: "5", name: "陈立诚", grade: "大一", major: "国际关系", status: "已录取", time: "2025-09-12 08:00", weeklyTime: "5小时以上" },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  "已投递": "bg-blue-50 text-blue-600 border-blue-100",
  "待面试": "bg-amber-50 text-amber-600 border-amber-100",
  "已录取": "bg-green-50 text-green-600 border-green-100",
  "未通过": "bg-red-50 text-red-600 border-red-100",
};

export default function AdminClubPage() {
  const params = useParams();
  const clubId = params.clubId as string;
  const club = clubs.find((c) => c.id === clubId);
  const role = roleMap[clubId] || "管理员";

  const [applicants, setApplicants] = useState(() => APPLICANTS_MAP[clubId] || []);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("全部");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = applicants.filter((app) => {
    const matchesSearch = app.name.includes(search) || app.major.includes(search);
    const matchesStatus = selectedStatus === "全部" || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  if (!club) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-4">社团不存在</h1>
        <Link href="/admin" className="text-indigo-600 font-bold hover:underline">返回选择</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">报名管理</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            招新进行中 · {role} · 共 {applicants.length} 份申请
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.error("请先勾选要录取的报名者");
              } else {
                setApplicants((prev) => prev.map((a) => selectedIds.includes(a.id) ? { ...a, status: "已录取" } : a));
                toast.success(`已录取 ${selectedIds.length} 名同学，通知已自动发送`);
                setSelectedIds([]);
              }
            }}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> 录取
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="搜索姓名、专业..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {["全部", "已投递", "待面试", "已录取", "未通过"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2",
                selectedStatus === status ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-500 border-slate-50 hover:border-indigo-100"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col style={{ width: "48px" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "28%" }} />
            </colgroup>
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 pl-6 pr-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={() => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((a) => a.id))}
                    className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500/20"
                  />
                </th>
                <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">报名者</th>
                <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">状态</th>
                <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">每周可投入</th>
                <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">提交时间</th>
                <th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-4 pl-6 pr-2">
                    <input type="checkbox" checked={selectedIds.includes(app.id)} onChange={() => toggleSelect(app.id)} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0">{app.name[0]}</div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{app.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{app.grade} · {app.major}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap", STATUS_COLORS[app.status] || "")}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">{app.weeklyTime}</span>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-400 font-bold whitespace-nowrap">{app.time}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 border border-slate-100 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                        查看档案
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 border border-slate-100 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                        状态操作
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300"><Search size={32} /></div>
            <p className="text-slate-500 font-medium">没有找到匹配的报名者</p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">此页面为静态展示，演示社团管理后台功能</p>
    </div>
  );
}
