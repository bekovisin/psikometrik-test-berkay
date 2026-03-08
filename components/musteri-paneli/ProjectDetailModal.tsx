'use client';

import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface ProjectDetailModalProps {
  selectedProject: any;
  onClose: () => void;
}

export function ProjectDetailModal({ selectedProject, onClose }: ProjectDetailModalProps) {
  return (
    <Dialog.Root open={!!selectedProject} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-5 border border-slate-200 bg-white p-6 shadow-xl sm:rounded-xl">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-bold text-slate-900">Aşama İlerleme Durumu</Dialog.Title>
            <Dialog.Description className="text-sm text-slate-500">
              {selectedProject?.title} projesi için detaylı aşama analizi.
            </Dialog.Description>
          </div>

          <div className="flex flex-col gap-6 py-4">
            <StageProgress
              num={1}
              title="OCEAN Kişilik Envanteri"
              badge="Envanter"
              badgeColor="bg-purple-100 text-purple-700"
              avg="64"
              time="29dk 28sn"
              completed={8}
              ongoing={1}
              waiting={7}
              total={16}
            />
            <StageProgress
              num={2}
              title="Çalışma Değerleri Envanteri"
              badge="Envanter"
              badgeColor="bg-purple-100 text-purple-700"
              avg="50"
              time="10sa 22dk"
              completed={6}
              ongoing={2}
              waiting={8}
              total={16}
            />
            <StageProgress
              num={3}
              title="Değerlendirme Merkezi"
              badge="Değerlendirme"
              badgeColor="bg-indigo-100 text-indigo-700"
              avg="15"
              time="41dk 57sn"
              completed={7}
              ongoing={0}
              waiting={9}
              total={16}
            />
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
            <X className="h-5 w-5" />
            <span className="sr-only">Kapat</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function StageProgress({ num, title, badge, badgeColor, avg, time, completed, ongoing, waiting, total }: any) {
  const completedPct = (completed / total) * 100;
  const ongoingPct = (ongoing / total) * 100;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
            {num}
          </div>
          <span className="text-sm font-medium text-slate-900 line-clamp-1">{title}</span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-medium shrink-0 ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-slate-500 shrink-0">
          <span>Ort: <strong className="text-slate-700">%{' '}{avg}</strong></span>
          <span>Süre: <strong className="text-slate-700">{time}</strong></span>
          <span className="font-medium text-slate-900">{completed}/{total}</span>
        </div>
      </div>

      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
        <div className="h-full bg-emerald-500" style={{ width: `${completedPct}%` }} />
        <div className="h-full bg-amber-400" style={{ width: `${ongoingPct}%` }} />
      </div>

      <div className="flex items-center gap-5 text-xs font-medium text-slate-400 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Tamamladı ({completed})
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Devam Ediyor ({ongoing})
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          Bekliyor ({waiting})
        </div>
      </div>
    </div>
  );
}
