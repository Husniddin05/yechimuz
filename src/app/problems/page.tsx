"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, Tag, AlertTriangle, ArrowUpDown, ChevronRight, PlusCircle, CheckCircle2 } from "lucide-react";

interface Category {
  id: string;
  nameUz: string;
  slug: string;
}

interface ProblemItem {
  id: string;
  title: string;
  rawDescription: string;
  region: string;
  organization?: string;
  problemType: string;
  severityLevel: string;
  budget: number;
  currency: string;
  status: string;
  createdAt: string;
  category: {
    nameUz: string;
  };
  owner: {
    profile: {
      firstName: string;
      lastName: string;
      organizationName?: string;
    };
  };
  challenge?: {
    id: string;
    structuredTitle: string;
  };
}

export default function ProblemMarketplacePage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [selectedCategory, selectedRegion, selectedSeverity, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/v1/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (selectedCategory) params.set("categoryId", selectedCategory);
      if (selectedRegion) params.set("region", selectedRegion);
      if (selectedSeverity) params.set("severityLevel", selectedSeverity);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/v1/problems?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setProblems(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProblems();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("uz-UZ").format(val);
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded text-[11px] font-bold">Juda Yuqori (Critical)</span>;
      case "HIGH":
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Yuqori (High)</span>;
      case "MEDIUM":
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-[11px] font-bold">O'rtacha</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[11px] font-bold">Oddiy</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Muammolar Marketplace'i</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real muammolar va challenge'lar bazasi. Yechim taklif qiling, pilotda qatnashing va mukofotga ega bo'ling.
          </p>
        </div>

        <Link
          href="/dashboard/problems/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow transition"
        >
          <PlusCircle className="w-4 h-4" /> Muammo joylash
        </Link>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Qidiruv (masalan: suv, IoT, agrotexnika, plastik)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            Qidirish
          </button>
        </form>

        {/* Categories selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === ""
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Barcha Kategoriyalar
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.nameUz}
            </button>
          ))}
        </div>

        {/* Region & Sort controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Hudud:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
              >
                <option value="">Barchasi</option>
                <option value="Farg'ona">Farg'ona (Pilot)</option>
                <option value="Toshkent">Toshkent</option>
                <option value="Andijon">Andijon</option>
                <option value="Namangan">Namangan</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Jiddiylik:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
              >
                <option value="">Barchasi</option>
                <option value="CRITICAL">Juda Yuqori</option>
                <option value="HIGH">Yuqori</option>
                <option value="MEDIUM">O'rtacha</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
            >
              <option value="newest">Eng yangilar</option>
              <option value="highest_reward">Eng yuqori byudjet</option>
            </select>
          </div>
        </div>
      </div>

      {/* PROBLEMS LIST GRID */}
      {loading ? (
        <div className="py-16 text-center text-sm font-semibold text-slate-500">
          Muammolar yuklanmoqda...
        </div>
      ) : problems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <p className="text-base font-bold text-slate-700">Birorta ham muammo topilmadi</p>
          <p className="text-xs text-slate-500">Qidiruv yoki filter shartlarini o'zgartirib ko'ring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {prob.category?.nameUz}
                  </span>
                  {getSeverityBadge(prob.severityLevel)}
                </div>

                <Link href={`/problems/${prob.id}`} className="block group">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                    {prob.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prob.rawDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {prob.region}
                  </div>
                  {prob.budget > 0 && (
                    <div className="text-blue-600 font-black">
                      {formatCurrency(prob.budget)} UZS
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Egasi: <strong>{prob.owner?.profile?.organizationName || prob.owner?.profile?.firstName}</strong>
                  </span>

                  <Link
                    href={`/problems/${prob.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Batafsil <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
