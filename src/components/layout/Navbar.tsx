"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { User, LogOut, Shield, ChevronDown, Menu, X, Lightbulb, Search, PlusCircle } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  roles: string[];
  profile: {
    firstName: string;
    lastName: string;
    username: string;
    region: string;
    avatarUrl?: string;
  };
}

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const res = await fetch("/api/v1/auth/me");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUser(json.data);
        }
      }
    } catch {
      // User not authenticated
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-2 rounded-xl shadow font-black text-xl tracking-tight flex items-center justify-center">
            Y<span className="text-yellow-300">UZ</span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            Yechim<span className="text-blue-600">UZ</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
            Fergana Pilot
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/problems" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <Search className="w-4 h-4 text-slate-400" />
            Muammolar Marketplace
          </Link>
          <Link href="/solvers" className="hover:text-blue-600 transition">
            Yechimchilar
          </Link>
          <Link href="/pilots" className="hover:text-blue-600 transition">
            Pilotlar & Impact
          </Link>
        </nav>

        {/* Action Controls / Auth Status */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard/problems/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Muammo joylash
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  {(user.roles.includes("SUPER_ADMIN") || user.roles.includes("ADMIN") || user.roles.includes("MODERATOR")) && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 font-bold text-xs px-3 py-2 rounded-lg transition shadow-xs"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-600 group-hover:text-white" />
                      Admin Panel
                    </Link>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition"
                    >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {user.profile.firstName[0]}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {user.profile.firstName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Profil & Rollar
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {user.profile.firstName} {user.profile.lastName}
                        </p>
                        <p className="text-xs text-slate-500">@{user.profile.username}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Mening Profilim
                      </Link>

                      {user.roles.includes("SUPER_ADMIN") || user.roles.includes("ADMIN") ? (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-medium transition"
                        >
                          <Shield className="w-4 h-4 text-purple-500" />
                          Admin Panel
                        </Link>
                      ) : null}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Chiqish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 transition"
                  >
                    Kirish
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition"
                  >
                    Ro'yxatdan o'tish
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2"
          >
            Muammolar Marketplace
          </Link>
          <Link
            href="/solvers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2"
          >
            Yechimchilar
          </Link>
          <Link
            href="/pilots"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2"
          >
            Pilotlar
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {(user.roles.includes("SUPER_ADMIN") || user.roles.includes("ADMIN") || user.roles.includes("MODERATOR")) && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-slate-100 text-slate-800 font-semibold py-2 rounded-lg"
                >
                  Profilim ({user.profile.firstName})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center bg-red-50 text-red-600 font-semibold py-2 rounded-lg"
                >
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-slate-300 text-slate-800 font-semibold py-2 rounded-lg"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg shadow"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
