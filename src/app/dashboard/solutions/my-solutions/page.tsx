"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Star, Clock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

interface MySolution {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  estimatedDays: number;
  status: string;
  scoreAvg: number;
  createdAt: string;
  challenge: {
    problem: {
      id: string;
      title: string;
      region: string;
    };
  };
  reviews: Array<{
    id: string;
    totalScore: number;
  }>;
}

export default function MySolutionsPage() {
  const [solutions, setSolutions] = useState<MySolution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySolutions();
  }, []);

  const fetchMySolutions = async () => {
    try {
      const res = await fetch("/api/v1/solutions");
      const json = await res.json();
      if (json.success) {
        setSolutions(json.data);
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500">Yechimlaringiz yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mening Yechim Takliflarim</h1>
        <p className="text-xs text-slate-500 mt-1">
          Topshirgan barcha yechimlaringiz, ekspert baholari va statuslar ro'yxati.
        </p>
      </div>

      {solutions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <p className="text-base font-bold text-slate-700">Siz hali birorta ham yechim yubormagansiz</p>
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
          >
            Muammolar marketplace'iga o'tish
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded">
                    Status: {sol.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(sol.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{sol.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{sol.description}</p>
                <p className="text-xs text-slate-500 font-semibold">
                  Muammo: <Link href={`/problems/${sol.challenge.problem.id}`} className="text-blue-600 hover:underline">{sol.challenge.problem.title}</Link>
                </p>
              </div>

              <div className="flex items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Ekspert Balli</span>
                  <div className="text-xl font-black text-amber-500 flex items-center gap-1 justify-end">
                    <Star className="w-5 h-5 fill-amber-500" /> {sol.scoreAvg || "—"}
                  </div>
                  <span className="text-[10px] text-slate-400">{sol.reviews.length} ta ekspert baholadi</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Taxminiy Narx</span>
                  <p className="text-sm font-black text-slate-900">{formatCurrency(sol.estimatedCost)} UZS</p>
                  <p className="text-[10px] text-slate-400">{sol.estimatedDays} kun</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
