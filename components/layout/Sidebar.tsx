'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutGrid, Library, Zap, Settings, Receipt, Plus, X, Coins, Menu,
  Users, ChevronDown, Shield, UserCircle, Layers, ClipboardList,
  FolderKanban, BookOpen, Tag, Ruler, Package, CreditCard, Gift,
  ArrowLeftRight, Monitor, LogOut, Eye,
} from 'lucide-react';
import { categories } from '@/data/categories';

const colorMap: Record<string, string> = {
  blue: 'text-blue-600', emerald: 'text-emerald-600', violet: 'text-violet-600',
  orange: 'text-orange-600', rose: 'text-rose-600', slate: 'text-slate-600',
  teal: 'text-teal-600', indigo: 'text-indigo-600',
};
const bgMap: Record<string, string> = {
  blue: 'bg-blue-50', emerald: 'bg-emerald-50', violet: 'bg-violet-50',
  orange: 'bg-orange-50', rose: 'bg-rose-50', slate: 'bg-slate-50',
  teal: 'bg-teal-50', indigo: 'bg-indigo-50',
};

type PanelType = 'admin' | 'musteri' | 'katilimci';

const panels: { id: PanelType; label: string; icon: React.ReactNode; color: string; home: string }[] = [
  { id: 'admin', label: 'Admin Paneli', icon: <Shield size={16} />, color: 'text-indigo-600', home: '/' },
  { id: 'musteri', label: 'Müşteri Paneli', icon: <Users size={16} />, color: 'text-emerald-600', home: '/panel' },
  { id: 'katilimci', label: 'Katılımcı Paneli', icon: <UserCircle size={16} />, color: 'text-amber-600', home: '/katilimci' },
];

function detectPanel(pathname: string): PanelType {
  if (pathname.startsWith('/panel')) return 'musteri';
  if (pathname.startsWith('/katilimci')) return 'katilimci';
  return 'admin';
}

interface NavGroup {
  label?: string;
  items: { icon: React.ReactNode; label: string; href: string }[];
}

const adminNav: NavGroup[] = [
  {
    items: [
      { icon: <LayoutGrid size={18} />, label: 'Dashboard', href: '/' },
    ],
  },
  {
    label: 'Soru Yönetimi',
    items: [
      { icon: <Library size={18} />, label: 'Soru Bankası', href: '/admin/soru-bankasi' },
      { icon: <Zap size={18} />, label: 'Soru Üretici', href: '/admin/soru-uretici' },
    ],
  },
  {
    label: 'Test Yönetimi',
    items: [
      { icon: <ClipboardList size={18} />, label: 'Test Şablonları', href: '#' },
      { icon: <Tag size={18} />, label: 'Test Kategorileri', href: '#' },
      { icon: <Ruler size={18} />, label: 'Kurallar', href: '#' },
    ],
  },
  {
    label: 'Envanter Yönetimi',
    items: [
      { icon: <BookOpen size={18} />, label: 'Envanterler', href: '#' },
    ],
  },
  {
    label: 'Müşteri Yönetimi',
    items: [
      { icon: <Users size={18} />, label: 'Müşteriler', href: '#' },
    ],
  },
  {
    label: 'Faturalandırma',
    items: [
      { icon: <Eye size={18} />, label: 'Genel Bakış', href: '#' },
      { icon: <Package size={18} />, label: 'Ürünler', href: '#' },
      { icon: <Layers size={18} />, label: 'Planlar', href: '#' },
      { icon: <CreditCard size={18} />, label: 'Siparişler', href: '#' },
      { icon: <Gift size={18} />, label: 'Promosyonlar', href: '#' },
      { icon: <ArrowLeftRight size={18} />, label: 'İşlemler', href: '#' },
    ],
  },
  {
    label: 'Demo',
    items: [
      { icon: <Monitor size={18} />, label: 'Demo Simülasyon', href: '#' },
      { icon: <Users size={18} />, label: 'Müşteri Paneli', href: '/panel' },
      { icon: <UserCircle size={18} />, label: 'Aday Paneli', href: '/katilimci' },
    ],
  },
];

const musteriNav: NavGroup[] = [
  {
    items: [
      { icon: <LayoutGrid size={18} />, label: 'Dashboard', href: '/panel' },
      { icon: <FolderKanban size={18} />, label: 'Projeler', href: '/panel/projeler' },
      { icon: <Layers size={18} />, label: 'Oturumlar', href: '/panel/oturumlar' },
      { icon: <Receipt size={18} />, label: 'Faturalandırma', href: '/panel/faturalama' },
      { icon: <Settings size={18} />, label: 'Ayarlar', href: '/panel/ayarlar' },
    ],
  },
];

const katilimciNav: NavGroup[] = [
  {
    items: [
      { icon: <LayoutGrid size={18} />, label: 'Dashboard', href: '/katilimci' },
      { icon: <ClipboardList size={18} />, label: 'Testlerim', href: '/katilimci/testlerim' },
      { icon: <BookOpen size={18} />, label: 'Sonuçlarım', href: '/katilimci/sonuclarim' },
      { icon: <Settings size={18} />, label: 'Profilim', href: '/katilimci/profilim' },
    ],
  },
];

function getNav(panel: PanelType): NavGroup[] {
  if (panel === 'musteri') return musteriNav;
  if (panel === 'katilimci') return katilimciNav;
  return adminNav;
}

export default function Sidebar({ open, onClose, onOpen }: { open: boolean; onClose: () => void; onOpen: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<PanelType>(detectPanel(pathname));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setActivePanel(detectPanel(pathname));
  }, [pathname]);

  const currentPanelInfo = panels.find(p => p.id === activePanel)!;
  const navGroups = getNav(activePanel);

  const switchPanel = (panel: PanelType) => {
    setActivePanel(panel);
    setDropdownOpen(false);
    const target = panels.find(p => p.id === panel)!;
    router.push(target.home);
    onClose();
  };

  const isActive = (href: string) => {
    if (href === '#') return false;
    if (href === '/' || href === '/panel' || href === '/katilimci') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const showCategories = activePanel === 'admin';
  const showCreditCard = activePanel === 'musteri';

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
        {/* Logo */}
        <div className="px-4 h-16 lg:h-20 border-b border-slate-200 shrink-0 flex items-center">
          <Link href={currentPanelInfo.home} className="flex items-center gap-3" onClick={onClose}>
            <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center font-bold rounded-lg shadow-sm text-sm">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900">Psikometrik Test</span>
              <span className="text-[10px] text-slate-400 font-medium">{currentPanelInfo.label}</span>
            </div>
          </Link>
          <button
            className="lg:hidden absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-0.5">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="h-px bg-slate-100 my-2 mx-2" />}
              {group.label && (
                <div className="px-3 py-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{group.label}</p>
                </div>
              )}
              {group.items.map((item, ii) => (
                <Link
                  key={ii}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-50 text-indigo-600 shadow-sm border border-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          {/* Categories for Admin */}
          {showCategories && (
            <>
              <div className="h-px bg-slate-100 my-2 mx-2" />
              <div className="px-3 py-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori Yönetimi</p>
              </div>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/admin/soru-bankasi/${cat.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    pathname.includes(`/admin/soru-bankasi/${cat.slug}`)
                      ? `${bgMap[cat.color]} ${colorMap[cat.color]} font-medium shadow-sm border border-slate-100`
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={onClose}
                >
                  <div className={`w-4 h-4 ${colorMap[cat.color]} shrink-0`} dangerouslySetInnerHTML={{ __html: cat.icon }} />
                  <span className="truncate text-xs font-medium">{cat.name}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200 flex flex-col gap-3">
          <>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className={currentPanelInfo.color}>{currentPanelInfo.icon}</span>
                  {currentPanelInfo.label}
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                    {panels.map(p => (
                      <button
                        key={p.id}
                        onClick={() => switchPanel(p.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors ${
                          p.id === activePanel
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className={p.color}>{p.icon}</span>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="h-px bg-slate-200" />
          </>

          {showCreditCard && (
            <Link href="/panel/faturalama" onClick={onClose}>
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
                    <span className="text-xs font-medium text-emerald-100">kredi</span>
                  </div>
                  <div className="text-[10px] font-medium text-emerald-100/80">≈ 29.150 ₺</div>
                </div>
              </div>
            </Link>
          )}

          {activePanel === 'admin' && (
            <Link
              href="/admin/soru-bankasi/yeni"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              onClick={onClose}
            >
              <Plus size={16} />
              Yeni Soru Ekle
            </Link>
          )}

          {showCreditCard ? (
            <Link href="/panel/faturalama" onClick={onClose} className="relative block rounded-lg overflow-hidden">
              <span className="relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white text-[13px] font-bold shadow-sm transition-all hover:brightness-110 animate-pulse">
                <Plus size={15} />
                Kredi Yükle
              </span>
            </Link>
          ) : (
            <button className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200">
              <LogOut size={16} />
              Çıkış Yap
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
