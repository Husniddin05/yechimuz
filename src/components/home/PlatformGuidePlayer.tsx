"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Cpu,
  Award,
  ShieldCheck,
  Star,
  MapPin,
  Bot,
  Zap,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Volume2,
  Maximize2,
  FileText,
} from "lucide-react";

interface GuideStep {
  id: number;
  stepNumber: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  duration: string;
  actionText: string;
  actionHref: string;
  visualType: "problem" | "ai" | "solution" | "pilot";
  details: {
    label: string;
    value: string;
  }[];
  tip: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 0,
    stepNumber: "01",
    badge: "Muammo Joylash",
    badgeColor: "bg-blue-500/20 text-sky-300 border-blue-400/30",
    title: "1-Qadam: Muammo va vazifani erkin bayon eting",
    subtitle: "Istalgan fuqaro, fermer, startap yoki korxona o'z muammosini bir necha daqiqada platformaga joylashtirishi mumkin.",
    duration: "00:15",
    actionText: "Muammo e'lon qilish",
    actionHref: "/dashboard/problems/create",
    visualType: "problem",
    details: [
      { label: "Mavzu", value: "Issiqxonada suv va elektr sarfini 35% kamaytirish" },
      { label: "Hudud", value: "Farg'ona viloyati, Quva tumani" },
      { label: "Byudjet", value: "25,000,000 UZS" },
      { label: "Kutilgan natija", value: "Avtomatlashtirilgan tejamkor IoT sug'orish tizimi" },
    ],
    tip: "Maslahat: Muammo tavsifini qanchalik aniq yozsangiz, AI shunchalik mukammal texnik topshiriq shakllantiradi.",
  },
  {
    id: 1,
    stepNumber: "02",
    badge: "AI Challenge & Moslashtirish",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    title: "2-Qadam: AI tahlili va eng mos mutaxassislar saralanishi",
    subtitle: "Sun'iy intellekt muammo talablarini tahlil qilib, 9 ta mezonli KPI tuzadi va unga eng mos solverlarni topadi.",
    duration: "00:30",
    actionText: "AI Challenge'larni ko'rish",
    actionHref: "/problems",
    visualType: "ai",
    details: [
      { label: "AI Generatsiyasi", value: "98% aniqlikdagi KPI & Metrikalar tayyorlandi" },
      { label: "Mos Mutaxassislar", value: "3 nafar yuqori reytingli muhandis biriktirildi" },
      { label: "Xavfsizlik", value: "Faqat muammo egasi tasdiqlaganidan so'ng ochiladi" },
      { label: "Status", value: "Challengeda ishtirok etish uchun ochiq" },
    ],
    tip: "AI muammo egasining ruxsatisiz e'lonni ommaga chiqarmaydi, to'liq shaffoflik ta'minlanadi.",
  },
  {
    id: 2,
    stepNumber: "03",
    badge: "Yechim & Ekspertiza",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    title: "3-Qadam: Solverlar taklif yuboradi va ekspertlar baholaydi",
    subtitle: "Muhandis va olimlar o'z loyihalarini yuboradi. Mustaqil ekspertlar har bir yechimga 9 ta mezon bo'yicha baho beradi.",
    duration: "00:45",
    actionText: "Yechimlarni ko'zdan kechirish",
    actionHref: "/problems",
    visualType: "solution",
    details: [
      { label: "Yetakchi Yechim", value: "DripSense: Tuproq namlik datchiklari & LoRaWAN" },
      { label: "Yechimchi", value: "Azizbek Muhandis (★ 5.0 reyting, 14 ta loyiha)" },
      { label: "Ekspert Bahosi", value: "8.89 / 10.0 ball (Shortlist #1 tavsiya)" },
      { label: "Tavsiya", value: "Texnik jihatdan mukammal va iqtisodiy tejamkor" },
    ],
    tip: "Muammo egasi yechimlarni, AI xulosasini va mutaxassis profilini to'liq ko'rib chiqib, o'zi g'olibni tanlaydi.",
  },
  {
    id: 3,
    stepNumber: "04",
    badge: "Pilot Sinovi & Natija",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    title: "4-Qadam: Farg'onada real pilot sinovi va shartnoma",
    subtitle: "Tanlangan g'olib yechim Farg'ona pilot maydonlarida real sinovdan o'tkaziladi, grant va tijoriy shartnomalar imzolanadi.",
    duration: "01:00",
    actionText: "Pilot natijalari bilan tanishish",
    actionHref: "/pilots",
    visualType: "pilot",
    details: [
      { label: "Pilot Maydoni", value: "Farg'ona tumani agromajmuasi (5 gektar issiqxona)" },
      { label: "Erishilgan Natija", value: "Suv sarfi 38% ga qisqardi, hosildorlik +22% oshdi" },
      { label: "Qoplanish Muddati", value: "5.5 oyda investitsiya to'liq qoplandi" },
      { label: "Yakuniy Hujjat", value: "Rasmiy pilot shartnomasi & Grant tasdiqlandi" },
    ],
    tip: "Bu oddiy e'lonlar sayti emas — haqiqiy muammoni oxirgi amaliy natijagacha yetkazuvchi to'liq ekotizim!",
  },
];

export function PlatformGuidePlayer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const STEP_DURATION_MS = 6500; // 6.5s per step
  const TICK_INTERVAL_MS = 100;

  // Auto-play slide timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((curr) => (curr + 1) % GUIDE_STEPS.length);
          return 0;
        }
        return prev + (TICK_INTERVAL_MS / STEP_DURATION_MS) * 100;
      });
    }, TICK_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStep]);

  const handleSelectStep = (idx: number) => {
    setCurrentStep(idx);
    setProgress(0);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentStep((curr) => (curr + 1) % GUIDE_STEPS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentStep((curr) => (curr - 1 + GUIDE_STEPS.length) % GUIDE_STEPS.length);
    setProgress(0);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const step = GUIDE_STEPS[currentStep];

  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto select-none">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-sky-500/20 via-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 -right-6 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* MAIN VIDEO-PLAYER FRAME */}
      <div className="relative bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-2xl rounded-[2rem] border border-sky-500/30 shadow-2xl p-5 sm:p-6 space-y-4 overflow-hidden">
        
        {/* Geometric Grid Overlay Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* TOP STATUS & STEP NAV TABS */}
        <div className="relative flex flex-col gap-3 pb-3 border-b border-white/10">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
              <span className="text-[11px] font-bold text-slate-300 ml-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Platformadan Foydalanish Qo'llanmasi
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              {isPlaying ? "Jonli Darslik" : "To'xtatilgan"}
            </div>
          </div>

          {/* 4 Interactive Step Pills */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {GUIDE_STEPS.map((s, idx) => {
              const isActive = currentStep === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStep(idx)}
                  className={`py-1.5 px-2 rounded-xl text-left transition-all relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/40 to-sky-600/40 border border-sky-400 text-white shadow-md"
                      : "bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-black">
                    <span>Qadam {s.stepNumber}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />}
                  </div>
                  <div className="text-[9px] font-semibold truncate mt-0.5 hidden sm:block">
                    {s.badge}
                  </div>

                  {/* Individual mini progress line if active */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400/30">
                      <div
                        className="h-full bg-sky-400 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* MAIN VISUAL SLIDE STAGE */}
        <div className="relative bg-slate-950/70 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 min-h-[310px] flex flex-col justify-between transition-all">
          
          {/* Header of the slide */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${step.badgeColor}`}>
                {step.stepNumber} • {step.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-sky-400" /> {step.duration}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
              {step.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {step.subtitle}
            </p>
          </div>

          {/* DYNAMIC VISUAL MOCKUP BASED ON STEP TYPE */}
          <div className="relative bg-slate-900/90 border border-sky-400/20 rounded-xl p-3.5 space-y-2 shadow-inner">
            
            {/* Slide 1: Problem Mockup */}
            {step.visualType === "problem" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Muammo Formasi
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Kiritish oson
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Hudud:</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> Farg'ona, Quva
                    </span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Ajratilgan Byudjet:</span>
                    <span className="font-bold text-amber-400">25,000,000 UZS</span>
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-[11px]">
                  <span className="text-slate-400 block text-[10px]">Talab:</span>
                  <span className="text-slate-200">Tomchilatib sug'orishda suvni 35% tejovchi aqlli IoT datchiklar</span>
                </div>
              </div>
            )}

            {/* Slide 2: AI Challenge Mockup */}
            {step.visualType === "ai" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-400 animate-spin" /> Sun'iy Intellekt Tahlili
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">
                    98% Aniqlik
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20">
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-slate-200">Strukturalashgan KPI: Suv tejami ≥35%, Aniqlik 98%</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span className="text-slate-200">Mos Solverlar: 3 nafar yuqori tajribali muhandis biriktirildi</span>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 3: Solution Mockup */}
            {step.visualType === "solution" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" /> Taqdim Etilgan Yechim
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> 8.89 Ball (Shortlist)
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Azizbek Muhandis (IoT Mutaxassisi)</span>
                    <span className="text-slate-400">35 kun • 21.5M UZS</span>
                  </div>
                  <p className="text-slate-300 text-[10px]">
                    "DripSense: Tuproq namlik datchiklari va avtomatlashtirilgan klapanlar"
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> 9 ta mezon bo'yicha ekspert ijobiy xulosasi olindi
                  </div>
                </div>
              </div>
            )}

            {/* Slide 4: Pilot Mockup */}
            {step.visualType === "pilot" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Farg'ona Pilot Shartnomasi
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-md">
                    TASDIQLANDI
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] block">Suv Tejamkorligi:</span>
                    <span className="text-emerald-400 font-extrabold text-xs">38% samaradorlik</span>
                  </div>
                  <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] block">ROI (O'zini qoplash):</span>
                    <span className="text-amber-300 font-extrabold text-xs">5.5 oy</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1.5 pt-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Grant moliyalashtirildi va to'liq shartnoma imzolandi.
                </div>
              </div>
            )}

          </div>

          {/* Quick Tip / Action Link */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 italic line-clamp-1">
              {step.tip}
            </span>

            <Link
              href={step.actionHref}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 flex-shrink-0 transition ml-2"
            >
              {step.actionText} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* BOTTOM VIDEO CONTROLS BAR */}
        <div className="relative pt-1 flex flex-col gap-2.5">
          
          {/* Main Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden cursor-pointer">
            <div
              className="bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-100"
              style={{
                width: `${((currentStep + progress / 100) / GUIDE_STEPS.length) * 100}%`,
              }}
            />
          </div>

          {/* Controls: Play/Pause, Step Counters, and Modal Trigger */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            
            {/* Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-1.5 bg-white/5 hover:bg-white/15 rounded-lg text-slate-300 hover:text-white transition"
                title="Oldingi qadam"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="p-2 bg-gradient-to-tr from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white rounded-xl shadow-md transition transform active:scale-95 flex items-center justify-center"
                title={isPlaying ? "To'xtatish" : "Davom ettirish"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-1.5 bg-white/5 hover:bg-white/15 rounded-lg text-slate-300 hover:text-white transition"
                title="Keyingi qadam"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
                title="Boshidan boshlash"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono text-slate-400 ml-1">
                {currentStep + 1} / {GUIDE_STEPS.length}
              </span>
            </div>

            {/* In-depth guide modal button */}
            <button
              onClick={() => setGuideModalOpen(true)}
              className="text-[11px] font-bold text-sky-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              Batafsil Qo'llanma (Matn)
            </button>

          </div>

        </div>

      </div>

      {/* FLOATING GEOMETRIC BADGES */}
      <div className="hidden sm:flex absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] px-3.5 py-1.5 rounded-full shadow-xl items-center gap-1.5 border border-white/30">
        <Sparkles className="w-3.5 h-3.5" />
        4 Qadamda To'liq Yechim
      </div>

      <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full shadow-xl items-center gap-1.5 border border-white/20">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Interaktiv Video Simulyator
      </div>

      {/* DETAILED MODAL GUIDE */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 text-white shadow-2xl relative my-8">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> YechimUZ Yo'riqnomasi
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Platformadan Foydalanish Bo'yicha To'liq Qo'llanma
                </h3>
              </div>
              <button
                onClick={() => setGuideModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
                  Muammo egalari uchun (Fuqarolar, Fermerlar, Korxonalar)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. Saytga kiring va <strong>"Muammo joylash"</strong> tugmasini bosing.<br/>
                  2. Muammoning qisqacha mazmuni, hududingiz (masalan, Farg'ona) va taxminiy byudjetingizni belgilang.<br/>
                  3. Sun'iy intellekt muammoingizni ko'rib chiqib, <strong>AI Challenge</strong> tayyorlaydi. Siz uni tasdiqlaganingizdan so'ng, topshiriq barcha mutaxassislarga e'lon qilinadi.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">2</span>
                  Yechimchilar va Muhandislar uchun (Solvers)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. <strong>"Muammolar Marketplace"</strong> sahifasidan o'zingizga mos vazifalarni toping.<br/>
                  2. O'z texnik yondashuvingiz, narx va muddatni ko'rsatgan holda taklif yuboring.<br/>
                  3. Taklifingiz ekspertlar va AI tomonidan baholanadi hamda yuqori ball to'plaganlar Farg'ona pilot maydonlarida shartnoma imzolaydi.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">3</span>
                  Real Pilot Sinovlari va Kafolatlangan Natija
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  G'olib deb topilgan eng yaxshi loyihalar shunchaki qog'ozda qolib ketmaydi — ular Farg'ona viloyatidagi real korxona va fermer xo'jaliklarida joriy etilib, davlat va xususiy grantlar bilan moliyalashtiriladi.
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <Link
                href="/dashboard/problems/create"
                onClick={() => setGuideModalOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
              >
                Birinchi muammoni joylash →
              </Link>

              <button
                onClick={() => setGuideModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
