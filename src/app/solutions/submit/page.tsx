"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Send, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

function SubmitSolutionForm() {
  const searchParams = useSearchParams();
  const problemId = searchParams.get("problemId");

  const [problemTitle, setProblemTitle] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technicalApproach: "",
    expectedResult: "",
    estimatedCost: 0,
    estimatedDays: 30,
    githubUrl: "",
    demoUrl: "",
    riskAnalysis: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (problemId) {
      fetchProblem();
    } else {
      setFetching(false);
    }
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const res = await fetch(`/api/v1/problems/${problemId}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setProblemTitle(json.data.title);
        if (json.data.challenge) {
          setChallengeId(json.data.challenge.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!challengeId) {
        throw new Error("Ushbu muammo uchun hali rasmiy Challenge faollashtirilmagan.");
      }

      const res = await fetch("/api/v1/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          challengeId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Yechim yuborishda xatolik yuz berdi.");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard/solutions/my-solutions";
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500">Muammo yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link href={problemId ? `/problems/${problemId}` : "/problems"} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Muammoga qaytish
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Yechim Taklifi Yuborish</h1>
        {problemTitle && (
          <p className="text-sm text-blue-600 font-bold mt-1">Muammo: {problemTitle}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Yechimingiz muvaffaqiyatli qabul qilindi! Shaxsiy kabinetga o'tilmoqda...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Yechim Sarlavhasi *
          </label>
          <input
            type="text"
            required
            placeholder="Masalan: IoT Sensorlar va LoRaWAN asosidagi aqlli sug'orish tizimi"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Yechim Umumiy Tavsifi *
          </label>
          <textarea
            required
            rows={4}
            placeholder="G'oyangiz va muammoni qanday hal etishingiz haqida qisqacha yozing..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Texnik Yondashuv & Arxitektura *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Ishlatiladigan texnologiyalar, apparatlar, algoritmlar va komponentlar tavsifi..."
            value={formData.technicalApproach}
            onChange={(e) => setFormData({ ...formData, technicalApproach: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Taxminiy Xarajat (UZS)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Masalan: 12000000"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Amalga Oshirish Muddati (Kunlar)
            </label>
            <input
              type="number"
              min="1"
              placeholder="30"
              value={formData.estimatedDays}
              onChange={(e) => setFormData({ ...formData, estimatedDays: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              GitHub Repozitoriyasi Linki (Ixtiyoriy)
            </label>
            <input
              type="url"
              placeholder="https://github.com/username/project"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Demo / Video Linki (Ixtiyoriy)
            </label>
            <input
              type="url"
              placeholder="https://demo.example.com"
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Yuborilmoqda..." : (
            <>
              <Send className="w-4 h-4 text-white" /> Yechimni topshirish
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function SubmitSolutionPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Yuklanmoqda...</div>}>
      <SubmitSolutionForm />
    </Suspense>
  );
}
