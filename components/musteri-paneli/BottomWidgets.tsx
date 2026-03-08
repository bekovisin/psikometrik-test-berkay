'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ArrowRight, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

function Pagination({ page, totalPages, onPageChange, rowsPerPage, onRowsChange, rowsOptions }: any) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-white shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Göster:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
          className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700 outline-none focus:border-indigo-500 font-medium cursor-pointer"
        >
          {rowsOptions.map((opt: number) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs text-slate-600 font-medium min-w-[65px] text-center">
          Sayfa {page} / {Math.max(1, totalPages)}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function MatchScoreBadge({ score }: { score: number }) {
  let colorClass = 'text-emerald-700 bg-emerald-50';
  let iconColor = 'text-emerald-500';
  if (score < 50) {
    colorClass = 'text-rose-700 bg-rose-50';
    iconColor = 'text-rose-500';
  } else if (score < 80) {
    colorClass = 'text-amber-700 bg-amber-50';
    iconColor = 'text-amber-500';
  }

  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-transform hover:scale-110 cursor-default ${colorClass}`}>
      <svg className={`w-3.5 h-3.5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9" />
      </svg>
      {score}%
    </div>
  );
}

function SkillBadge({ score, mode }: { score: number; mode: 'level' | 'score' }) {
  let level = 'Low';
  if (score >= 80) level = 'High';
  else if (score >= 50) level = 'Medium';

  if (mode === 'score') {
    let colorClass = 'text-emerald-700 bg-emerald-50';
    let iconColor = 'text-emerald-500';
    if (score < 50) {
      colorClass = 'text-rose-700 bg-rose-50';
      iconColor = 'text-rose-500';
    } else if (score < 80) {
      colorClass = 'text-amber-700 bg-amber-50';
      iconColor = 'text-amber-500';
    }
    return (
      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-transform hover:scale-110 cursor-default ${colorClass}`}>
        <svg className={`w-3.5 h-3.5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-9-9" />
        </svg>
        {score}%
      </div>
    );
  }

  const configs: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
    High: {
      icon: <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#10B981" /><path d="M4 7L6 9L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      label: 'Yüksek',
      cls: 'text-emerald-700 bg-emerald-50',
    },
    Medium: {
      icon: <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#F59E0B" /><path d="M4 7H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>,
      label: 'Orta',
      cls: 'text-amber-700 bg-amber-50',
    },
    Low: {
      icon: <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#EF4444" /><path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>,
      label: 'Düşük',
      cls: 'text-rose-700 bg-rose-50',
    },
  };
  const c = configs[level];
  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-transform hover:scale-110 cursor-default ${c.cls}`}>
      {c.icon}
      {c.label}
    </div>
  );
}

const initialCandidates = [
  { name: 'Ahmet Yılmaz', date: '10/09/2024', stage: 'Aşama 4: Mülakat', match: 40, ocean: { o: 45, c: 60, e: 55, a: 70, n: 30 } },
  { name: 'Ayşe Kaya', date: '12/09/2024', stage: 'Aşama 3: Teknik Test', match: 98, ocean: { o: 85, c: 90, e: 82, a: 88, n: 95 } },
  { name: 'Can Öztürk', date: '08/09/2024', stage: 'Aşama 2: Değerlendirme', match: 96, ocean: { o: 80, c: 85, e: 90, a: 85, n: 60 } },
  { name: 'Elif Demir', date: '15/09/2024', stage: 'Aşama 1: Yeni Başvuru', match: 42, ocean: { o: 30, c: 85, e: 65, a: 90, n: 40 } },
  { name: 'Burak Yılmaz', date: '11/09/2024', stage: 'Aşama 3: Teknik Test', match: 96, ocean: { o: 88, c: 92, e: 85, a: 80, n: 85 } },
  { name: 'Selin Şahin', date: '14/09/2024', stage: 'Aşama 4: Mülakat', match: 62, ocean: { o: 82, c: 80, e: 55, a: 45, n: 65 } },
  { name: 'Kemal Sunal', date: '16/09/2024', stage: 'Aşama 1: Yeni Başvuru', match: 75, ocean: { o: 70, c: 60, e: 90, a: 85, n: 50 } },
  { name: 'Fatma Girik', date: '17/09/2024', stage: 'Aşama 2: Değerlendirme', match: 88, ocean: { o: 85, c: 80, e: 75, a: 90, n: 80 } },
  { name: 'Tarık Akan', date: '18/09/2024', stage: 'Aşama 3: Teknik Test', match: 92, ocean: { o: 90, c: 85, e: 80, a: 85, n: 75 } },
  { name: 'Türkan Şoray', date: '19/09/2024', stage: 'Aşama 4: Mülakat', match: 95, ocean: { o: 85, c: 90, e: 85, a: 95, n: 85 } },
  { name: 'Cüneyt Arkın', date: '20/09/2024', stage: 'Aşama 5: Teklif', match: 99, ocean: { o: 95, c: 95, e: 90, a: 85, n: 90 } },
  { name: 'Filiz Akın', date: '21/09/2024', stage: 'Aşama 2: Değerlendirme', match: 82, ocean: { o: 80, c: 85, e: 70, a: 90, n: 80 } },
];

const initialTrackingData = [
  { name: 'Selin Yılmaz', time: '2dk', step: 0, status: 'Aşama 0: Değerlendirme' },
  { name: 'Mehmet Akif', time: '14dk', step: 2, status: 'Aşama 2: İK Mülakatı' },
  { name: 'Canan Öztürk', time: '45dk', step: 4, status: 'Aşama 4: Teklif İletildi' },
  { name: 'Ali Veli', time: '1s', step: 1, status: 'Aşama 1: Teknik Test' },
  { name: 'Ayşe Fatma', time: '2s', step: 3, status: 'Aşama 3: Yönetici Mülakatı' },
  { name: 'Hasan Hüseyin', time: '3s', step: 5, status: 'Aşama 5: İşe Alım' },
  { name: 'Zeynep Kamil', time: '4s', step: 0, status: 'Aşama 0: Değerlendirme' },
  { name: 'Veli Göçer', time: '5s', step: 2, status: 'Aşama 2: İK Mülakatı' },
];

function SortIcon({ columnKey, sortConfig }: { columnKey: string; sortConfig: { key: string; direction: 'asc' | 'desc' } | null }) {
  if (sortConfig?.key !== columnKey) {
    return <ArrowUpDown size={11} className="text-slate-300 ml-0.5 inline-block" />;
  }
  return sortConfig.direction === 'asc'
    ? <ArrowUp size={11} className="text-indigo-500 ml-0.5 inline-block" />
    : <ArrowDown size={11} className="text-indigo-500 ml-0.5 inline-block" />;
}

export function BottomWidgets() {
  const [displayMode, setDisplayMode] = useState<'level' | 'score'>('level');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [poolPage, setPoolPage] = useState(1);
  const [poolRowsPerPage, setPoolRowsPerPage] = useState(10);

  const [trackingPage, setTrackingPage] = useState(1);
  const [trackingRowsPerPage, setTrackingRowsPerPage] = useState(5);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCandidates = useMemo(() => {
    const sortableItems = [...initialCandidates];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'date') {
          const [ad, am, ay] = a.date.split('/');
          const [bd, bm, by] = b.date.split('/');
          aValue = new Date(`${ay}-${am}-${ad}`).getTime();
          bValue = new Date(`${by}-${bm}-${bd}`).getTime();
        } else if (['o', 'c', 'e', 'a', 'n'].includes(sortConfig.key)) {
          aValue = a.ocean[sortConfig.key as keyof typeof a.ocean];
          bValue = b.ocean[sortConfig.key as keyof typeof b.ocean];
        } else {
          aValue = a[sortConfig.key as keyof typeof a];
          bValue = b[sortConfig.key as keyof typeof b];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  const paginatedCandidates = useMemo(() => {
    const start = (poolPage - 1) * poolRowsPerPage;
    return sortedCandidates.slice(start, start + poolRowsPerPage);
  }, [sortedCandidates, poolPage, poolRowsPerPage]);

  const paginatedTracking = useMemo(() => {
    const start = (trackingPage - 1) * trackingRowsPerPage;
    return initialTrackingData.slice(start, start + trackingRowsPerPage);
  }, [trackingPage, trackingRowsPerPage]);

  const getThClass = (key: string) => {
    const baseClass = 'px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors';
    if (sortConfig?.key === key) return `${baseClass} bg-indigo-50/80 text-indigo-700`;
    return `${baseClass} text-slate-500 hover:bg-slate-100`;
  };

  const getTdClass = (key: string, extraClass: string = '') => {
    const baseClass = `px-3.5 py-2 whitespace-nowrap ${extraClass}`;
    if (sortConfig?.key === key) return `${baseClass} bg-indigo-50/30`;
    return baseClass;
  };

  const getStageStyles = (stage: string) => {
    if (stage.includes('Yeni Başvuru')) return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100';
    if (stage.includes('Değerlendirme')) return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    if (stage.includes('Teknik Test')) return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    if (stage.includes('Mülakat')) return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
    if (stage.includes('Teklif')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
      {/* Aday Havuzu */}
      <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden h-[520px]">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Aday Havuzu Analizi</h3>
            <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              Mono Sigorta Projesi
              <ChevronDown size={13} className="text-slate-400" />
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
              <button
                onClick={() => setDisplayMode('level')}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${displayMode === 'level' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Düzey
              </button>
              <button
                onClick={() => setDisplayMode('score')}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${displayMode === 'score' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Skor
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 text-xs font-bold text-indigo-700 border border-indigo-100 rounded-md hover:bg-indigo-100 transition-colors">
              Tümünü Gör
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th colSpan={4} className="px-3.5 py-2 border-r border-slate-100"></th>
                <th colSpan={5} className="px-3.5 py-2 text-center text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50/50 border-b-2 border-indigo-100">
                  OCEAN Raporu
                </th>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th onClick={() => handleSort('name')} className={getThClass('name')}>Aday Adı <SortIcon columnKey="name" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('date')} className={getThClass('date')}>Başvuru Tarihi <SortIcon columnKey="date" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('stage')} className={getThClass('stage')}>Aşama <SortIcon columnKey="stage" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('match')} className={`${getThClass('match')} border-r border-slate-100`}>Uyum Skoru <SortIcon columnKey="match" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('o')} className={getThClass('o')}>Deneyime Açıklık <SortIcon columnKey="o" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('c')} className={getThClass('c')}>Sorumluluk <SortIcon columnKey="c" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('e')} className={getThClass('e')}>Dışadönüklük <SortIcon columnKey="e" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('a')} className={getThClass('a')}>Uyumluluk <SortIcon columnKey="a" sortConfig={sortConfig} /></th>
                <th onClick={() => handleSort('n')} className={getThClass('n')}>Duygusal Denge <SortIcon columnKey="n" sortConfig={sortConfig} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedCandidates.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className={getTdClass('name')}>
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="İncele">
                        <Search size={13} />
                      </button>
                      <span className="text-[13px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{c.name}</span>
                    </div>
                  </td>
                  <td className={getTdClass('date', 'text-xs font-medium text-slate-500')}>{c.date}</td>
                  <td className={getTdClass('stage')}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border transition-all hover:scale-105 cursor-default ${getStageStyles(c.stage)}`}>
                      {c.stage}
                    </span>
                  </td>
                  <td className={getTdClass('match', 'border-r border-slate-50')}>
                    <MatchScoreBadge score={c.match} />
                  </td>
                  <td className={getTdClass('o')}><SkillBadge score={c.ocean.o} mode={displayMode} /></td>
                  <td className={getTdClass('c')}><SkillBadge score={c.ocean.c} mode={displayMode} /></td>
                  <td className={getTdClass('e')}><SkillBadge score={c.ocean.e} mode={displayMode} /></td>
                  <td className={getTdClass('a')}><SkillBadge score={c.ocean.a} mode={displayMode} /></td>
                  <td className={getTdClass('n')}><SkillBadge score={c.ocean.n} mode={displayMode} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={poolPage}
          totalPages={Math.ceil(sortedCandidates.length / poolRowsPerPage)}
          onPageChange={setPoolPage}
          rowsPerPage={poolRowsPerPage}
          onRowsChange={(val: number) => { setPoolRowsPerPage(val); setPoolPage(1); }}
          rowsOptions={[10, 20, 50]}
        />
      </div>

      {/* Anlık Aday Takibi */}
      <div className="col-span-1 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-[520px]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Anlık Aday Takibi</h3>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wider">
            Tümünü Gör
            <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col">
          {paginatedTracking.map((item, i) => (
            <TrackingItem key={i} name={item.name} time={item.time} step={item.step} status={item.status} />
          ))}
        </div>
        <Pagination
          page={trackingPage}
          totalPages={Math.ceil(initialTrackingData.length / trackingRowsPerPage)}
          onPageChange={setTrackingPage}
          rowsPerPage={trackingRowsPerPage}
          onRowsChange={(val: number) => { setTrackingRowsPerPage(val); setTrackingPage(1); }}
          rowsOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
}

const stepColors = ['bg-slate-400', 'bg-sky-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-green-600'];
const stepRingColors = ['ring-slate-200', 'ring-sky-200', 'ring-indigo-200', 'ring-purple-200', 'ring-emerald-200', 'ring-green-200'];

function TrackingItem({ name, time, step, status }: { name: string; time: string; step: number; status: string }) {
  const activeColor = stepColors[step] || 'bg-slate-400';
  const activeRing = stepRingColors[step] || 'ring-slate-200';
  const progressPercent = (step / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3.5 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0 group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="font-bold text-slate-900 text-[13px]">{name}</span>
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{time}</span>
      </div>

      <div className="mb-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Değerlendirme Aşaması</span>
      </div>

      <div className="relative flex items-center justify-between w-full px-2">
        <div className="absolute left-2 right-2 h-[2px] bg-slate-100 top-1/2 -translate-y-1/2 z-0" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `calc(${progressPercent}% - 16px)` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`absolute left-2 h-[2px] ${activeColor} top-1/2 -translate-y-1/2 z-0`}
        />

        {[0, 1, 2, 3, 4, 5].map((i) => {
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <div key={i} className="relative z-10 bg-white px-0.5">
              <motion.div
                initial={isActive ? { scale: 0.8 } : false}
                animate={isActive ? { scale: [0.8, 1.2, 1] } : false}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 cursor-default ${
                  isCompleted
                    ? `${activeColor} shadow-sm`
                    : isActive
                      ? `${activeColor} shadow-md ring-4 ${activeRing}`
                      : 'bg-slate-100 border border-slate-200'
                }`}
              >
                {isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-600 font-bold mt-3 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{status}</p>
    </motion.div>
  );
}
