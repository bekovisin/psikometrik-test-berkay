'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Minus, ChevronRight, Coins, MoreVertical, ArrowRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { getStats } from '@/lib/store';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, ALL_DIFFICULTIES } from '@/lib/types';
import DifficultyBadge from '@/components/admin/DifficultyBadge';
import JsonExportImport from '@/components/admin/JsonExportImport';

const generateChartData = (base: number, variance: number) => {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  return days.map(day => ({
    day,
    value: Math.max(0, base + Math.floor(Math.random() * variance * 2 - variance)),
  }));
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-md shadow-md">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

const colorMap: Record<string, string> = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  violet: 'text-violet-600',
  orange: 'text-orange-600',
  rose: 'text-rose-600',
  slate: 'text-slate-600',
  teal: 'text-teal-600',
  indigo: 'text-indigo-600',
};

const bgMap: Record<string, string> = {
  blue: 'bg-blue-50',
  emerald: 'bg-emerald-50',
  violet: 'bg-violet-50',
  orange: 'bg-orange-50',
  rose: 'bg-rose-50',
  slate: 'bg-slate-50',
  teal: 'bg-teal-50',
  indigo: 'bg-indigo-50',
};

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData] = useState({
    total: generateChartData(50, 20),
    categories: generateChartData(8, 3),
    subModules: generateChartData(30, 10),
  });

  const loadStats = async () => {
    try {
      const s = await getStats();
      setStats(s);
    } catch (err) {
      console.error('Stats yüklenemedi:', err);
    }
  };

  useEffect(() => { loadStats(); }, []);

  if (!stats) {
    return (
      <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-28 animate-pulse" />
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm h-64 animate-pulse" />
      </div>
      </div>
    );
  }

  const maxByCategory = Math.max(...Object.values(stats.byCategory as Record<string, number>), 1);

  return (
    <div className="max-w-[1400px] mx-auto">
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Soru</span>
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.total}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
              +12.4% <TrendingUp size={14} />
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategoriler</span>
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.categories}>
                  <defs>
                    <linearGradient id="colorCat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorCat)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900">{stats.categoryCount}</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded flex items-center gap-1">
              +4.1% <TrendingUp size={14} />
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alt Modüller</span>
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.subModules}>
                  <defs>
                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900">{stats.subModuleCount}</span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded flex items-center gap-1">
              Stable <Minus size={14} />
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-5 cursor-pointer hover:shadow-md transition-all shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-8 -mb-8 blur-xl pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Coins size={16} />
              </div>
              <span className="text-[11px] font-bold text-emerald-50 tracking-wider">DOLU ALT MODÜL</span>
            </div>
            <ChevronRight size={16} className="text-emerald-100" />
          </div>
          <div className="relative z-10 mt-4">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold text-white">{Object.keys(stats.bySubModule).length}</span>
              <span className="text-sm font-medium text-emerald-100">modül</span>
            </div>
            <div className="text-xs font-medium text-emerald-100/80">
              Toplam {stats.subModuleCount} alt modülden
            </div>
          </div>
        </div>
      </div>

      {/* Zorluk Dağılımı */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Zorluk Dağılımı</h2>
          <JsonExportImport onImportDone={() => loadStats()} />
        </div>
        <div className="p-5">
          <div className="flex items-end gap-3 h-32">
            {ALL_DIFFICULTIES.map(d => {
              const count = stats.byDifficulty[d] || 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const { bg, text } = DIFFICULTY_COLORS[d];
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">{count}</span>
                  <div className="w-full rounded-t-lg relative" style={{ height: `${Math.max(pct, 4)}%` }}>
                    <div className={`absolute inset-0 ${bg} rounded-t-lg`} />
                  </div>
                  <span className={`text-xs font-medium ${text}`}>{DIFFICULTY_LABELS[d]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kategoriye Göre Dağılım - Project Tracking Style */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Kategori Bazlı Takip</h2>
          <Link
            href="/admin/soru-bankasi"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-colors shrink-0 border border-indigo-100"
          >
            Tüm kategorileri görüntüle
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {categories.map(cat => {
            const count = stats.byCategory[cat.id] || 0;
            const catSubModules = subModules.filter(s => s.categoryId === cat.id);
            const filledSubs = catSubModules.filter(s => (stats.bySubModule[s.id] || 0) > 0).length;
            const pct = catSubModules.length > 0 ? Math.round((filledSubs / catSubModules.length) * 100) : 0;

            let progressColor = 'bg-emerald-500';
            if (pct < 40) progressColor = 'bg-rose-500';
            else if (pct < 70) progressColor = 'bg-amber-400';

            return (
              <Link
                key={cat.id}
                href={`/admin/soru-bankasi/${cat.slug}`}
                className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col hover:border-indigo-300 transition-colors overflow-hidden h-full group"
              >
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${bgMap[cat.color]} ${colorMap[cat.color]}`}>
                      {count > 0 ? 'Aktif' : 'Beklemede'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                    {cat.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium mb-6">
                    <div className="flex items-center gap-1">
                      <span>{count} soru</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1">
                      <span>{catSubModules.length} alt modül</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1">
                      <span>{filledSubs} dolu</span>
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-xs text-slate-500 font-medium">
                        {filledSubs}/{catSubModules.length} tamamlandı
                      </div>
                      <span className="text-lg font-bold text-slate-700">%{pct}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Son Eklenen / Güncellenen Sorular */}
      {stats.recentQuestions && stats.recentQuestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Son Eklenen Sorular</h3>
            <Link
              href="/admin/soru-bankasi"
              className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wider"
            >
              Tümünü Gör
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentQuestions.map((q: any) => {
              const cat = categories.find(c => c.id === q.categoryId);
              const sub = subModules.find(s => s.id === q.subModuleId);
              return (
                <div key={q.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <DifficultyBadge difficulty={q.difficulty} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{q.questionText}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cat?.name} &gt; {sub?.name}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
