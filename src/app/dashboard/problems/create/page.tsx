"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, AlertCircle, ArrowLeft, Lightbulb, CheckCircle2 } from "lucide-react";

interface Category {
  id: string;
  nameUz: string;
}

export default function CreateProblemPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    rawDescription: "",
    categoryId: "",
    region: "Farg'ona",
    organization: "",
    problemType: "GENERAL",
    severityLevel: "MEDIUM",
    targetResult: "",
    budget: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/v1/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
        if (json.data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: json.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Muammoni joylashtirishda xatolik");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = `/problems/${json.data.id}`;
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link href="/problems" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Marketplace'ga qaytish
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Yangi Muammo Joylash</h1>
        <p className="text-xs text-slate-500 mt-1">
          Muammoingizni oddiy tilda yozing. Sun'iy intellekt va ekspertlarimiz uni Challenge formatiga aylantiradi.
        </p>
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
          Muammo muvaffaqiyatli joylashtirildi! Sahifaga o'tilmoqda...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Muammo Nomi (Qisqa va aniq) *
          </label>
          <input
            type="text"
            required
            placeholder="Masalan: Issiqxonada suv va o'g'it sarfini kamaytirish"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kategoriya *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameUz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hudud (Viloyat) *
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="Farg'ona">Farg'ona (Pilot Hudud)</option>
              <option value="Toshkent">Toshkent</option>
              <option value="Andijon">Andijon</option>
              <option value="Namangan">Namangan</option>
              <option value="Samarqand">Samarqand</option>
              <option value="Buxoro">Buxoro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Muammo Batafsil Tavsifi *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Muammoning mazmuni, hozirgi vaziyat va duch kelinayotgan qiyinchiliklar haqida batafsil yozing..."
            value={formData.rawDescription}
            onChange={(e) => setFormData({ ...formData, rawDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Jiddiylik Darajasi
            </label>
            <select
              value={formData.severityLevel}
              onChange={(e) => setFormData({ ...formData, severityLevel: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="LOW">Oddiy / Past</option>
              <option value="MEDIUM">O'rtacha</option>
              <option value="HIGH">Yuqori</option>
              <option value="CRITICAL">Juda Yuqori (Critical)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mo'ljallangan Byudjet / Mukofot (UZS)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Masalan: 20000000"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Kutilayotgan Natija / KPI (Ixtiyoriy)
          </label>
          <input
            type="text"
            placeholder="Masalan: Suv sarfini 30% ga kamaytirish va hosildorlikni oshirish"
            value={formData.targetResult}
            onChange={(e) => setFormData({ ...formData, targetResult: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Saqlanmoqda..." : (
            <>
              <Lightbulb className="w-4 h-4 text-yellow-300" /> Muammoni joylashtirish
            </>
          )}
        </button>
      </form>
    </div>
  );
}
