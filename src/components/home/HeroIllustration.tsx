"use client";

import {
  Sparkles,
  CheckCircle2,
  Cpu,
  Zap,
  Award,
  ArrowRight,
  Star,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Bot,
  Lightbulb,
} from "lucide-react";

export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Decorative ambient background glows */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-sky-500/20 via-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 -right-6 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Glassmorphism Showcase Card */}
      <div className="relative bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-2xl rounded-[2rem] border border-sky-500/30 shadow-2xl p-6 sm:p-7 space-y-6 overflow-hidden">
        
        {/* Geometric Grid Overlay Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* Top Control Bar with glowing status */}
        <div className="relative flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-xs" />
            <span className="text-[11px] font-bold text-slate-400 ml-2">YechimUZ Neural Pipeline</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Jonli Tizim Faol
          </div>
        </div>

        {/* Interactive Visual Flow (Connected Nodes) */}
        <div className="relative space-y-4">
          
          {/* NODE 1: PROBLEM INPUT */}
          <div className="relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-yellow-300" /> 01 • Muammo Kiritildi
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> Farg'ona tumani
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
              Issiqxonada suv sarfini 35% kamaytiruvchi IoT sug'orish tizimi
            </h4>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
              <span className="text-amber-300 font-semibold">Byudjet: 25,000,000 UZS</span>
              <span>•</span>
              <span className="text-slate-300">Farg'ona Agromahsulot MCHJ</span>
            </div>
          </div>

          {/* CONNECTING FLOW LINE WITH AI CORE */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 via-sky-400 to-emerald-400" />
            </div>

            <div className="relative z-10 bg-slate-900 border border-sky-400/50 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold">
              <Bot className="w-4 h-4 text-sky-400 animate-spin" />
              <span>AI Challenge & KPI Generatsiyasi</span>
              <span className="bg-sky-400/20 text-sky-300 text-[10px] px-2 py-0.2 rounded-full">
                98% aniqlik
              </span>
            </div>
          </div>

          {/* NODE 2: MATCHED SOLVER PROPOSAL */}
          <div className="relative bg-gradient-to-r from-blue-950/60 to-slate-900 border border-sky-400/40 rounded-2xl p-4 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-400" /> 02 • Mos Yechim Topildi
              </span>
              <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> 94% Moslik
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-black text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                A
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-bold text-white">Azizbek Muhandis</h5>
                  <span className="text-[10px] text-slate-400">(IoT Mutaxassisi)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  DripSense: Tuproq namlik datchiklari va LoRaWAN avtomatlashtirish
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">
                Python
              </span>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">
                IoT Sensorlar
              </span>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">
                Avtomatika
              </span>
              <span className="text-[10px] bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold ml-auto">
                35 kun • 21,500,000 UZS
              </span>
            </div>
          </div>

          {/* NODE 3: PILOT & CONTRACT RESULT */}
          <div className="relative bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  03 • Natija
                </span>
                <h5 className="text-xs font-bold text-white">
                  Pilot Sinovi Tasdiqlandi & Shartnoma Imzolandi
                </h5>
                <p className="text-[10px] text-slate-300">
                  9 ta mezon bo'yicha ekspert balli: <strong>8.89 / 10.0</strong>
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg">
                Muvaffaqiyatli
              </span>
            </div>
          </div>

        </div>

        {/* Floating Mini Metric Cards */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Tejalgan Suv</p>
              <p className="text-xs font-black text-white">38% samaradorlik</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
            <div className="p-2 bg-sky-400/10 text-sky-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">O'zini Qoplash</p>
              <p className="text-xs font-black text-white">5.5 oyda ROI</p>
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING GEOMETRIC BADGES AROUND THE SHOWCASE */}
      <div className="hidden sm:flex absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] px-3.5 py-1.5 rounded-full shadow-xl items-center gap-1.5 border border-white/30 animate-bounce">
        <Sparkles className="w-3.5 h-3.5" />
        Top Solverlar Reytingi #1
      </div>

      <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full shadow-xl items-center gap-1.5 border border-white/20">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Farg'ona Pilot Dasturi
      </div>
    </div>
  );
}
