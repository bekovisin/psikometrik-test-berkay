'use client';

import { TrendingUp, Minus, ChevronRight, Coins } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data1 = [
  { date: '16.10', value: 10 }, { date: '17.10', value: 25 }, { date: '18.10', value: 15 },
  { date: '19.10', value: 30 }, { date: '20.10', value: 20 }, { date: '21.10', value: 40 },
  { date: '22.10', value: 35 },
];

const data2 = [
  { date: '16.10', value: 20 }, { date: '17.10', value: 15 }, { date: '18.10', value: 35 },
  { date: '19.10', value: 25 }, { date: '20.10', value: 45 }, { date: '21.10', value: 30 },
  { date: '22.10', value: 50 },
];

const data3 = [
  { date: '16.10', value: 30 }, { date: '17.10', value: 32 }, { date: '18.10', value: 28 },
  { date: '19.10', value: 31 }, { date: '20.10', value: 29 }, { date: '21.10', value: 30 },
  { date: '22.10', value: 31 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aktif Projeler</span>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data1}>
                <defs>
                  <linearGradient id="mp-color1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#mp-color1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-slate-900">303</span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            +12.4% <TrendingUp size={12} />
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Devam Eden Oturumlar</span>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data2}>
                <defs>
                  <linearGradient id="mp-color2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={1.5} fillOpacity={1} fill="url(#mp-color2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-slate-900">135</span>
          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            +4.1% <TrendingUp size={12} />
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tamamlanan Envanterler</span>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data3}>
                <defs>
                  <linearGradient id="mp-color3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#94a3b8" strokeWidth={1.5} fillOpacity={1} fill="url(#mp-color3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-slate-900">140</span>
          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            Stable <Minus size={12} />
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6 blur-xl pointer-events-none" />
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Coins size={13} />
            </div>
            <span className="text-[10px] font-bold text-emerald-50 tracking-wider">KREDİ BAKİYE</span>
          </div>
          <ChevronRight size={14} className="text-emerald-100" />
        </div>
        <div className="relative z-10 mt-3">
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-2xl font-bold text-white">5.830</span>
            <span className="text-xs font-medium text-emerald-100">kredi</span>
          </div>
          <div className="text-[10px] font-medium text-emerald-100/80">≈ 29.150 ₺</div>
        </div>
      </div>
    </div>
  );
}
