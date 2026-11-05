"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";

interface ChallengeItem {
  id: string;
  structuredTitle: string;
  formattedObjective: string;
  suggestedSkills: string[];
  targetKPIs: string[];
  challengeFormat: string;
  isOwnerApproved: boolean;
  publishedAt: string;
  problem: {
    id: string;
    title: string;
    region: string;
    category?: { nameUz: string };
    owner: {
      profile?: {
        firstName: string;
        lastName: string;
      };
      email: string;
    };
  };
  solutions: any[];
  shortlists: any[];
  pilots: any[];
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, [page]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/challenges?page=${page}&limit=15`);
      const json = await res.json();
      if (json.success) {
        setChallenges(json.data.challenges);
        setTotalPages(json.data.pagination.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id: string, currentVal: boolean) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/v1/admin/challenges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isOwnerApproved: !currentVal }),
      });
      const json = await res.json();
      if (json.success) {
        fetchChallenges();
        if (selectedChallenge?.id === id) {
          setSelectedChallenge({
            ...selectedChallenge,
            isOwnerApproved: !currentVal,
          });
        }
      } else {
        alert(json.error || "Yangilashda xatolik");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">AI Challenge'lar Boshqaruvi</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sun'iy intellekt tomonidan shakllantirilgan texnik topshiriqlar, KPIlar va ularga berilgan yechimlar.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
            Yuklanmoqda...
          </div>
        ) : challenges.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Sparkles className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">Challenge'lar mavjud emas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Strukturalashgan Sarlavha & Muammo</th>
                  <th className="py-3 px-4">Format & Hudud</th>
                  <th className="py-3 px-4">Talab Qilingan KPIlar</th>
                  <th className="py-3 px-4">Yechimlar</th>
                  <th className="py-3 px-4">Tasdiqlanganlik</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {challenges.map((ch) => (
                  <tr key={ch.id} className="hover:bg-white/5 transition">
                    
                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-white line-clamp-1">
                        {ch.structuredTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        Muammo: {ch.problem.title}
                      </div>
                    </td>

                    {/* Format & Region */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-bold bg-blue-500/20 text-sky-300 border border-blue-500/30 px-2 py-0.5 rounded-md">
                        {ch.challengeFormat}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{ch.problem.region}</div>
                    </td>

                    {/* KPIs */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {ch.targetKPIs.slice(0, 2).map((kpi, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded-sm line-clamp-1 max-w-[150px]"
                          >
                            {kpi}
                          </span>
                        ))}
                        {ch.targetKPIs.length > 2 && (
                          <span className="text-[9px] text-slate-500">+{ch.targetKPIs.length - 2} ta</span>
                        )}
                      </div>
                    </td>

                    {/* Solutions Count */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {ch.solutions.length} ta yechim
                      </span>
                    </td>

                    {/* Approval Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {ch.isOwnerApproved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Tasdiqlangan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          Kutilmoqda
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedChallenge(ch)}
                          className="bg-blue-600/30 hover:bg-blue-600 text-sky-200 hover:text-white font-semibold px-2.5 py-1 rounded-lg text-xs transition border border-blue-500/30"
                        >
                          Batafsil
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Sahifa {page} / {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-2xl w-full space-y-5 text-white shadow-2xl relative my-8">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Challenge Spetsifikatsiyasi
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedChallenge.structuredTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Objective */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Strukturalashgan Maqsad va Talablar:
              </label>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedChallenge.formattedObjective}
              </div>
            </div>

            {/* Target KPIs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target KPI Ko'rsatkichlari:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedChallenge.targetKPIs.map((kpi, idx) => (
                  <div key={idx} className="bg-white/5 p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-300">{kpi}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Kerakli Mutaxassislik Ko'nikmalari:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedChallenge.suggestedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-500/20 text-sky-300 border border-blue-500/30 px-2.5 py-1 rounded-lg"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Approval toggle */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300 block">
                  Egasi tomonidan tasdiqlangan:
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedChallenge.isOwnerApproved ? "Ha, tasdiqlangan" : "Yo'q, kutilmoqda"}
                </span>
              </div>

              <button
                onClick={() =>
                  handleToggleApproval(selectedChallenge.id, selectedChallenge.isOwnerApproved)
                }
                disabled={actionLoading === selectedChallenge.id}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                  selectedChallenge.isOwnerApproved
                    ? "bg-amber-600/30 text-amber-300 border border-amber-500/30 hover:bg-amber-600/50"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {selectedChallenge.isOwnerApproved ? "Tasdiqni bekor qilish" : "Majburiy tasdiqlash"}
              </button>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <Link
                href={`/problems/${selectedChallenge.problem.id}`}
                target="_blank"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
              >
                Muammo sahifasiga o'tish <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setSelectedChallenge(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
