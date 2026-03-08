'use client';

import { MoreVertical, Users, Layers, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { ProjectDetailModal } from './ProjectDetailModal';

const projects = [
  {
    title: 'Mono Sigorta - Sağlık Sigortaları Danışmanı',
    badge: 'Aktif',
    badgeColor: 'text-emerald-700 bg-emerald-100',
    description: 'Dijital kanallardan gelen müşterilere sağlık sigortaları hakkında bilgi vermek, ihtiyaç analizi yaparak uygun poliçe önerileri sunmak ve...',
    candidates: 16,
    stages: 3,
    date1: '02.03.2026',
    date2: '02.03.2026 — 10.03.2026',
    progress: 38,
    completed: 6,
    total: 16,
  },
  {
    title: 'TechNova Solutions - Senior Frontend Developer',
    badge: 'Aktif',
    badgeColor: 'text-emerald-700 bg-emerald-100',
    description: 'Modern web teknolojileri kullanarak kullanıcı dostu arayüzler geliştirmek, mevcut projelerin bakımını yapmak ve yeni özellikler eklemek...',
    candidates: 24,
    stages: 4,
    date1: '15.03.2026',
    date2: '15.03.2026 — 25.03.2026',
    progress: 85,
    completed: 20,
    total: 24,
  },
  {
    title: 'Global Logistics - Operasyon Sorumlusu',
    badge: 'Beklemede',
    badgeColor: 'text-amber-700 bg-amber-100',
    description: 'Günlük lojistik operasyonlarını planlamak, takip etmek ve raporlamak, müşteri taleplerini karşılamak ve süreç iyileştirmeleri yapmak...',
    candidates: 12,
    stages: 2,
    date1: '20.03.2026',
    date2: '20.03.2026 — 30.03.2026',
    progress: 15,
    completed: 2,
    total: 12,
  },
];

export function ProjectTracking() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Operasyonel Proje Takibi</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors shrink-0 border border-indigo-100">
          Tüm projeleri görüntüle
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {projects.map((p, i) => {
          let progressColor = 'bg-emerald-500';
          if (p.progress < 40) progressColor = 'bg-rose-500';
          else if (p.progress < 70) progressColor = 'bg-amber-400';

          return (
            <div key={i} className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col hover:border-indigo-300 transition-colors overflow-hidden h-full group">
              <div
                className="p-5 flex flex-col flex-1 cursor-pointer"
                onClick={() => setSelectedProject(p)}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                  <button
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                <p className="text-[13px] text-slate-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium mb-5">
                  <div className="flex items-center gap-1">
                    <Users size={13} />
                    <span>{p.candidates} aday</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1">
                    <Layers size={13} />
                    <span>{p.stages} aşama</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>{p.date1}</span>
                  </div>
                </div>

                <div className="w-full pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs text-slate-500 font-medium">
                      {p.completed}/{p.total} tamamlandı
                    </div>
                    <span className="text-sm font-bold text-slate-700">%{p.progress}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${p.progress}%` }} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                    >
                      İlerleme Durumu
                    </button>
                    <button
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      İncele
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectDetailModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
