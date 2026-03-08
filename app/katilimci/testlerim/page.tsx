'use client';

import { ClipboardList } from 'lucide-react';

const tests = [
  { id: 1, title: 'OCEAN Kişilik Envanteri', project: 'Mono Sigorta', status: 'Tamamlandı', score: 78, date: '01.03.2026' },
  { id: 2, title: 'Çalışma Değerleri Envanteri', project: 'Mono Sigorta', status: 'Devam Ediyor', score: null, date: '05.03.2026' },
  { id: 3, title: 'Değerlendirme Merkezi Simülasyonu', project: 'TechNova Solutions', status: 'Bekliyor', score: null, date: '—' },
  { id: 4, title: 'Sayısal Yetenek Testi', project: 'Mono Sigorta', status: 'Tamamlandı', score: 85, date: '28.02.2026' },
];

export default function TestlerimPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Testlerim</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Test</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proje</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skor</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tests.map(t => {
              const statusColor = t.status === 'Tamamlandı' ? 'text-emerald-700 bg-emerald-50' : t.status === 'Devam Ediyor' ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600 bg-slate-100';
              return (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><ClipboardList size={14} /></div>
                      <span className="text-sm font-semibold text-slate-700">{t.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{t.project}</td>
                  <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>{t.status}</span></td>
                  <td className="px-5 py-3 text-sm font-bold text-slate-700">{t.score !== null ? `%${t.score}` : '—'}</td>
                  <td className="px-5 py-3 text-xs text-slate-500 font-medium">{t.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
