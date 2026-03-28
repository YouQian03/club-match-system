"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ClipboardList, Clock, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  clubName: string;
  status: string;
  mode: string;
  time: string;
  color: string;
  interview?: { time: string; location: string };
}

const mockApplications: Application[] = [
  { id: "1", clubName: "回声吉他社", status: "已加入", mode: "直接加入", time: "2025-09-10 14:30", color: "bg-green-50 text-green-600 border-green-100" },
  { id: "2", clubName: "Pulse街舞社", status: "待面试", mode: "申请审核", time: "2025-09-11 09:15", interview: { time: "2025-09-18 14:00", location: "学生活动中心 B201" }, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { id: "3", clubName: "锋芒辩论社", status: "已录取", mode: "申请审核", time: "2025-09-10 11:20", color: "bg-green-50 text-green-600 border-green-100" },
  { id: "4", clubName: "创行创业社", status: "已投递", mode: "申请审核", time: "2025-09-12 16:45", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { id: "5", clubName: "光影话剧社", status: "未通过", mode: "申请审核", time: "2025-09-10 10:00", color: "bg-red-50 text-red-600 border-red-100" },
];

const STATUSES = ["全部", "已加入", "已投递", "待面试", "已录取", "未通过"];

function loadApplications(): Application[] {
  if (typeof window === "undefined") return mockApplications;
  const saved = sessionStorage.getItem("myApplications");
  const userApps: Application[] = saved ? JSON.parse(saved) : [];
  // Merge: user apps first, then mock apps (skip duplicates by clubName)
  const userClubNames = new Set(userApps.map((a) => a.clubName));
  const dedupedMock = mockApplications.filter((a) => !userClubNames.has(a.clubName));
  return [...userApps, ...dedupedMock];
}

export default function MyApplicationsPage() {
  const [selectedStatus, setSelectedStatus] = useState("全部");
  const [applications] = useState<Application[]>(() => loadApplications());

  const filtered = useMemo(() => {
    if (selectedStatus === "全部") return applications;
    return applications.filter((a) => a.status === selectedStatus);
  }, [selectedStatus, applications]);

  return (
    <div className="space-y-12 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">我的申请</h1>
          <p className="text-slate-500 font-medium">全流程进度追踪，招新结果实时掌握</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100">
          <ClipboardList size={32} />
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2",
              selectedStatus === status
                ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                : "bg-white text-slate-500 border-slate-100 hover:border-indigo-100"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filtered.map((app, idx) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[1.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all group"
          >
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {app.clubName[0]}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-800">{app.clubName}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{app.mode}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span>{app.time} 提交</span>
                    </div>
                  </div>
                </div>

                {app.interview && (
                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                      <CalendarDays size={16} /> 面试安排
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-indigo-400" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">面试时间</p>
                          <p className="text-sm font-bold text-slate-700">{app.interview.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-indigo-400" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">面试地点</p>
                          <p className="text-sm font-bold text-slate-700">{app.interview.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center items-center md:items-end gap-4 min-w-[120px]">
                <div className={cn("px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest border-2", app.color)}>
                  {app.status}
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all">
                  查看详情 <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-slate-50 rounded-[1.5rem] p-12 text-center space-y-4 border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
            <Clock size={32} />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-slate-700">没有该状态的申请</h4>
            <p className="text-slate-400 text-sm">试试其他筛选条件</p>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-[1.5rem] p-12 text-center space-y-4 border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
          <Clock size={32} />
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-black text-slate-700">没有更多申请了</h4>
          <p className="text-slate-400 text-sm">去发现更多有趣的社团吧！</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">此页面为静态展示，演示全流程状态追踪功能</p>
    </div>
  );
}
