"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  User,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  entityName: string;
  entityId?: string;
  details: string;
  createdAt: string;
  user?: {
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.append("action", actionFilter);
      params.append("page", String(page));
      params.append("limit", "25");

      const res = await fetch(`/api/v1/admin/audit-logs?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data.logs);
        setTotalPages(json.data.pagination.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Xavfsizlik va Tizim Loglari (Audit Trail)</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tizimda amalga oshirilgan barcha xavfsizlik va o'zgarish harakatlari jurnali.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Amal turi (masalan: ADMIN, USER_REGISTERED, PILOT)..."
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
          />
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
            Yuklanmoqda...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Activity className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">Audit loglar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Amal (Action)</th>
                  <th className="py-3 px-4">Subyekt (Entity)</th>
                  <th className="py-3 px-4">Foydalanuvchi</th>
                  <th className="py-3 px-4">Tafsilotlar</th>
                  <th className="py-3 px-4 text-right">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition">
                    
                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-sky-300 bg-sky-500/10 border border-sky-400/20 px-2.5 py-1 rounded-md text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-semibold">
                      {log.entityName} {log.entityId && <span className="text-[10px] text-slate-500 block">ID: {log.entityId.slice(0, 8)}...</span>}
                    </td>

                    {/* User */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.user ? (
                        <div>
                          <div className="text-white font-semibold">
                            {log.user.profile?.firstName ? `${log.user.profile.firstName} ${log.user.profile.lastName}` : log.user.email}
                          </div>
                          <div className="text-[10px] text-slate-500">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Tizim</span>
                      )}
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="text-[11px] text-slate-400 font-mono truncate bg-slate-950 px-2 py-1 rounded border border-white/5">
                        {log.details}
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
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

    </div>
  );
}
