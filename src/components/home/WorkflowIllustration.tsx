"use client";

import {
  Lightbulb,
  Cpu,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  FileText,
} from "lucide-react";

export function WorkflowIllustration() {
  const steps = [
    {
      num: "01",
      title: "Muammo Joylashtirish",
      subtitle: "Oddiy tilda bayon qilish",
      desc: "Fuqaro, fermer yoki korxona o'z muammosi va kutilgan maqsadini oddiy so'zlar bilan platformaga yozadi.",
      icon: Lightbulb,
      color: "from-amber-400 to-orange-500",
      tag: "1-Bosqich",
      shape: "bg-amber-500/10 border-amber-400/30 text-amber-300",
    },
    {
      num: "02",
      title: "AI Challenge Formati",
      subtitle: "Aniq texnik topshiriq & KPI",
      desc: "Sun'iy intellekt muammoni tahlil qilib, kerakli ko'nikmalar ro'yxati, KPI ko'rsatkichlari va rasmiy talabnomani tuzadi.",
      icon: Cpu,
      color: "from-sky-400 to-blue-500",
      tag: "AI Algoritmi",
      shape: "bg-sky-500/10 border-sky-400/30 text-sky-300",
    },
    {
      num: "03",
      title: "Yechimchilar Tanlovi",
      subtitle: "Top mutaxassislar jalbi",
      desc: "Dasturchi, agronom, muhandis va startaplar o'z loyihalarini (arxitektura, xarajat, muddat) taklif qilishadi.",
      icon: Users,
      color: "from-violet-400 to-purple-500",
      tag: "Matching",
      shape: "bg-purple-500/10 border-purple-400/30 text-purple-300",
    },
    {
      num: "04",
      title: "Ekspertiza & Pilot",
      subtitle: "Real maydonda sinov",
      desc: "Mustaqil soha ekspertlari 9 mezon bo'yicha baholaydi, g'olib loyiha Farg'onada pilot sinovidan o'tib, moliyalashtiriladi.",
      icon: Award,
      color: "from-emerald-400 to-teal-500",
      tag: "Shartnoma & Natija",
      shape: "bg-emerald-500/10 border-emerald-400/30 text-emerald-300",
    },
  ];

  return (
    <div className="relative space-y-8">
      {/* Decorative ambient background line for desktop */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/30 via-sky-400/30 to-emerald-400/30 -translate-y-8 pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const IconComp = item.icon;

          return (
            <div
              key={idx}
              className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 hover:from-slate-800/90 hover:to-slate-900/90 border border-white/10 hover:border-sky-400/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 space-y-4"
            >
              {/* Step number badge & tag */}
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                  {item.num}
                </span>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.shape}`}>
                  {item.tag}
                </span>
              </div>

              {/* Icon Container with glowing ring */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300`}>
                <IconComp className="w-6 h-6 text-slate-950 fill-slate-950/20" />
              </div>

              {/* Text content */}
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                  {item.title}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400">
                  {item.subtitle}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {item.desc}
                </p>
              </div>

              {/* Subtle bottom accent line */}
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${item.color} opacity-30 group-hover:opacity-100 transition duration-300`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
