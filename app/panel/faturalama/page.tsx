'use client';

import { CreditCard, TrendingUp, ArrowDownRight, Coins, Plus } from 'lucide-react';

const transactions = [
  { id: 1, desc: '100 Kredi Paketi', amount: '+100', price: '500 ₺', date: '05.03.2026', type: 'purchase' },
  { id: 2, desc: 'Mono Sigorta Projesi - 16 aday', amount: '-48', price: '', date: '03.03.2026', type: 'usage' },
  { id: 3, desc: '500 Kredi Paketi', amount: '+500', price: '2.250 ₺', date: '01.03.2026', type: 'purchase' },
  { id: 4, desc: 'TechNova Solutions - 24 aday', amount: '-72', price: '', date: '28.02.2026', type: 'usage' },
  { id: 5, desc: '1000 Kredi Paketi', amount: '+1000', price: '4.000 ₺', date: '15.02.2026', type: 'purchase' },
];

export default function FaturalamaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"><Coins size={16} /></div>
            <span className="text-[11px] font-bold text-emerald-50 tracking-wider">KREDİ BAKİYE</span>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-bold text-white">5.830</span>
            <span className="text-sm font-medium text-emerald-100 ml-1">kredi</span>
            <div className="text-xs font-medium text-emerald-100/80 mt-1">≈ 29.150 ₺</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bu Ay Kullanım</span>
          </div>
          <span className="text-3xl font-bold text-slate-900">120</span>
          <span className="text-xs text-slate-500">kredi harcandı</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={16} className="text-indigo-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Harcama</span>
          </div>
          <span className="text-3xl font-bold text-slate-900">6.750 ₺</span>
          <span className="text-xs text-slate-500">bu dönem</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
          <Plus size={16} />
          Kredi Yükle
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Son İşlemler</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Açıklama</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kredi</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tutar</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-slate-700">{t.desc}</td>
                <td className="px-5 py-3">
                  <span className={`text-sm font-bold ${t.type === 'purchase' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.amount}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-slate-500">{t.price || '—'}</td>
                <td className="px-5 py-3 text-xs text-slate-500 font-medium">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
