import Link from "next/link";
import { Lightbulb, Shield, MapPin, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg text-sm">YUZ</div>
              YechimUZ
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              O'zbekistonda real hayotiy muammolarni mutaxassislar, talabalar, startup va korxonalar bilan bog'laydigan innovatsion platforma.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-950/50 p-2 rounded border border-blue-900/50">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Birinchi pilot hudud: <strong>Farg'ona viloyati</strong>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platforma</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/problems" className="hover:text-white transition">Muammolar bozori</Link></li>
              <li><Link href="/solvers" className="hover:text-white transition">Yechimchilar bazasi</Link></li>
              <li><Link href="/pilots" className="hover:text-white transition">Pilot loyihalar</Link></li>
              <li><Link href="/dashboard/problems/create" className="hover:text-white transition">Muammo joylash</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Ekotizim</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-500">Tashkilotlar uchun</span></li>
              <li><span className="text-slate-500">Talabalar va Izlanuvchilar</span></li>
              <li><span className="text-slate-500">Ekspertlar tarmog'i</span></li>
              <li><span className="text-slate-500">Sponsorlik & Grantlar</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Xavfsizlik & Sifat</h4>
            <p className="text-xs text-slate-400">
              Platforma har bir yechimning ekspertizasi va amaliy pilot sinovlarini ta'minlaydi.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              RBAC & IP Hukukiy Himoya
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} YechimUZ. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-4">
            <span>Maxfiylik siyosati</span>
            <span>Foydalanish shartlari</span>
            <span>Farg'ona Pilot Dasturi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
