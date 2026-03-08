'use client';

import { Trophy, TrendingUp } from 'lucide-react';

const results = [
  { test: 'OCEAN Kişilik Envanteri', score: 78, breakdown: { o: 82, c: 75, e: 70, a: 85, n: 78 }, date: '01.03.2026' },
  { test: 'Sayısal Yetenek Testi', score: 85, breakdown: { doğru: 17, yanlış: 3, boş: 0 }, date: '28.02.2026' },
];

export default function SonuclarimPage() {
  return (
    <div className="flex flex-col gap-6">
      {results.map((r, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Trophy size={16} /></div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{r.test}</h3>
                <p className="text-xs text-slate-500">{r.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">%{r.score}</span>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Object.entries(r.breakdown).map(([key, val]) => (
                <div key={key} className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{key}</p>
                  <p className="text-lg font-bold text-slate-800">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
