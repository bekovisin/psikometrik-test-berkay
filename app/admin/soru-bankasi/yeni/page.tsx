'use client';

import { useState, useEffect, DragEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addQuestion } from '@/lib/store';
import {
  Question, Difficulty, ALL_DIFFICULTIES, DIFFICULTY_LABELS, DIFFICULTY_COLORS,
  SvgPosition, SvgAlign, TextVerticalAlign, VisualContent,
  QuestionType, QUESTION_TYPE_LABELS, QUESTION_TYPE_GROUPS, QUESTION_TYPE_ICONS, OPTION_BASED_TYPES,
  QuestionOption, ValidationRules, MatrixRow,
} from '@/lib/types';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import SvgUploader from '@/components/admin/SvgUploader';
import VisualContentEditor from '@/components/admin/VisualContentEditor';
import VisualContentRenderer from '@/components/admin/VisualContentRenderer';
import { renderMath } from '@/lib/math';
import { getEmbedUrl } from '@/lib/utils';

const getOptionLabel = (i: number) => String.fromCharCode(65 + i);
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;
const ALIGN_CLASS: Record<SvgAlign, string> = { center: 'text-center', left: 'text-left', right: 'text-right' };
const VALIGN_CLASS: Record<TextVerticalAlign, string> = { top: 'items-start', center: 'items-center', bottom: 'items-end' };
const DEFAULTS = {
  svgPosition: 'top' as SvgPosition, svgAlign: 'center' as SvgAlign, textVerticalAlign: 'top' as TextVerticalAlign,
  layoutRatio: 50, svgMaxHeight: 300, optionSvgMaxHeight: 48, bgColor: '',
};
const needsOptions = (t: QuestionType) => OPTION_BASED_TYPES.includes(t) && t !== 'matching';
/** SVG'den width/height attr. kaldırır, sadece viewBox kalır → CSS height'tan width otomatik hesaplanır */
const responsiveSvg = (s: string) => s.includes('viewBox') ? s.replace(/(<svg[^>]*?)\s+width="[^"]*"/i, '$1').replace(/(<svg[^>]*?)\s+height="[^"]*"/i, '$1') : s;

const TYPE_SIDEBAR_COLORS: Record<string, string> = {
  single: 'text-blue-600', multiple: 'text-violet-600', dropdown: 'text-cyan-600', image_choice: 'text-pink-600',
  short_text: 'text-gray-600', long_text: 'text-gray-600',
  scale: 'text-amber-600', star: 'text-yellow-600', nps: 'text-emerald-600', slider: 'text-orange-600',
  ranking: 'text-indigo-600', matching: 'text-teal-600', maxdiff: 'text-rose-600',
  matrix: 'text-purple-600', file_upload: 'text-slate-600', date: 'text-sky-600', time: 'text-sky-600',
};

function NewQuestionEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || undefined;
  const defaultSubModule = searchParams.get('submodule') || undefined;

  // ── State (same as QuestionForm) ──
  const [categoryId, setCategoryId] = useState(defaultCategory || '');
  const [subModuleId, setSubModuleId] = useState(defaultSubModule || '');
  const [difficulty, setDifficulty] = useState<Difficulty>('orta');
  const [questionType, setQuestionType] = useState<QuestionType>('single');
  const [questionText, setQuestionText] = useState('');
  const [svg, setSvg] = useState('');
  const [image, setImage] = useState('');
  const [visualMode, setVisualMode] = useState<'svg' | 'image' | 'video'>('svg');
  const [svgMaxHeight, setSvgMaxHeight] = useState(DEFAULTS.svgMaxHeight);
  const [optionSvgMaxHeight, setOptionSvgMaxHeight] = useState(DEFAULTS.optionSvgMaxHeight);
  const [bgColor, setBgColor] = useState(DEFAULTS.bgColor);
  const [svgPosition, setSvgPosition] = useState<SvgPosition>(DEFAULTS.svgPosition);
  const [svgAlign, setSvgAlign] = useState<SvgAlign>(DEFAULTS.svgAlign);
  const [textVerticalAlign, setTextVerticalAlign] = useState<TextVerticalAlign>(DEFAULTS.textVerticalAlign);
  const [layoutRatio, setLayoutRatio] = useState(DEFAULTS.layoutRatio);
  const [options, setOptions] = useState<QuestionOption[]>(
    Array.from({ length: 5 }, (_, i) => ({ label: getOptionLabel(i), text: '' }))
  );
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([0]);
  const [randomizeOptions, setRandomizeOptions] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [matchingPairs, setMatchingPairs] = useState<{ left: string; right: string }[]>([{ left: '', right: '' }, { left: '', right: '' }]);
  const [maxdiffBest, setMaxdiffBest] = useState<number>(-1);
  const [maxdiffWorst, setMaxdiffWorst] = useState<number>(-1);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [scaleMin, setScaleMin] = useState(1);
  const [scaleMax, setScaleMax] = useState(5);
  const [scaleMinLabel, setScaleMinLabel] = useState('');
  const [scaleMaxLabel, setScaleMaxLabel] = useState('');
  const [scaleStep, setScaleStep] = useState(1);
  const [matrixRows, setMatrixRows] = useState<MatrixRow[]>([{ id: 'r1', text: '' }, { id: 'r2', text: '' }]);
  const [matrixColumns, setMatrixColumns] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [matrixType, setMatrixType] = useState<'radio' | 'checkbox'>('radio');
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(['.pdf', '.docx', '.jpg', '.png']);
  const [maxFileSize, setMaxFileSize] = useState(10);
  const [video, setVideo] = useState('');
  const [required, setRequired] = useState(true);
  const [helpText, setHelpText] = useState('');
  const [hint, setHint] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [validation, setValidation] = useState<ValidationRules>({});
  const [solution, setSolution] = useState('');
  const [tags, setTags] = useState('');
  const [showOptionSvg, setShowOptionSvg] = useState<Record<number, boolean>>({});
  const [optionSvgPreview, setOptionSvgPreview] = useState<Record<number, boolean>>({});
  const [error, setError] = useState('');
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [visualContent, setVisualContent] = useState<VisualContent | undefined>(undefined);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'phone'>('desktop');
  // Preview interactivity states
  const [previewSelected, setPreviewSelected] = useState<number[]>([]);
  const [previewScaleVal, setPreviewScaleVal] = useState<number | null>(null);
  const [previewStarVal, setPreviewStarVal] = useState<number | null>(null);
  const [previewNpsVal, setPreviewNpsVal] = useState<number | null>(null);
  const [previewMatrixSel, setPreviewMatrixSel] = useState<Record<string, number[]>>({});
  // Responsive: right panel toggle on smaller screens
  const [showRightPanel, setShowRightPanel] = useState(false);

  const filteredSubModules = subModules.filter(s => s.categoryId === categoryId);
  const videoEmbed = getEmbedUrl(video);

  useEffect(() => {
    if (categoryId && !filteredSubModules.find(s => s.id === subModuleId)) {
      setSubModuleId(filteredSubModules[0]?.id || '');
    }
  }, [categoryId]);

  // ── Handlers ──
  const updateOption = (idx: number, field: keyof QuestionOption, value: any) => {
    const next = [...options]; next[idx] = { ...next[idx], [field]: value }; setOptions(next);
  };
  const addOption = () => { if (options.length >= MAX_OPTIONS) return; setOptions([...options, { label: getOptionLabel(options.length), text: '' }]); };
  const removeOption = (idx: number) => {
    if (options.length <= MIN_OPTIONS) return;
    setOptions(options.filter((_, i) => i !== idx));
    setCorrectAnswers(prev => prev.map(ca => ca > idx ? ca - 1 : ca).filter(ca => ca !== idx));
  };
  const bulkAddOptions = () => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const toAdd = lines.slice(0, MAX_OPTIONS - options.length);
    setOptions([...options, ...toAdd.map((text, i) => ({ label: getOptionLabel(options.length + i), text }))]);
    setBulkText(''); setShowBulkAdd(false);
  };
  const handleDragStart = (idx: number) => { setDragIdx(idx); };
  const handleDragOver = (e: DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };
  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) { handleDragEnd(); return; }
    const next = [...options]; const [moved] = next.splice(dragIdx, 1); next.splice(targetIdx, 0, moved);
    const origOrder = options.map((_, i) => i); origOrder.splice(dragIdx, 1); origOrder.splice(targetIdx, 0, dragIdx);
    const mapping = new Map<number, number>(); origOrder.forEach((orig, newI) => mapping.set(orig, newI));
    setOptions(next); setCorrectAnswers(prev => prev.map(ca => mapping.get(ca) ?? ca)); handleDragEnd();
  };
  const addPair = () => setMatchingPairs([...matchingPairs, { left: '', right: '' }]);
  const removePair = (idx: number) => { if (matchingPairs.length <= 2) return; setMatchingPairs(matchingPairs.filter((_, i) => i !== idx)); };
  const updatePair = (idx: number, side: 'left' | 'right', val: string) => { const next = [...matchingPairs]; next[idx] = { ...next[idx], [side]: val }; setMatchingPairs(next); };
  const addMatrixRow = () => setMatrixRows([...matrixRows, { id: `r${Date.now()}`, text: '' }]);
  const removeMatrixRow = (idx: number) => { if (matrixRows.length <= 1) return; setMatrixRows(matrixRows.filter((_, i) => i !== idx)); };
  const addMatrixCol = () => setMatrixColumns([...matrixColumns, '']);
  const removeMatrixCol = (idx: number) => { if (matrixColumns.length <= 2) return; setMatrixColumns(matrixColumns.filter((_, i) => i !== idx)); };
  const resetStyles = () => { setSvgPosition(DEFAULTS.svgPosition); setSvgAlign(DEFAULTS.svgAlign); setTextVerticalAlign(DEFAULTS.textVerticalAlign); setLayoutRatio(DEFAULTS.layoutRatio); setSvgMaxHeight(DEFAULTS.svgMaxHeight); setOptionSvgMaxHeight(DEFAULTS.optionSvgMaxHeight); setBgColor(DEFAULTS.bgColor); };
  const isStyleDirty = svgPosition !== DEFAULTS.svgPosition || svgAlign !== DEFAULTS.svgAlign || textVerticalAlign !== DEFAULTS.textVerticalAlign || layoutRatio !== DEFAULTS.layoutRatio || svgMaxHeight !== DEFAULTS.svgMaxHeight || optionSvgMaxHeight !== DEFAULTS.optionSvgMaxHeight || bgColor !== DEFAULTS.bgColor;
  const stripHtml = (html: string) => { if (typeof document === 'undefined') return html; const tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ''; };
  const toggleCorrectAnswer = (idx: number) => { if (questionType === 'multiple') { setCorrectAnswers(prev => prev.includes(idx) ? prev.filter(a => a !== idx) : [...prev, idx]); } else { setCorrectAnswers([idx]); } };

  const handleSave = async () => {
    setError('');
    if (!categoryId || !subModuleId) { setError('Kategori ve alt modül seçin'); return; }
    if (!questionText && !stripHtml(questionText)) { setError('Soru metni gerekli'); return; }
    if (needsOptions(questionType) && options.some(o => !o.text && !stripHtml(o.text || '') && !o.svg && !o.image)) { setError('Her seçenekte metin, SVG veya görsel olmalı'); return; }

    const data: any = {
      categoryId, subModuleId, difficulty, questionType, questionText,
      svg: (visualMode === 'svg' && svg) ? svg : undefined,
      image: (visualMode === 'image' && image) ? image : undefined,
      svgMaxHeight: svgMaxHeight !== DEFAULTS.svgMaxHeight ? svgMaxHeight : undefined,
      optionSvgMaxHeight: optionSvgMaxHeight !== DEFAULTS.optionSvgMaxHeight ? optionSvgMaxHeight : undefined,
      bgColor: bgColor || undefined,
      svgPosition: svgPosition !== DEFAULTS.svgPosition ? svgPosition : undefined,
      svgAlign: svgAlign !== DEFAULTS.svgAlign ? svgAlign : undefined,
      textVerticalAlign: textVerticalAlign !== DEFAULTS.textVerticalAlign ? textVerticalAlign : undefined,
      layoutRatio: layoutRatio !== DEFAULTS.layoutRatio ? layoutRatio : undefined,
      visualContent: visualContent || undefined,
      solution, tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      correctAnswer: correctAnswers[0] ?? 0, correctAnswers,
      randomizeOptions: randomizeOptions || undefined, video: video || undefined,
      required: required === false ? false : undefined, helpText: helpText || undefined,
      hint: hint || undefined, placeholder: placeholder || undefined,
      timeLimit: timeLimit > 0 ? timeLimit : undefined,
    };
    const hasValidation = validation.minLength || validation.maxLength || validation.pattern || validation.minValue !== undefined || validation.maxValue !== undefined;
    if (hasValidation) data.validation = validation;
    if (needsOptions(questionType) || questionType === 'image_choice') {
      data.options = options.map((o, i) => ({ label: getOptionLabel(i), text: o.text, svg: o.svg || undefined, image: o.image || undefined, pinned: o.pinned || undefined, score: o.score !== undefined ? o.score : undefined, feedback: o.feedback || undefined }));
    } else { data.options = []; }
    if (questionType === 'matching') data.matchingPairs = matchingPairs;
    if (questionType === 'maxdiff') { data.maxdiffBest = maxdiffBest >= 0 ? maxdiffBest : undefined; data.maxdiffWorst = maxdiffWorst >= 0 ? maxdiffWorst : undefined; }
    if (questionType === 'ranking') data.correctOrder = correctOrder.length > 0 ? correctOrder : undefined;
    if (questionType === 'scale' || questionType === 'slider') { data.scaleMin = scaleMin; data.scaleMax = scaleMax; data.scaleMinLabel = scaleMinLabel || undefined; data.scaleMaxLabel = scaleMaxLabel || undefined; if (questionType === 'slider') data.scaleStep = scaleStep; }
    if (questionType === 'star') { data.scaleMax = scaleMax; data.scaleMinLabel = scaleMinLabel || undefined; data.scaleMaxLabel = scaleMaxLabel || undefined; }
    if (questionType === 'nps') { data.scaleMin = 0; data.scaleMax = 10; data.scaleMinLabel = scaleMinLabel || 'Hiç olası değil'; data.scaleMaxLabel = scaleMaxLabel || 'Kesinlikle olası'; }
    if (questionType === 'matrix') { data.matrixRows = matrixRows; data.matrixColumns = matrixColumns; data.matrixType = matrixType; }
    if (questionType === 'file_upload') { data.allowedFileTypes = allowedFileTypes; data.maxFileSize = maxFileSize; }

    await addQuestion(data);
    router.back();
  };

  // ═══════════════════════════════════════
  // RENDER — 3 Panel Layout
  // ═══════════════════════════════════════

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-base font-semibold text-gray-900">Yeni Soru</h1>
          <span className="hidden sm:inline text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{QUESTION_TYPE_LABELS[questionType]}</span>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-500 mr-2">{error}</span>}
          <button type="button" onClick={() => { setPreviewSelected([]); setPreviewScaleVal(null); setPreviewStarVal(null); setPreviewNpsVal(null); setPreviewMatrixSel({}); setShowPreviewModal(true); }} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            Önizleme
          </button>
          {/* Responsive: toggle right panel on lg- */}
          <button type="button" onClick={() => setShowRightPanel(!showRightPanel)} className="xl:hidden flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18" /></svg>
            Ayarlar
          </button>
          <button onClick={() => router.back()} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">İptal</button>
          <button onClick={handleSave} className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Kaydet</button>
        </div>
      </div>

      {/* ── 3 Panel Body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ LEFT PANEL: Question Types ═══ */}
        <aside className="hidden lg:block w-56 border-r border-gray-200 bg-gray-50/80 overflow-y-auto flex-shrink-0">
          <div className="p-3 space-y-4">
            {Object.entries(QUESTION_TYPE_GROUPS).map(([group, types]) => (
              <div key={group}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">{group}</p>
                <div className="space-y-0.5">
                  {types.map(t => {
                    const isActive = questionType === t;
                    return (
                      <button key={t} type="button" onClick={() => setQuestionType(t)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}>
                        <span className={`text-base w-5 text-center flex-shrink-0 ${isActive ? 'text-indigo-600' : TYPE_SIDEBAR_COLORS[t] || 'text-gray-500'}`}>
                          {QUESTION_TYPE_ICONS[t]}
                        </span>
                        <span className="truncate">{QUESTION_TYPE_LABELS[t]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ═══ CENTER PANEL: Content Editor ═══ */}
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

            {/* Responsive: type selector for lg- */}
            <div className="lg:hidden">
              <label className="block text-xs font-medium text-gray-500 mb-1">Soru Tipi</label>
              <select value={questionType} onChange={e => setQuestionType(e.target.value as QuestionType)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                {Object.entries(QUESTION_TYPE_GROUPS).map(([group, types]) => (
                  <optgroup key={group} label={group}>{types.map(t => <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>)}</optgroup>
                ))}
              </select>
            </div>

            {/* ── Soru Metni + Medya (Canlı Önizleme) ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Soru Metni *</label>
                {/* + Görsel butonu (medya yoksa) veya medya tipi göstergesi */}
                {!(svg || image || video) ? (
                  <button type="button" onClick={() => setShowMediaUploader(!showMediaUploader)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showMediaUploader ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-gray-700 hover:bg-gray-100'}`}>
                    {showMediaUploader ? '✕ Kapat' : '+ Görsel'}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">
                      {visualMode === 'svg' ? 'SVG' : visualMode === 'image' ? 'Görsel' : 'Video'}
                    </span>
                    <button type="button" onClick={() => setShowMediaUploader(!showMediaUploader)}
                      className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors ${showMediaUploader ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`}>
                      Değiştir
                    </button>
                    <button type="button" onClick={() => { setSvg(''); setImage(''); setVideo(''); setShowMediaUploader(false); }}
                      className="px-2 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                      Kaldır
                    </button>
                  </div>
                )}
              </div>

              {/* Canlı önizleme: Metin + Görsel birlikte */}
              {(svg && visualMode === 'svg') || (image && visualMode === 'image') || (videoEmbed && visualMode === 'video') ? (
                <div className={`rounded-xl border border-gray-100 overflow-hidden ${bgColor ? '' : 'bg-gray-50/50'}`} style={bgColor ? { backgroundColor: bgColor } : undefined}>
                  {(svgPosition === 'top' || svgPosition === 'bottom') ? (
                    <div className="flex flex-col">
                      {svgPosition === 'top' && (
                        <div className={`${ALIGN_CLASS[svgAlign]} p-4 pb-2`}>
                          {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                          {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                          {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                        </div>
                      )}
                      <div className="p-4">
                        <RichTextEditor value={questionText} onChange={setQuestionText} placeholder="Soru metnini yazın..." minHeight="6rem" collapsible />
                      </div>
                      {svgPosition === 'bottom' && (
                        <div className={`${ALIGN_CLASS[svgAlign]} p-4 pt-2`}>
                          {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                          {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                          {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`flex ${VALIGN_CLASS[textVerticalAlign]} gap-4 p-4`}>
                      {svgPosition === 'left' && (
                        <div className={`${ALIGN_CLASS[svgAlign]} flex-shrink-0`} style={{ width: `${layoutRatio}%` }}>
                          {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                          {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                          {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <RichTextEditor value={questionText} onChange={setQuestionText} placeholder="Soru metnini yazın..." minHeight="6rem" collapsible />
                      </div>
                      {svgPosition === 'right' && (
                        <div className={`${ALIGN_CLASS[svgAlign]} flex-shrink-0`} style={{ width: `${layoutRatio}%` }}>
                          {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                          {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                          {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <RichTextEditor value={questionText} onChange={setQuestionText} placeholder="Soru metnini yazın..." minHeight="6rem" collapsible />
              )}

              {/* Medya yükleyici — sadece buton tıklanınca açılır */}
              {showMediaUploader && (
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 w-fit">
                    <button type="button" onClick={() => setVisualMode('svg')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${visualMode === 'svg' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>SVG</button>
                    <button type="button" onClick={() => setVisualMode('image')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${visualMode === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Görsel</button>
                    <button type="button" onClick={() => setVisualMode('video')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${visualMode === 'video' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Video</button>
                  </div>
                  {visualMode === 'svg' ? (
                    <SvgUploader value={svg} onChange={v => { setSvg(v); if (v) setShowMediaUploader(false); }} previewBgColor={bgColor || undefined} previewAlignClass={ALIGN_CLASS[svgAlign]} previewMaxHeight={`${svgMaxHeight}px`} />
                  ) : visualMode === 'image' ? (
                    <ImageUploader value={image} onChange={v => { setImage(v); if (v) setShowMediaUploader(false); }} maxDimension={800} quality={0.7} />
                  ) : (
                    <div className="space-y-2">
                      <input type="url" value={video} onChange={e => setVideo(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      {video && !videoEmbed && <p className="text-xs text-red-500">Geçersiz video URL</p>}
                      {videoEmbed && <button type="button" onClick={() => setShowMediaUploader(false)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Tamam</button>}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Görsel İçerik (Yeni Dual-Mode) ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <label className="text-sm font-medium text-gray-700">Görsel İçerik</label>
              <VisualContentEditor
                value={visualContent}
                onChange={setVisualContent}
                svgPreviewBgColor={bgColor || undefined}
              />
              {/* Önizleme (visualContent varsa) */}
              {visualContent && (visualContent.content || visualContent.tableData || visualContent.image) && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Önizleme</p>
                  <VisualContentRenderer content={visualContent} bgColor={bgColor || undefined} />
                </div>
              )}
            </div>

            {/* ── Seçenekli Tipler ── */}
            {needsOptions(questionType) && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Seçenekler ({getOptionLabel(0)}-{getOptionLabel(options.length - 1)}) *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{options.length} seçenek</span>
                    <button type="button" onClick={() => setShowBulkAdd(!showBulkAdd)} className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">+ Toplu</button>
                    <button type="button" onClick={addOption} disabled={options.length >= MAX_OPTIONS} className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-40 transition-colors">+ Ekle</button>
                  </div>
                </div>
                {showBulkAdd && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                    <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={4} placeholder={"Her satıra bir seçenek yazın:\nSeçenek 1\nSeçenek 2"} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => { setShowBulkAdd(false); setBulkText(''); }} className="px-3 py-1 text-xs text-gray-500">İptal</button>
                      <button type="button" onClick={bulkAddOptions} className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Ekle</button>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={randomizeOptions} onChange={e => setRandomizeOptions(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    Seçenekleri Karıştır
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={showScoring} onChange={e => setShowScoring(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    Puanlandırma
                  </label>
                </div>
                <div className="space-y-2">
                  {options.map((opt, i) => {
                    const isCorrect = correctAnswers.includes(i);
                    return (
                      <div key={i} draggable onDragStart={() => handleDragStart(i)} onDragOver={e => handleDragOver(e, i)} onDragEnd={handleDragEnd} onDrop={() => handleDrop(i)}
                        className={`${dragIdx === i ? 'opacity-40' : ''} ${dragOverIdx === i ? 'border-t-2 border-indigo-400' : ''}`}>
                        <div className="flex items-start gap-2">
                          <div className="flex items-center mt-2.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
                          </div>
                          <button type="button" onClick={() => toggleCorrectAnswer(i)}
                            className={`w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-colors ${questionType === 'multiple'
                              ? (isCorrect ? 'bg-green-600 text-white rounded-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-md')
                              : (isCorrect ? 'bg-green-600 text-white rounded-full' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full')}`}
                            title={isCorrect ? 'Doğru cevap' : 'Doğru cevap olarak işaretle'}>{getOptionLabel(i)}</button>
                          <div className="flex-1 space-y-1">
                            <div className="flex gap-2 items-start">
                              <div className="flex-1">
                                <RichTextEditor value={opt.text} onChange={val => updateOption(i, 'text', val)} placeholder={`Seçenek ${getOptionLabel(i)} metni`} minHeight="2.2rem" collapsible />
                              </div>
                              {randomizeOptions && (
                                <button type="button" onClick={() => updateOption(i, 'pinned', !opt.pinned)} className={`px-1.5 py-1.5 text-xs rounded-lg border flex-shrink-0 mt-0.5 transition-colors ${opt.pinned ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`} title={opt.pinned ? 'Sabitlendi' : 'Sabitle'}>{opt.pinned ? '📌' : 'Pin'}</button>
                              )}
                              {showScoring && (
                                <input type="number" value={opt.score ?? (isCorrect ? 1 : 0)} onChange={e => updateOption(i, 'score', Number(e.target.value))} className="w-12 px-1 py-1.5 text-xs border border-gray-300 rounded-lg text-center flex-shrink-0 mt-0.5" title="Puan" />
                              )}
                              <button type="button" onClick={() => setShowOptionSvg(prev => ({ ...prev, [i]: !prev[i] }))} className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 mt-0.5 ${showOptionSvg[i] || opt.svg || opt.image ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`} title="Görsel ekle">{opt.svg || opt.image ? '🖼' : '+ Görsel'}</button>
                              <button type="button" onClick={() => setShowFeedback(prev => ({ ...prev, [i]: !prev[i] }))} className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 mt-0.5 ${showFeedback[i] || opt.feedback ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`} title="Geri bildirim">💬</button>
                              {options.length > MIN_OPTIONS && (
                                <button type="button" onClick={() => removeOption(i)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 mt-0.5" title={`Seçenek ${getOptionLabel(i)} sil`}>
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                              )}
                            </div>
                            {showFeedback[i] && <textarea value={opt.feedback || ''} onChange={e => updateOption(i, 'feedback', e.target.value)} placeholder="Bu seçenek neden doğru/yanlış..." rows={2} className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-amber-50/50" />}
                            {(showOptionSvg[i] || questionType === 'image_choice') && (
                              <div className="space-y-1.5">
                                {questionType !== 'image_choice' && (
                                  <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5 w-fit">
                                    <button type="button" onClick={() => setOptionSvgPreview(prev => ({ ...prev, [i]: false }))} className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${!optionSvgPreview[i] ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>SVG</button>
                                    <button type="button" onClick={() => setOptionSvgPreview(prev => ({ ...prev, [i]: true }))} className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${optionSvgPreview[i] ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Görsel</button>
                                  </div>
                                )}
                                {questionType === 'image_choice' || optionSvgPreview[i] ? (
                                  <ImageUploader value={opt.image || ''} onChange={val => updateOption(i, 'image', val)} maxDimension={300} quality={0.65} compact />
                                ) : (
                                  <SvgUploader compact value={opt.svg || ''} onChange={val => updateOption(i, 'svg', val)} previewMaxHeight={`${optionSvgMaxHeight}px`} previewBgColor={bgColor || undefined} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2">{questionType === 'multiple' ? 'Birden fazla doğru cevabı tıklayarak seçin' : 'Doğru cevabı yeşil harfe tıklayarak seçin'}</p>
              </div>
            )}

            {/* ── Dropdown Önizleme ── */}
            {questionType === 'dropdown' && options.some(o => o.text) && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Dropdown Önizleme</p>
                <select disabled className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white appearance-none cursor-default" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%236b7280\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', paddingRight: '2.5rem' }}>
                  <option value="">Seçiniz...</option>
                  {options.map((o, i) => o.text && <option key={i} value={i}>{stripHtml(o.text).slice(0, 60)}</option>)}
                </select>
              </div>
            )}

            {/* ── Eşleştirme ── */}
            {questionType === 'matching' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-gray-700">Eşleştirme Çiftleri *</label><button type="button" onClick={addPair} className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">+ Çift Ekle</button></div>
                <div className="space-y-2">
                  {matchingPairs.map((pair, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-6">{i + 1}.</span>
                      <input type="text" value={pair.left} onChange={e => updatePair(i, 'left', e.target.value)} placeholder="Sol öğe" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <span className="text-gray-400">↔</span>
                      <input type="text" value={pair.right} onChange={e => updatePair(i, 'right', e.target.value)} placeholder="Sağ öğe" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      {matchingPairs.length > 2 && <button type="button" onClick={() => removePair(i)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Ölçek ── */}
            {questionType === 'scale' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Ölçek Ayarları</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-600 mb-1 block">Min</label><input type="number" value={scaleMin} onChange={e => setScaleMin(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Max</label><input type="number" value={scaleMax} onChange={e => setScaleMax(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Sol Uç</label><input type="text" value={scaleMinLabel} onChange={e => setScaleMinLabel(e.target.value)} placeholder="Hiç katılmıyorum" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Sağ Uç</label><input type="text" value={scaleMaxLabel} onChange={e => setScaleMaxLabel(e.target.value)} placeholder="Tamamen katılıyorum" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] text-gray-400 uppercase font-medium mb-2">Önizleme</p>
                  <div className="flex items-end gap-1">
                    {scaleMinLabel && <span className="text-[10px] text-gray-400 pb-1 flex-shrink-0">{scaleMinLabel}</span>}
                    <div className="flex gap-1 flex-1 justify-center flex-wrap">
                      {Array.from({ length: Math.min(Math.max(scaleMax - scaleMin + 1, 1), 20) }, (_, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg border-2 border-indigo-200 text-indigo-600 flex items-center justify-center text-xs font-bold hover:bg-indigo-50 cursor-default">{scaleMin + i}</div>
                      ))}
                    </div>
                    {scaleMaxLabel && <span className="text-[10px] text-gray-400 pb-1 flex-shrink-0">{scaleMaxLabel}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── Yıldız ── */}
            {questionType === 'star' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Yıldız Derecelendirme</p>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Yıldız Sayısı:</label>
                    <select value={scaleMax} onChange={e => setScaleMax(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-lg text-sm">
                      {[3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-1">{Array.from({ length: scaleMax }, (_, i) => <svg key={i} className="w-8 h-8 text-amber-400 hover:scale-110 transition-transform cursor-default" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}</div>
                {scaleMinLabel || scaleMaxLabel ? (
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>{scaleMinLabel}</span><span>{scaleMaxLabel}</span>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                  <div><label className="text-xs text-gray-600 mb-1 block">Sol Uç Etiket</label><input type="text" value={scaleMinLabel} onChange={e => setScaleMinLabel(e.target.value)} placeholder="Çok kötü" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Sağ Uç Etiket</label><input type="text" value={scaleMaxLabel} onChange={e => setScaleMaxLabel(e.target.value)} placeholder="Mükemmel" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
              </div>
            )}

            {/* ── NPS ── */}
            {questionType === 'nps' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">NPS (Net Promoter Score)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-600 mb-1 block">Sol Uç</label><input type="text" value={scaleMinLabel} onChange={e => setScaleMinLabel(e.target.value)} placeholder="Hiç olası değil" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Sağ Uç</label><input type="text" value={scaleMaxLabel} onChange={e => setScaleMaxLabel(e.target.value)} placeholder="Kesinlikle olası" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div className="flex items-end gap-0.5 pt-2">
                  <span className="text-[10px] text-gray-400 pb-1">{scaleMinLabel || 'Hiç olası değil'}</span>
                  <div className="flex gap-0.5 flex-1 justify-center">{Array.from({ length: 11 }, (_, i) => { const color = i <= 6 ? 'border-red-300 text-red-600' : i <= 8 ? 'border-amber-300 text-amber-600' : 'border-green-300 text-green-600'; return <div key={i} className={`w-7 h-7 rounded border-2 ${color} flex items-center justify-center text-[10px] font-bold`}>{i}</div>; })}</div>
                  <span className="text-[10px] text-gray-400 pb-1">{scaleMaxLabel || 'Kesinlikle olası'}</span>
                </div>
              </div>
            )}

            {/* ── Slider ── */}
            {questionType === 'slider' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Slider Ayarları</p>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-600 mb-1 block">Min</label><input type="number" value={scaleMin} onChange={e => setScaleMin(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Max</label><input type="number" value={scaleMax} onChange={e => setScaleMax(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Adım</label><input type="number" value={scaleStep} onChange={e => setScaleStep(Number(e.target.value))} min={0.1} step={0.1} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-600 mb-1 block">Sol Uç</label><input type="text" value={scaleMinLabel} onChange={e => setScaleMinLabel(e.target.value)} placeholder="Minimum" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Sağ Uç</label><input type="text" value={scaleMaxLabel} onChange={e => setScaleMaxLabel(e.target.value)} placeholder="Maksimum" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] text-gray-400 uppercase font-medium mb-2">Önizleme</p>
                  <div className="space-y-1">
                    <input type="range" min={scaleMin} max={scaleMax} step={scaleStep} defaultValue={Math.round((scaleMin + scaleMax) / 2)} disabled className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-default accent-indigo-600" />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>{scaleMinLabel || scaleMin}</span>
                      <span className="text-indigo-500 font-medium">{Math.round((scaleMin + scaleMax) / 2)}</span>
                      <span>{scaleMaxLabel || scaleMax}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Sıralama ── */}
            {questionType === 'ranking' && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg"><p className="text-xs text-amber-700 font-medium">Doğru sıralama: Yukarıdaki seçenekleri doğru sırada ekleyin.</p></div>}

            {/* ── MaxDiff ── */}
            {questionType === 'maxdiff' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">MaxDiff Doğru Cevaplar</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-600 mb-1 block">En İyi (Best)</label><select value={maxdiffBest} onChange={e => setMaxdiffBest(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value={-1}>Seçin...</option>{options.map((o, i) => <option key={i} value={i}>{getOptionLabel(i)}: {stripHtml(o.text).slice(0, 30)}</option>)}</select></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">En Kötü (Worst)</label><select value={maxdiffWorst} onChange={e => setMaxdiffWorst(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value={-1}>Seçin...</option>{options.map((o, i) => <option key={i} value={i}>{getOptionLabel(i)}: {stripHtml(o.text).slice(0, 30)}</option>)}</select></div>
                </div>
              </div>
            )}

            {/* ── Matris ── */}
            {questionType === 'matrix' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Matris Ayarları</p>
                <div className="flex items-center gap-4">
                  <label className="text-xs text-gray-600">Satır başına:</label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="radio" checked={matrixType === 'radio'} onChange={() => setMatrixType('radio')} className="text-indigo-600" /> Tek seçim</label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="radio" checked={matrixType === 'checkbox'} onChange={() => setMatrixType('checkbox')} className="text-indigo-600" /> Çoklu seçim</label>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1"><label className="text-xs font-medium text-gray-600">Satırlar</label><button type="button" onClick={addMatrixRow} className="text-xs text-indigo-600 hover:text-indigo-700">+ Satır</button></div>
                  <div className="space-y-1">{matrixRows.map((row, i) => (<div key={row.id} className="flex items-center gap-2"><span className="text-xs text-gray-400 w-4">{i+1}.</span><input type="text" value={row.text} onChange={e => { const next = [...matrixRows]; next[i] = { ...next[i], text: e.target.value }; setMatrixRows(next); }} placeholder={`Madde ${i+1}`} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />{matrixRows.length > 1 && <button type="button" onClick={() => removeMatrixRow(i)} className="p-1 text-gray-300 hover:text-red-500"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>}</div>))}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1"><label className="text-xs font-medium text-gray-600">Sütunlar</label><button type="button" onClick={addMatrixCol} className="text-xs text-indigo-600 hover:text-indigo-700">+ Sütun</button></div>
                  <div className="flex flex-wrap gap-1">{matrixColumns.map((col, i) => (<div key={i} className="flex items-center gap-0.5"><input type="text" value={col} onChange={e => { const next = [...matrixColumns]; next[i] = e.target.value; setMatrixColumns(next); }} className="w-20 px-2 py-1 border border-gray-300 rounded text-xs text-center" />{matrixColumns.length > 2 && <button type="button" onClick={() => removeMatrixCol(i)} className="text-gray-300 hover:text-red-500 text-xs">×</button>}</div>))}</div>
                </div>
              </div>
            )}

            {/* ── Dosya Yükleme ── */}
            {questionType === 'file_upload' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Dosya Yükleme Ayarları</p>
                <div><label className="text-xs text-gray-600 mb-1 block">İzin Verilen Tipler</label><input type="text" value={allowedFileTypes.join(', ')} onChange={e => setAllowedFileTypes(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder=".pdf, .docx, .jpg" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-600 mb-1 block">Maks. Dosya (MB)</label><input type="number" value={maxFileSize} onChange={e => setMaxFileSize(Number(e.target.value))} min={1} max={100} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              </div>
            )}

            {/* ── Metin Tipleri ── */}
            {(questionType === 'short_text' || questionType === 'long_text') && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{questionType === 'short_text' ? 'Kısa Paragraf' : 'Uzun Paragraf'} Önizleme</p>
                {questionType === 'short_text' ? <input type="text" disabled placeholder={placeholder || 'Cevabınızı yazın...'} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" /> : <textarea disabled placeholder={placeholder || 'Cevabınızı yazın...'} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />}
              </div>
            )}

            {/* ── Tarih/Saat ── */}
            {(questionType === 'date' || questionType === 'time') && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{questionType === 'date' ? 'Tarih' : 'Saat'} Seçici</p>
                <input type={questionType === 'date' ? 'date' : 'time'} disabled className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
              </div>
            )}

            {/* ── Çözüm ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Çözüm Açıklaması</label>
              <RichTextEditor value={solution} onChange={setSolution} placeholder="Doğru cevabın açıklamasını yazın..." minHeight="4.5rem" collapsible />
            </div>

          </div>
        </main>

        {/* ═══ RIGHT PANEL: Settings ═══ */}
        <aside className={`${showRightPanel ? 'fixed inset-y-0 right-0 z-40 shadow-xl' : 'hidden'} xl:relative xl:block w-72 border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0`}>
          {/* Close button for mobile overlay */}
          <div className="xl:hidden flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Ayarlar</span>
            <button onClick={() => setShowRightPanel(false)} className="p-1 text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
          </div>

          <div className="p-4 space-y-5">

            {/* ── Zorluk ── */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Zorluk</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_DIFFICULTIES.map(d => {
                  const { bg, text } = DIFFICULTY_COLORS[d];
                  return <button key={d} type="button" onClick={() => setDifficulty(d)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${difficulty === d ? `${bg} ${text} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{DIFFICULTY_LABELS[d]}</button>;
                })}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* ── Kategori & Alt Modül ── */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Kategori *</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm">
                  <option value="">Seçin...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Alt Modül *</label>
                <select value={subModuleId} onChange={e => setSubModuleId(e.target.value)} disabled={!categoryId} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50">
                  <option value="">Seçin...</option>
                  {filteredSubModules.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* ── Etiketler ── */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Etiketler</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="virgülle ayırın" />
            </div>

            <hr className="border-gray-100" />

            {/* ── Stil Ayarları (collapsible) ── */}
            <div>
              <button type="button" onClick={() => setShowStylePanel(!showStylePanel)} className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase hover:text-indigo-600 transition-colors w-full">
                <svg className={`w-3.5 h-3.5 transition-transform ${showStylePanel ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                Stil Ayarları
                {isStyleDirty && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
              </button>
              {showStylePanel && (
                <div className="mt-2 space-y-3">
                  {isStyleDirty && <button type="button" onClick={resetStyles} className="text-[10px] text-amber-600 hover:text-amber-700">Varsayılana getir</button>}
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Görsel Konumu</label>
                    <div className="grid grid-cols-4 gap-1">{([{ val: 'bottom' as SvgPosition, l: '⬇' },{ val: 'top' as SvgPosition, l: '⬆' },{ val: 'left' as SvgPosition, l: '⬅' },{ val: 'right' as SvgPosition, l: '➡' }]).map(p => <button key={p.val} type="button" onClick={() => setSvgPosition(p.val)} className={`p-1.5 rounded border text-xs text-center ${svgPosition === p.val ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-500'}`}>{p.l}</button>)}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Hizalama</label>
                    <div className="flex gap-1">{([{ val: 'left' as SvgAlign, l: '◧' },{ val: 'center' as SvgAlign, l: '◻' },{ val: 'right' as SvgAlign, l: '◨' }]).map(a => <button key={a.val} type="button" onClick={() => setSvgAlign(a.val)} className={`flex-1 p-1.5 rounded border text-xs text-center ${svgAlign === a.val ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-500'}`}>{a.l}</button>)}</div>
                  </div>
                  {(svgPosition === 'left' || svgPosition === 'right') && (
                    <>
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1 block">Metin Dikey Hizalama</label>
                        <div className="flex gap-1">{([{ val: 'top' as TextVerticalAlign, l: '⬆' },{ val: 'center' as TextVerticalAlign, l: '⬌' },{ val: 'bottom' as TextVerticalAlign, l: '⬇' }]).map(v => <button key={v.val} type="button" onClick={() => setTextVerticalAlign(v.val)} className={`flex-1 p-1.5 rounded border text-xs ${textVerticalAlign === v.val ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-500'}`}>{v.l}</button>)}</div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1 block">Oran: {layoutRatio}% / {100-layoutRatio}%</label>
                        <input type="range" min={20} max={80} step={5} value={layoutRatio} onChange={e => setLayoutRatio(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">SVG Maks. Yükseklik: {svgMaxHeight}px</label>
                    <input type="range" min={50} max={500} step={10} value={svgMaxHeight} onChange={e => setSvgMaxHeight(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Seçenek SVG: {optionSvgMaxHeight}px</label>
                    <input type="range" min={24} max={200} step={4} value={optionSvgMaxHeight} onChange={e => setOptionSvgMaxHeight(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Arka Plan Rengi</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={bgColor || '#f9fafb'} onChange={e => setBgColor(e.target.value)} className="w-8 h-6 cursor-pointer rounded border border-gray-300 p-0.5" />
                      <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} placeholder="#f9fafb" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg font-mono" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* ── Soru Ayarları (collapsible) ── */}
            <div>
              <button type="button" onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase hover:text-indigo-600 transition-colors w-full">
                <svg className={`w-3.5 h-3.5 transition-transform ${showSettings ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                Soru Ayarları
              </button>
              {showSettings && (
                <div className="mt-2 space-y-3">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={required} onChange={e => setRequired(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /> Zorunlu soru
                  </label>
                  <div><label className="text-[10px] text-gray-500 mb-1 block">Yardım Metni</label><textarea value={helpText} onChange={e => setHelpText(e.target.value)} rows={2} placeholder="Soru altı açıklama..." className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                  <div><label className="text-[10px] text-gray-500 mb-1 block">İpucu</label><textarea value={hint} onChange={e => setHint(e.target.value)} rows={2} placeholder="Kullanıcıya ipucu..." className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                  {(questionType === 'short_text' || questionType === 'long_text') && (
                    <div><label className="text-[10px] text-gray-500 mb-1 block">Placeholder</label><input type="text" value={placeholder} onChange={e => setPlaceholder(e.target.value)} placeholder="Input placeholder" className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                  )}
                  <div><label className="text-[10px] text-gray-500 mb-1 block">Süre Limiti (saniye, 0=sınırsız)</label><input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} min={0} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                </div>
              )}
            </div>

            {/* ── Validasyon (collapsible) ── */}
            {(questionType === 'short_text' || questionType === 'long_text' || questionType === 'scale' || questionType === 'slider') && (
              <>
                <hr className="border-gray-100" />
                <div>
                  <button type="button" onClick={() => setShowValidation(!showValidation)} className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase hover:text-indigo-600 transition-colors w-full">
                    <svg className={`w-3.5 h-3.5 transition-transform ${showValidation ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                    Validasyon
                  </button>
                  {showValidation && (
                    <div className="mt-2 space-y-3">
                      {(questionType === 'short_text' || questionType === 'long_text') && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[10px] text-gray-500 mb-1 block">Min Karakter</label><input type="number" value={validation.minLength || ''} onChange={e => setValidation({ ...validation, minLength: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                            <div><label className="text-[10px] text-gray-500 mb-1 block">Max Karakter</label><input type="number" value={validation.maxLength || ''} onChange={e => setValidation({ ...validation, maxLength: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                          </div>
                          <div><label className="text-[10px] text-gray-500 mb-1 block">Regex</label><input type="text" value={validation.pattern || ''} onChange={e => setValidation({ ...validation, pattern: e.target.value || undefined })} placeholder="^[a-zA-Z]+$" className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono" /></div>
                        </>
                      )}
                      {(questionType === 'scale' || questionType === 'slider') && (
                        <div className="grid grid-cols-2 gap-2">
                          <div><label className="text-[10px] text-gray-500 mb-1 block">Min Değer</label><input type="number" value={validation.minValue ?? ''} onChange={e => setValidation({ ...validation, minValue: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                          <div><label className="text-[10px] text-gray-500 mb-1 block">Max Değer</label><input type="number" value={validation.maxValue ?? ''} onChange={e => setValidation({ ...validation, maxValue: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" /></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </aside>
        {/* Backdrop for mobile right panel */}
        {showRightPanel && <div className="xl:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setShowRightPanel(false)} />}

      </div>

      {/* ── Preview Modal ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4" onClick={() => setShowPreviewModal(false)}>
          <div className="fixed inset-0 bg-black/50" />
          {/* Device switcher - floating above modal */}
          <div className="relative z-10 flex items-center gap-1 bg-white/95 backdrop-blur rounded-full shadow-lg px-1.5 py-1.5 mb-3" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              Masaüstü
            </button>
            <button type="button" onClick={() => setPreviewDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${previewDevice === 'tablet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M12 18h.01" /></svg>
              Tablet
            </button>
            <button type="button" onClick={() => setPreviewDevice('phone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${previewDevice === 'phone' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
              Telefon
            </button>
          </div>
          {/* Modal container with device-based width */}
          <div className={`relative bg-white shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out ${previewDevice === 'phone' ? 'w-[375px] max-h-[80vh] rounded-[2rem] ring-4 ring-gray-900/10' : previewDevice === 'tablet' ? 'w-[768px] max-w-full max-h-[80vh] rounded-2xl ring-4 ring-gray-900/10' : 'w-full max-w-2xl max-h-[85vh] rounded-2xl'}`} onClick={e => e.stopPropagation()}>
            <div className={`sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 ${previewDevice === 'phone' ? 'px-4 py-2.5 rounded-t-[2rem]' : 'px-5 py-3 rounded-t-2xl'}`}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                <h3 className={`font-semibold text-gray-900 ${previewDevice === 'phone' ? 'text-xs' : 'text-sm'}`}>Soru Önizleme</h3>
                {previewDevice !== 'phone' && <span className="text-xs text-gray-400 ml-1">{QUESTION_TYPE_LABELS[questionType]}</span>}
              </div>
              <button type="button" onClick={() => setShowPreviewModal(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
            </div>
            <div className={`space-y-4 ${previewDevice === 'phone' ? 'p-4' : 'p-6'}`}>
              {/* Soru metni + medya (canlı önizleme ile aynı layout) */}
              {((svg && visualMode === 'svg') || (image && visualMode === 'image') || (videoEmbed && visualMode === 'video')) ? (
                <div className={`rounded-xl overflow-hidden ${bgColor ? '' : 'bg-gray-50/50'}`} style={bgColor ? { backgroundColor: bgColor } : undefined}>
                  {(svgPosition === 'top' || svgPosition === 'bottom') ? (
                    <div className="flex flex-col">
                      {svgPosition === 'top' && (
                        <div className={`${ALIGN_CLASS[svgAlign]} p-4 pb-2`}>
                          {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                          {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                          {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                        </div>
                      )}
                      <div className="p-4">
                        {questionText ? <div className="rich-text-content text-base font-semibold text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(questionText) }} /> : <p className="text-sm text-gray-400 italic">Soru metni henüz girilmedi...</p>}
                      </div>
                      {svgPosition === 'bottom' && (
                        <div className={`${ALIGN_CLASS[svgAlign]} p-4 pt-2`}>
                          {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                          {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                          {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Sol/Sağ: telefonda dikey, diğerlerinde yatay */
                    previewDevice === 'phone' ? (
                      <div className="flex flex-col gap-3 p-4">
                        <div className={`${ALIGN_CLASS[svgAlign]}`}>
                          {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                          {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                          {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                        </div>
                        <div>{questionText ? <div className="rich-text-content text-sm font-semibold text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(questionText) }} /> : <p className="text-sm text-gray-400 italic">Soru metni henüz girilmedi...</p>}</div>
                      </div>
                    ) : (
                      <div className={`flex ${VALIGN_CLASS[textVerticalAlign]} gap-4 p-4`}>
                        {svgPosition === 'left' && (
                          <div className={`${ALIGN_CLASS[svgAlign]} flex-shrink-0`} style={{ width: `${layoutRatio}%` }}>
                            {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                            {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                            {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {questionText ? <div className="rich-text-content text-base font-semibold text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(questionText) }} /> : <p className="text-sm text-gray-400 italic">Soru metni henüz girilmedi...</p>}
                        </div>
                        {svgPosition === 'right' && (
                          <div className={`${ALIGN_CLASS[svgAlign]} flex-shrink-0`} style={{ width: `${layoutRatio}%` }}>
                            {visualMode === 'svg' && svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(svg) }} style={{ height: `${svgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full" />}
                            {visualMode === 'image' && image && <img src={image} alt="" style={{ maxHeight: `${svgMaxHeight}px` }} className="rounded-lg max-w-full w-auto h-auto inline-block" />}
                            {visualMode === 'video' && videoEmbed && <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen /></div>}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                questionText ? <div className={`rich-text-content font-semibold text-gray-900 leading-relaxed ${previewDevice === 'phone' ? 'text-sm' : 'text-base'}`} dangerouslySetInnerHTML={{ __html: renderMath(questionText) }} /> : <p className="text-sm text-gray-400 italic">Soru metni henüz girilmedi...</p>
              )}
              {/* ── Seçenekli tipler (single, multiple, image_choice, ranking, maxdiff) ── */}
              {needsOptions(questionType) && questionType !== 'dropdown' && options.some(o => o.text || o.image || o.svg) && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Seçenekler</p>
                  {options.map((opt, i) => {
                    if (!opt.text && !opt.image && !opt.svg) return null;
                    const isSelected = previewSelected.includes(i);
                    const handleClick = () => {
                      if (questionType === 'multiple') { setPreviewSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]); }
                      else { setPreviewSelected(prev => prev.includes(i) ? [] : [i]); }
                    };
                    return (
                      <button key={i} type="button" onClick={handleClick} className={`w-full flex items-center gap-2 rounded-lg border transition-all text-left ${isSelected ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'} ${previewDevice === 'phone' ? 'p-2.5' : 'p-3 gap-3'}`}>
                        <span className={`flex items-center justify-center font-bold flex-shrink-0 transition-colors ${questionType === 'multiple' ? 'rounded-md' : 'rounded-full'} ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'} ${previewDevice === 'phone' ? 'w-6 h-6 text-xs' : 'w-7 h-7 text-sm'}`}>{isSelected && questionType === 'multiple' ? '✓' : getOptionLabel(i)}</span>
                        <div className="flex-1 min-w-0">
                          {opt.image && <img src={opt.image} alt="" className="rounded-lg max-h-20 mb-1" />}
                          {opt.svg && <div dangerouslySetInnerHTML={{ __html: responsiveSvg(opt.svg) }} style={{ height: `${optionSvgMaxHeight}px` }} className="inline-block max-w-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full mb-1" />}
                          {opt.text && <div className={`rich-text-content text-gray-800 ${previewDevice === 'phone' ? 'text-xs' : 'text-sm'}`} dangerouslySetInnerHTML={{ __html: renderMath(opt.text) }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {/* ── Dropdown ── */}
              {questionType === 'dropdown' && options.some(o => stripHtml(o.text || '')) && (
                <div className="pt-2 border-t border-gray-100">
                  <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer">
                    <option value="">Seçiniz...</option>
                    {options.map((o, i) => { const t = stripHtml(o.text || ''); return t ? <option key={i} value={i}>{t}</option> : null; })}
                  </select>
                </div>
              )}
              {/* ── Eşleştirme ── */}
              {questionType === 'matching' && matchingPairs.some(p => p.left || p.right) && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Eşleştirme</p>
                  {matchingPairs.map((pair, i) => (pair.left || pair.right) && (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`flex-1 rounded-lg border border-gray-200 bg-gray-50 ${previewDevice === 'phone' ? 'p-2 text-xs' : 'p-2.5 text-sm'} text-gray-800`}>{pair.left || '...'}</div>
                      <span className="text-gray-400 font-bold">↔</span>
                      <div className={`flex-1 rounded-lg border border-gray-200 bg-gray-50 ${previewDevice === 'phone' ? 'p-2 text-xs' : 'p-2.5 text-sm'} text-gray-800`}>{pair.right || '...'}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* ── Ölçek ── */}
              {questionType === 'scale' && (() => {
                const [pScaleVal, setPScaleVal] = [previewScaleVal, setPreviewScaleVal];
                return (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-end gap-1">
                    {scaleMinLabel && <span className="text-[10px] text-gray-400 pb-1">{scaleMinLabel}</span>}
                    <div className="flex gap-1 flex-1 justify-center flex-wrap">
                      {Array.from({ length: Math.min(Math.max(scaleMax - scaleMin + 1, 1), 20) }, (_, i) => {
                        const val = scaleMin + i;
                        const selected = pScaleVal === val;
                        return <button key={i} type="button" onClick={() => setPScaleVal(selected ? null : val)} className={`${previewDevice === 'phone' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'} rounded-lg border-2 flex items-center justify-center font-bold transition-all cursor-pointer ${selected ? 'border-indigo-500 bg-indigo-600 text-white scale-110' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}>{val}</button>;
                      })}
                    </div>
                    {scaleMaxLabel && <span className="text-[10px] text-gray-400 pb-1">{scaleMaxLabel}</span>}
                  </div>
                </div>);
              })()}
              {/* ── Yıldız ── */}
              {questionType === 'star' && (() => {
                const [pStarVal, setPStarVal] = [previewStarVal, setPreviewStarVal];
                return (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex gap-0.5 justify-center">
                    {Array.from({ length: scaleMax }, (_, i) => {
                      const filled = pStarVal !== null && i < pStarVal;
                      return <svg key={i} onClick={() => setPStarVal(i + 1 === pStarVal ? null : i + 1)} className={`${previewDevice === 'phone' ? 'w-6 h-6' : 'w-8 h-8'} cursor-pointer transition-all hover:scale-110 ${filled ? 'text-amber-400' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
                    })}
                  </div>
                  {(scaleMinLabel || scaleMaxLabel) && <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>{scaleMinLabel}</span><span>{scaleMaxLabel}</span></div>}
                </div>);
              })()}
              {/* ── NPS ── */}
              {questionType === 'nps' && (() => {
                const [pNpsVal, setPNpsVal] = [previewNpsVal, setPreviewNpsVal];
                return (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-end gap-0.5">
                    <span className="text-[10px] text-gray-400 pb-1">{scaleMinLabel || 'Hiç olası değil'}</span>
                    <div className="flex gap-0.5 flex-1 justify-center">{Array.from({ length: 11 }, (_, i) => { const baseColor = i <= 6 ? 'border-red-300 text-red-600' : i <= 8 ? 'border-amber-300 text-amber-600' : 'border-green-300 text-green-600'; const selectedColor = i <= 6 ? 'bg-red-500 text-white border-red-500' : i <= 8 ? 'bg-amber-500 text-white border-amber-500' : 'bg-green-500 text-white border-green-500'; const selected = pNpsVal === i; return <button key={i} type="button" onClick={() => setPNpsVal(selected ? null : i)} className={`${previewDevice === 'phone' ? 'w-5 h-5 text-[8px]' : 'w-7 h-7 text-[10px]'} rounded border-2 flex items-center justify-center font-bold cursor-pointer transition-all ${selected ? selectedColor + ' scale-110' : baseColor + ' hover:opacity-80'}`}>{i}</button>; })}</div>
                    <span className="text-[10px] text-gray-400 pb-1">{scaleMaxLabel || 'Kesinlikle olası'}</span>
                  </div>
                </div>);
              })()}
              {/* ── Slider ── */}
              {questionType === 'slider' && (
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <input type="range" min={scaleMin} max={scaleMax} step={scaleStep} defaultValue={Math.round((scaleMin + scaleMax) / 2)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <div className="flex justify-between text-[10px] text-gray-400"><span>{scaleMinLabel || scaleMin}</span><span>{scaleMaxLabel || scaleMax}</span></div>
                </div>
              )}
              {/* ── Matris ── */}
              {questionType === 'matrix' && matrixRows.length > 0 && matrixColumns.length > 0 && (
                <div className="pt-2 border-t border-gray-100 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr><th className="p-1" />{matrixColumns.map((col, i) => <th key={i} className="p-1 text-gray-500 font-medium text-center">{col}</th>)}</tr></thead>
                    <tbody>{matrixRows.map((row, ri) => {
                      const rowSel = previewMatrixSel[row.id] || [];
                      return <tr key={row.id} className={ri % 2 === 0 ? 'bg-gray-50' : ''}><td className="p-1.5 text-gray-700 font-medium">{row.text || `Madde ${ri+1}`}</td>{matrixColumns.map((_, ci) => {
                        const isSel = rowSel.includes(ci);
                        const toggle = () => setPreviewMatrixSel(prev => {
                          const curr = prev[row.id] || [];
                          if (matrixType === 'radio') return { ...prev, [row.id]: isSel ? [] : [ci] };
                          return { ...prev, [row.id]: isSel ? curr.filter(x => x !== ci) : [...curr, ci] };
                        });
                        return <td key={ci} className="p-1 text-center"><button type="button" onClick={toggle} className={`inline-flex items-center justify-center w-5 h-5 ${matrixType === 'radio' ? 'rounded-full' : 'rounded'} border-2 transition-all cursor-pointer ${isSel ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 hover:border-gray-400'}`}>{isSel && <span className="text-white text-[8px] font-bold">{matrixType === 'radio' ? '●' : '✓'}</span>}</button></td>;
                      })}</tr>;
                    })}</tbody>
                  </table>
                </div>
              )}
              {/* ── Dosya Yükleme ── */}
              {questionType === 'file_upload' && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16V4m0 0L8 8m4-4l4 4M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" /></svg>
                    <p className="text-xs text-gray-500">Dosya yüklemek için tıklayın veya sürükleyin</p>
                    <p className="text-[10px] text-gray-400 mt-1">{allowedFileTypes.join(', ')} (max {maxFileSize}MB)</p>
                  </div>
                </div>
              )}
              {/* ── Metin Tipleri ── */}
              {questionType === 'short_text' && (
                <div className="pt-2 border-t border-gray-100"><input type="text" placeholder={placeholder || 'Cevabınızı yazın...'} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none" /></div>
              )}
              {questionType === 'long_text' && (
                <div className="pt-2 border-t border-gray-100"><textarea placeholder={placeholder || 'Cevabınızı yazın...'} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none" /></div>
              )}
              {/* ── Tarih/Saat ── */}
              {(questionType === 'date' || questionType === 'time') && (
                <div className="pt-2 border-t border-gray-100"><input type={questionType === 'date' ? 'date' : 'time'} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none cursor-pointer" /></div>
              )}
              {solution && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Çözüm</p>
                  <div className="rich-text-content text-sm text-amber-900" dangerouslySetInnerHTML={{ __html: renderMath(solution) }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function NewQuestionPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-50 bg-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" /></div>}>
      <NewQuestionEditor />
    </Suspense>
  );
}
