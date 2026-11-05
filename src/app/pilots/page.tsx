"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  MapPin,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Clock,
  Activity,
  AlertCircle,
  FileCheck,
} from "lucide-react";

interface PilotMetric {
  id: string;
  metricName: string;
  expectedValue: string;
  actualValue: string;
  unit?: string;
}

interface PilotItem {
  id: string;
  region: string;
  startDate: string;
  endDate?: string;
  budget: number;
  status: string;
  expectedResult?: string;
  actualResult?: string;
  challenge: {
    id: string;
    structuredTitle: string;
    formattedObjective: string;
    problem: {
      id: string;
      title: string;
      region: string;
      organization?: string;
      category?: {
        nameUz: string;
        slug: string;
      };
    };
  };
  solution: {
    id: string;
    title: string;
    scoreAvg: number;
    solver: {
      profile?: {
        firstName: string;
        lastName: string;
        organizationName?: string;
        avatarUrl?: string;
      };
    };
  };
  metrics: PilotMetric[];
  impact?: {
    id: string;
    totalScore: number;
    summary?: string;
  };
}

export default function PilotsPage() {
  const [pilots, setPilots] = useState<PilotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState("all");

  useEffect(() => {
    fetchPilots(regionFilter);
  }, [regionFilter]);

  const fetchPilots = async (region: string) => {
    setLoading(true);
    try {
      const url = region === "all" ? "/api/v1/pilots" : `/api/v1/pilots?region=${region}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setPilots(json.data || []);
      }
    } catch (err) {
      console.error("Pilotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Muvaffaqiyatli Yakunlangan",
          classes: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
        };
      case "RUNNING":
        return {
          label: "Amalda (Jarayonda)",
          classes: "bg-blue-500/20 text-sky-300 border-blue-400/30",
        };
      case "APPROVED":
        return {
          label: "Tasdiqlangan",
          classes: "bg-amber-500/20 text-amber-300 border-amber-400/30",
        };
      default:
        return {
          label: status,
          classes: "bg-slate-500/20 text-slate-300 border-slate-400/30",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white space-y-12 pb-20">
      {/* HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-950 border-b border-white/10">
        <div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[250px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition">
              Bosh sahifa
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-emerald-400 font-medium">Pilotlar & Impact</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs sm:text-sm font-semibold shadow-md">
              <Rocket className="w-4 h-4 text-emerald-400" />
              Real Sinov & Hududiy Natijadorlik
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pilot Loyihalar va{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                Impact Natijalari
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Farg'ona va boshqa hududlarda ilg'or innovatsion yechimlarni sinovdan o'tkazish, ularning samaradorligini real KPI metrikalari asosida baholash va amaliyotga joriy etish maydoni.
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: "all", label: "Barcha Hududlar" },
              { id: "Farg'ona", label: "Farg'ona viloyati" },
              { id: "Toshkent", label: "Toshkent shahri" },
              { id: "Samarqand", label: "Samarqand" },
              { id: "Buxoro", label: "Buxoro" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRegionFilter(r.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                  regionFilter === r.id
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-semibold"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Pilot loyihalar yuklanmoqda...</p>
          </div>
        ) : pilots.length > 0 ? (
          /* REAL PILOTS GRID (When real data is present in database) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pilots.map((pilot) => {
              const statusInfo = getStatusBadge(pilot.status);
              const solverName = pilot.solution?.solver?.profile
                ? `${pilot.solution.solver.profile.firstName} ${pilot.solution.solver.profile.lastName}`
                : "Top Solver";

              return (
                <div
                  key={pilot.id}
                  className="bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-3xl p-6 space-y-5 transition duration-300 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusInfo.classes}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {pilot.region}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {pilot.challenge?.structuredTitle || "Pilot Sinovi"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Asosiy Muammo: {pilot.challenge?.problem?.title}
                    </p>
                  </div>

                  {/* Solution & Solver Card */}
                  <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Taqdim etilgan Yechim:</span>
                      {pilot.solution?.scoreAvg ? (
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          ★ {pilot.solution.scoreAvg} ball
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {pilot.solution?.title}
                    </p>
                    <p className="text-[11px] text-slate-400">Muhandis: {solverName}</p>
                  </div>

                  {/* Real Metrics from Database */}
                  {pilot.metrics && pilot.metrics.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Real KPI Metrikalari
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {pilot.metrics.map((m) => (
                          <div
                            key={m.id}
                            className="bg-white/5 rounded-xl p-2.5 border border-white/5 space-y-0.5"
                          >
                            <span className="text-[11px] text-slate-400 block truncate">
                              {m.metricName}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-emerald-400">
                                {m.actualValue}
                              </span>
                              {m.unit && (
                                <span className="text-[10px] text-slate-400">{m.unit}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Kutilgan: {m.expectedValue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget & Impact */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ajratilgan Byudjet</span>
                      <span className="font-bold text-amber-300">
                        {pilot.budget?.toLocaleString()} UZS
                      </span>
                    </div>
                    {pilot.impact?.totalScore ? (
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Impact Bahosi</span>
                        <span className="font-bold text-purple-300">
                          {pilot.impact.totalScore} / 100
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TRANSPARENT & HONEST PIPELINE STATE (When no confirmed pilots are in the database yet) */
          <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <Activity className="w-7 h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Pilot Loyihalar Ekspert Baholash & Shartnoma Bosqichida
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                YechimUZ platformasida e'lon qilingan muammolar (jumladan, Farg'ona viloyati qishloq xo'jaligi va suv resurslari bo'yicha) hozirda eng sara yechimchilarni saralash va 9 mezonli ekspertiza bosqichida turibdi. Shartnoma imzolangan pilotlar tasdiqlanishi bilan ushbu sahifada real natijalari va metrikalari bilan e'lon qilib boriladi.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/problems"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-lg transform active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  Faol Challenge'larni ko'rish
                </Link>

                <Link
                  href="/dashboard/problems/create"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-white/20 transition"
                >
                  Yangi muammo joylashtirish
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>

            {/* PIPELINE ROADMAP EXPLAINER */}
            <div className="border-t border-white/10 pt-8 space-y-6">
              <h4 className="text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
                Yechim qanday qilib Pilot Loyihaga aylanadi?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-sky-400 text-xs font-bold flex items-center justify-center border border-blue-500/30">
                      01
                    </span>
                    <span className="text-[10px] text-slate-500">Boshlang'ich</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">AI Challenge E'loni</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Fermer yoki korxona muammosi AI tomonidan texnik KPI va vazifalarga aylantiriladi.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/30">
                      02
                    </span>
                    <span className="text-[10px] text-slate-500">9 Mezon</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">Mustaqil Ekspertiza</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Muhandislar yuborgan yechimlar olimlar va soha mutaxassislari tomonidan 10 ballik shkalada baholanadi.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center border border-purple-500/30">
                      03
                    </span>
                    <span className="text-[10px] text-slate-500">Tanlov</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">Shortlist & Shartnoma</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Muammo egasi eng yaxshi taklifni tanlaydi, byudjet tasdiqlanadi va rasmiy shartnoma tuziladi.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/30">
                      04
                    </span>
                    <span className="text-[10px] text-slate-500">Real Sinov</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">Pilot Sinovi & Natija</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Qurilma yoki tizim dalada, korxonada o'rnatiladi va uning tejamkorligi tekshirib boriladi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
