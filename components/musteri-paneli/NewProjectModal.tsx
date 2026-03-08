import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, User, Brain, Wrench, MessageCircle, LayoutTemplate, PenTool } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface TemplateStage {
  id: string;
  title: string;
  type: 'Kişilik' | 'Bilişsel Yetenekler' | 'Teknik Beceriler' | 'Sosyal Beceriler';
  duration: number;
}

export interface Template {
  id: string;
  title: string;
  icon: string;
  stages: TemplateStage[];
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Arayüz (UI) Tasarımcısı',
    icon: '🎨',
    stages: [
      { id: 's1', title: '5 Faktör Kişilik Envanteri', type: 'Kişilik', duration: 5 },
      { id: 's2', title: 'Figma', type: 'Teknik Beceriler', duration: 5 },
      { id: 's3', title: 'Görsel Tasarım', type: 'Teknik Beceriler', duration: 10 },
    ]
  },
  {
    id: '2',
    title: 'Ürün Tasarımcısı',
    icon: '🎨',
    stages: [
      { id: 's1', title: '5 Faktör Kişilik Envanteri', type: 'Kişilik', duration: 5 },
      { id: 's2', title: 'Uyumluluk', type: 'Bilişsel Yetenekler', duration: 5 },
      { id: 's3', title: 'Figma', type: 'Teknik Beceriler', duration: 5 },
      { id: 's4', title: 'Adobe After Effects', type: 'Teknik Beceriler', duration: 5 },
      { id: 's5', title: 'Neden tasarımcı olmak istiyorsunuz?', type: 'Sosyal Beceriler', duration: 5 },
    ]
  },
  {
    id: '3',
    title: 'Hizmet Tasarımcısı',
    icon: '🤝',
    stages: [
      { id: 's1', title: 'Empati ve İletişim', type: 'Sosyal Beceriler', duration: 10 },
      { id: 's2', title: 'Problem Çözme', type: 'Bilişsel Yetenekler', duration: 15 },
    ]
  },
  {
    id: '4',
    title: 'Pazarlama Asistanı',
    icon: '📱',
    stages: [
      { id: 's1', title: 'Sosyal Medya Yönetimi', type: 'Teknik Beceriler', duration: 10 },
      { id: 's2', title: 'Detay Odaklılık', type: 'Bilişsel Yetenekler', duration: 5 },
    ]
  },
  {
    id: '5',
    title: 'Satış Direktörü',
    icon: '💼',
    stages: [
      { id: 's1', title: 'Liderlik', type: 'Sosyal Beceriler', duration: 15 },
      { id: 's2', title: 'Stratejik Düşünme', type: 'Bilişsel Yetenekler', duration: 20 },
      { id: 's3', title: 'Satış Sunumu', type: 'Teknik Beceriler', duration: 10 },
    ]
  },
  {
    id: '6',
    title: 'Pazarlama Koordinatörü',
    icon: '📢',
    stages: [
      { id: 's1', title: 'Kampanya Planlama', type: 'Teknik Beceriler', duration: 15 },
      { id: 's2', title: 'Takım Çalışması', type: 'Sosyal Beceriler', duration: 10 },
    ]
  },
  {
    id: '7',
    title: 'Web Tasarımcısı',
    icon: '💻',
    stages: [
      { id: 's1', title: 'HTML/CSS Temelleri', type: 'Teknik Beceriler', duration: 15 },
      { id: 's2', title: 'UI/UX Prensipleri', type: 'Teknik Beceriler', duration: 10 },
    ]
  },
  {
    id: '8',
    title: 'Köpek Eğitmeni',
    icon: '🐕',
    stages: [
      { id: 's1', title: 'Hayvan Davranışları', type: 'Teknik Beceriler', duration: 15 },
      { id: 's2', title: 'Sabır ve Empati', type: 'Sosyal Beceriler', duration: 10 },
    ]
  },
  {
    id: '9',
    title: 'Hemşire Asistanı',
    icon: '⚕️',
    stages: [
      { id: 's1', title: 'Hasta Bakımı', type: 'Teknik Beceriler', duration: 20 },
      { id: 's2', title: 'Empati', type: 'Sosyal Beceriler', duration: 10 },
    ]
  },
  {
    id: '10',
    title: 'Tıbbi Asistan',
    icon: '🏥',
    stages: [
      { id: 's1', title: 'Tıbbi Terminoloji', type: 'Teknik Beceriler', duration: 15 },
      { id: 's2', title: 'Detay Odaklılık', type: 'Bilişsel Yetenekler', duration: 10 },
    ]
  }
];

const getTypeStyles = (type: TemplateStage['type']) => {
  switch (type) {
    case 'Kişilik':
      return { bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]', icon: <User size={14} className="mr-1.5" /> };
    case 'Bilişsel Yetenekler':
      return { bg: 'bg-[#F3E5F5]', text: 'text-[#6A1B9A]', icon: <Brain size={14} className="mr-1.5" /> };
    case 'Teknik Beceriler':
      return { bg: 'bg-[#E3F2FD]', text: 'text-[#1565C0]', icon: <Wrench size={14} className="mr-1.5" /> };
    case 'Sosyal Beceriler':
      return { bg: 'bg-[#E0F7FA]', text: 'text-[#00838F]', icon: <MessageCircle size={14} className="mr-1.5" /> };
  }
};

interface InitialSelectionProps {
  onClose: () => void;
  onSelectTemplates: () => void;
}

function InitialSelection({ onClose, onSelectTemplates }: InitialSelectionProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center mb-5 pb-5 border-b border-slate-200">
        <Dialog.Title className="text-xl font-bold text-slate-900">Yeni Proje Oluştur</Dialog.Title>
        <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors outline-none focus:ring-2 focus:ring-indigo-500">
          <X size={20} />
        </Dialog.Close>
      </div>
      
      <Dialog.Description className="text-[13px] text-slate-500 mb-6">
        Projenizi nasıl oluşturmak istersiniz? Hazır şablonlarımızdan birini seçebilir veya sıfırdan kendi projenizi tasarlayabilirsiniz.
      </Dialog.Description>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button 
          onClick={onSelectTemplates}
          className="flex flex-col items-start gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left group outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <LayoutTemplate size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">Şablon Seçimi</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">Önceden hazırlanmış, sektöre özel test ve envanter şablonlarıyla hızlıca başlayın.</p>
          </div>
        </button>

        <button 
          onClick={() => {
            onClose();
            // router.push('/panel/projeler/yeni'); // We can leave this as a placeholder or remove it for now since there's no actual page yet.
          }}
          className="flex flex-col items-start gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left group outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <PenTool size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">Özel Proje Oluştur</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">Tüm aşamaları, testleri ve değerlendirme kriterlerini kendiniz belirleyin.</p>
          </div>
        </button>
      </div>
    </>
  );
}

interface TemplateSelectionProps {
  templates: Template[];
  onClose: () => void;
}

function TemplateSelectionContent({ templates, onClose }: TemplateSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[1].id);

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white overflow-hidden">
      {/* Left Side: Templates Grid */}
      <div className="flex-1 flex flex-col h-1/2 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-slate-100">
        <div className="p-6 lg:p-8 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-[#1E1B4B] text-center mb-6">Tüm Şablonlar</h2>
          
          <div className="relative max-w-[700px] mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Şablon ara" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 bg-[#F8F9FA] border-none rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-[13px]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[700px] mx-auto">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;
              const totalDuration = template.stages.reduce((acc, stage) => acc + stage.duration, 0);
              
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all aspect-[4/3] overflow-hidden group outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isSelected 
                      ? 'border-indigo-600 shadow-[0_0_0_1.5px_rgba(79,70,229,1)] bg-white' 
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
                  
                  <h3 className={`text-center font-bold text-sm leading-snug relative z-10 ${isSelected ? 'text-indigo-600' : 'text-[#1E1B4B]'}`}>
                    {template.title}
                  </h3>
                  <p className={`text-xs font-medium mt-2 relative z-10 ${isSelected ? 'text-indigo-500' : 'text-slate-500'}`}>
                    {template.stages.length} Aşama • {totalDuration} dk
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side: Template Details */}
      <div className="w-full md:w-[400px] shrink-0 flex flex-col h-1/2 md:h-full bg-slate-50 relative">
        <Dialog.Close className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors z-10 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500">
          <X size={16} />
        </Dialog.Close>

        {selectedTemplate ? (
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 pb-28 flex flex-col">
            <div className="flex flex-col items-center text-center mb-8 mt-2">
              <div className="w-12 h-12 rounded-xl bg-[#E0F2F1] flex items-center justify-center text-2xl mb-4">
                {selectedTemplate.icon}
              </div>
              <h2 className="text-lg font-bold text-[#1E1B4B] mb-1.5">{selectedTemplate.title}</h2>
              <p className="text-slate-400 text-[13px] font-medium">Değerlendirme Önizlemesi</p>
            </div>

            <div className="flex flex-col gap-4">
              {selectedTemplate.stages.map((stage, index) => {
                const typeStyle = getTypeStyles(stage.type);
                return (
                  <div key={stage.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1E1B4B] text-[13px] leading-tight mb-2.5">{stage.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${typeStyle.bg} ${typeStyle.text}`}>
                          {typeStyle.icon}
                          {stage.type}
                        </span>
                        <span className="text-xs font-medium text-slate-500">{stage.duration} dk</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-[13px]">
            Detayları görmek için bir şablon seçin
          </div>
        )}

        {/* Fixed Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <button 
            onClick={() => onClose()}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[13px] transition-colors shadow-md"
          >
            Bu şablonu kullan
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [step, setStep] = useState<'initial' | 'templates'>('initial');

  React.useEffect(() => {
    if (isOpen) {
      setStep('initial');
    }
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content 
          className={`fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white shadow-2xl rounded-xl animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] overflow-hidden flex flex-col ${
            step === 'initial' ? 'w-[95vw] sm:w-full max-w-2xl p-6 sm:p-8' : 'w-[95vw] sm:w-full max-w-[1200px] h-[90vh] md:h-[85vh] p-0'
          }`}
        >
          <Dialog.Title className="sr-only">Yeni Proje Oluştur</Dialog.Title>
          <Dialog.Description className="sr-only">Projenizi nasıl oluşturmak istersiniz?</Dialog.Description>
          {step === 'initial' ? (
            <InitialSelection 
              onClose={onClose} 
              onSelectTemplates={() => setStep('templates')} 
            />
          ) : (
            <TemplateSelectionContent 
              templates={templates} 
              onClose={onClose} 
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
