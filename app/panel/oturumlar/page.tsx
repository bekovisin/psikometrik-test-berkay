'use client';

import { Clock, Users, CheckCircle2 } from 'lucide-react';

const sessions = [
  { id: 1, candidate: 'Selin Yılmaz', project: 'Mono Sigorta', stage: 'OCEAN Envanteri', duration: '14dk 32sn', status: 'Devam Ediyor', progress: 65 },
  { id: 2, candidate: 'Mehmet Akif', project: 'TechNova Solutions', stage: 'Teknik Test', duration: '45dk 10sn', status: 'Devam Ediyor', progress: 82 },
  { id: 3, candidate: 'Can Öztürk', project: 'Mono Sigorta', stage: 'Değerlendirme Merkezi', duration: '28dk 55sn', status: 'Tamamlandı', progress: 100 },
  { id: 4, candidate: 'Ayşe Kaya', project: 'Global Logistics', stage: 'OCEAN Envanteri', duration: '5dk 22sn', status: 'Devam Ediyor', progress: 30 },
  { id: 5, candidate: 'Burak Yılmaz', project: 'TechNova Solutions', stage: 'Çalışma Değerleri', duration: '19dk 48sn', status: 'Devam Ediyor', progress: 55 },
  { id: 6, candidate: 'Elif Demir', project: 'Mono Sigorta', stage: 'OCEAN Envanteri', duration: '32dk 10sn', status: 'Tamamlandı', progress: 100 },
];

export default function OturumlarPage() {
  const active = sessions.filter(s => s.status === 'Devam Ediyor').length;
  const completed = sessions.filter(s => s.status === 'Tamamlandı').length;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Clock size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Devam Eden</p>
            <p className="text-2xl font-bold text-slate-900">{active}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tamamlanan</p>
            <p className="text-2xl font-bold text-slate-900">{completed}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center"><Users size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Oturum</p>
            <p className="text-2xl font-bold text-slate-900">{sessions.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Aktif Oturumlar</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aday</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proje</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aşama</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Süre</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">İlerleme</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sessions.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-slate-700">{s.candidate}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{s.project}</td>
                <td className="px-5 py-3 text-xs font-medium text-slate-500">{s.stage}</td>
                <td className="px-5 py-3 text-xs font-bold text-slate-600">{s.duration}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.status === 'Devam Ediyor' ? 'text-indigo-700 bg-indigo-50' : 'text-emerald-700 bg-emerald-50'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">%{s.progress}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
