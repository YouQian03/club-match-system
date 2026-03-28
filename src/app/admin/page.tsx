"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Users, ChevronRight, Shield } from "lucide-react";

const myClubs = [
  { id: "guitar-club", name: "回声吉他社", role: "社长", category: "文艺" },
  { id: "street-dance", name: "Pulse街舞社", role: "副社长", category: "文艺" },
  { id: "debate-club", name: "锋芒辩论社", role: "宣传部长", category: "学术" },
];

export default function AdminSelectPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 mx-auto">
          <Shield size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">选择要管理的社团</h1>
        <p className="text-slate-500 font-medium">你可以管理多个社团，请选择要进入的社团后台</p>
      </div>

      <div className="space-y-4">
        {myClubs.map((club, idx) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={`/admin/${club.id}`}
              className="flex items-center gap-5 bg-white rounded-[1.25rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-200 hover:-translate-y-1 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                {club.name[0]}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{club.name}</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{club.category}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-indigo-500">{club.role}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
