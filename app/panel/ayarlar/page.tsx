'use client';

import { Settings, Bell, Shield, Globe } from 'lucide-react';

export default function AyarlarPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Settings size={18} className="text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Genel Ayarlar</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Şirket Adı</p>
              <p className="text-xs text-slate-500">Projelerinizde görünecek isim</p>
            </div>
            <input type="text" defaultValue="Psikometrik Test A.Ş." className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 outline-none focus:border-indigo-500" />
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">E-posta</p>
              <p className="text-xs text-slate-500">Hesap e-posta adresi</p>
            </div>
            <input type="email" defaultValue="tamer@psikometrik.com" className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 outline-none focus:border-indigo-500" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Bell size={18} className="text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bildirim Tercihleri</h3>
        </div>
        <div className="p-5 space-y-4">
          {['Aday tamamladığında bildirim gönder', 'Proje tamamlandığında bildirim gönder', 'Haftalık özet rapor gönder'].map((label, i) => (
            <div key={i} className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <button className="w-10 h-6 bg-indigo-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Globe size={18} className="text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Dil ve Bölge</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Arayüz Dili</p>
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
              <option>Türkçe</option>
              <option>English</option>
            </select>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Zaman Dilimi</p>
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
              <option>UTC+3 (İstanbul)</option>
              <option>UTC+0 (London)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
          Kaydet
        </button>
      </div>
    </div>
    </div>
  );
}
