"use client";

import Link from "next/link";
import { SolversLeaderboard } from "@/components/home/SolversLeaderboard";
import {
  Trophy,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Zap,
} from "lucide-react";

export default function SolversPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white space-y-12 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-950 border-b border-white/10">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[450px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[400px] h-[300px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition">
              Bosh sahifa
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-sky-400 font-medium">Yechimchilar</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-400/30 px-3.5 py-1.5 rounded-full text-yellow-300 text-xs sm:text-sm font-semibold shadow-md">
              <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
              Milliy Innovatorlar & Solverlar Hamjamiyati
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              O'zbekistonning Yetakchi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
                Yechimchilari
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Fermerlar, davlat idoralari va korxonalar oldidagi dolzarb muammolarga eng samarali texnologik yechim bergan, ekspertlar tomonidan yuqori baholangan malakali mutaxassislar reytingi.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                <Users className="w-4 h-4" /> Mutaxassislar
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">500+</p>
              <p className="text-[11px] text-slate-400">Malakali muhandislar</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Trophy className="w-4 h-4" /> Top Reyting
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">5.0 ★</p>
              <p className="text-[11px] text-slate-400">Yetakchi yechimchilar</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" /> Ekspert Bahosi
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">9 Mezon</p>
              <p className="text-[11px] text-slate-400">Shaffof tekshiruv</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
                <Zap className="w-4 h-4" /> AI Moslashuv
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">98%</p>
              <p className="text-[11px] text-slate-400">Challenge mosligi</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SolversLeaderboard />
      </main>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-400/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-2xl font-bold text-white">
              Siz ham malakali dasturchi yoki muhandismisiz?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Platformadagi dolzarb muammolarga o'z yechimlaringizni taklif qiling, ekspertlar e'tirofiga sazovor bo'ling va moliyalashtiriluvchi pilot loyihalarda ishtirok eting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/register?role=SOLVER"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-lg transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Yechimchi bo'lish
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-white/20 transition"
            >
              Muammolarni ko'rish
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
