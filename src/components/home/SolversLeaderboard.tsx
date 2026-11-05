"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Star,
  MapPin,
  Sparkles,
  ChevronRight,
  User,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Zap,
  TrendingUp,
  ShieldCheck,
  Crown,
  Medal,
} from "lucide-react";

interface SolverItem {
  id: string;
  rank: number;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  region: string;
  occupation?: string;
  organizationName?: string;
  skills: string[];
  experienceYears: number;
  ratingAvg: number;
  solvedCount: number;
  impactTotal: number;
  badges: string[];
  solutionsCount: number;
}

export function SolversLeaderboard() {
  const [solvers, setSolvers] = useState<SolverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolver, setSelectedSolver] = useState<SolverItem | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>("all");

  useEffect(() => {
    fetchSolvers(activeRegion);
  }, [activeRegion]);

  const fetchSolvers = async (region: string) => {
    setLoading(true);
    try {
      const url = region === "all" ? "/api/v1/solvers?limit=10" : `/api/v1/solvers?region=${region}&limit=10`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setSolvers(json.data);
      }
    } catch (err) {
      console.error("Yechimchilarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const top3 = solvers.slice(0, 3);
  const remainingSolvers = solvers.slice(3);

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 border border-blue-500/30 shadow-2xl">
      {/* Background neon glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-400/40 px-4 py-1.5 rounded-full text-yellow-300 text-xs sm:text-sm font-bold shadow-lg">
            <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
            Top Mutaxassislar & Muhandislar Reytingi
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Eng Yetakchi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">Yechimchilar (Solvers)</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Platformada muammolarga eng samarali yechim bergan, ekspertlar bahosida yuqori natija ko'rsatgan va muvaffaqiyatli pilotlarni ishga tushirgan mutaxassislar.
          </p>

          {/* Region Tabs */}
          <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 gap-2 mt-2">
            <button
              onClick={() => setActiveRegion("all")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeRegion === "all"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Barcha Hududlar
            </button>
            <button
              onClick={() => setActiveRegion("Farg'ona")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeRegion === "Farg'ona"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> Farg'ona Pilot
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400">Yechimchilar reytingi hisoblanmoqda...</p>
          </div>
        ) : (
          <>
            {/* TOP 3 PODIUM */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-end">
                {/* 2ND PLACE (SILVER) */}
                {top3[1] && (
                  <div
                    onClick={() => setSelectedSolver(top3[1])}
                    className="order-2 md:order-1 group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-400/40 hover:border-slate-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer text-center space-y-4"
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 font-black text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white">
                      <Medal className="w-3.5 h-3.5 text-slate-800" /> 2-O'RIN
                    </div>

                    <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-slate-400/30">
                      {top3[1].name[0]}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition">
                        {top3[1].name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        @{top3[1].username} • {top3[1].occupation || "Mutaxassis"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 py-2 border-y border-white/10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Reyting</span>
                        <div className="text-base font-black text-amber-400 flex items-center justify-center gap-0.5">
                          <Star className="w-4 h-4 fill-amber-400" /> {top3[1].ratingAvg}
                        </div>
                      </div>
                      <div className="h-6 w-px bg-white/10" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Hal qilingan</span>
                        <p className="text-base font-black text-white">{top3[1].solvedCount} ta</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {top3[1].skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="text-[10px] font-semibold bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-lg border border-white/5">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="w-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5"
                    >
                      Profilni ko'rish <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 1ST PLACE (GOLD - CHAMPION) */}
                {top3[0] && (
                  <div
                    onClick={() => setSelectedSolver(top3[0])}
                    className="order-1 md:order-2 group relative bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-amber-400/80 hover:border-yellow-300 shadow-[0_0_50px_rgba(251,191,36,0.25)] hover:shadow-[0_0_70px_rgba(251,191,36,0.35)] transition-all duration-300 transform hover:-translate-y-3 cursor-pointer text-center space-y-4 md:-mt-6"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm px-5 py-2 rounded-full shadow-2xl flex items-center gap-1.5 border-2 border-white animate-bounce">
                      <Crown className="w-4 h-4 text-slate-950" /> 1-O'RIN • CHEMPION
                    </div>

                    <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-4xl flex items-center justify-center shadow-2xl ring-4 ring-amber-400/50 mt-2">
                      {top3[0].name[0]}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <h3 className="text-xl font-black text-white group-hover:text-yellow-300 transition">
                          {top3[0].name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-amber-300/80 font-medium">
                        @{top3[0].username} • {top3[0].occupation || "Yetakchi Mutaxassis"}
                      </p>
                      {top3[0].organizationName && (
                        <p className="text-[11px] text-slate-400">{top3[0].organizationName}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-6 py-2.5 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Reyting</span>
                        <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400" /> {top3[0].ratingAvg}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Hal qilingan</span>
                        <p className="text-lg font-black text-white">{top3[0].solvedCount} ta muammo</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {top3[0].skills.slice(0, 4).map((sk) => (
                        <span key={sk} className="text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-xl">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="w-full text-xs font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-slate-950 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <Trophy className="w-4 h-4" /> Mutaxassis Profilini Ko'rish
                    </button>
                  </div>
                )}

                {/* 3RD PLACE (BRONZE) */}
                {top3[2] && (
                  <div
                    onClick={() => setSelectedSolver(top3[2])}
                    className="order-3 group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-amber-700/40 hover:border-amber-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer text-center space-y-4"
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-amber-400/50">
                      <Medal className="w-3.5 h-3.5 text-amber-200" /> 3-O'RIN
                    </div>

                    <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-amber-600/30">
                      {top3[2].name[0]}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                        {top3[2].name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        @{top3[2].username} • {top3[2].occupation || "Mutaxassis"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 py-2 border-y border-white/10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Reyting</span>
                        <div className="text-base font-black text-amber-400 flex items-center justify-center gap-0.5">
                          <Star className="w-4 h-4 fill-amber-400" /> {top3[2].ratingAvg}
                        </div>
                      </div>
                      <div className="h-6 w-px bg-white/10" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Hal qilingan</span>
                        <p className="text-base font-black text-white">{top3[2].solvedCount} ta</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {top3[2].skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="text-[10px] font-semibold bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-lg border border-white/5">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="w-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5"
                    >
                      Profilni ko'rish <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LEADERBOARD TABLE FOR 4TH PLACE ONWARDS */}
            {remainingSolvers.length > 0 && (
              <div className="space-y-3 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Keyingi O'rinlardagi Yetakchilar
                </h3>

                <div className="space-y-2.5">
                  {remainingSolvers.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSolver(s)}
                      className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 rounded-2xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-black text-sm flex items-center justify-center flex-shrink-0">
                          #{s.rank}
                        </span>

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                          {s.name[0]}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                              {s.name}
                            </h4>
                            <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md">
                              {s.region}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {s.occupation || "Mustaqil mutaxassis"} {s.organizationName ? `• ${s.organizationName}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Reyting</span>
                          <p className="text-xs font-black text-amber-400 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {s.ratingAvg}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Yechilgan</span>
                          <p className="text-xs font-black text-white">{s.solvedCount} ta</p>
                        </div>

                        <button
                          type="button"
                          className="text-xs font-bold bg-white/10 hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-xl border border-white/10 transition"
                        >
                          Ko'rish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* SOLVER DETAIL MODAL */}
      {selectedSolver && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden text-white">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 flex items-start justify-between gap-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  {selectedSolver.name[0]}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {selectedSolver.name}
                    </h3>
                    <span className="text-[10px] bg-amber-400/20 text-yellow-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                      #{selectedSolver.rank} Reyting
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    @{selectedSolver.username} • {selectedSolver.occupation || "Mutaxassis"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedSolver.region}
                    </span>
                    {selectedSolver.organizationName && (
                      <span>• {selectedSolver.organizationName}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSolver(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Reyting</span>
                  <p className="text-base font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {selectedSolver.ratingAvg}
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hal Qilingan</span>
                  <p className="text-base font-black text-white mt-0.5">
                    {selectedSolver.solvedCount} ta
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tajriba</span>
                  <p className="text-base font-black text-white mt-0.5">
                    {selectedSolver.experienceYears ? `${selectedSolver.experienceYears} yil` : "Amaliyotchi"}
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Yechimlar</span>
                  <p className="text-base font-black text-sky-400 mt-0.5">
                    {selectedSolver.solutionsCount} ta
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mutaxassis Haqida (Bio)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                  {selectedSolver.bio || "Qisqacha bio ma'lumot kiritilmagan."}
                </p>
              </div>

              {/* Skills */}
              {selectedSolver.skills && selectedSolver.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Ko'nikmalar va Texnologiyalar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSolver.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold text-xs px-3 py-1 rounded-xl"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bog'lanish Ma'lumotlari
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedSolver.email && (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{selectedSolver.email}</span>
                    </div>
                  )}

                  {selectedSolver.phone && (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{selectedSolver.phone}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                YechimUZ Leaderboard
              </span>

              <button
                type="button"
                onClick={() => setSelectedSolver(null)}
                className="bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
