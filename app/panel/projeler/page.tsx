'use client';

import { FolderKanban, Plus, Search, Filter } from 'lucide-react';

const projects = [
  { id: 1, title: 'Mono Sigorta - Sağlık Sigortaları Danışmanı', status: 'Aktif', candidates: 16, progress: 38, date: '02.03.2026' },
  { id: 2, title: 'TechNova Solutions - Senior Frontend Developer', status: 'Aktif', candidates: 24, progress: 85, date: '15.03.2026' },
  { id: 3, title: 'Global Logistics - Operasyon Sorumlusu', status: 'Beklemede', candidates: 12, progress: 15, date: '20.03.2026' },
  { id: 4, title: 'FinTech Startup - Backend Engineer', status: 'Tamamlandı', candidates: 8, progress: 100, date: '01.02.2026' },
  { id: 5, title: 'Retail Corp - Mağaza Müdürü', status: 'Aktif', candidates: 20, progress: 62, date: '10.03.2026' },
];

export default function ProjelerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Projeler</h2>
          <p className="text-sm text-slate-500 mt-1">{projects.length} proje listeleniyor</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Proje ara..." className="text-sm outline-none bg-transparent w-40" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter size={14} />
            Filtrele
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Plus size={16} />
            Yeni Proje
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proje Adı</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aday</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">İlerleme</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projects.map(p => {
              const statusColor = p.status === 'Aktif' ? 'text-emerald-700 bg-emerald-50' : p.status === 'Beklemede' ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-100';
              let barColor = 'bg-emerald-500';
              if (p.progress < 40) barColor = 'bg-rose-500';
              else if (p.progress < 70) barColor = 'bg-amber-400';
              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FolderKanban size={16} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 font-medium">{p.candidates}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">%{p.progress}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500 font-medium">{p.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
