"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  MessageSquare,
  Compass,
  ClipboardList,
  LayoutDashboard,
  Users,
  Menu,
  X,
  UserCircle,
  ArrowLeftRight,
  Building2,
} from "lucide-react";
import clubsData from "@/data/clubs.json";
import { Club } from "@/types/club";

const clubs = clubsData as Club[];

const studentNavItems = [
  { href: "/", label: "首页", icon: Sparkles },
  { href: "/chat", label: "AI 匹配", icon: MessageSquare },
  { href: "/clubs", label: "浏览社团", icon: Compass },
  { href: "/my", label: "我的申请", icon: ClipboardList },
];

type Mode = "student" | "club-select" | "club-manage";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("student");

  // Extract clubId from /admin/[clubId] paths (first segment only)
  const clubIdMatch = pathname.match(/^\/admin\/([^/]+)/);
  const currentClubId = clubIdMatch ? clubIdMatch[1] : null;
  const currentClub = currentClubId ? clubs.find((c) => c.id === currentClubId) : null;

  useEffect(() => {
    if (currentClubId) {
      setMode("club-manage");
    } else if (pathname === "/admin") {
      setMode("club-select");
    } else {
      setMode("student");
    }
  }, [pathname, currentClubId]);

  // Student mode navbar
  if (mode === "student") {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3">
        <div className="mx-auto px-6 md:px-12 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:inline">社团通</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {studentNavItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={cn("px-4 py-2 text-sm font-medium transition-colors rounded-xl", isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50")}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile" className={cn("hidden md:flex items-center justify-center w-9 h-9 rounded-full transition-all", pathname === "/profile" ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700")}>
              <UserCircle size={20} />
            </Link>
            <Link href="/admin" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all">
              <Building2 size={16} />
              切换至社团端
            </Link>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full md:hidden" onClick={() => setOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        <MobileSidebar open={open} setOpen={setOpen} pathname={pathname} mode="student" />
      </nav>
    );
  }

  // Club select page (/admin) or dashboard
  if (mode === "club-select") {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3">
        <div className="mx-auto px-6 md:px-12 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:inline">社团通</span>
            <span className="hidden sm:inline text-sm text-slate-400 font-medium ml-2">· 社团端</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/admin" className={cn("px-4 py-2 text-sm font-medium transition-colors rounded-xl", pathname === "/admin" ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50")}>
              社团管理
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all">
              <UserCircle size={16} />
              切换至学生端
            </Link>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full md:hidden" onClick={() => setOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        <MobileSidebar open={open} setOpen={setOpen} pathname={pathname} mode="club-select" />
      </nav>
    );
  }

  // Club manage mode (/admin/[clubId]) — two-layer nav
  return (
    <div className="sticky top-0 z-50">
      {/* Top bar: identity layer */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-3">
        <div className="mx-auto px-6 md:px-12 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Sparkles size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:inline">社团通</span>
            </Link>
            {currentClub && (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                    {currentClub.name[0]}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{currentClub.name}</span>
                </div>
                <Link href="/admin" className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all" title="切换社团">
                  <ArrowLeftRight size={14} />
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all">
              <UserCircle size={16} />
              切换至学生端
            </Link>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full md:hidden" onClick={() => setOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Second bar: function modules */}
      <div className="bg-white/60 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto px-6 md:px-12 flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {[
            { href: `/admin/${currentClubId}`, label: "报名管理", exact: true },
            { href: `/admin/${currentClubId}/profile`, label: "社团档案", exact: false },
            { href: `/admin/${currentClubId}/qa`, label: "问答板", exact: false },
          ].map((tab) => {
            const isActive = tab.exact
              ? (pathname === tab.href || pathname.startsWith(`${tab.href}/applicant`))
              : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={cn(
                  "px-4 py-2 text-sm font-bold transition-colors rounded-lg whitespace-nowrap",
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <MobileSidebar open={open} setOpen={setOpen} pathname={pathname} mode="club-manage" clubName={currentClub?.name} clubId={currentClubId} />
    </div>
  );
}

function MobileSidebar({ open, setOpen, pathname, mode, clubName, clubId }: { open: boolean; setOpen: (v: boolean) => void; pathname: string; mode: Mode; clubName?: string; clubId?: string | null }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-64 bg-white z-[70] shadow-2xl p-6 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">
                {mode === "club-manage" && clubName ? clubName : "菜单"}
              </span>
              <button onClick={() => setOpen(false)}><X size={24} /></button>
            </div>

            <div className="flex flex-col gap-2">
              {mode === "student" && studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 p-3 rounded-xl transition-all font-medium", isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-50")}>
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              {mode === "club-manage" && clubId && (
                <>
                  <Link href={`/admin/${clubId}`} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 p-3 rounded-xl font-medium", pathname === `/admin/${clubId}` ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-50")}>
                    <Users size={18} /> 报名管理
                  </Link>
                  <Link href={`/admin/${clubId}/profile`} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 p-3 rounded-xl font-medium", pathname.includes("/profile") ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-50")}>
                    <LayoutDashboard size={18} /> 社团档案
                  </Link>
                  <Link href={`/admin/${clubId}/qa`} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 p-3 rounded-xl font-medium", pathname.includes("/qa") ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-50")}>
                    <MessageSquare size={18} /> 问答板
                  </Link>
                </>
              )}
            </div>

            <div className="mt-auto border-t pt-6 space-y-3">
              {mode === "student" && (
                <Link href="/profile" onClick={() => setOpen(false)} className={cn("w-full flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all", pathname === "/profile" ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100")}>
                  <UserCircle size={18} /> 个人中心
                </Link>
              )}
              {mode === "club-manage" && (
                <Link href="/admin" onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all">
                  <ArrowLeftRight size={16} /> 切换社团
                </Link>
              )}
              <Link href={mode === "student" ? "/admin" : "/"} onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-all">
                切换至{mode === "student" ? "社团端" : "学生端"}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
