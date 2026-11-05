"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Send,
  Sparkles,
  Star,
  Eye,
  FileText,
  DollarSign,
  Clock,
  Award,
  Lightbulb,
  User,
  Shield,
  ChevronRight,
} from "lucide-react";
import { AIChallengeGeneratorWidget } from "@/components/ai/AIChallengeGeneratorWidget";
import { AISolverMatchingWidget } from "@/components/ai/AISolverMatchingWidget";
import { SolutionReviewModal } from "@/components/solutions/SolutionReviewModal";

interface SolutionItem {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  technicalApproach: string;
  expectedResult?: string;
  estimatedCost: number;
  estimatedDays: number;
  riskAnalysis?: string;
  status: string;
  scoreAvg: number;
  createdAt: string;
  solver: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      username: string;
      occupation?: string;
      organizationName?: string;
      region?: string;
      ratingAvg: number;
      skills?: string;
      bio?: string;
    };
  };
  reviews?: Array<{
    id: string;
    totalScore: number;
    comments?: string;
  }>;
}

interface ProblemDetail {
  id: string;
  title: string;
  rawDescription: string;
  region: string;
  organization?: string;
  problemType: string;
  severityLevel: string;
  targetResult?: string;
  budget: number;
  currency: string;
  status: string;
  createdAt: string;
  category: {
    nameUz: string;
  };
  owner: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      username: string;
      organizationName?: string;
      occupation?: string;
      bio?: string;
      ratingAvg: number;
    };
  };
  challenge?: {
    id: string;
    structuredTitle: string;
    formattedObjective: string;
    suggestedSkills: string;
    targetKPIs: string;
    solutions?: SolutionItem[];
  };
}

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solution review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);
  const [selectedSolutionData, setSelectedSolutionData] = useState<any>(null);
  const [modalDefaultTab, setModalDefaultTab] = useState<"ai" | "details">("details");

  useEffect(() => {
    fetchProblemDetail();
    fetchCurrentUser();
  }, [params.id]);

  const fetchProblemDetail = async () => {
    try {
      const res = await fetch(`/api/v1/problems/${params.id}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setProblem(json.data);
      } else {
        throw new Error(json.error || "Muammo topilmadi");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/v1/auth/me");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCurrentUser(json.data);
        }
      }
    } catch {
      // Unauthenticated
    }
  };

  const handleOpenReview = (solution: any, defaultTab: "ai" | "details" = "details") => {
    setSelectedSolutionId(solution.id);
    setSelectedSolutionData(solution);
    setModalDefaultTab(defaultTab);
    setReviewModalOpen(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("uz-UZ").format(val);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Muammo ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-base font-bold text-red-600">{error || "Muammo topilmadi"}</p>
        <Link href="/problems" className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl">
          Marketplace'ga qaytish
        </Link>
      </div>
    );
  }

  const { owner, category, challenge } = problem;
  const isProblemOwner = currentUser && currentUser.id === owner.id;
  const solutions = challenge?.solutions || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/problems"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Muammolar ro'yxatiga qaytish
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-lg">
            {category?.nameUz}
          </span>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg">
            Status: {problem.status}
          </span>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg">
            {problem.severityLevel} Jiddiylik
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          {problem.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Challenge Generator Widget */}
          <AIChallengeGeneratorWidget
            problemId={problem.id}
            initialTitle={problem.title}
            initialDescription={problem.rawDescription}
            region={problem.region}
            isOwner={isProblemOwner}
            existingChallenge={challenge}
            onChallengeGenerated={() => fetchProblemDetail()}
          />

          {/* Raw Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Muammo Tavsifi</h3>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {problem.rawDescription}
            </p>
          </div>

          {/* Target Result */}
          {problem.targetResult && (
            <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kutilayotgan Natija / KPI
              </h3>
              <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                {problem.targetResult}
              </p>
            </div>
          )}

          {/* SUBMITTED SOLUTIONS SECTION (User inspection & AI evaluation) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Taqdim Etilgan Yechimlar
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                    {solutions.length} ta yechim
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Ushbu muammoga taklif qilingan loyihalar. Har bir yechimni o'zingiz mustaqil ko'zdan kechirib, AI bahosi va tavsiyalari bilan tanishishingiz mumkin.
                </p>
              </div>

              <Link
                href={`/solutions/submit?problemId=${problem.id}`}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition whitespace-nowrap self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" /> Yechim yuborish
              </Link>
            </div>

            {solutions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Hozircha yechim takliflari kelib tushmagan</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ushbu muammo bo'yicha g'oya yoki amaliy tajribangiz bormi? Birinchi bo'lib o'z yechimingizni taklif qiling!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {solutions.map((sol) => {
                  const solverProfile = sol.solver?.profile;

                  return (
                    <div
                      key={sol.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition shadow-xs space-y-4"
                    >
                      {/* Solver Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-black text-sm flex items-center justify-center shadow-xs">
                            {solverProfile?.firstName ? solverProfile.firstName[0] : "S"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-slate-900">
                                {solverProfile?.firstName} {solverProfile?.lastName}
                              </h4>
                              {solverProfile?.ratingAvg && (
                                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-500">
                                  <Star className="w-3 h-3 fill-amber-500" /> {solverProfile.ratingAvg}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {solverProfile?.occupation || "Mustaqil mutaxassis"} {solverProfile?.organizationName ? `• ${solverProfile.organizationName}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-0.5 rounded-md">
                            Status: {sol.status}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(sol.createdAt).toLocaleDateString("uz-UZ")}
                          </span>
                        </div>
                      </div>

                      {/* Solution Title & Content */}
                      <div className="space-y-1.5">
                        <h4 className="text-base font-bold text-slate-900">
                          {sol.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {sol.description}
                        </p>
                        {sol.technicalApproach && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                            <span className="font-bold text-slate-900">Texnik yondashuv: </span>
                            <span className="line-clamp-2">{sol.technicalApproach}</span>
                          </div>
                        )}
                      </div>

                      {/* Specs and Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          {sol.estimatedCost > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400">Taklif Byudjeti</span>
                              <p className="text-xs font-black text-slate-900">
                                {formatCurrency(sol.estimatedCost)} UZS
                              </p>
                            </div>
                          )}

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Muddat</span>
                            <p className="text-xs font-black text-slate-900">
                              {sol.estimatedDays} kun
                            </p>
                          </div>

                          {sol.scoreAvg > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400">Ekspert Balli</span>
                              <p className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-amber-500" /> {sol.scoreAvg}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons for user inspection & AI assessment */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenReview(sol, "details")}
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Yechimni ko'zdan kechirish
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenReview(sol, "ai")}
                            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                            AI Tavsiyalari
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Solver Matching Widget */}
          {challenge && (
            <AISolverMatchingWidget
              challengeId={challenge.id}
              onOpenSolution={(solId) => handleOpenReview({ id: solId }, "details")}
            />
          )}

          {/* Action CTA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ushbu muammoga yechim taklif qiling</h4>
              <p className="text-xs text-slate-500">O'z bilimingiz va loyihangiz bilan pilotda qatnashing</p>
            </div>

            <Link
              href={`/solutions/submit?problemId=${problem.id}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition whitespace-nowrap"
            >
              <Send className="w-4 h-4" /> Yechim yuborish
            </Link>
          </div>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-6">
          {/* Key specs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loyiha Tafsilotlari</h3>

            {problem.budget > 0 && (
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                <p className="text-[11px] text-blue-600 font-bold uppercase">Ajratilgan Byudjet / Mukofot</p>
                <p className="text-xl font-black text-blue-950 mt-0.5">
                  {formatCurrency(problem.budget)} {problem.currency}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Hudud: <strong>{problem.region}</strong></span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>E'lon qilingan: <strong>{new Date(problem.createdAt).toLocaleDateString("uz-UZ")}</strong></span>
            </div>
          </div>

          {/* Problem Owner info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Muammo Egasi</h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                {owner.profile.firstName[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {owner.profile.firstName} {owner.profile.lastName}
                </h4>
                <p className="text-xs text-slate-500">@{owner.profile.username}</p>
              </div>
            </div>

            {owner.profile.organizationName && (
              <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border">
                Tashkilot: <strong>{owner.profile.organizationName}</strong>
              </p>
            )}

            {owner.profile.bio && (
              <p className="text-xs text-slate-600 italic">"{owner.profile.bio}"</p>
            )}
          </div>
        </div>
      </div>

      {/* SOLUTION REVIEW & AI EVALUATION MODAL */}
      <SolutionReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        solutionId={selectedSolutionId}
        initialSolutionData={selectedSolutionData}
        isProblemOwner={isProblemOwner}
        defaultTab={modalDefaultTab}
        onStatusUpdated={() => {
          fetchProblemDetail();
        }}
      />
    </div>
  );
}
