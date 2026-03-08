'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import VisualContentRenderer from '@/components/admin/VisualContentRenderer';
import { VisualContent } from '@/lib/types';

// ── Constants ──
const CATEGORIES: Record<string, { label: string; modules: { id: string; label: string; options: number }[] }> = {
  'sayisal-yetenek': {
    label: 'Sayısal Yetenek',
    modules: [
      { id: 'sayisal-muhakeme', label: 'Sayısal Muhakeme', options: 5 },
      { id: 'sayisal-okuma-anlama', label: 'Sayısal Okuma Anlama', options: 5 },
      { id: 'sayisal-kritik-akil', label: 'Sayısal Kritik Akıl Yürütme', options: 5 },
      { id: 'sayisal-karsilastirma', label: 'Sayısal Karşılaştırma', options: 5 },
      { id: 'capp-sayisal', label: 'CAPP Sayısal', options: 5 },
      { id: 'tp-sayisal', label: 'TP Sayısal', options: 4 },
    ],
  },
  'sozel-yetenek': {
    label: 'Sözel Yetenek',
    modules: [
      { id: 'sozel-muhakeme', label: 'Sözel Muhakeme', options: 5 },
      { id: 'sozel-okuma-anlama', label: 'Sözel Okuma Anlama', options: 5 },
      { id: 'kiyaslar', label: 'Kıyaslar', options: 5 },
      { id: 'capp-sozel', label: 'CAPP Sözel', options: 5 },
      { id: 'tp-sozel', label: 'TP Sözel', options: 5 },
    ],
  },
  'mantiksal-akil-yurutme': {
    label: 'Mantıksal & Akıl Yürütme',
    modules: [
      { id: 'mantiksal', label: 'Mantıksal Akıl Yürütme', options: 5 },
      { id: 'tumevarimsal', label: 'Tümevarımsal', options: 5 },
      { id: 'tumdengelimsel', label: 'Tümdengelimsel', options: 5 },
      { id: 'diyagramatik', label: 'Diyagramatik', options: 5 },
    ],
  },
  'elestirel-dusunme': {
    label: 'Eleştirel Düşünme',
    modules: [
      { id: 'argumanlar', label: 'Argümanlar', options: 5 },
      { id: 'varsayimlar', label: 'Varsayımlar', options: 5 },
      { id: 'cikarimlar', label: 'Çıkarımlar', options: 5 },
      { id: 'cikarsamalar', label: 'Çıkarsamalar', options: 5 },
      { id: 'bilgi-yorumlama', label: 'Bilgi Yorumlama', options: 5 },
      { id: 'elestirel-tam-test', label: 'Tam Testler', options: 5 },
      { id: 'elestirel-kiyaslar', label: 'Kıyaslar (Eleştirel)', options: 5 },
    ],
  },
  'dikkat-hata-bulma': {
    label: 'Dikkat & Hata Bulma',
    modules: [{ id: 'hata-bulma', label: 'Hata Bulma', options: 5 }],
  },
  'mekanik-akil-yurutme': {
    label: 'Mekanik Akıl Yürütme',
    modules: [{ id: 'mekanik', label: 'Mekanik Testler', options: 5 }],
  },
  'durumsal-yargi': {
    label: 'Durumsal Yargı',
    modules: [{ id: 'sjt', label: 'Durumsal Yargı Testleri', options: 5 }],
  },
  'degerlendirme-merkezi': {
    label: 'Değerlendirme Merkezi',
    modules: [
      { id: 'in-tray', label: 'In-Tray', options: 5 },
      { id: 'e-tray', label: 'E-Tray', options: 5 },
      { id: 'vaka-analizi', label: 'Vaka Analizi', options: 5 },
      { id: 'sunum-egzersizi', label: 'Sunum Egzersizi', options: 5 },
      { id: 'grup-egzersizi', label: 'Grup Egzersizleri', options: 5 },
    ],
  },
};

const MODULE_PDF_MAP: Record<string, { folder: string; description: string }> = {
  'sayisal-muhakeme': { folder: '01-Sayısal Yetenek/Sayısal Muhakeme', description: '44 PDF — Sayısal muhakeme testleri' },
  'sayisal-okuma-anlama': { folder: '01-Sayısal Yetenek/Sayısal Okuma Anlama', description: '12 PDF — Sayısal okuma anlama' },
  'sayisal-kritik-akil': { folder: '01-Sayısal Yetenek/Sayısal Kritik Akıl Yürütme', description: '18 PDF — Sayısal kritik akıl yürütme' },
  'sayisal-karsilastirma': { folder: '01-Sayısal Yetenek/Sayısal Karşılaştırma', description: '4 PDF — Sayısal karşılaştırma' },
  'capp-sayisal': { folder: '01-Sayısal Yetenek/CAPP Sayısal', description: '10 PDF — CAPP Sayısal' },
  'tp-sayisal': { folder: '01-Sayısal Yetenek/TP Sayısal', description: '8 PDF — TP Sayısal' },
  'sozel-muhakeme': { folder: '02-Sözel Yetenek/Sözel Muhakeme', description: '28 PDF — Sözel muhakeme testleri' },
  'sozel-okuma-anlama': { folder: '02-Sözel Yetenek/Sözel Okuma Anlama', description: '24 PDF — Sözel okuma anlama' },
  'kiyaslar': { folder: '02-Sözel Yetenek/Kıyaslar', description: '8 PDF — Kıyaslar (syllogisms)' },
  'capp-sozel': { folder: '02-Sözel Yetenek/CAPP Sözel', description: '10 PDF — CAPP Sözel' },
  'tp-sozel': { folder: '02-Sözel Yetenek/TP Sözel', description: '8 PDF — TP Sözel' },
  'mantiksal': { folder: '03-Mantıksal ve Akıl Yürütme/Mantıksal Akıl Yürütme', description: '34 PDF — Mantıksal akıl yürütme' },
  'tumevarimsal': { folder: '03-Mantıksal ve Akıl Yürütme/Tümevarımsal', description: '28 PDF — Tümevarımsal testler' },
  'tumdengelimsel': { folder: '03-Mantıksal ve Akıl Yürütme/Tümdengelimsel', description: '10 PDF — Tümdengelimsel testler' },
  'diyagramatik': { folder: '03-Mantıksal ve Akıl Yürütme/Diyagramatik', description: '14 PDF — Diyagramatik testler' },
  'argumanlar': { folder: '04-Eleştirel Düşünme/Argümanlar', description: '12 PDF — Argümanlar' },
  'varsayimlar': { folder: '04-Eleştirel Düşünme/Varsayımlar', description: '12 PDF — Varsayımlar' },
  'cikarimlar': { folder: '04-Eleştirel Düşünme/Çıkarımlar', description: '12 PDF — Çıkarımlar' },
  'cikarsamalar': { folder: '04-Eleştirel Düşünme/Çıkarsamalar', description: '12 PDF — Çıkarsamalar' },
  'bilgi-yorumlama': { folder: '04-Eleştirel Düşünme/Bilgi Yorumlama', description: '12 PDF — Bilgi yorumlama' },
  'elestirel-tam-test': { folder: '04-Eleştirel Düşünme/Tam Testler', description: '60 PDF — Eleştirel düşünme tam testleri' },
  'elestirel-kiyaslar': { folder: '04-Eleştirel Düşünme/Kıyaslar', description: '8 PDF — Kıyaslar (Eleştirel)' },
  'hata-bulma': { folder: '05-Dikkat ve Hata Bulma/Hata Bulma', description: '12 PDF — Hata bulma testleri' },
  'mekanik': { folder: '06-Mekanik Akıl Yürütme/Mekanik Testler', description: '8 PDF — Mekanik akıl yürütme' },
  'sjt': { folder: '07-Durumsal Yargı/Durumsal Yargı Testleri', description: '12 PDF — Durumsal yargı testleri' },
  'in-tray': { folder: '08-Değerlendirme Merkezi/In-Tray', description: '6 PDF — In-Tray egzersizleri' },
  'e-tray': { folder: '08-Değerlendirme Merkezi/E-Tray', description: '6 PDF — E-Tray egzersizleri' },
  'vaka-analizi': { folder: '08-Değerlendirme Merkezi/Vaka Analizi', description: '4 PDF — Vaka analizi' },
  'sunum-egzersizi': { folder: '08-Değerlendirme Merkezi/Sunum Egzersizi', description: '2 PDF — Sunum egzersizi' },
  'grup-egzersizi': { folder: '08-Değerlendirme Merkezi/Grup Egzersizleri', description: '20 PDF — Grup egzersizleri' },
};

const PDF_BASE_PATH = '/Users/tamerbolat/Desktop/AC-soru bankası-v2';

const DIFFICULTIES = [
  { key: 'cok-kolay', label: 'Çok Kolay' },
  { key: 'kolay', label: 'Kolay' },
  { key: 'orta', label: 'Orta' },
  { key: 'zor', label: 'Zor' },
  { key: 'cok-zor', label: 'Çok Zor' },
];

const DIFF_COLORS: Record<string, string> = {
  'cok-kolay': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'kolay': 'bg-blue-100 text-blue-700 border-blue-200',
  'orta': 'bg-amber-100 text-amber-700 border-amber-200',
  'zor': 'bg-orange-100 text-orange-700 border-orange-200',
  'cok-zor': 'bg-red-100 text-red-700 border-red-200',
};
const DIFF_LABELS: Record<string, string> = {
  'cok-kolay': 'Çok Kolay', 'kolay': 'Kolay', 'orta': 'Orta', 'zor': 'Zor', 'cok-zor': 'Çok Zor',
};
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

// ── Types ──
type LogEntry = { time: string; text: string; type: 'info' | 'success' | 'error' | 'progress' };
type FolderEntry = { name: string; path: string; hasSubfolders: boolean; pdfCount: number };
type BrowseResult = { currentPath: string; parentPath: string | null; rootPath: string; folders: FolderEntry[]; pdfCount: number };

interface DraftQuestion {
  id: string;
  categoryId: string;
  subModuleId: string;
  difficulty: string;
  questionText: string;
  visualContent?: VisualContent;
  options: { label: string; text: string }[];
  correctAnswer: number;
  solution: string;
  tags: string[];
  _validation?: 'verified' | 'needs_review' | 'skipped';
  _validation_detail?: string;
}

interface TrashItem {
  question: DraftQuestion;
  action: 'saved' | 'rejected';
  timestamp: string;
}

// ── Validation badge ──
function ValidationBadge({ validation, detail }: { validation?: string; detail?: string }) {
  if (!validation || validation === 'skipped') return null;
  const isVerified = validation === 'verified';
  return (
    <span
      title={detail || ''}
      className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${
        isVerified
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
      }`}
    >
      {isVerified ? '✅' : '⚠️'}
      {isVerified ? 'Doğrulandı' : 'İncele'}
    </span>
  );
}

// ── Visual content type indicator ──
function VCIndicator({ vc }: { vc?: VisualContent }) {
  if (!vc?.type) return null;
  const icons: Record<string, string> = { text: '📝', table: '📊', svg: '📈', image: '🖼', video: '🎬' };
  return <span className="text-[11px] shrink-0" title={`Görsel: ${vc.type}`}>{icons[vc.type] || '📎'}</span>;
}


export default function SoruUreticiPage() {
  // ── Settings state ──
  const [selectedModule, setSelectedModule] = useState('');
  const [optionsCount, setOptionsCount] = useState(5);
  const [pdfPath, setPdfPath] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({
    'cok-kolay': 20, kolay: 20, orta: 20, zor: 20, 'cok-zor': 20,
  });

  // ── Generation state ──
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // ── Draft management ──
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'drafts' | 'trash'>('drafts');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [detailIdx, setDetailIdx] = useState(0);
  const [diffFilter, setDiffFilter] = useState('');
  const [validationFilter, setValidationFilter] = useState('');
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [saveError, setSaveError] = useState('');

  // ── Folder browser ──
  const [showBrowser, setShowBrowser] = useState(false);
  const [browseData, setBrowseData] = useState<BrowseResult | null>(null);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState('');

  // ── Computed ──
  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0);
  const filteredDrafts = questions.filter(q => {
    if (diffFilter && q.difficulty !== diffFilter) return false;
    if (validationFilter && q._validation !== validationFilter) return false;
    return true;
  });
  const verifiedCount = questions.filter(q => q._validation === 'verified').length;
  const reviewCount = questions.filter(q => q._validation === 'needs_review').length;
  const savedCount = trashItems.filter(t => t.action === 'saved').length;
  const rejectedCount = trashItems.filter(t => t.action === 'rejected').length;

  // ── Module change ──
  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId);
    for (const cat of Object.values(CATEGORIES)) {
      const mod = cat.modules.find(m => m.id === moduleId);
      if (mod) { setOptionsCount(mod.options); break; }
    }
    const mapping = MODULE_PDF_MAP[moduleId];
    if (mapping) setPdfPath(`${PDF_BASE_PATH}/${mapping.folder}`);
  };

  // ── Folder browser ──
  const browseTo = useCallback(async (folderPath?: string) => {
    setBrowseLoading(true);
    setBrowseError('');
    try {
      const url = folderPath ? `/api/browse-folders?path=${encodeURIComponent(folderPath)}` : '/api/browse-folders';
      const res = await fetch(url);
      if (!res.ok) { const err = await res.json(); setBrowseError(err.error || 'Klasör okunamadı'); return; }
      setBrowseData(await res.json());
    } catch { setBrowseError('Bağlantı hatası'); }
    finally { setBrowseLoading(false); }
  }, []);
  const openBrowser = () => { setShowBrowser(true); browseTo(pdfPath || undefined); };
  const selectFolder = (folderPath: string) => { setPdfPath(folderPath); setShowBrowser(false); };

  // ── Logging ──
  const addLog = useCallback((text: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('tr-TR');
    setLogs(prev => [...prev, { time, text, type }]);
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50);
  }, []);

  // ── Load drafts from output JSON ──
  const loadDrafts = useCallback(async (mod?: string) => {
    const m = mod || selectedModule;
    if (!m) return;
    setQuestionsLoading(true);
    try {
      const res = await fetch(`/api/preview-questions?module=${encodeURIComponent(m)}`);
      if (!res.ok) { setQuestionsLoading(false); return; }
      const data = await res.json();
      const qs: DraftQuestion[] = (data.questions || []).map((q: any) => ({
        id: q.id || '',
        categoryId: q.categoryId || '',
        subModuleId: q.subModuleId || '',
        difficulty: q.difficulty || '',
        questionText: q.questionText || '',
        visualContent: q.visualContent || undefined,
        options: q.options || [],
        correctAnswer: q.correctAnswer ?? 0,
        solution: q.solution || '',
        tags: q.tags || [],
        _validation: q._validation,
        _validation_detail: q._validation_detail,
      }));
      setQuestions(qs);
      setTrashItems([]);
      setSelectedIds(new Set());
      setActiveTab('drafts');
      setViewMode('list');
      setDetailIdx(0);
      setDiffFilter('');
      setValidationFilter('');
      setConsoleOpen(false);
    } catch { /* ignore */ }
    setQuestionsLoading(false);
  }, [selectedModule]);

  // Auto-load drafts when generation completes
  useEffect(() => {
    if (result && result.totalQuestions > 0 && !isGenerating) {
      loadDrafts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  // ── Generate questions ──
  const handleGenerate = async () => {
    if (!selectedModule) return;
    setIsGenerating(true);
    setLogs([]);
    setResult(null);
    setProgress(0);
    setConsoleOpen(true);
    setQuestions([]);
    setTrashItems([]);

    addLog(`Soru üretimi başlıyor: ${selectedModule}`, 'info');
    addLog(`Toplam ${totalQuestions} soru üretilecek`, 'info');

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: selectedModule, counts, optionsCount, pdfPath: pdfPath || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        addLog(`Hata: ${err.error || res.statusText}`, 'error');
        setIsGenerating(false);
        return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'log') {
                  addLog(data.text, data.level || 'info');
                } else if (data.type === 'progress') {
                  setProgress(data.value);
                } else if (data.type === 'complete') {
                  setResult(data.result);
                  addLog(`Tamamlandı! ${data.result.totalQuestions} soru üretildi.`, 'success');
                  setProgress(100);
                } else if (data.type === 'error') {
                  addLog(`Hata: ${data.text}`, 'error');
                }
              } catch { /* skip invalid JSON */ }
            }
          }
        }
      }
    } catch (err: any) {
      addLog(`Bağlantı hatası: ${err.message}`, 'error');
    }
    setIsGenerating(false);
  };

  // ── Save single question (DB) ──
  const handleSave = async (questionId: string) => {
    const q = questions.find(x => x.id === questionId);
    if (!q) return;
    setSavingIds(prev => { const s = new Set(Array.from(prev)); s.add(questionId); return s; });
    setSaveError('');
    try {
      const res = await fetch('/api/questions/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: [q] }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error || 'Kaydetme hatası');
        setSavingIds(prev => { const s = new Set(prev); s.delete(questionId); return s; });
        return;
      }
      setQuestions(prev => prev.filter(x => x.id !== questionId));
      setTrashItems(prev => [...prev, { question: q, action: 'saved', timestamp: new Date().toLocaleTimeString('tr-TR') }]);
      setSelectedIds(prev => { const s = new Set(prev); s.delete(questionId); return s; });
    } catch (err: any) {
      setSaveError(err.message || 'Bağlantı hatası');
    }
    setSavingIds(prev => { const s = new Set(prev); s.delete(questionId); return s; });
  };

  // ── Bulk save (DB) ──
  const handleBulkSave = async () => {
    const toSave = questions.filter(q => selectedIds.has(q.id));
    if (toSave.length === 0) return;
    const allIds = toSave.map(q => q.id);
    setSavingIds(new Set(allIds));
    setSaveError('');
    try {
      const res = await fetch('/api/questions/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: toSave }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error || 'Toplu kaydetme hatası');
        setSavingIds(new Set());
        return;
      }
      const now = new Date().toLocaleTimeString('tr-TR');
      setQuestions(prev => prev.filter(q => !allIds.includes(q.id)));
      setTrashItems(prev => [...prev, ...toSave.map(q => ({ question: q, action: 'saved' as const, timestamp: now }))]);
      setSelectedIds(new Set());
    } catch (err: any) {
      setSaveError(err.message || 'Bağlantı hatası');
    }
    setSavingIds(new Set());
  };

  // ── Reject single question ──
  const handleReject = (questionId: string) => {
    const q = questions.find(x => x.id === questionId);
    if (!q) return;
    setQuestions(prev => prev.filter(x => x.id !== questionId));
    setTrashItems(prev => [...prev, { question: q, action: 'rejected', timestamp: new Date().toLocaleTimeString('tr-TR') }]);
    setSelectedIds(prev => { const s = new Set(prev); s.delete(questionId); return s; });
  };

  // ── Restore from trash ──
  const handleRestore = async (idx: number) => {
    const item = trashItems[idx];
    if (!item) return;
    // If it was saved, try to remove from DB
    if (item.action === 'saved') {
      try {
        const res = await fetch('/api/questions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.question.id }),
        });
        if (!res.ok) {
          setSaveError('Geri getirme hatası — veritabanından silinemedi');
          return;
        }
      } catch { setSaveError('Bağlantı hatası'); return; }
    }
    setTrashItems(prev => prev.filter((_, i) => i !== idx));
    setQuestions(prev => [...prev, item.question]);
  };

  // ── Selection helpers ──
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };
  const selectAllFiltered = () => {
    const ids = filteredDrafts.map(q => q.id);
    setSelectedIds(prev => {
      const allSelected = ids.every(id => prev.has(id));
      if (allSelected) {
        const s = new Set(prev);
        ids.forEach(id => s.delete(id));
        return s;
      }
      const s = new Set(prev);
      ids.forEach(id => s.add(id));
      return s;
    });
  };
  const selectAllVerified = () => {
    const ids = questions.filter(q => q._validation === 'verified').map(q => q.id);
    setSelectedIds(new Set(ids));
  };

  const getModuleLabel = (id: string) => {
    for (const cat of Object.values(CATEGORIES)) {
      const mod = cat.modules.find(m => m.id === id);
      if (mod) return mod.label;
    }
    return id;
  };

  // ── Detail navigation (within filtered list) ──
  const currentDetailQuestion = filteredDrafts[detailIdx] || null;
  const goToDetail = (globalQ: DraftQuestion) => {
    const idx = filteredDrafts.indexOf(globalQ);
    setDetailIdx(idx >= 0 ? idx : 0);
    setViewMode('detail');
  };

  // ═══════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-7 h-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Otomatik Soru Üretici
        </h1>
        <p className="text-sm text-gray-500 mt-1">PDF kaynaklardan Claude API ile otomatik soru üretimi — Draft yönetimi ve doğrulama</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ════════════════════════════════════════════════ */}
        {/* SOL PANEL: AYARLAR                              */}
        {/* ════════════════════════════════════════════════ */}
        <div className="lg:col-span-1 space-y-4">
          {/* Modül Seçimi */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Modül Seçimi</h2>
            <select
              value={selectedModule}
              onChange={e => handleModuleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              disabled={isGenerating}
            >
              <option value="">Modül seçin...</option>
              {Object.entries(CATEGORIES).map(([catId, cat]) => (
                <optgroup key={catId} label={cat.label}>
                  {cat.modules.map(mod => (
                    <option key={mod.id} value={mod.id}>{mod.label} ({mod.options} şık)</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {selectedModule && MODULE_PDF_MAP[selectedModule] && (
              <div className="mt-2.5 p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-indigo-700">PDF Eşleştirmesi</p>
                    <p className="text-[10px] text-indigo-500 mt-0.5">{MODULE_PDF_MAP[selectedModule].description}</p>
                    <p className="text-[10px] text-indigo-400 font-mono mt-1 truncate" title={MODULE_PDF_MAP[selectedModule].folder}>📁 {MODULE_PDF_MAP[selectedModule].folder}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PDF Klasör Yolu */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">PDF Kaynak Klasörü</h2>
            <p className="text-xs text-gray-400 mb-2">Boş bırakılırsa Claude kendi içerik üretir</p>
            <div className="flex gap-2">
              <input type="text" value={pdfPath} onChange={e => setPdfPath(e.target.value)} placeholder="/Users/.../AC-soru bankası/" disabled={isGenerating}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-gray-300" />
              <button onClick={openBrowser} disabled={isGenerating}
                className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors shrink-0 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                Gözat
              </button>
            </div>
            {pdfPath && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-green-600 truncate">{pdfPath.split('/').slice(-2).join('/')}</span>
              </div>
            )}
          </div>

          {/* Klasör Gezgini */}
          {showBrowser && (
            <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-50 border-b border-indigo-100">
                <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  Klasör Seç
                </span>
                <button onClick={() => setShowBrowser(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {browseLoading ? (
                <div className="p-6 text-center"><p className="text-xs text-gray-400">Yükleniyor...</p></div>
              ) : browseError ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-red-500">{browseError}</p>
                  <button onClick={() => browseTo()} className="mt-2 text-xs text-indigo-600 hover:underline">Ana klasöre dön</button>
                </div>
              ) : browseData ? (
                <div>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-[10px] text-gray-400 font-mono truncate">{browseData.currentPath}</p>
                    {browseData.pdfCount > 0 && <p className="text-[10px] text-amber-600 font-medium mt-0.5">{browseData.pdfCount} PDF</p>}
                  </div>
                  <div className="flex gap-1 px-3 py-2 border-b border-gray-100">
                    {browseData.parentPath && (
                      <button onClick={() => browseTo(browseData.parentPath!)} className="px-2 py-1 text-[11px] bg-gray-100 text-gray-600 rounded hover:bg-gray-200 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>Üst
                      </button>
                    )}
                    {browseData.pdfCount > 0 && (
                      <button onClick={() => selectFolder(browseData.currentPath)} className="ml-auto px-2.5 py-1 text-[11px] bg-green-500 text-white rounded font-medium hover:bg-green-600">Seç</button>
                    )}
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                    {browseData.folders.map(folder => (
                      <div key={folder.path} onClick={() => folder.hasSubfolders ? browseTo(folder.path) : selectFolder(folder.path)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 cursor-pointer group">
                        <svg className="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" /></svg>
                        <span className="text-xs text-gray-700 truncate flex-1">{folder.name}</span>
                        {folder.pdfCount > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{folder.pdfCount} PDF</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Seçenek Sayısı */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Seçenek Sayısı</h2>
            <div className="flex gap-2">
              {[4, 5].map(n => (
                <button key={n} onClick={() => setOptionsCount(n)} disabled={isGenerating}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    optionsCount === n ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  {n} Şık
                </button>
              ))}
            </div>
          </div>

          {/* Zorluk Seviyesi Ayarları */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Zorluk Başına Soru Sayısı</h2>
            <div className="space-y-2">
              {DIFFICULTIES.map(d => (
                <div key={d.key} className="flex items-center justify-between gap-3">
                  <label className="text-sm text-gray-600 w-24">{d.label}</label>
                  <input type="number" min={0} max={200} value={counts[d.key]}
                    onChange={e => setCounts(prev => ({ ...prev, [d.key]: parseInt(e.target.value) || 0 }))}
                    disabled={isGenerating}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-amber-500" />
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Toplam</span>
                <span className="text-sm font-bold text-amber-600">{totalQuestions} soru</span>
              </div>
            </div>
          </div>

          {/* Hızlı Ayarlar */}
          <div className="flex gap-2">
            <button onClick={() => setCounts({ 'cok-kolay': 20, kolay: 20, orta: 20, zor: 20, 'cok-zor': 20 })} disabled={isGenerating} className="flex-1 py-1.5 px-2 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">100 Soru</button>
            <button onClick={() => setCounts({ 'cok-kolay': 100, kolay: 100, orta: 100, zor: 100, 'cok-zor': 100 })} disabled={isGenerating} className="flex-1 py-1.5 px-2 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">500 Soru</button>
            <button onClick={() => setCounts({ 'cok-kolay': 0, kolay: 0, orta: 0, zor: 0, 'cok-zor': 0 })} disabled={isGenerating} className="flex-1 py-1.5 px-2 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Temizle</button>
          </div>

          {/* Üret Butonu */}
          <button onClick={handleGenerate} disabled={isGenerating || !selectedModule || totalQuestions === 0}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isGenerating ? 'bg-amber-100 text-amber-600 cursor-wait'
                : !selectedModule || totalQuestions === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200'
            }`}>
            {isGenerating ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Üretiliyor...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {totalQuestions} Soru Üret
              </>
            )}
          </button>

          {/* Mevcut Soruları Yükle */}
          {selectedModule && !isGenerating && (
            <button onClick={() => loadDrafts()} disabled={questionsLoading}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
              {questionsLoading ? 'Yükleniyor...' : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Üretilmiş Soruları Yükle
                </>
              )}
            </button>
          )}

          {/* Draft İstatistikleri */}
          {(questions.length > 0 || trashItems.length > 0) && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <h3 className="text-xs font-semibold text-gray-500 mb-2">Durum Özeti</h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-amber-50 rounded-lg p-2">
                  <p className="text-amber-800 font-bold text-lg">{questions.length}</p>
                  <p className="text-amber-600 text-[10px]">Taslak</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-green-800 font-bold text-lg">{verifiedCount}</p>
                  <p className="text-green-600 text-[10px]">Doğrulanmış</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-blue-800 font-bold text-lg">{savedCount}</p>
                  <p className="text-blue-600 text-[10px]">Kaydedildi</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2">
                  <p className="text-red-800 font-bold text-lg">{rejectedCount}</p>
                  <p className="text-red-600 text-[10px]">Reddedildi</p>
                </div>
              </div>
            </div>
          )}

          {/* Dosya Bilgisi */}
          {selectedModule && (
            <div className="text-[10px] text-gray-400 space-y-0.5 px-1">
              <p>📁 Çıktı: <span className="font-mono">tools/question-generator/output/seed-{selectedModule}.ts</span></p>
              <p>🏠 Hedef: <span className="font-mono">data/questions/seed-{selectedModule}.ts</span></p>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════ */}
        {/* SAĞ PANEL: KONSOL + DRAFT YÖNETİMİ             */}
        {/* ════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-4">

          {/* Progress Bar */}
          {isGenerating && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>İlerleme</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Konsol (collapsible) */}
          <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <button onClick={() => setConsoleOpen(!consoleOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 hover:bg-gray-750 transition-colors">
              <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                <svg className={`w-3 h-3 transition-transform ${consoleOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                Konsol Çıktısı
              </span>
              <span className="text-xs text-gray-500">{logs.length} satır</span>
            </button>
            {consoleOpen && (
              <div ref={logRef} className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <p className="text-gray-500">Modül seçip &quot;Üret&quot; butonuna basın...</p>
                ) : logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-500 shrink-0">{log.time}</span>
                    <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : log.type === 'progress' ? 'text-amber-400' : 'text-gray-300'}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Error Toast */}
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-red-700">❌ {saveError}</span>
              <button onClick={() => setSaveError('')} className="text-red-400 hover:text-red-600 text-xs">✕</button>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* DRAFT YÖNETİM PANELİ                       */}
          {/* ═══════════════════════════════════════════ */}
          {(questions.length > 0 || trashItems.length > 0) && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

              {/* Tab Bar + Stats */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <button onClick={() => { setActiveTab('drafts'); setViewMode('list'); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === 'drafts' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}>
                    📋 Taslaklar ({questions.length})
                  </button>
                  <button onClick={() => { setActiveTab('trash'); setViewMode('list'); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === 'trash' ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}>
                    🗑️ Çöp Kutusu ({trashItems.length})
                  </button>
                </div>
                {activeTab === 'drafts' && questions.length > 0 && (
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    {verifiedCount > 0 && <span className="text-green-600">✅ {verifiedCount}</span>}
                    {reviewCount > 0 && <span className="text-yellow-600">⚠️ {reviewCount}</span>}
                  </div>
                )}
              </div>

              {/* ─── TASLAKLAR TAB ─── */}
              {activeTab === 'drafts' && (
                <>
                  {/* Filter bar */}
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto">
                    <span className="text-[10px] text-gray-400 shrink-0">Zorluk:</span>
                    {[{ key: '', label: 'Tümü' }, ...Object.entries(DIFF_LABELS).map(([k, v]) => ({ key: k, label: v }))].map(d => {
                      const cnt = d.key ? questions.filter(q => q.difficulty === d.key).length : questions.length;
                      return (
                        <button key={d.key || 'all'} onClick={() => { setDiffFilter(d.key); setDetailIdx(0); }}
                          className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors ${
                            diffFilter === d.key ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}>
                          {d.label} ({cnt})
                        </button>
                      );
                    })}
                    <span className="text-gray-200 mx-1">|</span>
                    <span className="text-[10px] text-gray-400 shrink-0">Durum:</span>
                    {[
                      { key: '', label: 'Tümü' },
                      { key: 'verified', label: '✅ Doğrulanmış' },
                      { key: 'needs_review', label: '⚠️ İncele' },
                    ].map(v => (
                      <button key={v.key || 'all-v'} onClick={() => { setValidationFilter(v.key); setDetailIdx(0); }}
                        className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors ${
                          validationFilter === v.key ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}>
                        {v.label}
                      </button>
                    ))}
                  </div>

                  {/* Bulk actions */}
                  {questions.length > 0 && viewMode === 'list' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100">
                      <button onClick={selectAllFiltered} className="text-[10px] text-indigo-600 hover:underline font-medium">
                        {filteredDrafts.every(q => selectedIds.has(q.id)) && filteredDrafts.length > 0 ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                      </button>
                      <button onClick={selectAllVerified} className="text-[10px] text-green-600 hover:underline font-medium">Doğrulanmışları Seç</button>
                      <div className="flex-1" />
                      {selectedIds.size > 0 && (
                        <button onClick={handleBulkSave} disabled={savingIds.size > 0}
                          className="px-3 py-1 text-[11px] bg-green-500 text-white rounded-md font-medium hover:bg-green-600 disabled:opacity-50 flex items-center gap-1">
                          {savingIds.size > 0 ? (
                            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          ) : (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                          Seçilenleri Kaydet ({selectedIds.size})
                        </button>
                      )}
                    </div>
                  )}

                  {/* LIST VIEW */}
                  {viewMode === 'list' && (
                    <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50">
                      {filteredDrafts.map((q) => {
                        const correctLetter = OPTION_LETTERS[q.correctAnswer] || '?';
                        const isSaving = savingIds.has(q.id);
                        return (
                          <div key={q.id} className="flex items-center gap-2 px-4 py-2.5 hover:bg-indigo-50/50 group transition-colors">
                            {/* Checkbox */}
                            <input type="checkbox" checked={selectedIds.has(q.id)} onChange={() => toggleSelect(q.id)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 focus:ring-amber-400 shrink-0" />
                            {/* Sıra */}
                            <span className="text-[11px] font-mono text-gray-300 w-6 text-right shrink-0">{questions.indexOf(q) + 1}</span>
                            {/* Validation */}
                            <ValidationBadge validation={q._validation} detail={q._validation_detail} />
                            {/* Difficulty */}
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 w-16 text-center ${DIFF_COLORS[q.difficulty] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              {DIFF_LABELS[q.difficulty] || q.difficulty}
                            </span>
                            {/* Question text */}
                            <span onClick={() => goToDetail(q)} className="text-xs text-gray-600 group-hover:text-indigo-700 truncate flex-1 min-w-0 cursor-pointer">
                              {q.questionText?.slice(0, 80)}{(q.questionText?.length || 0) > 80 ? '...' : ''}
                            </span>
                            {/* VC indicator */}
                            <VCIndicator vc={q.visualContent} />
                            {/* Correct answer */}
                            <span className="shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center justify-center">{correctLetter}</span>
                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleSave(q.id)} disabled={isSaving}
                                className="px-2 py-0.5 text-[10px] bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 disabled:opacity-50" title="Kaydet">
                                {isSaving ? '...' : '✓ Kaydet'}
                              </button>
                              <button onClick={() => handleReject(q.id)}
                                className="px-2 py-0.5 text-[10px] bg-red-50 text-red-500 border border-red-200 rounded hover:bg-red-100" title="Reddet">
                                ✕
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {filteredDrafts.length === 0 && (
                        <p className="p-6 text-center text-xs text-gray-400">Bu filtrede soru bulunamadı</p>
                      )}
                    </div>
                  )}

                  {/* DETAIL VIEW */}
                  {viewMode === 'detail' && currentDetailQuestion && (() => {
                    const q = currentDetailQuestion;
                    const isSaving = savingIds.has(q.id);
                    return (
                      <div className="p-4 space-y-4 max-h-[700px] overflow-y-auto">
                        {/* Top nav */}
                        <div className="flex items-center justify-between">
                          <button onClick={() => setViewMode('list')} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            Listeye Dön
                          </button>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setDetailIdx(Math.max(0, detailIdx - 1))} disabled={detailIdx === 0}
                              className="p-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <span className="text-[11px] text-gray-400 font-medium">{detailIdx + 1}/{filteredDrafts.length}</span>
                            <button onClick={() => setDetailIdx(Math.min(filteredDrafts.length - 1, detailIdx + 1))} disabled={detailIdx === filteredDrafts.length - 1}
                              className="p-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                          </div>
                        </div>

                        {/* ID, Difficulty, Validation, Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{q.id}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${DIFF_COLORS[q.difficulty] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {DIFF_LABELS[q.difficulty] || q.difficulty}
                          </span>
                          <ValidationBadge validation={q._validation} detail={q._validation_detail} />
                          {q.tags?.map((tag: string) => (
                            <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>

                        {/* Validation Detail */}
                        {q._validation === 'needs_review' && q._validation_detail && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs font-medium text-yellow-800 mb-1">⚠️ İnceleme Gerekli</p>
                            <p className="text-[11px] text-yellow-700">{q._validation_detail}</p>
                          </div>
                        )}

                        {/* Visual Content */}
                        {q.visualContent?.type && (
                          <VisualContentRenderer content={q.visualContent as VisualContent} />
                        )}

                        {/* Question Text */}
                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          {(q.options || []).map((opt, i) => {
                            const isCorrect = i === q.correctAnswer;
                            const letter = opt.label || OPTION_LETTERS[i] || `${i + 1}`;
                            return (
                              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-300 ring-1 ring-green-200' : 'bg-white border-gray-200'}`}>
                                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{letter}</span>
                                <span className={`text-sm pt-0.5 ${isCorrect ? 'text-green-800 font-medium' : 'text-gray-700'}`}>{opt.text}</span>
                                {isCorrect && <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Solution */}
                        {q.solution && (
                          <details className="group">
                            <summary className="text-xs font-medium text-indigo-600 cursor-pointer hover:text-indigo-800 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                              Çözüm Açıklaması
                            </summary>
                            <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                              <p className="text-xs text-indigo-800 leading-relaxed whitespace-pre-wrap">{q.solution}</p>
                            </div>
                          </details>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                          <button onClick={() => handleSave(q.id)} disabled={isSaving}
                            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSaving ? (
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                            )}
                            Onayla & Kaydet
                          </button>
                          <button onClick={() => handleReject(q.id)}
                            className="py-2 px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            Reddet
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              {/* ─── ÇÖP KUTUSU TAB ─── */}
              {activeTab === 'trash' && (
                <div className="max-h-[600px] overflow-y-auto">
                  {trashItems.length === 0 ? (
                    <p className="p-8 text-center text-xs text-gray-400">Çöp kutusu boş</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {trashItems.map((item, idx) => {
                        const q = item.question;
                        const isSaved = item.action === 'saved';
                        return (
                          <div key={`${q.id}-${idx}`} className="flex items-center gap-2 px-4 py-2.5 group hover:bg-gray-50 transition-colors">
                            {/* Status badge */}
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${
                              isSaved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                              {isSaved ? '✅ Kaydedildi' : '🔴 Reddedildi'}
                            </span>
                            {/* Difficulty */}
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${DIFF_COLORS[q.difficulty] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              {DIFF_LABELS[q.difficulty] || q.difficulty}
                            </span>
                            {/* Question text */}
                            <span className="text-xs text-gray-500 truncate flex-1 min-w-0">
                              {q.questionText?.slice(0, 70)}{(q.questionText?.length || 0) > 70 ? '...' : ''}
                            </span>
                            {/* Timestamp */}
                            <span className="text-[10px] text-gray-300 shrink-0">{item.timestamp}</span>
                            {/* Restore */}
                            <button onClick={() => handleRestore(idx)}
                              className="px-2 py-0.5 text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              ↩ Geri Getir
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Empty state — no questions loaded */}
          {questions.length === 0 && trashItems.length === 0 && !isGenerating && logs.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm text-gray-500 font-medium">Henüz soru üretilmedi</p>
              <p className="text-xs text-gray-400 mt-1">Sol panelden modül seçip &quot;Üret&quot; butonuna basın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
