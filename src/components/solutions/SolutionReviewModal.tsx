"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  DollarSign,
  User,
  ExternalLink,
  Github,
  Star,
  Award,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileText,
  RotateCw,
} from "lucide-react";

interface SolutionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutionId?: string | null;
  initialSolutionData?: any;
  isProblemOwner?: boolean;
  onStatusUpdated?: () => void;
  defaultTab?: "ai" | "details";
}

export function SolutionReviewModal({
  isOpen,
  onClose,
  solutionId,
  initialSolutionData,
  isProblemOwner = false,
  onStatusUpdated,
  defaultTab = "ai",
}: SolutionReviewModalProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "details">(defaultTab);
  const [solution, setSolution] = useState<any>(initialSolutionData || null);
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortlisting, setShortlisting] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultTab) {
        setActiveTab(defaultTab);
      }
      if (solutionId) {
        loadEvaluation(solutionId);
      } else if (initialSolutionData) {
        setSolution(initialSolutionData);
        loadEvaluation(initialSolutionData.id);
      }
    }
  }, [isOpen, solutionId, initialSolutionData, defaultTab]);

  const loadEvaluation = async (id: string) => {
    setLoading(true);
    setError(null);
    setActionMsg(null);
    try {
      const res = await fetch("/api/v1/ai/evaluate-solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solutionId: id }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "AI tahlilini yuklashda xatolik");
      }

      setAiEvaluation(json.data.evaluation);
      if (json.data.solution) {
        setSolution(json.data.solution);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async () => {
    if (!solution) return;
    setShortlisting(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/v1/problems/${solution.challenge?.problem?.id || solution.challengeId}/shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: solution.challengeId,
          solutionId: solution.id,
          rankPosition: 1,
          shortlistReason: "AI tavsiyasi va innovatsion yechim sifati asosida saralandi",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setActionMsg("Yechim muvaffaqiyatli shortlistga qo'shildi!");
        if (onStatusUpdated) onStatusUpdated();
      } else {
        throw new Error(json.error || "Shortlistga kiritishda xatolik");
      }
    } catch (err: any) {
      setActionMsg(`Xatolik: ${err.message}`);
    } finally {
      setShortlisting(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("uz-UZ").format(val);
  };

  const solver = solution?.solver;
  const profile = solver?.profile;
  const problem = solution?.challenge?.problem;

  let solverSkills: string[] = [];
  try {
    if (profile?.skills) {
      solverSkills = typeof profile.skills === "string" ? JSON.parse(profile.skills) : profile.skills;
    }
  } catch {
    solverSkills = [];
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full font-bold">
                Status: {solution?.status || "SUBMITTED"}
              </span>
              {problem && (
                <span className="text-xs text-slate-300">
                  Muammo: <strong className="text-white">{problem.title}</strong>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {solution?.title || "Yechim tahlili"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab("ai")}
            className={`py-3.5 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === "ai"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            AI Tahlili & Tavsiyalari
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`py-3.5 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === "details"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            To'liq Yechim & Mutaxassis
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {actionMsg && (
            <div className="p-4 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              {actionMsg}
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-base font-bold text-slate-900">AI Yechimni Tahlil Qilmoqda...</p>
                <p className="text-xs text-slate-500 mt-1">
                  Texnik yondashuv, byudjet, samaradorlik va amaliy tavsiyalar hisoblanmoqda
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
              <p className="text-sm font-bold text-red-700">{error}</p>
              <button
                onClick={() => solutionId && loadEvaluation(solutionId)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
              >
                <RotateCw className="w-3.5 h-3.5" /> Qayta urinib ko'rish
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: AI EVALUATION */}
              {activeTab === "ai" && aiEvaluation && (
                <div className="space-y-6">
                  {/* Verdict & Score Banner */}
                  <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 blur-3xl" />
                    
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            {aiEvaluation.verdictText}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                          {aiEvaluation.summary}
                        </h3>
                        <p className="text-xs text-slate-300">
                          {aiEvaluation.pilotReadiness}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm flex-shrink-0">
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl font-black text-amber-400">
                            {aiEvaluation.overallScore}%
                          </div>
                          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                            Umumiy AI Balli
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Gauges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600">Texnik Maqbullik</span>
                        <span className="text-sm font-black text-blue-600">{aiEvaluation.feasibilityScore}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${aiEvaluation.feasibilityScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600">Innovatsionlik</span>
                        <span className="text-sm font-black text-sky-500">{aiEvaluation.innovationScore}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${aiEvaluation.innovationScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600">Byudjet Tejamkorligi</span>
                        <span className="text-sm font-black text-emerald-600">{aiEvaluation.costEfficiencyScore}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${aiEvaluation.costEfficiencyScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Kuchli Tomonlari
                      </h4>
                      <ul className="space-y-2">
                        {aiEvaluation.strengths.map((str: string, idx: number) => (
                          <li key={idx} className="text-xs text-emerald-950 font-medium flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        E'tibor Qaratish Kerak Bo'lgan Jihatlar
                      </h4>
                      <ul className="space-y-2">
                        {aiEvaluation.weaknesses.map((w: string, idx: number) => (
                          <li key={idx} className="text-xs text-amber-950 font-medium flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      AI Bergan Amaliy Tavsiyalar
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiEvaluation.recommendations.map((rec: string, idx: number) => (
                        <div key={idx} className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
                          <p className="text-xs text-slate-800 font-semibold">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-slate-700" />
                      Tavsiya Etilgan Keyingi Qadamlar
                    </h4>
                    <div className="space-y-2">
                      {aiEvaluation.nextSteps.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-xs font-medium text-slate-800">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FULL DETAILS & SOLVER */}
              {activeTab === "details" && solution && (
                <div className="space-y-6">
                  {/* Solver Profile Card */}
                  {profile && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white text-xl font-black flex items-center justify-center shadow-md">
                          {profile.firstName?.[0] || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">
                              {profile.firstName} {profile.lastName}
                            </h4>
                            <span className="text-[11px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                              Solver
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            @{profile.username} • {profile.occupation || "Mustaqil mutaxassis"}
                          </p>
                          {profile.organizationName && (
                            <p className="text-xs text-slate-600 font-medium mt-0.5">
                              Tashkilot: {profile.organizationName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div className="text-center sm:text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Reyting</span>
                          <p className="text-sm font-black text-amber-500 flex items-center justify-center sm:justify-end gap-1">
                            <Star className="w-4 h-4 fill-amber-500" /> {profile.ratingAvg || "5.0"}
                          </p>
                        </div>
                        <div className="text-center sm:text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Yechilgan</span>
                          <p className="text-sm font-black text-slate-900">{profile.solvedCount || 0} ta</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {solverSkills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Mutaxassis Ko'nikmalari
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {solverSkills.map((sk: string) => (
                          <span key={sk} className="text-xs bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Approach */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Texnik Yondashuv (Technical Approach)
                    </h4>
                    <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                      {solution.technicalApproach}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Yechim Tavsifi
                    </h4>
                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                      {solution.description}
                    </p>
                  </div>

                  {/* Expected Results & Risk Analysis */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {solution.expectedResult && (
                      <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kutilayotgan Natija
                        </h4>
                        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                          {solution.expectedResult}
                        </p>
                      </div>
                    )}

                    {solution.riskAnalysis && (
                      <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1.5">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Xatarlar Tahlili
                        </h4>
                        <p className="text-xs text-amber-950 font-medium leading-relaxed">
                          {solution.riskAnalysis}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Metrics Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Taklif Byudjeti</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {formatCurrency(solution.estimatedCost)} UZS
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Rejalashtirilgan Muddat</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {solution.estimatedDays} kun
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Ekspert Balli</span>
                      <p className="text-sm font-black text-amber-500 mt-0.5 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500" /> {solution.scoreAvg || "—"}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Yuborilgan Sana</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {new Date(solution.createdAt).toLocaleDateString("uz-UZ")}
                      </p>
                    </div>
                  </div>

                  {/* External Links */}
                  {(solution.githubUrl || solution.demoUrl) && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {solution.githubUrl && (
                        <a
                          href={solution.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                        >
                          <Github className="w-4 h-4" /> GitHub Repozitoriy
                        </a>
                      )}
                      {solution.demoUrl && (
                        <a
                          href={solution.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                        >
                          <ExternalLink className="w-4 h-4" /> Jonli Demo / Sayt
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isProblemOwner ? (
              <span>Siz ushbu muammoning egasisiz. Yechimni tekshirib, shortlistga qo'shishingiz mumkin.</span>
            ) : (
              <span>YechimUZ AI Tahlil Tizimi</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isProblemOwner && solution?.status !== "SHORTLISTED" && (
              <button
                type="button"
                onClick={handleShortlist}
                disabled={shortlisting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                {shortlisting ? "Saqlanmoqda..." : "Shortlistga kiritish"}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Yopish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
