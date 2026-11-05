"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Trash2,
  UserCheck,
} from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  status: string;
  createdAt: string;
  roles: string[];
  profile?: {
    firstName: string;
    lastName: string;
    username: string;
    region: string;
    occupation?: string;
    organizationName?: string;
    ratingAvg: number;
    solvedCount: number;
  };
  stats: {
    problemsCount: number;
    solutionsCount: number;
    reviewsCount: number;
  };
}

const ALL_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "EXPERT",
  "SOLVER",
  "PROBLEM_OWNER",
  "COMPANY",
  "STARTUP",
  "SPONSOR",
  "USER",
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("status", statusFilter);
      params.append("page", String(page));
      params.append("limit", "15");

      const res = await fetch(`/api/v1/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
        setTotalPages(json.data.pagination.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, roleName: string, action: "add" | "remove") => {
    setActionLoading(userId);
    try {
      const payload: any = { userId };
      if (action === "add") payload.addRole = roleName;
      if (action === "remove") payload.removeRole = roleName;

      const res = await fetch("/api/v1/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        fetchUsers();
        if (selectedUser?.id === userId) {
          const updatedRoles =
            action === "add"
              ? [...selectedUser.roles, roleName]
              : selectedUser.roles.filter((r) => r !== roleName);
          setSelectedUser({ ...selectedUser, roles: updatedRoles });
        }
      } else {
        alert(json.error || "Rollar yangilanishida xatolik");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      } else {
        alert(json.error || "Status yangilanishida xatolik");
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
          <h1 className="text-2xl font-black text-white">Foydalanuvchilar & Rollar Boshqaruvi</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Foydalanuvchilarga EXPERT, MODERATOR yoki ADMIN kabi rollarni berish, hisob holatini nazorat qilish.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ism, familiya, email yoki username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-sky-400"
        >
          <option value="">Barcha Rollar</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

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
          <option value="ACTIVE">Faol (ACTIVE)</option>
          <option value="SUSPENDED">To'xtatilgan (SUSPENDED)</option>
          <option value="BANNED">Bloklangan (BANNED)</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
            Yuklanmoqda...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">Foydalanuvchi topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Foydalanuvchi</th>
                  <th className="py-3 px-4">Hudud & Kasb</th>
                  <th className="py-3 px-4">Biriktirilgan Rollar</th>
                  <th className="py-3 px-4">Faollik</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition">
                    
                    {/* User Profile */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600/30 text-sky-300 font-bold flex items-center justify-center flex-shrink-0 border border-sky-400/30">
                          {u.profile?.firstName?.[0] || u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : "Profil to'ldirilmagan"}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Region & Occupation */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-300 font-medium">{u.profile?.region || "—"}</div>
                      <div className="text-[10px] text-slate-400">{u.profile?.occupation || "—"}</div>
                    </td>

                    {/* Roles */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                              r === "SUPER_ADMIN"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : r === "ADMIN"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : r === "EXPERT"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : r === "SOLVER"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-white/10 text-slate-300"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Activity stats */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                      <div>💡 {u.stats.problemsCount} muammo</div>
                      <div>⚡ {u.stats.solutionsCount} yechim</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : u.status === "SUSPENDED"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="bg-blue-600/30 hover:bg-blue-600 text-sky-200 hover:text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition border border-blue-500/30"
                      >
                        Rollar / Boshqaruv
                      </button>
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

      {/* USER ROLES & STATUS MANAGEMENT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full space-y-6 text-white shadow-2xl relative">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
                  Foydalanuvchi Boshqaruvi
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedUser.profile ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName}` : selectedUser.email}
                </h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Status Control */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Hisob Holati (Status):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedUser.id, "ACTIVE")}
                  disabled={actionLoading === selectedUser.id}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    selectedUser.status === "ACTIVE"
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-emerald-600/20"
                  }`}
                >
                  ✓ Faol (ACTIVE)
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedUser.id, "SUSPENDED")}
                  disabled={actionLoading === selectedUser.id}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    selectedUser.status === "SUSPENDED"
                      ? "bg-amber-600 border-amber-500 text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-amber-600/20"
                  }`}
                >
                  To'xtatilgan
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedUser.id, "BANNED")}
                  disabled={actionLoading === selectedUser.id}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    selectedUser.status === "BANNED"
                      ? "bg-rose-600 border-rose-500 text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-rose-600/20"
                  }`}
                >
                  Bloklangan
                </button>
              </div>
            </div>

            {/* Roles Toggle */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Biriktirilgan Rollar (Bosish orqali qo'shish / o'chirish):
              </label>

              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map((role) => {
                  const has = selectedUser.roles.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() =>
                        handleUpdateRole(selectedUser.id, role, has ? "remove" : "add")
                      }
                      disabled={actionLoading === selectedUser.id}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                        has
                          ? "bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {has ? "✓" : "+"} {role}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">
                Eslatma: <strong>EXPERT</strong> roli mustaqil ekspertiza qilishga, <strong>ADMIN</strong> esa admin panelga to'liq kirishga imkon beradi.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Tayyor / Yopish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
