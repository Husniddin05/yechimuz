"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  User,
  CheckCircle2,
  Award,
  X,
  Star,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Eye,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SolverProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  region?: string;
  organizationName?: string;
  occupation?: string;
  skills?: string[];
  experienceYears?: number;
  portfolioUrls?: string[];
  website?: string;
  ratingAvg?: number;
  solvedCount?: number;
  impactTotal?: number;
  badges?: string[];
}

interface SubmittedSolution {
  id: string;
  title: string;
  description?: string;
  status: string;
  estimatedCost?: number;
  estimatedDays?: number;
  scoreAvg?: number;
}

interface SolverMatch {
  solverId: string;
  solverName: string;
  matchScore: number;
  matchReasons: string[];
  profile?: SolverProfile;
  email?: string;
  phone?: string;
  submittedSolution?: SubmittedSolution | null;
}

interface AISolverMatchingWidgetProps {
  challengeId: string;
  onOpenSolution?: (solutionId: string) => void;
}

export function AISolverMatchingWidget({ challengeId, onOpenSolution }: AISolverMatchingWidgetProps) {
  const [matches, setMatches] = useState<SolverMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolver, setSelectedSolver] = useState<SolverMatch | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [challengeId]);

  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/v1/ai/match-solvers/${challengeId}`);
      const json = await res.json();
      if (json.success) {
        setMatches(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("uz-UZ").format(val);
  };

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center font-semibold flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        AI Mos Solverlarni tahlil qilmoqda...
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                AI Tavsiya Qiladigan Solverlar (Matching Engine)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sun'iy intellekt muammo talablari, ko'nikmalar va hudud bo'yicha saralagan mutaxassislar.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-400 self-start sm:self-auto">
            Mutaxassis ustiga bosib to'liq ma'lumot oling
          </span>
        </div>

        <div className="space-y-3">
          {matches.map((m) => {
            const profile = m.profile;

            return (
              <div
                key={m.solverId}
                onClick={() => setSelectedSolver(m)}
                className="group p-4 bg-slate-50/80 hover:bg-blue-50/40 rounded-2xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-black text-base flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition">
                    {m.solverName ? m.solverName[0] : "S"}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                        {m.solverName}
                      </h4>

                      {profile?.ratingAvg && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> {profile.ratingAvg}
                        </span>
                      )}

                      {m.submittedSolution && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Yechim topshirgan
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      {profile?.occupation || "Mutaxassis"} {profile?.organizationName ? `• ${profile.organizationName}` : ""}
                    </p>

                    <ul className="text-[11px] text-slate-600 space-y-0.5 pt-0.5">
                      {m.matchReasons.map((r, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <span className="text-xs font-black text-blue-700 bg-blue-100/90 border border-blue-200 px-3 py-1.5 rounded-xl shadow-2xs">
                    {m.matchScore}% Moslik
                  </span>

                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition flex items-center gap-0.5">
                    Batafsil <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOLVER DETAIL MODAL */}
      {selectedSolver && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 text-white font-black text-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  {selectedSolver.solverName ? selectedSolver.solverName[0] : "S"}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {selectedSolver.solverName}
                    </h3>
                    <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                      Solver
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    @{selectedSolver.profile?.username || "solver"} • {selectedSolver.profile?.occupation || "Mutaxassis"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedSolver.profile?.region || "Farg'ona"}
                    </span>
                    {selectedSolver.profile?.organizationName && (
                      <span>• {selectedSolver.profile.organizationName}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSolver(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* AI Matching Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    AI Moslik Natijasi
                  </span>
                  <span className="text-sm font-black text-blue-700 bg-white px-3 py-1 rounded-xl shadow-2xs border border-blue-100">
                    {selectedSolver.matchScore}% Moslik
                  </span>
                </div>

                <ul className="text-xs text-blue-950 space-y-1 pt-1">
                  {selectedSolver.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Reyting</span>
                  <p className="text-base font-black text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500" />
                    {selectedSolver.profile?.ratingAvg || "5.0"}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hal Qilingan</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    {selectedSolver.profile?.solvedCount || 0} ta
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tajriba</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    {selectedSolver.profile?.experienceYears ? `${selectedSolver.profile.experienceYears} yil` : "Amaliyotchi"}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hudud</span>
                  <p className="text-xs font-black text-slate-900 mt-1 truncate">
                    {selectedSolver.profile?.region || "Farg'ona"}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mutaxassis Haqida (Bio)
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedSolver.profile?.bio || "Qisqacha bio ma'lumoti kiritilmagan."}
                </p>
              </div>

              {/* Skills */}
              {selectedSolver.profile?.skills && selectedSolver.profile.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Ko'nikmalar va Texnologiyalar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSolver.profile.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs px-3 py-1 rounded-xl"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submitted Solution (if this solver submitted one for this problem) */}
              {selectedSolver.submittedSolution && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Ushbu Muammoga Yechim Taklifi Mavjud!
                    </span>
                    <span className="text-[11px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-md">
                      Status: {selectedSolver.submittedSolution.status}
                    </span>
                  </div>

                  <h5 className="text-sm font-black text-slate-900">
                    {selectedSolver.submittedSolution.title}
                  </h5>

                  {selectedSolver.submittedSolution.estimatedCost && selectedSolver.submittedSolution.estimatedCost > 0 && (
                    <p className="text-xs text-slate-600 font-medium">
                      Taklif byudjeti: <strong>{formatCurrency(selectedSolver.submittedSolution.estimatedCost)} UZS</strong> • Muddat: <strong>{selectedSolver.submittedSolution.estimatedDays} kun</strong>
                    </p>
                  )}

                  {onOpenSolution && (
                    <button
                      type="button"
                      onClick={() => {
                        const solId = selectedSolver.submittedSolution?.id;
                        setSelectedSolver(null);
                        if (solId) onOpenSolution(solId);
                      }}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Taqdim etgan yechimini to'liq ko'zdan kechirish
                    </button>
                  )}
                </div>
              )}

              {/* Contacts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bog'lanish Ma'lumotlari
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedSolver.email && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{selectedSolver.email}</span>
                    </div>
                  )}

                  {selectedSolver.phone && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{selectedSolver.phone}</span>
                    </div>
                  )}

                  {selectedSolver.profile?.website && (
                    <a
                      href={selectedSolver.profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 rounded-xl border border-slate-200 flex items-center gap-2 text-blue-600 font-semibold transition"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="truncate">Veb-sayt / Portfolio</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                YechimUZ Matching & Solver Directory
              </span>

              <button
                type="button"
                onClick={() => setSelectedSolver(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
