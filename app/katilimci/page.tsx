'use client';

import { ClipboardList, Clock, CheckCircle2, Trophy } from 'lucide-react';

export default function KatilimciDashboard() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><ClipboardList size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atanmış Test</p>
            <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Devam Eden</p>
            <p className="text-2xl font-bold text-slate-900">1</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tamamlanan</p>
            <p className="text-2xl font-bold text-slate-900">2</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Trophy size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ortalama Skor</p>
            <p className="text-2xl font-bold text-slate-900">%82</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bekleyen Testler</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { title: 'OCEAN Kişilik Envanteri', project: 'Mono Sigorta', duration: '~30dk', status: 'Başla' },
            { title: 'Çalışma Değerleri Envanteri', project: 'Mono Sigorta', duration: '~20dk', status: 'Devam Et' },
            { title: 'Değerlendirme Merkezi Simülasyonu', project: 'TechNova Solutions', duration: '~45dk', status: 'Başla' },
          ].map((test, i) => (
            <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">{i + 1}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{test.title}</p>
                  <p className="text-xs text-slate-500">{test.project} &middot; Tahmini süre: {test.duration}</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                test.status === 'Devam Et'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}>
                {test.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
