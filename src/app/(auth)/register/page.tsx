"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, AlertCircle, ArrowLeft, CheckSquare } from "lucide-react";

const AVAILABLE_ROLES = [
  { id: "SOLVER", title: "Solver / Yechimchi", desc: "Muammolarni hal qilib daromad va tajriba orttiruvchi mutaxassis" },
  { id: "PROBLEM_OWNER", title: "Problem Owner", desc: "O'z muammosiga yechim va mutaxassis qidirayotgan shaxs" },
  { id: "COMPANY", title: "Tashkilot / Korxona", desc: "Zavod, korxona yoki muassasa vakili" },
  { id: "STARTUP", title: "Startup", desc: "Innovatsion startup va texnologik jamoa" },
  { id: "EXPERT", title: "Ekspert", desc: "Yechim va pilot loyihalarni baholovchi soha mutaxassisi" },
  { id: "SPONSOR", title: "Sponsor / Grant beruvchi", desc: "Challenge va pilotlarni moliyalashtiruvchi subyekt" },
  { id: "USER", title: "Fuqaro", desc: "Jamoatchilik va umumiy foydalanuvchi" },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    region: "Farg'ona",
    organizationName: "",
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>(["SOLVER"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length === 1) return; // Must keep at least one role
      setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        roles: selectedRoles,
      };

      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }

      window.location.href = "/dashboard/profile";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium mb-4">
            <ArrowLeft className="w-4 h-4" /> Bosh sahifaga qaytish
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ro'yxatdan o'tish</h2>
          <p className="text-xs text-slate-500 mt-1">YechimUZ ekotizimida o'zingizga mos rollarni tanlang</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ism *</label>
              <input
                type="text"
                required
                placeholder="Azizbek"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Familiya *</label>
              <input
                type="text"
                required
                placeholder="Muhandisov"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username *</label>
              <input
                type="text"
                required
                placeholder="aziz_dev"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="aziz@fergana.uz"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Parol *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Hudud</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Farg'ona">Farg'ona (Pilot Hudud)</option>
                <option value="Toshkent">Toshkent shahri</option>
                <option value="Andijon">Andijon</option>
                <option value="Namangan">Namangan</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Buxoro">Buxoro</option>
                <option value="Xorazm">Xorazm</option>
                <option value="Boshqa">Boshqa viloyat</option>
              </select>
            </div>
          </div>

          {/* Role selection section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Platformadagi Rollaringiz (Bir nechtasini tanlashingiz mumkin) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role.id);
                return (
                  <div
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 text-blue-900"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-white ${
                      isSelected ? "bg-blue-600 border-blue-600" : "border-slate-400"
                    }`}>
                      {isSelected && <CheckSquare className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{role.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{role.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Ro'yxatdan o'tilmoqda..." : (
              <>
                <UserPlus className="w-4 h-4" /> Ro'yxatdan o'tish
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Allaqachon hisobingiz bormi?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
}
