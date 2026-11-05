"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface CategoryItem {
  id: string;
  nameUz: string;
  nameRu?: string;
  nameEn?: string;
  slug: string;
  icon?: string;
  _count: {
    problems: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form fields
  const [nameUz, setNameUz] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Layers");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setNameUz("");
    setNameRu("");
    setNameEn("");
    setSlug("");
    setIcon("Layers");
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setNameUz(cat.nameUz);
    setNameRu(cat.nameRu || "");
    setNameEn(cat.nameEn || "");
    setSlug(cat.slug);
    setIcon(cat.icon || "Layers");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const method = editingCategory ? "PATCH" : "POST";
      const payload: any = { nameUz, nameRu, nameEn, slug, icon };
      if (editingCategory) payload.id = editingCategory.id;

      const res = await fetch("/api/v1/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        fetchCategories();
      } else {
        alert(json.error || "Xatolik yuz berdi");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ushbu kategoriyani o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/v1/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        fetchCategories();
      } else {
        alert(json.error || "O'chirishda xatolik");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Muammolar Kategoriyalari</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Platformadagi yo'nalishlar, sohalar va ularga tegishli muammolar soni.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi Kategoriya Qo'shish
        </button>
      </div>

      {/* CATEGORIES GRID */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-white/10 rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
          Yuklanmoqda...
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-white/10 rounded-2xl">
          Kategoriyalar mavjud emas.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-sky-400/40 transition shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-500/10 border border-sky-400/20 px-2 py-0.5 rounded-md">
                  {cat.icon || "Layers"}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  {cat._count.problems} ta muammo
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{cat.nameUz}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Slug: {cat.slug}</p>
                {cat.nameRu && <p className="text-[11px] text-slate-500 mt-0.5">RU: {cat.nameRu}</p>}
                {cat.nameEn && <p className="text-[11px] text-slate-500">EN: {cat.nameEn}</p>}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs flex items-center gap-1 font-semibold"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-md w-full space-y-5 text-white shadow-2xl relative">
            
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya Qo'shish"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nomi (O'zbekcha) *:</label>
                <input
                  type="text"
                  required
                  value={nameUz}
                  onChange={(e) => {
                    setNameUz(e.target.value);
                    if (!editingCategory) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                      );
                    }
                  }}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white"
                  placeholder="Masalan: Raqamli Sog'liqni Saqlash"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Slug (URL uchun) *:</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white"
                  placeholder="masalan: digital-health"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nomi (Ruscha):</label>
                <input
                  type="text"
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nomi (Inglizcha):</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Icon nomi (Lucide):</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white"
                  placeholder="Sprout, Cpu, Factory, Zap, Recycle..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                >
                  {actionLoading ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
