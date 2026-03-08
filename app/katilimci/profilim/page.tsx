'use client';

import { UserCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function ProfilimPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">AK</div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ahmet Kaya</h2>
            <p className="text-sm text-slate-500">Katılımcı</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {[
            { icon: <Mail size={16} />, label: 'E-posta', value: 'ahmet.kaya@email.com' },
            { icon: <Phone size={16} />, label: 'Telefon', value: '+90 532 XXX XX XX' },
            { icon: <MapPin size={16} />, label: 'Konum', value: 'İstanbul, Türkiye' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">{item.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-medium text-slate-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Başvuru Bilgileri</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Başvuru Tarihi</span>
            <span className="text-sm font-medium text-slate-700">01.03.2026</span>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Pozisyon</span>
            <span className="text-sm font-medium text-slate-700">Sağlık Sigortaları Danışmanı</span>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Proje</span>
            <span className="text-sm font-medium text-slate-700">Mono Sigorta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
