"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Save, CheckCircle2, Info, ImagePlus } from "lucide-react";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const clubs = clubsData as Club[];

const atmosphereOptions = ["轻松", "竞技", "学术", "社交", "教学型", "创意", "公益", "硬核", "自由", "深度", "团队", "热血", "传统", "修身", "健康", "包容", "小众", "欢乐", "务实", "成长型"];

export default function ClubProfileEditPage() {
  const params = useParams();
  const clubId = params.clubId as string;
  const club = clubs.find((c) => c.id === clubId);

  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState(() => {
    if (!club) return null;
    return {
      name: club.name,
      category: club.category,
      slogan: club.slogan,
      description: club.description,
      activities: club.coreActivities.map((a) => ({ name: a.name, desc: a.desc })),
      fee: club.fee,
      feeUsage: club.feeUsage,
      requireBasis: club.requireBasis,
      basisDesc: club.basisDesc,
      timeLevel: club.timeLevel,
      atmosphere: [...club.atmosphere],
      joinMode: club.joinMode,
    };
  });

  if (!club || !form) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-4">社团不存在</h1>
        <Link href="/admin" className="text-indigo-600 font-bold hover:underline">返回选择</Link>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    toast.success("社团档案已更新，学生端信息已同步");
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleAtmosphere = (tag: string) => {
    setForm((f) => {
      if (!f) return f;
      const atm = f.atmosphere.includes(tag) ? f.atmosphere.filter((t) => t !== tag) : [...f.atmosphere, tag];
      return { ...f, atmosphere: atm };
    });
  };

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">社团档案</h1>
        <p className="text-slate-500 font-medium">编辑社团信息，学生端和AI知识库将同步更新</p>
      </div>

      {/* Tip banners */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-600 text-sm font-medium">
          <Info size={18} className="shrink-0" />
          以下信息将展示在学生端社团档案页，并同步至 AI 匹配助手的知识库。
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl text-amber-700 text-sm font-medium">
          <CheckCircle2 size={18} className="shrink-0" />
          已加载 2024-2025 学年档案，请确认并更新后保存。
        </div>
      </div>

      {/* Form */}
      <div className="space-y-8">
        {/* Section: Basic Info */}
        <FormSection title="基本信息">
          <div className="grid sm:grid-cols-2 gap-6">
            <FieldInput label="社团名称" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">社团类别</p>
              <div className="flex flex-wrap gap-2">
                {["文艺", "体育", "学术", "公益", "实践", "兴趣"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm({ ...form, category: cat })}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                      form.category === cat
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <FieldInput label="一句话定位" value={form.slogan} onChange={(v) => setForm({ ...form, slogan: v.slice(0, 50) })} maxLength={50} />
          <FieldTextarea label="详细介绍" value={form.description} onChange={(v) => setForm({ ...form, description: v.slice(0, 500) })} maxLength={500} rows={5} />

          {/* Logo upload placeholder */}
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">社团Logo</p>
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer">
              <ImagePlus size={28} />
              <span className="text-[10px] font-bold">点击上传</span>
            </div>
          </div>
        </FormSection>

        {/* Section: Activities & Fees */}
        <FormSection title="活动与费用">
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">核心活动 Top3</p>
            <div className="space-y-4">
              {form.activities.map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div className="flex-1 grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={act.name}
                      onChange={(e) => {
                        const activities = [...form.activities];
                        activities[i] = { ...activities[i], name: e.target.value };
                        setForm({ ...form, activities });
                      }}
                      placeholder="活动名称"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <input
                      type="text"
                      value={act.desc}
                      onChange={(e) => {
                        const activities = [...form.activities];
                        activities[i] = { ...activities[i], desc: e.target.value };
                        setForm({ ...form, activities });
                      }}
                      placeholder="一句话描述"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">社费金额（元）</p>
              <input
                type="number"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
                min={0}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <FieldInput label="社费用途说明" value={form.feeUsage} onChange={(v) => setForm({ ...form, feeUsage: v })} />
          </div>
        </FormSection>

        {/* Section: Recruitment Settings */}
        <FormSection title="招新设置">
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">是否需要基础</p>
            <div className="flex gap-3">
              {[
                { value: false, label: "否（零基础欢迎）" },
                { value: true, label: "是（需要基础）" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setForm({ ...form, requireBasis: opt.value })}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                    form.requireBasis === opt.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {form.requireBasis && (
            <FieldInput label="基础要求说明" value={form.basisDesc} onChange={(v) => setForm({ ...form, basisDesc: v })} />
          )}

          <div className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">每周预计时间投入</p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "轻度" as const, label: "轻度（2h以内）" },
                { value: "中度" as const, label: "中度（2-5h）" },
                { value: "重度" as const, label: "重度（5h以上）" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, timeLevel: opt.value })}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                    form.timeLevel === opt.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">氛围关键词（多选）</p>
            <div className="flex flex-wrap gap-2">
              {atmosphereOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleAtmosphere(tag)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                    form.atmosphere.includes(tag)
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">招新模式</p>
            <div className="flex gap-3">
              {[
                { value: "直接加入" as const, label: "直接加入" },
                { value: "申请审核" as const, label: "申请审核" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, joinMode: opt.value })}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                    form.joinMode === opt.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </FormSection>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
      >
        {saved ? <><CheckCircle2 size={18} /> 已保存并同步</> : <><Save size={18} /> 保存并发布</>}
      </button>

      <p className="text-xs text-slate-400 text-center font-medium">此页面为静态展示，演示社团档案编辑功能</p>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-8 space-y-6">
      <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
      {children}
    </div>
  );
}

function FieldInput({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (v: string) => void; maxLength?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {maxLength && <p className="text-[10px] text-slate-400">{value.length}/{maxLength}</p>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, maxLength, rows }: { label: string; value: string; onChange: (v: string) => void; maxLength?: number; rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {maxLength && <p className="text-[10px] text-slate-400">{value.length}/{maxLength}</p>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        rows={rows || 3}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
      />
    </div>
  );
}
