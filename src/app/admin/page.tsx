"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  AlertCircle,
  FileText,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

interface AdminStats {
  counts: {
    users: number;
    problems: number;
    pendingProblems: number;
    publishedProblems: number;
    pilotProblems: number;
    solvedProblems: number;
    solutions: number;
    shortlistedSolutions: number;
    pilots: number;
    runningPilots: number;
    completedPilots: number;
    categories: number;
    totalBudget: number;
  };
  regions: Record<string, number>;
  recentProblems: any[];
  recentSolutions: any[];
  recentLogs: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/stats");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      console.error("Stats load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/v1/admin/problems", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchStats();
      } else {
        alert(json.error || "Xatolik yuz berdi");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mb-3" />
        <p className="text-sm text-slate-400">Tizim ko'rsatkichlari yuklanmoqda...</p>
      </div>
    );
  }

  const { counts, regions, recentProblems, recentSolutions, recentLogs } = stats;

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            YechimUZ Boshqaruv Markazi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Platforma muammolari, AI challenge'lar, yechimchilar va Farg'ona pilot dasturini to'liq nazorat qilish.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Yangilash
        </button>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Problems */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-sky-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Jami Muammolar
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-sky-400 border border-blue-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{counts.problems}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                {counts.pendingProblems} ta kutilmoqda
              </span>
              <span className="text-[11px] text-slate-400">
                {counts.publishedProblems} e'londa
              </span>
            </div>
          </div>
          <Link
            href="/admin/problems"
            className="text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-1"
          >
            Muammolarni boshqarish →
          </Link>
        </div>

        {/* Card 2: Users */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Foydalanuvchilar
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{counts.users}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                Faol Ro'yxat
              </span>
              <span className="text-[11px] text-slate-400">barcha rollar</span>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-1"
          >
            Foydalanuvchilar & Rollar →
          </Link>
        </div>

        {/* Card 3: Solutions */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Yechimlar & Takliflar
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{counts.solutions}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                {counts.shortlistedSolutions} ta tanlangan
              </span>
              <span className="text-[11px] text-slate-400">ekspert bahosida</span>
            </div>
          </div>
          <Link
            href="/admin/solutions"
            className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-1"
          >
            Yechimlarni ko'rish →
          </Link>
        </div>

        {/* Card 4: Pilots & Impact */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pilot Sinovlari
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{counts.pilots}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                {counts.runningPilots} ta faol jarayonda
              </span>
              <span className="text-[11px] text-slate-400">{counts.completedPilots} tugallangan</span>
            </div>
          </div>
          <Link
            href="/admin/pilots"
            className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-1"
          >
            Pilot monitoringi →
          </Link>
        </div>

      </div>

      {/* MODERATION ALERT BOX (Agar kutilayotgan muammolar bo'lsa) */}
      {counts.pendingProblems > 0 && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {counts.pendingProblems} ta yangi muammo moderatsiya kutmoqda
              </h3>
              <p className="text-xs text-slate-300">
                Foydalanuvchilar tomonidan kiritilgan ushbu muammolarni ko'rib chiqib, e'lon qilish yoki rad etish zarur.
              </p>
            </div>
          </div>
          <Link
            href="/admin/problems?status=PENDING_REVIEW"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition self-start sm:self-auto whitespace-nowrap"
          >
            Moderatsiyaga o'tish →
          </Link>
        </div>
      )}

      {/* TWO COLUMN GRID: RECENT PROBLEMS & REGIONS BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Problems (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Oxirgi Muammolar</h3>
              <p className="text-xs text-slate-400">Platformaga qo'shilgan so'nggi e'lonlar</p>
            </div>
            <Link
              href="/admin/problems"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              Barchasi ({counts.problems}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {recentProblems.map((prob) => (
              <div key={prob.id} className="py-3.5 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prob.status === "PENDING_REVIEW"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : prob.status === "PUBLISHED"
                          ? "bg-blue-500/20 text-sky-300 border border-blue-500/30"
                          : prob.status === "PILOT"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {prob.status}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {prob.region}
                    </span>
                  </div>

                  <Link
                    href={`/problems/${prob.id}`}
                    target="_blank"
                    className="text-xs sm:text-sm font-semibold text-white hover:text-sky-300 transition line-clamp-1"
                  >
                    {prob.title}
                  </Link>

                  <div className="text-[11px] text-slate-400">
                    Muallif: <span className="text-slate-300">{prob.owner.profile?.firstName} {prob.owner.profile?.lastName}</span> ({prob.owner.email})
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {prob.status === "PENDING_REVIEW" && (
                    <button
                      onClick={() => handleUpdateStatus(prob.id, "PUBLISHED")}
                      disabled={actionLoading === prob.id}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                      title="E'lon qilish"
                    >
                      {actionLoading === prob.id ? "..." : "Tasdiqlash"}
                    </button>
                  )}
                  <Link
                    href={`/problems/${prob.id}`}
                    target="_blank"
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Regions & Categories (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Regional Distribution */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Hududiy Taqsimot</h3>
              <p className="text-xs text-slate-400">Muammolar qaysi viloyatlardan kelib tushmoqda</p>
            </div>

            <div className="space-y-3">
              {Object.entries(regions).map(([reg, count]) => {
                const pct = counts.problems > 0 ? Math.round((count / counts.problems) * 100) : 0;
                return (
                  <div key={reg} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" /> {reg}
                      </span>
                      <span className="text-slate-400 font-bold">{count} ta ({pct}%)</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick System Actions */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tezkor Boshqaruv
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/admin/users"
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 transition text-center"
              >
                👥 Rollarni biriktirish
              </Link>
              <Link
                href="/admin/categories"
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 transition text-center"
              >
                🏷️ Yangi Kategoriya
              </Link>
              <Link
                href="/admin/pilots"
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 transition text-center"
              >
                🧪 Yangi Pilot boshlash
              </Link>
              <Link
                href="/admin/audit-logs"
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 transition text-center"
              >
                📜 Xavfsizlik loglari
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* RECENT SOLUTIONS & RECENT AUDIT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Solutions (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Oxirgi Yechimlar</h3>
            <Link
              href="/admin/solutions"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Barcha yechimlar ({counts.solutions}) →
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {recentSolutions.map((sol) => (
              <div key={sol.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white line-clamp-1">{sol.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sol.status === "PILOT"
                        ? "bg-amber-500/20 text-amber-300"
                        : sol.status === "SELECTED"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-blue-500/20 text-sky-300"
                    }`}
                  >
                    {sol.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Yechimchi: {sol.solver.profile?.firstName} {sol.solver.profile?.lastName}</span>
                  <span className="text-amber-400 font-bold">★ {sol.scoreAvg || "Baholanmagan"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Tizim Faoliyati (Audit Logs)</h3>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              To'liq audit →
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-sky-300 block">{log.action}</span>
                  <span className="text-[11px] text-slate-400">
                    {log.user ? `${log.user.profile?.firstName || log.user.email}` : "Tizim"} • {log.entityName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
