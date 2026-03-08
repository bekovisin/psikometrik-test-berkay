'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MoreVertical, Users, Layers, Calendar, Plus,
  Trash2, Archive, Copy, Edit2, Check,
  ChevronDown, Play, Pause, CheckCircle2, AlertTriangle, X,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';

type ProjectStatus = 'Aktif' | 'Beklemede' | 'Tamamlandı' | 'Arşiv';

interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  description: string;
  candidates: number;
  stages: number;
  date1: string;
  date2: string;
  progress: number;
  completed: number;
  total: number;
}

const initialProjects: Project[] = [
  { id: '1', title: 'Mono Sigorta - Sağlık Sigortaları Danışmanı', status: 'Aktif', description: 'Dijital kanallardan gelen müşterilere sağlık sigortaları hakkında bilgi vermek, ihtiyaç analizi yaparak uygun poliçe önerileri sunmak ve...', candidates: 16, stages: 3, date1: '02.03.2026', date2: '02.03.2026 — 10.03.2026', progress: 38, completed: 6, total: 16 },
  { id: '2', title: 'TechNova Solutions - Senior Frontend Developer', status: 'Aktif', description: 'Modern web teknolojileri kullanarak kullanıcı dostu arayüzler geliştirmek, mevcut projelerin bakımını yapmak ve yeni özellikler eklemek...', candidates: 24, stages: 4, date1: '15.03.2026', date2: '15.03.2026 — 25.03.2026', progress: 85, completed: 20, total: 24 },
  { id: '3', title: 'Global Logistics - Operasyon Sorumlusu', status: 'Beklemede', description: 'Günlük lojistik operasyonlarını planlamak, takip etmek ve raporlamak, müşteri taleplerini karşılamak ve süreç iyileştirmeleri yapmak...', candidates: 12, stages: 2, date1: '20.03.2026', date2: '20.03.2026 — 30.03.2026', progress: 15, completed: 2, total: 12 },
  { id: '4', title: 'FinTech Startup - Backend Engineer', status: 'Tamamlandı', description: 'Ölçeklenebilir backend sistemleri tasarlamak ve API geliştirmek.', candidates: 8, stages: 3, date1: '01.02.2026', date2: '01.02.2026 — 15.02.2026', progress: 100, completed: 8, total: 8 },
  { id: '5', title: 'Retail Corp - Mağaza Müdürü', status: 'Aktif', description: 'Mağaza operasyonlarını yönetmek, satış hedeflerini takip etmek ve ekip performansını değerlendirmek...', candidates: 20, stages: 4, date1: '10.03.2026', date2: '10.03.2026 — 25.03.2026', progress: 62, completed: 12, total: 20 },
];

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case 'Aktif': return 'text-emerald-700 bg-emerald-100';
    case 'Beklemede': return 'text-amber-700 bg-amber-100';
    case 'Tamamlandı': return 'text-indigo-700 bg-indigo-100';
    case 'Arşiv': return 'text-slate-700 bg-slate-100';
    default: return 'text-slate-700 bg-slate-100';
  }
};

export default function ProjelerPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<'Tümü' | ProjectStatus>('Tümü');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortLabel, setSortLabel] = useState('Yeniden Eskiye');

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    actionType: 'danger' | 'primary';
    onConfirm: () => void;
  }>({ isOpen: false, title: '', description: '', actionLabel: '', actionType: 'primary', onConfirm: () => {} });

  const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => setModalConfig({ ...config, isOpen: true });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  const handleBulkDelete = () => {
    openModal({
      title: 'Projeleri Sil',
      description: `${selectedIds.size} projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      actionLabel: 'Sil',
      actionType: 'danger',
      onConfirm: () => {
        setProjects(projects.filter(p => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
        setIsSelectMode(false);
        closeModal();
      },
    });
  };

  const handleBulkStatusChange = (newStatus: ProjectStatus) => {
    openModal({
      title: 'Durum Güncelle',
      description: `${selectedIds.size} projenin durumunu "${newStatus}" olarak değiştirmek istediğinize emin misiniz?`,
      actionLabel: 'Güncelle',
      actionType: 'primary',
      onConfirm: () => {
        setProjects(projects.map(p => selectedIds.has(p.id) ? { ...p, status: newStatus } : p));
        setSelectedIds(new Set());
        setIsSelectMode(false);
        closeModal();
      },
    });
  };

  const handleSingleDelete = (id: string) => {
    openModal({
      title: 'Projeyi Sil',
      description: 'Bu projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      actionLabel: 'Sil',
      actionType: 'danger',
      onConfirm: () => {
        setProjects(projects.filter(p => p.id !== id));
        closeModal();
      },
    });
  };

  const handleSingleStatusChange = (id: string, newStatus: ProjectStatus) => {
    openModal({
      title: 'Durum Güncelle',
      description: `Projenin durumunu "${newStatus}" olarak değiştirmek istediğinize emin misiniz?`,
      actionLabel: 'Güncelle',
      actionType: 'primary',
      onConfirm: () => {
        setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
        closeModal();
      },
    });
  };

  const handleDuplicate = (project: Project) => {
    openModal({
      title: 'Projeyi Çoğalt',
      description: 'Bu projeyi çoğaltmak istediğinize emin misiniz?',
      actionLabel: 'Çoğalt',
      actionType: 'primary',
      onConfirm: () => {
        const newProject = { ...project, id: String(Date.now()), title: `${project.title} (Kopya)` };
        setProjects([...projects, newProject]);
        closeModal();
      },
    });
  };

  const handleArchive = (id: string) => {
    openModal({
      title: 'Projeyi Arşivle',
      description: 'Bu projeyi arşivlemek istediğinize emin misiniz?',
      actionLabel: 'Arşivle',
      actionType: 'primary',
      onConfirm: () => {
        setProjects(projects.map(p => p.id === id ? { ...p, status: 'Arşiv' } : p));
        closeModal();
      },
    });
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProjects.map(p => p.id)));
  };

  const filteredProjects = projects.filter(p => filter === 'Tümü' || p.status === filter);

  return (
    <div className="flex flex-col gap-0">
      {/* Tab menü: navbar'ın hemen altında, tek başlık yok (başlık Header'da) */}
      <div className="bg-white border-b border-slate-200 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex gap-5 -mb-[1px] overflow-x-auto w-full sm:w-auto no-scrollbar">
            {(['Tümü', 'Aktif', 'Beklemede', 'Tamamlandı', 'Arşiv'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`pb-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${filter === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pb-3">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Sırala: {sortLabel}
                  <ChevronDown size={13} className="text-slate-400" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" className="z-50 min-w-[160px] bg-white rounded-lg shadow-lg border border-slate-200 p-1">
                  {['Yeniden Eskiye', 'Eskiden Yeniye', 'A-Z', 'Z-A'].map((opt) => (
                    <DropdownMenu.Item key={opt} onClick={() => setSortLabel(opt)} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none">
                      {opt}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {!isSelectMode ? (
              <button
                onClick={() => setIsSelectMode(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Seç
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  {selectedIds.size === filteredProjects.length ? 'Seçimi Temizle' : 'Tümünü Seç'}
                </button>
                <button
                  onClick={() => { setIsSelectMode(false); setSelectedIds(new Set()); }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toplu işlem çubuğu: tam genişlik */}
      {isSelectMode && selectedIds.size > 0 && (
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 py-2.5 flex justify-between items-center shadow-sm -mx-4 lg:-mx-6 px-4 lg:px-6">
          <span className="text-xs font-bold text-slate-700">{selectedIds.size} proje seçildi</span>
          <div className="flex items-center gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5">
                  Durum Değiştir
                  <ChevronDown size={13} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" className="z-50 min-w-[150px] bg-white rounded-lg shadow-lg border border-slate-200 p-1">
                  <DropdownMenu.Item onClick={() => handleBulkStatusChange('Aktif')} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                    <Play size={13} className="text-emerald-500" /> Aktif Yap
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleBulkStatusChange('Beklemede')} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                    <Pause size={13} className="text-amber-500" /> Durdur
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleBulkStatusChange('Tamamlandı')} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-indigo-500" /> Tamamlandı İşaretle
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              Sil
            </button>
          </div>
        </div>
      )}

      {/* Kart grid: max 1400px */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-5 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {/* Yeni Proje Kartı */}
          {filter === 'Tümü' && (
            <Link
              href="#"
              className="bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all min-h-[280px] group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                <Plus size={20} className="text-slate-400 group-hover:text-indigo-600" />
              </div>
              <span className="font-bold text-sm">Yeni Proje Oluştur</span>
              <span className="text-xs mt-0.5 opacity-70">Sıfırdan veya şablondan</span>
            </Link>
          )}

          {filteredProjects.map((p) => {
            let progressColor = 'bg-emerald-500';
            if (p.progress < 40) progressColor = 'bg-rose-500';
            else if (p.progress < 70) progressColor = 'bg-amber-400';
            const isSelected = selectedIds.has(p.id);

            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl shadow-sm flex flex-col transition-all overflow-hidden min-h-[280px] relative group ${
                  isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-indigo-300 cursor-pointer'
                }`}
                onClick={() => isSelectMode ? toggleSelection(p.id) : undefined}
              >
                {isSelectMode && (
                  <div className="absolute top-4 left-4 z-10" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleSelection(p.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-transparent hover:border-indigo-400'
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </button>
                  </div>
                )}

                <div className={`p-4 flex flex-col flex-1 ${isSelectMode ? 'pl-9' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                    {!isSelectMode && (
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content align="end" className="z-50 min-w-[180px] bg-white rounded-lg shadow-lg border border-slate-200 p-1">
                            <DropdownMenu.Item className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                              <Edit2 size={13} /> Düzenle
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => handleDuplicate(p)} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                              <Copy size={13} /> Çoğalt
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />
                            <DropdownMenu.Item onClick={() => handleSingleStatusChange(p.id, 'Aktif')} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                              <Play size={13} className="text-emerald-500" /> Aktif
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => handleSingleStatusChange(p.id, 'Beklemede')} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                              <Pause size={13} className="text-amber-500" /> Durduruldu
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => handleSingleStatusChange(p.id, 'Tamamlandı')} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-indigo-500" /> Tamamlandı
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />
                            <DropdownMenu.Item onClick={() => handleArchive(p.id)} className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer outline-none flex items-center gap-2">
                              <Archive size={13} /> Arşivle
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => handleSingleDelete(p.id)} className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer outline-none flex items-center gap-2">
                              <Trash2 size={13} /> Sil
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-2 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 flex-1 leading-relaxed">{p.description}</p>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-500 font-medium mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={11} />
                      <span>{p.candidates} aday</span>
                    </div>
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1">
                      <Layers size={11} />
                      <span>{p.stages} aşama</span>
                    </div>
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1">
                      <Calendar size={11} />
                      <span>{p.date1}</span>
                    </div>
                  </div>

                  <div className="w-full pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-1.5">
                      <div className="text-[10px] text-slate-500 font-medium">{p.completed}/{p.total} tamamlandı</div>
                      <span className="text-sm font-bold text-slate-700">%{p.progress}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${p.progress}%` }} />
                    </div>
                    {!isSelectMode && (
                      <div className="flex gap-2">
                        <Link
                          href={`/panel/projeler/${p.id}`}
                          className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Detay
                        </Link>
                        <button
                          className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          İncele
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Modal */}
      <Dialog.Root open={modalConfig.isOpen} onOpenChange={(open) => !open && closeModal()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-xl rounded-xl">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${modalConfig.actionType === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">{modalConfig.title}</Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 mt-1.5">{modalConfig.description}</Dialog.Description>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={closeModal}
                className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={modalConfig.onConfirm}
                className={`flex-1 py-2 text-white text-xs font-bold rounded-lg transition-colors ${modalConfig.actionType === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {modalConfig.actionLabel}
              </button>
            </div>
            <Dialog.Close className="absolute right-3 top-3 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Kapat</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
