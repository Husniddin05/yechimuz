"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertCircle,
  FileText,
  Users,
  Award,
  Zap,
  Layers,
  Activity,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Bell,
  Search,
  CheckCircle2,
  Sparkles,
  Compass,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  roles: string[];
  profile: {
    firstName: string;
    lastName: string;
    username: string;
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch("/api/v1/auth/me");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const u = json.data;
          const isAdmin =
            u.roles.includes("SUPER_ADMIN") ||
            u.roles.includes("ADMIN") ||
            u.roles.includes("MODERATOR");

          if (isAdmin) {
            setUser(u);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    {
      title: "Boshqaruv Paneli",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Muammolar",
      href: "/admin/problems",
      icon: AlertCircle,
      badge: "Moderatsiya",
    },
    {
      title: "AI Challenge'lar",
      href: "/admin/challenges",
      icon: Sparkles,
      badge: null,
    },
    {
      title: "Yechimlar",
      href: "/admin/solutions",
      icon: FileText,
      badge: null,
    },
    {
      title: "Foydalanuvchilar",
      href: "/admin/users",
      icon: Users,
      badge: null,
    },
    {
      title: "Pilot Sinovlari",
      href: "/admin/pilots",
      icon: Award,
      badge: "Farg'ona",
    },
    {
      title: "Kategoriyalar",
      href: "/admin/categories",
      icon: Layers,
      badge: null,
    },
    {
      title: "Tizim Loglari",
      href: "/admin/audit-logs",
      icon: Activity,
      badge: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Admin panel yuklanmoqda...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full space-y-5 text-white shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black">Ruxsat Cheklangan</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Admin panelga kirish uchun sizda <strong>ADMIN</strong> yoki <strong>SUPER_ADMIN</strong> ruxsati bo'lishi kerak.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition"
            >
              Admin sifatida kirish
            </Link>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 text-slate-300 font-semibold py-3 px-4 rounded-xl text-sm transition"
            >
              Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-1.5 rounded-lg font-black text-sm">
            Y<span className="text-yellow-300">UZ</span>
          </div>
          <span className="font-bold text-base text-white">YechimUZ Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-slate-900 border-r border-white/10 flex-shrink-0 flex flex-col justify-between z-40 transition-all`}
      >
        <div className="p-5 space-y-6">
          {/* Logo */}
          <div className="hidden md:flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-blue-600 to-sky-400 text-white p-2 rounded-xl shadow font-black text-lg flex items-center justify-center">
                Y<span className="text-yellow-300">UZ</span>
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">
                  Yechim<span className="text-sky-400">Admin</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block -mt-1">
                  Ekotizim Boshqaruvi
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-sky-400"}`} />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-500/20 text-sky-300 border border-blue-400/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Back Link */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-slate-900/60">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center flex-shrink-0 shadow">
              {user.profile.firstName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {user.profile.firstName} {user.profile.lastName}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 truncate">
                  {user.roles.includes("SUPER_ADMIN") ? "Super Admin" : "Administrator"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-1 text-xs font-semibold">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                Asosiy Saytga Qaytish
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Mening Profilim
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        
        {/* TOP STATUS BAR */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-400">YechimUZ Boshqaruv Markazi</span>
            <span className="text-slate-600">/</span>
            <span className="text-sky-400 font-semibold">
              {navItems.find((n) => n.href === pathname)?.title || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Tizim Barqaror
            </div>

            <Link
              href="/dashboard/problems/create"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              + Yangi Muammo
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  );
}
