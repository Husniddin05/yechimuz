"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Target,
  Shield,
  Clock,
  RotateCw,
  Lock,
} from "lucide-react";

interface AIChallengeWidgetProps {
  problemId?: string;
  initialTitle?: string;
  initialDescription?: string;
  region?: string;
  isOwner?: boolean;
  existingChallenge?: any;
  onChallengeGenerated?: (challenge: any) => void;
}

export function AIChallengeGeneratorWidget({
  problemId,
  initialTitle = "",
  initialDescription = "",
  region = "Farg'ona",
  isOwner = false,
  existingChallenge,
  onChallengeGenerated,
}: AIChallengeWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [generatedChallenge, setGeneratedChallenge] = useState<any>(null);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingChallenge) {
      let suggestedSkills = [];
      try {
        suggestedSkills = typeof existingChallenge.suggestedSkills === "string"
          ? JSON.parse(existingChallenge.suggestedSkills)
          : existingChallenge.suggestedSkills || [];
      } catch {
        suggestedSkills = [];
      }

      let targetKPIs = [];
      try {
        targetKPIs = typeof existingChallenge.targetKPIs === "string"
          ? JSON.parse(existingChallenge.targetKPIs)
          : existingChallenge.targetKPIs || [];
      } catch {
        targetKPIs = [];
      }

      let generatedQuestions = [];
      try {
        generatedQuestions = typeof existingChallenge.generatedQuestions === "string"
          ? JSON.parse(existingChallenge.generatedQuestions)
          : existingChallenge.generatedQuestions || [];
      } catch {
        generatedQuestions = [];
      }

      setGeneratedChallenge({
        ...existingChallenge,
        suggestedSkills,
        targetKPIs,
        generatedQuestions,
      });

      setApproved(Boolean(existingChallenge.isOwnerApproved));
    } else {
      setGeneratedChallenge(null);
      setApproved(false);
    }
  }, [existingChallenge]);

  const handleGenerate = async () => {
    if (!isOwner) {
      setError("Faqatgina muammoni joylagan inson AI Challenge'ni boshlay oladi!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/ai/generate-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          title: initialTitle,
          rawDescription: initialDescription,
          region,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "AI Challenge yaratishda xatolik");
      }

      setGeneratedChallenge(json.data);
      if (onChallengeGenerated) onChallengeGenerated(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!problemId || !isOwner) {
      setError("Faqatgina muammo egasi AI Challenge'ni tasdiqlashi mumkin!");
      return;
    }

    try {
      const res = await fetch(`/api/v1/problems/${problemId}/approve-challenge`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.success) {
        setApproved(true);
        if (onChallengeGenerated) onChallengeGenerated(json.data);
      } else {
        throw new Error(json.error || "Tasdiqlashda xatolik");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-800/50 space-y-6">
      {/* Header / Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-2.5 rounded-2xl text-slate-950 font-black shadow-md flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-white">YechimUZ AI Challenge Generator</h3>
              {isOwner ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  Siz muammo egasisiz
                </span>
              ) : (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  Rasmiy Challenge
                </span>
              )}
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Muammoni tahlil qilib, KPI va rasmiy Challenge formatini yaratish.
            </p>
          </div>
        </div>

        {/* Generate Button: ONLY FOR THE PROBLEM OWNER! */}
        {!generatedChallenge && isOwner && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition disabled:opacity-50 whitespace-nowrap self-start sm:self-auto transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "AI Challenge Shakllantirilmoqda..." : "AI Challenge'ni Boshlash"}
          </button>
        )}
      </div>

      {/* Info Notice when user is NOT the owner and challenge hasn't been started yet */}
      {!generatedChallenge && !isOwner && (
        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-blue-900/30 border border-blue-800/50 text-xs">
          <div className="p-2 bg-blue-800/40 rounded-xl text-blue-300 flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white">AI Challenge Boshlanishi Kutilmoqda</h4>
            <p className="text-slate-300 leading-relaxed">
              Ushbu muammo bo'yicha rasmiy AI Challenge'ni faqat muammoni kiritgan inson boshlay oladi. Muammo egasi sun'iy intellekt orqali topshiriqni shakllantirib tasdiqlagach, uning to'liq talabnomasi shu yerda paydo bo'ladi.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* GENERATED CHALLENGE DISPLAY */}
      {generatedChallenge && (
        <div className="space-y-4 pt-3 border-t border-blue-900/60 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest">Rasmiy Title</span>
            <h4 className="text-base font-extrabold text-white">{generatedChallenge.structuredTitle}</h4>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Maqsad (Objective)</span>
            <p className="text-xs text-slate-200 leading-relaxed">{generatedChallenge.formattedObjective}</p>
          </div>

          {/* Suggested Skills */}
          {generatedChallenge.suggestedSkills?.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1.5 block">
                Tavsiya Qilinadigan Ko'nikmalar (Required Skills)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {generatedChallenge.suggestedSkills.map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-blue-900/80 border border-blue-700 text-blue-200 text-xs px-2.5 py-0.5 rounded-lg font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target KPIs */}
          {generatedChallenge.targetKPIs?.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 block flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Kutilayotgan KPI ko'rsatkichlari
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {generatedChallenge.targetKPIs.map((kpi: any, idx: number) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-300">{kpi.name}:</span>
                    <strong className="text-emerald-400">{kpi.target}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Clarifying Questions */}
          {generatedChallenge.generatedQuestions?.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-2xl space-y-1 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> AI Savollari (Aniqlashtirish uchun)
              </span>
              <ul className="list-disc list-inside text-amber-100 text-[11px] space-y-1">
                {generatedChallenge.generatedQuestions.map((q: string, idx: number) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Approval Section */}
          {approved ? (
            <div className="bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>AI Challenge formati muammo egasi tomonidan tasdiqlangan va rasmiy e'lon qilingan!</span>
            </div>
          ) : isOwner ? (
            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-blue-900/60">
              <p className="text-xs text-amber-200">
                Siz ushbu muammo egasisiz. Topshiriqni tasdiqlang yoki qayta tahlil qildiring:
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/10 transition flex items-center gap-1"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  Qayta shakllantirish
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Tasdiqlash va Chop Etish
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-950/50 border border-amber-800/50 text-amber-200 p-3 rounded-xl text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Muammo egasi tomonidan AI Challenge formati tasdiqlanishi kutilmoqda.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
