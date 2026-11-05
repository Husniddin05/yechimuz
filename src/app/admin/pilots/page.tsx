"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Plus,
  RefreshCw,
  Search,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  Star,
  Activity,
  Calendar,
} from "lucide-react";

interface PilotItem {
  id: string;
  region: string;
  startDate: string;
  endDate?: string;
  budget: number;
  responsiblePerson?: string;
  status: string;
  expectedResult?: string;
  actualResult?: string;
  challenge: {
    id: string;
    structuredTitle: string;
    problem: {
      id: string;
      title: string;
      region: string;
      category?: { nameUz: string };
    };
  };
  solution: {
    id: string;
    title: string;
    solver: {
      profile?: {
        firstName: string;
        lastName: string;
        organizationName?: string;
      };
    };
  };
  metrics: {
    id: string;
    metricName: string;
    expectedValue: string;
    actualValue: string;
    unit?: string;
  }[];
  impact?: {
    id: string;
    totalScore: number;
    summary?: string;
  };
}

export default function AdminPilotsPage() {
  const [pilots, setPilots] = useState<PilotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPilot, setSelectedPilot] = useState<PilotItem | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Edit fields inside modal
  const [editStatus, setEditStatus] = useState("");
  const [editActualResult, setEditActualResult] = useState("");
  const [editImpactScore, setEditImpactScore] = useState<number>(0);
  const [editImpactSummary, setEditImpactSummary] = useState("");
  const [editMetrics, setEditMetrics] = useState<any[]>([]);

  useEffect(() => {
    fetchPilots();
  }, [statusFilter, regionFilter]);

  const fetchPilots = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (regionFilter) params.append("region", regionFilter);

      const res = await fetch(`/api/v1/admin/pilots?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setPilots(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (p: PilotItem) => {
    setSelectedPilot(p);
    setEditStatus(p.status);
    setEditActualResult(p.actualResult || "");
    setEditImpactScore(p.impact?.totalScore || 0);
    setEditImpactSummary(p.impact?.summary || "");
    setEditMetrics(p.metrics.map((m) => ({ ...m })));
  };

  const handleSavePilot = async () => {
    if (!selectedPilot) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/v1/admin/pilots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPilot.id,
          status: editStatus,
          actualResult: editActualResult,
          impactTotal: editImpactScore,
          impactSummary: editImpactSummary,
          metricUpdates: editMetrics,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedPilot(null);
        fetchPilots();
      } else {
        alert(json.error || "Yangilashda xatolik");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Jarayonda (RUNNING)</span>;
      case "PLANNED":
        return <span className="bg-blue-500/20 text-sky-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Rejalashtirilgan</span>;
      case "EVALUATION":
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Baholashda</span>;
      case "COMPLETED":
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Muvaffaqiyatli Yakunlangan</span>;
      case "FAILED":
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">Kutilgan natija bermadi</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Pilot Sinovlari & Impact Monitoringi</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Farg'ona va boshqa hududlarda amaliyotga tatbiq etilayotgan real pilot loyihalar natijalari.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-sky-400"
        >
          <option value="">Barcha Statuslar</option>
          <option value="RUNNING">Faol Jarayonda (RUNNING)</option>
          <option value="PLANNED">Rejalashtirilgan (PLANNED)</option>
          <option value="EVALUATION">Baholashda (EVALUATION)</option>
          <option value="COMPLETED">Muvaffaqiyatli Yakunlangan</option>
          <option value="FAILED">Kutilgan natija bermadi</option>
        </select>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-sky-400"
        >
          <option value="">Barcha Hududlar</option>
          <option value="Farg'ona">Farg'ona</option>
          <option value="Toshkent">Toshkent</option>
          <option value="Samarqand">Samarqand</option>
        </select>
      </div>

      {/* PILOTS GRID */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-white/10 rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
          Yuklanmoqda...
        </div>
      ) : pilots.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-white/10 rounded-2xl space-y-2">
          <Award className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-semibold">Pilot loyihalar topilmadi</p>
          <p className="text-xs text-slate-500">Tanlangan yechimlarni "PILOT" bosqichiga o'tkazish orqali yangi pilot boshlashingiz mumkin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pilots.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-amber-400/40 transition shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {p.region}
                    </span>
                    {getStatusBadge(p.status)}
                  </div>
                  <h3 className="text-base font-bold text-white mt-2">
                    {p.challenge.problem.title}
                  </h3>
                </div>

                {p.impact?.totalScore !== undefined && (
                  <div className="text-center bg-amber-400/10 border border-amber-400/30 p-2 rounded-xl">
                    <span className="text-lg font-black text-amber-400">{p.impact.totalScore}</span>
                    <span className="text-[9px] block text-slate-400 uppercase">Impact</span>
                  </div>
                )}
              </div>

              {/* Solution & Responsible */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs space-y-1">
                <div className="text-slate-400">
                  Tanlangan Yechim: <span className="text-white font-semibold">{p.solution.title}</span>
                </div>
                <div className="text-slate-400">
                  Mas'ul: <span className="text-sky-300">{p.responsiblePerson || "Belgilanmagan"}</span>
                </div>
                <div className="text-slate-400">
                  Byudjet: <span className="text-amber-400 font-bold">{p.budget.toLocaleString()} UZS</span>
                </div>
              </div>

              {/* Metrics */}
              {p.metrics.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Metrikalar (Kutilgan vs Haqiqiy):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {p.metrics.map((m) => (
                      <div key={m.id} className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[11px] text-slate-400 block truncate">{m.metricName}</span>
                        <div className="flex items-center gap-1 mt-1 font-bold">
                          <span className="text-slate-400">{m.expectedValue}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400">{m.actualValue} {m.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleOpenModal(p)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  Natijalarni kiritish / Yangilash →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {selectedPilot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-xl w-full space-y-5 text-white shadow-2xl relative my-8">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
                  Pilot Monitoringi: {selectedPilot.region}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedPilot.challenge.problem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPilot(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Pilot Statusi:</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="PLANNED">PLANNED (Rejalashtirilgan)</option>
                <option value="RUNNING">RUNNING (Amalda joriy etilmoqda)</option>
                <option value="EVALUATION">EVALUATION (Sinov yakuni va baholash)</option>
                <option value="COMPLETED">COMPLETED (Muvaffaqiyatli yakunlandi)</option>
                <option value="FAILED">FAILED (Kutilgan samara bermadi)</option>
              </select>
            </div>

            {/* Actual Result Text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Haqiqiy Erishilgan Natija:</label>
              <textarea
                rows={3}
                value={editActualResult}
                onChange={(e) => setEditActualResult(e.target.value)}
                placeholder="Masalan: Farg'ona tumanidagi 5 gektar issiqxonada suv sarfi 34.2% ga kamaytirildi..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
              />
            </div>

            {/* Metrics Inputs */}
            {editMetrics.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Metrikalarni Yangilash (Haqiqiy qiymatlar):</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {editMetrics.map((m, idx) => (
                    <div key={m.id || idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-white/10 text-xs">
                      <span className="flex-1 text-slate-300 truncate">{m.metricName}</span>
                      <span className="text-slate-500">Kutilgan: {m.expectedValue}</span>
                      <input
                        type="text"
                        value={m.actualValue}
                        onChange={(e) => {
                          const updated = [...editMetrics];
                          updated[idx].actualValue = e.target.value;
                          setEditMetrics(updated);
                        }}
                        className="w-24 bg-slate-900 border border-white/20 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold"
                        placeholder="Haqiqiy..."
                      />
                      <span className="text-slate-400 text-[10px]">{m.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Score & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Impact Ball (0-100):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editImpactScore}
                  onChange={(e) => setEditImpactScore(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400">Impact Xulosasi:</label>
                <input
                  type="text"
                  value={editImpactSummary}
                  onChange={(e) => setEditImpactSummary(e.target.value)}
                  placeholder="Iqtisodiy va ekologik samara..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedPilot(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Bekor qilish
              </button>

              <button
                onClick={handleSavePilot}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow transition"
              >
                {actionLoading ? "Saqlanmoqda..." : "Natijalarni Saqlash"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
