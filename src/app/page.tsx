import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Users,
  Target,
  ShieldCheck,
  Zap,
  Award,
  MapPin,
  Sparkles,
  Trophy,
  Flame,
  Sprout,
  Recycle,
  Cpu,
  Factory,
  GraduationCap,
  TrendingUp,
  Compass,
} from "lucide-react";
import { SolversLeaderboard } from "@/components/home/SolversLeaderboard";
import { PlatformGuidePlayer } from "@/components/home/PlatformGuidePlayer";
import { WorkflowIllustration } from "@/components/home/WorkflowIllustration";

export default function HomePage() {
  const categories = [
    {
      title: "Qishloq xo'jaligi va Suv",
      desc: "Tomchilatib sug'orish, aqlli datchiklar, hosildorlik va suv tejovchi texnologiyalar.",
      slug: "agriculture-water",
      icon: Sprout,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50 text-emerald-800 border-emerald-200",
      count: "35+ Challenge",
    },
    {
      title: "Ekologiya va Chiqindi Boshqaruvi",
      desc: "Plastik chiqindilarni saralash, qayta ishlash logistikasi va toza shahar.",
      slug: "ecology-waste",
      icon: Recycle,
      color: "from-teal-500 to-cyan-600",
      bgLight: "bg-teal-50 text-teal-800 border-teal-200",
      count: "24+ Challenge",
    },
    {
      title: "Axborot Texnologiyalari va AI",
      desc: "Sun'iy intellekt modellari, Computer Vision, dasturiy yechimlar va avtomatlashtirish.",
      slug: "it-ai",
      icon: Cpu,
      color: "from-violet-600 to-indigo-600",
      bgLight: "bg-violet-50 text-violet-800 border-violet-200",
      count: "42+ Challenge",
    },
    {
      title: "Energetika va Yashil Texnologiyalar",
      desc: "Quyosh elektr stansiyalari, muqobil energiya va energiya tejamkorligi.",
      slug: "energy-greentech",
      icon: Zap,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50 text-amber-800 border-amber-200",
      count: "18+ Challenge",
    },
    {
      title: "Sanoat va Muhandislik",
      desc: "Zavod va ishlab chiqarishda uskunalar monitoringi, robototexnika va logistika.",
      slug: "industry-engineering",
      icon: Factory,
      color: "from-orange-500 to-rose-600",
      bgLight: "bg-orange-50 text-orange-800 border-orange-200",
      count: "29+ Challenge",
    },
    {
      title: "Ta'lim va Ijtimoiy Rivojlanish",
      desc: "EdTech platformalari, zamonaviy kasbiy ta'lim va ijtimoiy tashabbuslar.",
      slug: "education-social",
      icon: GraduationCap,
      color: "from-sky-500 to-blue-600",
      bgLight: "bg-sky-50 text-sky-800 border-sky-200",
      count: "21+ Challenge",
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* HERO SECTION: TWO-COLUMN ELEGANT BALANCED LAYOUT */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-12 sm:pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
        
        {/* Floating gradient blur orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-sky-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: REFINED TYPOGRAPHY & CTAS (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 via-sky-500/20 to-indigo-500/20 border border-sky-400/30 px-4 py-1.5 rounded-full text-sky-300 text-xs sm:text-sm font-semibold shadow-md">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                O'zbekistonda Birinchi Innovatsion Challenge & Pilot Ekotizimi
              </div>

              {/* Balanced, elegant headline (No fat/bulky text clump!) */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Haqiqiy muammolarga{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
                  innovatsion yechimlar
                </span>{" "}
                va natijador loyihalar.
              </h1>

              {/* Airy, readable description */}
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
                YechimUZ fuqaro, fermer va korxonalar muammolarini sun'iy intellekt orqali texnik <strong className="text-white font-semibold">Challenge</strong> formatiga o'tkazadi, eng iqtidorli mutaxassislarni birlashtiradi va mustaqil ekspertlar bahosi bilan real pilot sinovlariga olib chiqadi.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/problems/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Lightbulb className="w-4 h-4 text-slate-950 fill-slate-950" />
                  Muammo joylashtirish
                </Link>

                <Link
                  href="/problems"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition hover:-translate-y-0.5"
                >
                  Muammolarni ko'rish
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </Link>

                <a
                  href="#leaderboard"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-300 hover:text-white px-4 py-3.5 transition"
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Yechimchilar reytingi →
                </a>
              </div>

              {/* Live Metric Stats Bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-sky-400">120+</span>
                  <p className="text-[11px] text-slate-300 font-medium">Faol Muammo</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-yellow-400">500+</span>
                  <p className="text-[11px] text-slate-300 font-medium">Malakali Solver</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">850M+</span>
                  <p className="text-[11px] text-slate-300 font-medium">Byudjet (UZS)</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-purple-400">98%</span>
                  <p className="text-[11px] text-slate-300 font-medium">AI Aniqligi</p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: INTERACTIVE PLATFORM GUIDE PLAYER (5 cols) */}
            <div className="lg:col-span-5">
              <PlatformGuidePlayer />
            </div>

          </div>

          {/* Farg'ona Pilot Regional Showcase Banner */}
          <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-indigo-950/90 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-left shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3.5 rounded-2xl border border-emerald-500/40 text-emerald-400 flex-shrink-0">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                    Rasmiy Pilot Hudud
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Farg'ona Viloyati Innovatsiyalar Dasturi
                </h3>
                <p className="text-xs text-slate-300">
                  Tomchilatib sug'orish, ekologiya, chiqindilarni qayta ishlash va AI diagnostika maydonchalari.
                </p>
              </div>
            </div>

            <Link
              href="/problems?region=Farg'ona"
              className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-3 rounded-xl whitespace-nowrap transition shadow-lg self-start sm:self-auto transform active:scale-95"
            >
              Farg'ona loyihalari →
            </Link>
          </div>

        </div>
      </section>

      {/* TOP SOLVERS LEADERBOARD (Yechimchilar reytingi) */}
      <div id="leaderboard">
        <SolversLeaderboard />
      </div>

      {/* VIBRANT CATEGORIES SHOWCASE WITH ILLUSTRATIVE ICONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Asosiy Yo'nalishlar
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dolzarb Muammolar Kategoriyalari
          </h2>
          <p className="text-sm text-slate-600">
            O'z yo'nalishingiz bo'yicha e'lon qilingan topshiriqlarni tanlang va loyihangiz bilan qatnashing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;

            return (
              <Link
                key={cat.slug}
                href={`/problems?categoryId=${cat.slug}`}
                className="group relative bg-white p-7 rounded-3xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${cat.bgLight}`}>
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition gap-1">
                  Topshiriqlarni ko'rish <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ILLUSTRATED WORKFLOW CYCLE (MUAMMOLARDAN NATIJAGACHA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 space-y-10 border border-blue-500/20 shadow-2xl relative overflow-hidden">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Shaffof Ekotizim
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Muammodan Natijagacha Bo'lgan 4 Qadam
            </h2>
            <p className="text-sm text-slate-300">
              Oddiy e'lonlar doskasidan farqli o'laroq, platformamiz har bir bosqichni AI va mustaqil ekspertlar nazoratida amalga oshiradi.
            </p>
          </div>

          <WorkflowIllustration />
        </div>
      </section>

      {/* PLATFORM ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Nega Aynan YechimUZ?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Platformaning Asosiy Ustunliklari
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200 space-y-3.5 hover:shadow-lg transition">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">AI Challenge & Matching Engine</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sun'iy intellekt muammo talablarini tahlil qilib, unga mos mutaxassislarni ko'nikmalari va hududi bo'yicha aniq bog'laydi.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200 space-y-3.5 hover:shadow-lg transition">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">9 Mezonli Mustaqil Ekspertiza</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yechimlar soha olimlari va mutaxassislar tomonidan texnik sifat, muddat, xarajat va innovatsionlik bo'yicha baholanadi.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200 space-y-3.5 hover:shadow-lg transition">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Real Shartnoma va Pilot Sinovlari</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Eng yaxshi natija ko'rsatgan takliflar Farg'ona va boshqa hududlarda grantlar va tijoriy shartnomalarga ega bo'ladi.
            </p>
          </div>
        </div>
      </section>

      {/* VIBRANT CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 border border-white/30 text-white px-4 py-1 rounded-full uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Harakatni Bugun Boshlang
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            O'z muammoingizga professional yechim toping!
          </h2>

          <p className="text-blue-100 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            Istalgan fuqaro, fermer yoki tashkilot muammosini qisqa vaqtda joylashtirishi, mutaxassislar esa o'z bilimi va tajribasi bilan daromad olishi mumkin.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 active:scale-95"
            >
              Bepul ro'yxatdan o'tish
            </Link>

            <Link
              href="/dashboard/problems/create"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 active:scale-95"
            >
              Muammo e'lon qilish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
