'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bell, Globe, LogOut, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Soru bankası genel görünümü' },
  '/admin/soru-bankasi': { title: 'Soru Bankası', subtitle: 'Tüm kategoriler ve alt modüller' },
  '/admin/soru-bankasi/yeni': { title: 'Yeni Soru Ekle', subtitle: 'Soru bankasına yeni soru ekleyin' },
  '/admin/soru-uretici': { title: 'Soru Üretici', subtitle: 'AI destekli soru üretim aracı' },
  '/panel': { title: 'Dashboard', subtitle: 'Proje takibi ve aday değerlendirme' },
  '/panel/projeler': { title: 'Projeler', subtitle: 'Tüm işe alım projelerinizi buradan yönetin.' },
  '/panel/oturumlar': { title: 'Oturumlar', subtitle: 'Devam eden oturumlar' },
  '/panel/faturalama': { title: 'Faturalandırma', subtitle: 'Kredi ve ödeme yönetimi' },
  '/panel/ayarlar': { title: 'Ayarlar', subtitle: 'Hesap ve tercih ayarları' },
  '/katilimci': { title: 'Dashboard', subtitle: 'Katılımcı paneli' },
  '/katilimci/testlerim': { title: 'Testlerim', subtitle: 'Atanmış testleriniz' },
  '/katilimci/sonuclarim': { title: 'Sonuçlarım', subtitle: 'Test sonuçlarınız' },
  '/katilimci/profilim': { title: 'Profilim', subtitle: 'Profil bilgileriniz' },
};

function getPageInfo(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];

  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'admin' && parts[1] === 'soru-bankasi' && parts[2]) {
    const cat = categories.find(c => c.slug === parts[2]);
    if (cat) {
      if (parts[3]) {
        const sub = subModules.find(s => s.slug === parts[3] && s.categoryId === cat.id);
        if (sub) return { title: sub.name, subtitle: cat.name };
      }
      return { title: cat.name, subtitle: 'Kategori detayı' };
    }
  }
  return { title: 'Psikometrik Test' };
}

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();
  const [lang, setLang] = useState('TR');
  const pageInfo = getPageInfo(pathname);

  return (
    <header className={`h-16 lg:h-20 pr-4 pl-16 lg:px-8 flex items-center justify-between bg-white shrink-0 ${pathname === '/panel/projeler' ? '' : 'border-b border-slate-200'}`}>
      <div className="flex flex-col">
        <h1 className="text-lg lg:text-xl font-bold text-slate-900">{pageInfo.title}</h1>
        {pageInfo.subtitle && (
          <p className="text-xs lg:text-sm text-slate-500 font-medium hidden sm:block">{pageInfo.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="relative group">
          <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
            <Globe size={16} />
            {lang}
          </button>
          <div className="absolute right-0 top-full mt-2 w-24 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button onClick={() => setLang('TR')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 rounded-t-lg">Türkçe</button>
            <button onClick={() => setLang('EN')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 rounded-b-lg">English</button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Systems: Active
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden" sideOffset={8} align="end">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-sm">Bildirimler</h3>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">2 Yeni</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto flex flex-col">
                <DropdownMenu.Item className="flex gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 outline-none cursor-pointer transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={16} /></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">Yeni sorular eklendi</p>
                    <p className="text-xs text-slate-500">Sayısal Yetenek kategorisine 15 yeni soru başarıyla eklendi.</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">2 DAKİKA ÖNCE</span>
                  </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 outline-none cursor-pointer transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><Clock size={16} /></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">Soru üretimi tamamlandı</p>
                    <p className="text-xs text-slate-500">AI soru üretici 25 yeni soru oluşturdu, incelemeniz bekleniyor.</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">1 SAAT ÖNCE</span>
                  </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex gap-3 p-4 hover:bg-slate-50 outline-none cursor-pointer transition-colors group opacity-60">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5"><AlertCircle size={16} /></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-900 leading-tight">Sistem Bakımı</p>
                    <p className="text-xs text-slate-500">Planlı sistem bakımı bu gece 03:00&apos;da yapılacaktır.</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">DÜN</span>
                  </div>
                </DropdownMenu.Item>
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors text-center">Tüm Bildirimleri Gör</button>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="hidden sm:block w-px h-8 bg-slate-200" />

        <div className="flex items-center gap-3">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg relative w-8 h-8 lg:w-9 lg:h-9">
                <div className="w-full h-full rounded-lg border border-slate-200 bg-indigo-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="min-w-[200px] bg-white rounded-lg p-1 shadow-lg border border-slate-200 z-50" sideOffset={8} align="end">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-slate-900">Tamer Bolat</p>
                  <p className="text-xs text-slate-500">tamer@psikometrik.com</p>
                </div>
                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 font-medium rounded-md hover:bg-slate-50 hover:text-slate-900 outline-none cursor-pointer">Profilim</DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 font-medium rounded-md hover:bg-slate-50 hover:text-slate-900 outline-none cursor-pointer">Hesap Ayarları</DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 font-medium rounded-md hover:bg-rose-50 outline-none cursor-pointer">
                  <LogOut size={16} />
                  Çıkış Yap
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
