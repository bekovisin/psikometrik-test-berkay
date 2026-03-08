'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Library, Zap, Settings, Receipt, Plus, X, Coins, Menu, Users } from 'lucide-react';
import { categories } from '@/data/categories';

const colorMap: Record<string, string> = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  violet: 'text-violet-600',
  orange: 'text-orange-600',
  rose: 'text-rose-600',
  slate: 'text-slate-600',
  teal: 'text-teal-600',
  indigo: 'text-indigo-600',
};

const bgMap: Record<string, string> = {
  blue: 'bg-blue-50',
  emerald: 'bg-emerald-50',
  violet: 'bg-violet-50',
  orange: 'bg-orange-50',
  rose: 'bg-rose-50',
  slate: 'bg-slate-50',
  teal: 'bg-teal-50',
  indigo: 'bg-indigo-50',
};

const navItems = [
  { icon: <LayoutGrid size={18} />, label: 'Dashboard', href: '/' },
  { icon: <Users size={18} />, label: 'Müşteri Paneli', href: '/musteri-paneli' },
  { icon: <Library size={18} />, label: 'Soru Bankası', href: '/admin/soru-bankasi' },
  { icon: <Zap size={18} />, label: 'Soru Üretici', href: '/admin/soru-uretici' },
];

const bottomNavItems = [
  { icon: <Receipt size={18} />, label: 'Faturalandırma', href: '#' },
  { icon: <Settings size={18} />, label: 'Ayarlar', href: '#' },
];

export default function Sidebar({ open, onClose, onOpen }: { open: boolean; onClose: () => void; onOpen: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {!open && (
        <button
          className="lg:hidden fixed top-[13px] left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center"
          onClick={onOpen}
        >
          <Menu size={20} />
        </button>
      )}

      {open && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/20 z-40" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-60 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0
        transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 lg:h-20 px-6 flex items-center justify-between border-b border-slate-200 shrink-0">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center font-bold rounded-lg shadow-sm">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 uppercase">Psikometrik</span>
            </div>
          </Link>
          <button
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md -mr-2"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
          {navItems.map((item, i) => {
            const active = item.href === '/'
              ? pathname === '/'
              : pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href));
            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-50 text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <div className="h-px bg-slate-100 my-2 mx-2" />

          <div className="px-3 py-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategoriler</p>
          </div>

          {categories.map(cat => {
            const isActive = pathname.includes(`/admin/soru-bankasi/${cat.slug}`);
            return (
              <Link
                key={cat.id}
                href={`/admin/soru-bankasi/${cat.slug}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? `${bgMap[cat.color]} ${colorMap[cat.color]} font-medium shadow-sm border border-slate-100`
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={onClose}
              >
                <div className={`w-5 h-5 ${colorMap[cat.color]} shrink-0`} dangerouslySetInnerHTML={{ __html: cat.icon }} />
                <span className="truncate text-xs font-medium">{cat.name}</span>
              </Link>
            );
          })}

          <div className="h-px bg-slate-100 my-2 mx-2" />

          {bottomNavItems.map((item, i) => {
            const active = item.href === '/'
              ? pathname === '/'
              : pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href));
            return (
              <Link
                key={`bottom-${i}`}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-50 text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 flex flex-col gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8 blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-8 -mb-8 blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Coins size={14} />
              </div>
              <span className="text-[10px] font-bold text-emerald-50 tracking-wider">KREDİ BAKİYE</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">5.830</span>
              </div>
              <div className="text-[10px] font-medium text-emerald-100/80">
                ≈ 29.150 ₺
              </div>
            </div>
          </div>
          <Link
            href="/admin/soru-bankasi/yeni"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
            onClick={onClose}
          >
            <Plus size={16} />
            Yeni Soru Ekle
          </Link>
        </div>
      </aside>
    </>
  );
}
