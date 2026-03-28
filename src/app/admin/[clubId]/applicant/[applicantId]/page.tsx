"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CalendarDays, XCircle, User, FileText } from "lucide-react";
import { toast } from "sonner";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";
import { APPLICANTS_MAP } from "@/data/applicants";
import { cn } from "@/lib/utils";

const clubs = clubsData as Club[];

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.clubId as string;
  const applicantId = params.applicantId as string;

  const club = clubs.find((c) => c.id === clubId);
  const applicants = APPLICANTS_MAP[clubId] || [];
  const applicant = applicants.find((a) => a.id === applicantId);

  if (!club || !applicant) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-4">报名者不存在</h1>
        <Link href={`/admin/${clubId}`} className="text-indigo-600 font-bold hover:underline">返回报名管理</Link>
      </div>
    );
  }

  const handleAction = (action: string) => {
    toast.success(`状态已更新为「${action}」，已通知该同学`);
    setTimeout(() => router.push(`/admin/${clubId}`), 1000);
  };

  return (
    <div className="space-y-8 py-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href={`/admin/${clubId}`}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        返回报名管理
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl">
          {applicant.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">{applicant.name}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {applicant.grade} · {applicant.major} · {applicant.studentId}
          </p>
        </div>
      </div>

      {/* Section 1: Basic Profile */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <User size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">基础档案</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <InfoField label="姓名" value={applicant.name} />
          <InfoField label="学号" value={applicant.studentId} />
          <InfoField label="专业" value={applicant.major} />
          <InfoField label="年级" value={applicant.grade} />
          <InfoField label="手机号" value={applicant.phone} />
          <InfoField label="每周可投入时间" value={applicant.weeklyTime} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">兴趣标签</p>
          <div className="flex flex-wrap gap-2">
            {applicant.interests.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold">{tag}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">自我介绍</p>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-2xl p-4">{applicant.intro}</p>
        </div>
      </div>

      {/* Section 2: Application Info */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">社团申请信息</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <InfoField label="申请社团" value={club.name} />
          <InfoField label="提交时间" value={applicant.time} />
          <InfoField label="当前状态" value={applicant.status} />
          <InfoField label="招新模式" value={club.joinMode} />
        </div>

        {applicant.customAnswers.length > 0 ? (
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">社团自定义问题</p>
            {applicant.customAnswers.map((qa, i) => (
              <div key={i} className="space-y-2">
                <p className="text-sm font-bold text-slate-700">{qa.question}</p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-2xl p-4 leading-relaxed">{qa.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-50">
            <p className="text-sm text-slate-400">该社团未设置自定义问题</p>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 bg-[#F8F9FC] py-4 flex gap-3">
        <button
          onClick={() => handleAction("待面试")}
          className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:border-indigo-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <CalendarDays size={18} /> 安排面试
        </button>
        <button
          onClick={() => handleAction("已录取")}
          className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} /> 录取
        </button>
        <button
          onClick={() => handleAction("未通过")}
          className="flex-1 py-4 rounded-2xl bg-white border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
        >
          <XCircle size={18} /> 拒绝
        </button>
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">此页面为静态展示，演示报名者详情功能</p>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
