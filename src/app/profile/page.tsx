"use client";

import { useState } from "react";
import { UserCircle, Save, CheckCircle2, Shield, Smartphone, LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const interestOptions = [
  "音乐", "舞蹈", "运动", "阅读", "编程", "摄影", "绘画", "书法",
  "辩论", "演讲", "创业", "公益", "游戏", "动漫", "美食", "旅行",
  "戏剧", "武术", "跑步", "环保",
];

const timeOptions = ["2小时以内", "2-5小时", "5小时以上"];

const defaultProfile = {
  name: "张小明",
  studentId: "2025010001",
  major: "计算机科学与技术",
  grade: "大一",
  phone: "13812348888",
  intro: "我是一名大一新生，对很多事物都充满好奇心，希望在大学里找到志同道合的朋友，一起成长。",
  weeklyTime: "2-5小时",
};

const defaultInterests = ["音乐", "运动", "编程", "阅读"];

function loadProfile() {
  if (typeof window === "undefined") return { profile: defaultProfile, interests: defaultInterests };
  const saved = sessionStorage.getItem("userProfile");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { profile: parsed.profile || defaultProfile, interests: parsed.interests || defaultInterests };
    } catch { /* ignore */ }
  }
  return { profile: defaultProfile, interests: defaultInterests };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => loadProfile().profile);
  const [interests, setInterests] = useState<string[]>(() => loadProfile().interests);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    sessionStorage.setItem("userProfile", JSON.stringify({ profile, interests }));
    setSaved(true);
    toast.success("档案已保存");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-12 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">个人中心</h1>
          <p className="text-slate-500 font-medium">管理你的账号信息和基础档案</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100">
          <UserCircle size={32} />
        </div>
      </div>

      {/* Account Info */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Shield size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">账号信息</h2>
        </div>
        <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <AccountRow label="手机号" value="138****8888" action="更换" />
          <AccountRow label="登录密码" value="已设置" action="修改" />
          <AccountRow label="微信绑定" value="已绑定" action="解绑" bound />
          <AccountRow label="QQ 绑定" value="未绑定" action="去绑定" />
        </div>
      </section>

      {/* Basic Profile */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Save size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">基础档案</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">填写一次，申请时自动带入所有社团</span>
        </div>

        <div className="bg-white rounded-[1.25rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <FieldInput label="姓名" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <FieldInput label="学号" value={profile.studentId} onChange={(v) => setProfile({ ...profile, studentId: v })} />
            <FieldInput label="专业" value={profile.major} onChange={(v) => setProfile({ ...profile, major: v })} />
            <FieldSelect label="年级" value={profile.grade} options={["大一", "大二", "大三", "大四"]} onChange={(v) => setProfile({ ...profile, grade: v })} />
            <FieldInput label="手机号" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">自我介绍（200字以内）</p>
            <textarea
              value={profile.intro}
              onChange={(e) => setProfile({ ...profile, intro: e.target.value.slice(0, 200) })}
              rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
            <p className="text-[10px] text-slate-400 text-right">{profile.intro.length}/200</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">每周可投入课余时间</p>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setProfile({ ...profile, weeklyTime: opt })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                    profile.weeklyTime === opt
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">兴趣标签（多选）</p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                    interests.includes(tag)
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {saved ? <><CheckCircle2 size={18} /> 已保存</> : <><Save size={18} /> 保存档案</>}
          </button>
        </div>
      </section>

      <div className="pt-4">
        <button className="w-full py-4 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2">
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </div>
  );
}

function AccountRow({ label, value, action, bound }: { label: string; value: string; action: string; bound?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-slate-500 w-20">{label}</span>
        <span className={cn("text-sm font-medium", bound ? "text-green-600" : "text-slate-800")}>{value}</span>
      </div>
      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
        {action}
      </button>
    </div>
  );
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
      />
    </div>
  );
}

function FieldSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
