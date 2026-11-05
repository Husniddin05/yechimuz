"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Sparkles,
  MapPin,
  ExternalLink,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface ProblemItem {
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
    id: string;
    nameUz: string;
    slug: string;
  };
  owner: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
  challenge?: {
    id: string;
    structuredTitle: string;
    isOwnerApproved: boolean;
    _count: {
      solutions: number;
    };
  };
}

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProblems();
  }, [search, statusFilter, regionFilter, page]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (regionFilter) params.append("region", regionFilter);
      params.append("page", String(page));
      params.append("limit", "15");

      const res = await fetch(`/api/v1/admin/problems?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setProblems(json.data.problems);
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
      const res = await fetch("/api/v1/admin/problems", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchProblems();
        if (selectedProblem?.id === id) {
          setSelectedProblem({ ...selectedProblem, status: newStatus });
        }
      } else {
        alert(json.error || "Xatolik yuz berdi");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham ushbu muammoni butunlay o'chirmoqchimisiz?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/admin/problems?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setSelectedProblem(null);
        fetchProblems();
      } else {
        alert(json.error || "O'chirishda xatolik");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Kutilmoqda</span>;
      case "PUBLISHED":
        return <span className="bg-blue-500/20 text-sky-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">E'londa</span>;
      case "CHALLENGE_READY":
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Challenge</span>;
      case "PILOT":
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Pilot Sinov</span>;
      case "SOLVED":
        return <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Yechilgan</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Muammolarni Moderatsiya Qilish</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Foydalanuvchilar e'lon qilgan muammolarni tekshirish, tasdiqlash, tahrirlash va statuslarini o'zgartirish.
          </p>
        </div>

        <Link
          href="/dashboard/problems/create"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi Muammo Qo'shish
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Muammo sarlavhasi yoki tashkilot..."
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
          <option value="PENDING_REVIEW">Kutilmoqda (PENDING_REVIEW)</option>
          <option value="PUBLISHED">E'londa (PUBLISHED)</option>
          <option value="CHALLENGE_READY">Challenge Tayyor</option>
          <option value="PILOT">Pilot Sinovida</option>
          <option value="SOLVED">Yechilgan</option>
        </select>

        {/* Region Filter */}
        <select
          value={regionFilter}
          onChange={(e) => {
            setRegionFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-sky-400"
        >
          <option value="">Barcha Hududlar</option>
          <option value="Farg'ona">Farg'ona</option>
          <option value="Toshkent">Toshkent</option>
          <option value="Samarqand">Samarqand</option>
          <option value="Andijon">Andijon</option>
          <option value="Namangan">Namangan</option>
          <option value="Buxoro">Buxoro</option>
        </select>
      </div>

      {/* PROBLEMS TABLE */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
            Yuklanmoqda...
          </div>
        ) : problems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">Hech qanday muammo topilmadi</p>
            <p className="text-xs text-slate-500">Filtrlarni o'zgartirib ko'ring yoki yangi muammo qo'shing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Muammo & Muallif</th>
                  <th className="py-3 px-4">Hudud & Kategoriya</th>
                  <th className="py-3 px-4">Byudjet</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Challenge</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {problems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-white/5 transition">
                    
                    {/* Title & Author */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-white line-clamp-1">{prob.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {prob.owner.profile?.firstName} {prob.owner.profile?.lastName} ({prob.owner.email})
                      </div>
                    </td>

                    {/* Region & Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-300 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {prob.region}
                      </div>
                      <div className="text-[10px] text-slate-400">{prob.category?.nameUz}</div>
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-amber-400">
                        {prob.budget.toLocaleString()} {prob.currency}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(prob.status)}
                    </td>

                    {/* Challenge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {prob.challenge ? (
                        <span className="text-[11px] text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          {prob.challenge._count.solutions} yechim
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Mavjud emas</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Quick Approve button if pending */}
                        {prob.status === "PENDING_REVIEW" && (
                          <button
                            onClick={() => handleUpdateStatus(prob.id, "PUBLISHED")}
                            disabled={actionLoading === prob.id}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded-lg text-[10px] transition"
                            title="Tasdiqlash"
                          >
                            Tasdiqlash
                          </button>
                        )}

                        {/* View modal */}
                        <button
                          onClick={() => setSelectedProblem(prob)}
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition"
                          title="Batafsil ko'rish"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Direct link */}
                        <Link
                          href={`/problems/${prob.id}`}
                          target="_blank"
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-sky-400 rounded-lg transition"
                          title="Foydalanuvchi ko'rinishida ochish"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(prob.id)}
                          disabled={actionLoading === prob.id}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* PROBLEM DETAILS & MODERATION MODAL */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-2xl w-full space-y-6 text-white shadow-2xl relative my-8">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
                  {selectedProblem.category?.nameUz} • {selectedProblem.region}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedProblem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Muammoning to'liq tavsifi:
              </label>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedProblem.rawDescription}
              </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 block">Byudjet:</span>
                <span className="font-bold text-amber-400">
                  {selectedProblem.budget.toLocaleString()} {selectedProblem.currency}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 block">Tashkilot:</span>
                <span className="font-semibold text-white">
                  {selectedProblem.organization || "Jismoniy shaxs"}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 block">Jiddiylik darajasi:</span>
                <span className="font-semibold text-rose-400">
                  {selectedProblem.severityLevel}
                </span>
              </div>
            </div>

            {/* Owner info */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Muammo Egasi:</span>
                <span className="font-bold text-white">
                  {selectedProblem.owner.profile?.firstName} {selectedProblem.owner.profile?.lastName}
                </span>{" "}
                <span className="text-slate-400">(@{selectedProblem.owner.profile?.username})</span>
              </div>
              <span className="text-slate-400">{selectedProblem.owner.email}</span>
            </div>

            {/* Moderation Status Changer */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Statusni o'zgartirish:
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedProblem.id, "PUBLISHED")}
                  disabled={actionLoading === selectedProblem.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedProblem.status === "PUBLISHED"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 hover:bg-blue-600/30 text-sky-300"
                  }`}
                >
                  ✓ E'lon qilish (PUBLISHED)
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedProblem.id, "PILOT")}
                  disabled={actionLoading === selectedProblem.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedProblem.status === "PILOT"
                      ? "bg-emerald-600 text-white"
                      : "bg-white/10 hover:bg-emerald-600/30 text-emerald-300"
                  }`}
                >
                  🧪 Pilot Sinovga o'tkazish
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedProblem.id, "SOLVED")}
                  disabled={actionLoading === selectedProblem.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedProblem.status === "SOLVED"
                      ? "bg-teal-600 text-white"
                      : "bg-white/10 hover:bg-teal-600/30 text-teal-300"
                  }`}
                >
                  ★ Yechildi (SOLVED)
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedProblem.id, "PENDING_REVIEW")}
                  disabled={actionLoading === selectedProblem.id}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    selectedProblem.status === "PENDING_REVIEW"
                      ? "bg-amber-600 text-white"
                      : "bg-white/10 hover:bg-amber-600/30 text-amber-300"
                  }`}
                >
                  ⏳ Qayta Ko'rishga qaytarish
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/problems/${selectedProblem.id}`}
                target="_blank"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
              >
                Sahifani alohida ko'rish <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setSelectedProblem(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl"
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
