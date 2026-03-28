"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, CheckCircle2, CalendarDays, XCircle } from "lucide-react";
import { toast } from "sonner";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";
import { APPLICANTS_MAP } from "@/data/applicants";
import { cn } from "@/lib/utils";

const clubs = clubsData as Club[];

const roleMap: Record<string, string> = {
  "guitar-club": "社长",
  "street-dance": "副社长",
  "debate-club": "宣传部长",
};

const STATUS_COLORS: Record<string, string> = {
  "已投递": "bg-blue-50 text-blue-600 border-blue-100",
  "待面试": "bg-amber-50 text-amber-600 border-amber-100",
  "已面试": "bg-violet-50 text-violet-600 border-violet-100",
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

  const hasSelection = selectedIds.length > 0;

  const batchUpdateStatus = (newStatus: string) => {
    setApplicants((prev) => prev.map((a) => selectedIds.includes(a.id) ? { ...a, status: newStatus } : a));
    toast.success(`已更新 ${selectedIds.length} 人状态，通知已发送`);
    setSelectedIds([]);
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
        <div className="flex gap-3">
          <button
            disabled={!hasSelection}
            onClick={() => batchUpdateStatus("待面试")}
            className={cn(
              "px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all",
              hasSelection
                ? "bg-white border border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-slate-50"
                : "bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed"
            )}
          >
            <CalendarDays size={16} /> 安排面试
          </button>
          <button
            disabled={!hasSelection}
            onClick={() => batchUpdateStatus("已录取")}
            className={cn(
              "px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all",
              hasSelection
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                : "bg-indigo-200 text-indigo-400 cursor-not-allowed"
            )}
          >
            <CheckCircle2 size={16} /> 录取
          </button>
          <button
            disabled={!hasSelection}
            onClick={() => batchUpdateStatus("未通过")}
            className={cn(
              "px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all",
              hasSelection
                ? "bg-white border border-red-200 text-red-500 hover:bg-red-50"
                : "bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed"
            )}
          >
            <XCircle size={16} /> 拒绝
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
          {["全部", "已投递", "待面试", "已面试", "已录取", "未通过"].map((status) => (
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 pl-6 pr-2 w-12">
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
                    <Link
                      href={`/admin/${clubId}/applicant/${app.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 border border-slate-100 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all whitespace-nowrap"
                    >
                      查看档案
                    </Link>
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
