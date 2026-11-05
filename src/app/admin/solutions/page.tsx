"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Award,
  Sparkles,
  MapPin,
  ExternalLink,
  RefreshCw,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Zap,
} from "lucide-react";

interface SolutionItem {
  id: string;
  title: string;
  description: string;
  technicalApproach: string;
  expectedResult?: string;
  estimatedCost: number;
  estimatedDays: number;
  teamMembers: string[];
  githubUrl?: string;
  demoUrl?: string;
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
      region: string;
      occupation?: string;
    };
  };
  challenge: {
    id: string;
    structuredTitle: string;
    problem: {
      id: string;
      title: string;
      region: string;
      category?: {
        nameUz: string;
      };
    };
  };
  reviews: any[];
}

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSolution, setSelectedSolution] = useState<SolutionItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSolutions();
  }, [search, statusFilter, page]);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      params.append("page", String(page));
      params.append("limit", "15");

      const res = await fetch(`/api/v1/admin/solutions?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSolutions(json.data.solutions);
        setTotalPages(json.data.pagination.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/v1/admin/solutions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchSolutions();
        if (selectedSolution?.id === id) {
          setSelectedSolution({ ...selectedSolution, status: newStatus });
        }
      } else {
        alert(json.error || "Statusni o'zgartirishda xatolik");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <span className="bg-blue-500/20 text-sky-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Yuborilgan</span>;
      case "UNDER_REVIEW":
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Ekspertizada</span>;
      case "SHORTLISTED":
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Shortlist</span>;
      case "SELECTED":
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Tanlab Olingan</span>;
      case "PILOT":
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Pilot Sinovda</span>;
      case "REJECTED":
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Rad etilgan</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Yechimlar & Takliflar Boshqaruvi</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Challenge topshiriqlari bo'yicha yuborilgan yechimlar, ularning ekspert baholari va saralash jarayoni.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Yechim nomi, texnik yondashuv yoki muammo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-sky-400"
        >
          <option value="">Barcha Statuslar</option>
          <option value="SUBMITTED">Yuborilgan (SUBMITTED)</option>
          <option value="UNDER_REVIEW">Ekspertizadagi (UNDER_REVIEW)</option>
          <option value="SHORTLISTED">Shortlist qilingan</option>
          <option value="SELECTED">Tanlab olingan (SELECTED)</option>
          <option value="PILOT">Pilot sinoviga o'tgan</option>
          <option value="REJECTED">Rad etilgan</option>
        </select>
      </div>

      {/* SOLUTIONS TABLE */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
            Yuklanmoqda...
          </div>
        ) : solutions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">Yechimlar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Yechim & Yechimchi</th>
                  <th className="py-3 px-4">Bog'langan Muammo</th>
                  <th className="py-3 px-4">Muddat & Xarajat</th>
                  <th className="py-3 px-4">O'rtacha Ball</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {solutions.map((sol) => (
                  <tr key={sol.id} className="hover:bg-white/5 transition">
                    
                    {/* Solution & Solver */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-white line-clamp-1">{sol.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {sol.solver.profile?.firstName} {sol.solver.profile?.lastName} ({sol.solver.email})
                      </div>
                    </td>

                    {/* Problem */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-300 font-medium line-clamp-1">
                        {sol.challenge.problem.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {sol.challenge.problem.region}
                      </div>
                    </td>

                    {/* Cost & Days */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-amber-400">
                        {sol.estimatedCost.toLocaleString()} UZS
                      </div>
                      <div className="text-[10px] text-slate-400">{sol.estimatedDays} kun</div>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {sol.scoreAvg > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {sol.scoreAvg.toFixed(1)} / 10
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Baholanmagan</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(sol.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedSolution(sol)}
                          className="bg-blue-600/30 hover:bg-blue-600 text-sky-200 hover:text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition border border-blue-500/30 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ko'rish
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

      {/* SOLUTION DETAIL MODAL */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-2xl w-full space-y-6 text-white shadow-2xl relative my-8">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
                  Yechim Tafsilotlari
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedSolution.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Muallif: {selectedSolution.solver.profile?.firstName} {selectedSolution.solver.profile?.lastName} ({selectedSolution.solver.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedSolution(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Problem reference */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
              <span className="text-slate-400 block">Qaysi muammoga berilgan:</span>
              <span className="font-bold text-sky-300">{selectedSolution.challenge.problem.title}</span>
            </div>

            {/* Technical Approach */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Texnik Yondashuv:
              </label>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                {selectedSolution.technicalApproach}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Umumiy Tavsif:
              </label>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto">
                {selectedSolution.description}
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block">Kutilgan xarajat:</span>
                <span className="font-bold text-amber-400">
                  {selectedSolution.estimatedCost.toLocaleString()} UZS
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block">Muddat:</span>
                <span className="font-semibold text-white">
                  {selectedSolution.estimatedDays} kun
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block">O'rtacha Ball:</span>
                <span className="font-bold text-emerald-400">
                  ★ {selectedSolution.scoreAvg || 0} / 10
                </span>
              </div>
            </div>

            {/* Status Changer */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Yechim Holatini O'zgartirish:
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedSolution.id, "SHORTLISTED")}
                  disabled={actionLoading === selectedSolution.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedSolution.status === "SHORTLISTED"
                      ? "bg-amber-600 text-white"
                      : "bg-white/10 hover:bg-amber-600/30 text-amber-300"
                  }`}
                >
                  ★ Shortlistga kiritish
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedSolution.id, "SELECTED")}
                  disabled={actionLoading === selectedSolution.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedSolution.status === "SELECTED"
                      ? "bg-emerald-600 text-white"
                      : "bg-white/10 hover:bg-emerald-600/30 text-emerald-300"
                  }`}
                >
                  ✓ G'olib sifatida tanlash (SELECTED)
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedSolution.id, "PILOT")}
                  disabled={actionLoading === selectedSolution.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedSolution.status === "PILOT"
                      ? "bg-cyan-600 text-white"
                      : "bg-white/10 hover:bg-cyan-600/30 text-cyan-300"
                  }`}
                >
                  🧪 Pilot Sinoviga yuborish
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedSolution.id, "REJECTED")}
                  disabled={actionLoading === selectedSolution.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedSolution.status === "REJECTED"
                      ? "bg-rose-600 text-white"
                      : "bg-white/10 hover:bg-rose-600/30 text-rose-300"
                  }`}
                >
                  ✕ Rad etish
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedSolution(null)}
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
