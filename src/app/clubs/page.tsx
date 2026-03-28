"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, Star, Clock, Users, SlidersHorizontal } from "lucide-react";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";
import { cn } from "@/lib/utils";

const clubs = clubsData as Club[];
const CATEGORIES = ["全部", "文艺", "体育", "学术", "公益", "实践", "兴趣"];
const TIME_LEVELS = ["全部", "轻度", "中度", "重度"];
const JOIN_MODES = ["全部", "直接加入", "申请审核"];
const BASIS_OPTIONS = ["全部", "零基础欢迎", "需要基础"];
const FEE_RANGES = ["全部", "免费", "¥1-30", "¥31-50", "¥50以上"];

export default function ClubsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部");
  const [timeLevel, setTimeLevel] = useState("全部");
  const [joinMode, setJoinMode] = useState("全部");
  const [basis, setBasis] = useState("全部");
  const [feeRange, setFeeRange] = useState("全部");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()) || c.slogan.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (category !== "全部" && c.category !== category) return false;
      if (timeLevel !== "全部" && c.timeLevel !== timeLevel) return false;
      if (joinMode !== "全部" && c.joinMode !== joinMode) return false;
      if (basis === "零基础欢迎" && c.requireBasis) return false;
      if (basis === "需要基础" && !c.requireBasis) return false;
      if (feeRange === "免费" && c.fee !== 0) return false;
      if (feeRange === "¥1-30" && (c.fee === 0 || c.fee > 30)) return false;
      if (feeRange === "¥31-50" && (c.fee < 31 || c.fee > 50)) return false;
      if (feeRange === "¥50以上" && c.fee <= 50) return false;
      return true;
    });
  }, [search, category, timeLevel, joinMode, basis, feeRange]);

  return (
    <div className="space-y-8 py-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 bg-[#F8F9FC]/80 backdrop-blur-md py-4">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="搜索社团名称或关键词..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border-2 shrink-0",
              showFilters
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200"
            )}
          >
            <SlidersHorizontal size={18} />
            高级筛选
          </button>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />

          {CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border-2 shrink-0",
                category === cat
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : "bg-white text-slate-500 border-slate-100 hover:border-indigo-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-100 rounded-[1.25rem] p-8 grid md:grid-cols-3 lg:grid-cols-5 gap-8 shadow-xl shadow-indigo-50/50">
              <FilterGroup label="社团类别" options={CATEGORIES} value={category} onChange={setCategory} />
              <FilterGroup label="时间投入" options={TIME_LEVELS} value={timeLevel} onChange={setTimeLevel} />
              <FilterGroup label="招新模式" options={JOIN_MODES} value={joinMode} onChange={setJoinMode} />
              <FilterGroup label="是否需要基础" options={BASIS_OPTIONS} value={basis} onChange={setBasis} />
              <FilterGroup label="社费范围" options={FEE_RANGES} value={feeRange} onChange={setFeeRange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length > 0 ? (
          filtered.map((club, idx) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={`/clubs/${club.id}`}
                className="block bg-white rounded-[1.5rem] border border-slate-100 p-8 space-y-6 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-wider uppercase">
                      {club.category}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <Star size={16} fill="currentColor" />
                      {club.rating}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-1 italic">
                      &ldquo;{club.slogan}&rdquo;
                    </p>
                  </div>

                  <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {club.atmosphere.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {club.timeLevel}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={14} /> {club.memberCount}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight",
                        club.joinMode === "直接加入"
                          ? "bg-green-50 text-green-600"
                          : "bg-blue-50 text-blue-600"
                      )}
                    >
                      {club.joinMode}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Search size={40} />
            </div>
            <p className="text-slate-500 font-medium">没有找到匹配的社团，换个关键词试试？</p>
            <button
              onClick={() => { setSearch(""); setCategory("全部"); setTimeLevel("全部"); setJoinMode("全部"); setBasis("全部"); setFeeRange("全部"); }}
              className="text-indigo-600 font-bold hover:underline"
            >
              重置所有筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</h5>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
              value === opt
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                : "bg-slate-50 text-slate-500 border-slate-50 hover:border-indigo-100"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
