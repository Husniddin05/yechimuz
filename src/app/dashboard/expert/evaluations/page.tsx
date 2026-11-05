"use client";

import { useState, useEffect } from "react";
import { Award, CheckCircle2, Star, Shield, ArrowRight, MessageSquare, Send } from "lucide-react";

interface SolutionItem {
  id: string;
  title: string;
  description: string;
  technicalApproach: string;
  estimatedCost: number;
  estimatedDays: number;
  status: string;
  scoreAvg: number;
  challenge: {
    problem: {
      id: string;
      title: string;
    };
  };
  solver: {
    profile: {
      firstName: string;
      lastName: string;
      organizationName?: string;
    };
  };
}

export default function ExpertEvaluationsPage() {
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<SolutionItem | null>(null);
  const [loading, setLoading] = useState(true);

  // 9-criterion scores state (1-10)
  const [scores, setScores] = useState({
    innovationScore: 8,
    feasibilityScore: 8,
    costEfficiencyScore: 7,
    impactScore: 9,
    scalabilityScore: 8,
    technicalQualityScore: 8,
    implementationTimeScore: 8,
    securityScore: 9,
    socialImpactScore: 9,
    comments: "",
  });

  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      // Fetch open problem solutions
      const res = await fetch("/api/v1/problems");
      const json = await res.json();

      if (json.success && json.data.length > 0) {
        // Fetch solutions for first problem
        const probId = json.data[0].id;
        const solRes = await fetch(`/api/v1/problems/${probId}/solutions`);
        const solJson = await solRes.json();
        if (solJson.success) {
          setSolutions(solJson.data);
          if (solJson.data.length > 0) setSelectedSolution(solJson.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalScore = () => {
    const sum =
      scores.innovationScore +
      scores.feasibilityScore +
      scores.costEfficiencyScore +
      scores.impactScore +
      scores.scalabilityScore +
      scores.technicalQualityScore +
      scores.implementationTimeScore +
      scores.securityScore +
      scores.socialImpactScore;
    return (sum / 9).toFixed(1);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolution) return;
    setReviewMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/v1/solutions/${selectedSolution.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scores),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Baholashni saqlashda xatolik");
      }

      setReviewMsg("Ekspert bahosi muvaffaqiyatli saqlandi va yechim reytingi yangilandi!");
      fetchSolutions();
    } catch (err: any) {
      setReviewMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500">Baholanadigan yechimlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-8 h-8 text-amber-500" /> Ekspert Baholash Paneli
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Yechimlarni 9 ta mezon bo'yicha mustaqil baholash va xulosa berish interfeysi.
        </p>
      </div>

      {reviewMsg && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-xs font-bold">
          {reviewMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Solution List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topshirilgan Yechimlar</h3>

          {solutions.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Hali yechimlar mavjud emas
            </div>
          ) : (
            solutions.map((sol) => (
              <div
                key={sol.id}
                onClick={() => setSelectedSolution(sol)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  selectedSolution?.id === sol.id
                    ? "border-blue-600 bg-blue-50/70"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">
                    Status: {sol.status}
                  </span>
                  <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {sol.scoreAvg || "—"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{sol.title}</h4>
                <p className="text-xs text-slate-500">
                  Yechimchi: {sol.solver.profile.firstName} {sol.solver.profile.lastName}
                </p>
              </div>
            ))
          )}
        </div>

        {/* 9 Criteria Evaluation Form */}
        {selectedSolution ? (
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedSolution.title}</h3>
                  <p className="text-xs text-slate-500">Muammo: {selectedSolution.challenge.problem.title}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold">Kutilayotgan Ball</span>
                  <p className="text-2xl font-black text-blue-600">{calculateTotalScore()} / 10</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed">
                <strong>Texnik yondashuv:</strong> {selectedSolution.technicalApproach}
              </div>
            </div>

            {/* 9 CRITERIA SLIDERS */}
            <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                9 Ta Mezon Bo'yicha Baholash (1 - 10 Ball)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {[
                  { key: "innovationScore", label: "1. Innovatsiya va Yangilik" },
                  { key: "feasibilityScore", label: "2. Amalga Oshirish Imkoniyati (Feasibility)" },
                  { key: "costEfficiencyScore", label: "3. Iqtisodiy Samaradorlik & Byudjet" },
                  { key: "impactScore", label: "4. Muammoni Hal Etish Ta'siri (Impact)" },
                  { key: "scalabilityScore", label: "5. Kengaytiriluvchanlik (Scalability)" },
                  { key: "technicalQualityScore", label: "6. Texnik Sifat va Ishonchlilik" },
                  { key: "implementationTimeScore", label: "7. Muddat va Zudliklik" },
                  { key: "securityScore", label: "8. Xavfsizlik va Kiber-himoya" },
                  { key: "socialImpactScore", label: "9. Ijtimoiy & Ekologik Foyda" },
                ].map((crit) => (
                  <div key={crit.key} className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{crit.label}</span>
                      <span className="text-blue-600">{scores[crit.key as keyof typeof scores]} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores[crit.key as keyof typeof scores]}
                      onChange={(e) => setScores({ ...scores, [crit.key]: Number(e.target.value) })}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ekspert Xulosasi va Izohlari
                </label>
                <textarea
                  rows={3}
                  placeholder="Yechimning kuchli va zaif tomonlari bo'yicha tavsiyalaringizni yozing..."
                  value={scores.comments}
                  onChange={(e) => setScores({ ...scores, comments: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Saqlanmoqda..." : (
                  <>
                    <Send className="w-4 h-4 text-white" /> Ekspert Bahosini Saqlash ({calculateTotalScore()} / 10)
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            Baholash uchun yechimni tanlang
          </div>
        )}
      </div>
    </div>
  );
}
