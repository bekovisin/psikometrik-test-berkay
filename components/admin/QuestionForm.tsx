'use client';

import { useState, useEffect, DragEvent } from 'react';
import {
  Question, Difficulty, ALL_DIFFICULTIES, DIFFICULTY_LABELS, DIFFICULTY_COLORS,
  SvgPosition, SvgAlign, TextVerticalAlign,
  QuestionType, QUESTION_TYPE_LABELS, QUESTION_TYPE_GROUPS, OPTION_BASED_TYPES,
  QuestionOption, ValidationRules, MatrixRow,
} from '@/lib/types';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import SvgUploader from './SvgUploader';
import { renderMath } from '@/lib/math';
import { getEmbedUrl } from '@/lib/utils';

const getOptionLabel = (i: number) => String.fromCharCode(65 + i);
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;

const ALIGN_CLASS: Record<SvgAlign, string> = { center: 'justify-center', left: 'justify-start', right: 'justify-end' };
const VALIGN_CLASS: Record<TextVerticalAlign, string> = { top: 'items-start', center: 'items-center', bottom: 'items-end' };

const DEFAULTS = {
  svgPosition: 'top' as SvgPosition,
  svgAlign: 'center' as SvgAlign,
  textVerticalAlign: 'top' as TextVerticalAlign,
  layoutRatio: 50,
  svgMaxHeight: 300,
  optionSvgMaxHeight: 48,
  bgColor: '',
};

const needsOptions = (t: QuestionType) => OPTION_BASED_TYPES.includes(t) && t !== 'matching';

interface QuestionFormProps {
  question?: Question;
  defaultCategoryId?: string;
  defaultSubModuleId?: string;
  onSave: (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function QuestionForm({ question, defaultCategoryId, defaultSubModuleId, onSave, onCancel }: QuestionFormProps) {
  // ── Temel Alanlar ──
  const [categoryId, setCategoryId] = useState(question?.categoryId || defaultCategoryId || '');
  const [subModuleId, setSubModuleId] = useState(question?.subModuleId || defaultSubModuleId || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(question?.difficulty || 'orta');
  const [questionType, setQuestionType] = useState<QuestionType>(question?.questionType || 'single');
  const [questionText, setQuestionText] = useState(question?.questionText || '');
  const [svg, setSvg] = useState(question?.svg || '');
  const [image, setImage] = useState(question?.image || '');
  const [visualMode, setVisualMode] = useState<'svg' | 'image' | 'video'>(question?.video ? 'video' : question?.image ? 'image' : 'svg');
  const [svgMaxHeight, setSvgMaxHeight] = useState(question?.svgMaxHeight || DEFAULTS.svgMaxHeight);
  const [optionSvgMaxHeight, setOptionSvgMaxHeight] = useState(question?.optionSvgMaxHeight || DEFAULTS.optionSvgMaxHeight);
  const [bgColor, setBgColor] = useState(question?.bgColor || DEFAULTS.bgColor);
  const [svgPosition, setSvgPosition] = useState<SvgPosition>(question?.svgPosition || DEFAULTS.svgPosition);
  const [svgAlign, setSvgAlign] = useState<SvgAlign>(question?.svgAlign || DEFAULTS.svgAlign);
  const [textVerticalAlign, setTextVerticalAlign] = useState<TextVerticalAlign>(question?.textVerticalAlign || DEFAULTS.textVerticalAlign);
  const [layoutRatio, setLayoutRatio] = useState(question?.layoutRatio || DEFAULTS.layoutRatio);

  // ── Seçenekler ──
  const [options, setOptions] = useState<QuestionOption[]>(
    question?.options || Array.from({ length: 5 }, (_, i) => ({ label: getOptionLabel(i), text: '' }))
  );
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(
    question?.correctAnswers || (question?.correctAnswer !== undefined ? [question.correctAnswer] : [0])
  );
  const [randomizeOptions, setRandomizeOptions] = useState(question?.randomizeOptions || false);
  const [showScoring, setShowScoring] = useState(
    question?.options?.some(o => o.score !== undefined && o.score !== 0) || false
  );

  // ── Eşleştirme ──
  const [matchingPairs, setMatchingPairs] = useState<{ left: string; right: string }[]>(
    question?.matchingPairs || [{ left: '', right: '' }, { left: '', right: '' }]
  );

  // ── MaxDiff ──
  const [maxdiffBest, setMaxdiffBest] = useState<number>(question?.maxdiffBest ?? -1);
  const [maxdiffWorst, setMaxdiffWorst] = useState<number>(question?.maxdiffWorst ?? -1);

  // ── Sıralama ──
  const [correctOrder, setCorrectOrder] = useState<number[]>(question?.correctOrder || []);

  // ── Ölçek/NPS/Slider ──
  const [scaleMin, setScaleMin] = useState(question?.scaleMin ?? 1);
  const [scaleMax, setScaleMax] = useState(question?.scaleMax ?? 5);
  const [scaleMinLabel, setScaleMinLabel] = useState(question?.scaleMinLabel || '');
  const [scaleMaxLabel, setScaleMaxLabel] = useState(question?.scaleMaxLabel || '');
  const [scaleStep, setScaleStep] = useState(question?.scaleStep ?? 1);

  // ── Matris ──
  const [matrixRows, setMatrixRows] = useState<MatrixRow[]>(
    question?.matrixRows || [{ id: 'r1', text: '' }, { id: 'r2', text: '' }]
  );
  const [matrixColumns, setMatrixColumns] = useState<string[]>(
    question?.matrixColumns || ['1', '2', '3', '4', '5']
  );
  const [matrixType, setMatrixType] = useState<'radio' | 'checkbox'>(question?.matrixType || 'radio');

  // ── Dosya Yükleme ──
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(
    question?.allowedFileTypes || ['.pdf', '.docx', '.jpg', '.png']
  );
  const [maxFileSize, setMaxFileSize] = useState(question?.maxFileSize ?? 10);

  // ── Video ──
  const [video, setVideo] = useState(question?.video || '');

  // ── Soru Ayarları ──
  const [required, setRequired] = useState(question?.required ?? true);
  const [helpText, setHelpText] = useState(question?.helpText || '');
  const [hint, setHint] = useState(question?.hint || '');
  const [placeholder, setPlaceholder] = useState(question?.placeholder || '');
  const [timeLimit, setTimeLimit] = useState(question?.timeLimit ?? 0);

  // ── Validasyon ──
  const [validation, setValidation] = useState<ValidationRules>(question?.validation || {});

  // ── Diğer ──
  const [solution, setSolution] = useState(question?.solution || '');
  const [tags, setTags] = useState(question?.tags?.join(', ') || '');
  const [showOptionSvg, setShowOptionSvg] = useState<Record<number, boolean>>({});
  const [optionSvgPreview, setOptionSvgPreview] = useState<Record<number, boolean>>({});
  const [error, setError] = useState('');
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  // ── Drag State ──
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const filteredSubModules = subModules.filter(s => s.categoryId === categoryId);

  useEffect(() => {
    if (categoryId && !filteredSubModules.find(s => s.id === subModuleId)) {
      setSubModuleId(filteredSubModules[0]?.id || '');
    }
  }, [categoryId]);

  // ── Seçenek İşlemleri ──
  const updateOption = (idx: number, field: keyof QuestionOption, value: any) => {
    const next = [...options];
    next[idx] = { ...next[idx], [field]: value };
    setOptions(next);
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions([...options, { label: getOptionLabel(options.length), text: '' }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= MIN_OPTIONS) return;
    const next = options.filter((_, i) => i !== idx);
    setOptions(next);
    setCorrectAnswers(prev => prev.map(ca => ca > idx ? ca - 1 : ca).filter(ca => ca !== idx));
    // Clean up SVG visibility
    const newShowSvg: Record<number, boolean> = {};
    const newPreview: Record<number, boolean> = {};
    Object.keys(showOptionSvg).forEach(k => {
      const ki = parseInt(k);
      if (ki < idx) { newShowSvg[ki] = showOptionSvg[ki]; newPreview[ki] = optionSvgPreview[ki]; }
      else if (ki > idx) { newShowSvg[ki - 1] = showOptionSvg[ki]; newPreview[ki - 1] = optionSvgPreview[ki]; }
    });
    setShowOptionSvg(newShowSvg);
    setOptionSvgPreview(newPreview);
  };

  const bulkAddOptions = () => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const remaining = MAX_OPTIONS - options.length;
    const toAdd = lines.slice(0, remaining);
    const newOpts: QuestionOption[] = toAdd.map((text, i) => ({ label: getOptionLabel(options.length + i), text }));
    setOptions([...options, ...newOpts]);
    setBulkText('');
    setShowBulkAdd(false);
  };

  // (bulk delete removed)

  // ── Drag & Drop ──
  const handleDragStart = (idx: number) => { setDragIdx(idx); };
  const handleDragOver = (e: DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };
  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) { handleDragEnd(); return; }
    const next = [...options];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    const origOrder = options.map((_, i) => i);
    origOrder.splice(dragIdx, 1);
    origOrder.splice(targetIdx, 0, dragIdx);
    const mapping = new Map<number, number>();
    origOrder.forEach((orig, newI) => mapping.set(orig, newI));
    setOptions(next);
    setCorrectAnswers(prev => prev.map(ca => mapping.get(ca) ?? ca));
    handleDragEnd();
  };

  // ── Eşleştirme İşlemleri ──
  const addPair = () => setMatchingPairs([...matchingPairs, { left: '', right: '' }]);
  const removePair = (idx: number) => {
    if (matchingPairs.length <= 2) return;
    setMatchingPairs(matchingPairs.filter((_, i) => i !== idx));
  };
  const updatePair = (idx: number, side: 'left' | 'right', val: string) => {
    const next = [...matchingPairs];
    next[idx] = { ...next[idx], [side]: val };
    setMatchingPairs(next);
  };

  // ── Matris İşlemleri ──
  const addMatrixRow = () => setMatrixRows([...matrixRows, { id: `r${Date.now()}`, text: '' }]);
  const removeMatrixRow = (idx: number) => {
    if (matrixRows.length <= 1) return;
    setMatrixRows(matrixRows.filter((_, i) => i !== idx));
  };
  const addMatrixCol = () => setMatrixColumns([...matrixColumns, '']);
  const removeMatrixCol = (idx: number) => {
    if (matrixColumns.length <= 2) return;
    setMatrixColumns(matrixColumns.filter((_, i) => i !== idx));
  };

  // ── Stil Helpers ──
  const resetStyles = () => {
    setSvgPosition(DEFAULTS.svgPosition); setSvgAlign(DEFAULTS.svgAlign);
    setTextVerticalAlign(DEFAULTS.textVerticalAlign); setLayoutRatio(DEFAULTS.layoutRatio);
    setSvgMaxHeight(DEFAULTS.svgMaxHeight); setOptionSvgMaxHeight(DEFAULTS.optionSvgMaxHeight);
    setBgColor(DEFAULTS.bgColor);
  };

  const isStyleDirty = svgPosition !== DEFAULTS.svgPosition || svgAlign !== DEFAULTS.svgAlign ||
    textVerticalAlign !== DEFAULTS.textVerticalAlign || layoutRatio !== DEFAULTS.layoutRatio ||
    svgMaxHeight !== DEFAULTS.svgMaxHeight || optionSvgMaxHeight !== DEFAULTS.optionSvgMaxHeight ||
    bgColor !== DEFAULTS.bgColor;

  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const toggleCorrectAnswer = (idx: number) => {
    if (questionType === 'multiple') {
      setCorrectAnswers(prev => prev.includes(idx) ? prev.filter(a => a !== idx) : [...prev, idx]);
    } else {
      setCorrectAnswers([idx]);
    }
  };

  const videoEmbed = getEmbedUrl(video);

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!categoryId || !subModuleId) { setError('Kategori ve alt modül seçin'); return; }
    if (!questionText && !stripHtml(questionText)) { setError('Soru metni gerekli'); return; }

    if (needsOptions(questionType) && options.some(o => !o.text && !stripHtml(o.text || '') && !o.svg && !o.image)) {
      setError('Her seçenekte metin, SVG veya görsel olmalı'); return;
    }

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
      solution,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      correctAnswer: correctAnswers[0] ?? 0,
      correctAnswers,
      randomizeOptions: randomizeOptions || undefined,
      video: video || undefined,
      required: required === false ? false : undefined,
      helpText: helpText || undefined,
      hint: hint || undefined,
      placeholder: placeholder || undefined,
      timeLimit: timeLimit > 0 ? timeLimit : undefined,
    };

    const hasValidation = validation.minLength || validation.maxLength || validation.pattern || validation.minValue !== undefined || validation.maxValue !== undefined;
    if (hasValidation) data.validation = validation;

    if (needsOptions(questionType) || questionType === 'image_choice') {
      data.options = options.map((o, i) => ({
        label: getOptionLabel(i), text: o.text,
        svg: o.svg || undefined, image: o.image || undefined,
        pinned: o.pinned || undefined, score: o.score !== undefined ? o.score : undefined,
        feedback: o.feedback || undefined,
      }));
    } else {
      data.options = [];
    }

    if (questionType === 'matching') data.matchingPairs = matchingPairs;
    if (questionType === 'maxdiff') { data.maxdiffBest = maxdiffBest >= 0 ? maxdiffBest : undefined; data.maxdiffWorst = maxdiffWorst >= 0 ? maxdiffWorst : undefined; }
    if (questionType === 'ranking') data.correctOrder = correctOrder.length > 0 ? correctOrder : undefined;
    if (questionType === 'scale' || questionType === 'slider') {
      data.scaleMin = scaleMin; data.scaleMax = scaleMax;
      data.scaleMinLabel = scaleMinLabel || undefined; data.scaleMaxLabel = scaleMaxLabel || undefined;
      if (questionType === 'slider') data.scaleStep = scaleStep;
    }
    if (questionType === 'nps') {
      data.scaleMin = 0; data.scaleMax = 10;
      data.scaleMinLabel = scaleMinLabel || 'Hiç olası değil'; data.scaleMaxLabel = scaleMaxLabel || 'Kesinlikle olası';
    }
    if (questionType === 'matrix') { data.matrixRows = matrixRows; data.matrixColumns = matrixColumns; data.matrixType = matrixType; }
    if (questionType === 'file_upload') { data.allowedFileTypes = allowedFileTypes; data.maxFileSize = maxFileSize; }

    onSave(data);
  };

  // ═══════════════════════════════════════
  // RENDER — Tek akışlı form (orijinal tasarım dili)
  // ═══════════════════════════════════════

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── Soru Tipi ── */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Soru Tipi</label>
        <select value={questionType} onChange={e => setQuestionType(e.target.value as QuestionType)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
          {Object.entries(QUESTION_TYPE_GROUPS).map(([group, types]) => (
            <optgroup key={group} label={group}>
              {types.map(t => <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>)}
            </optgroup>
          ))}
        </select>
      </div>

      {/* ── Soru Metni ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Soru Metni *</label>
        <RichTextEditor value={questionText} onChange={setQuestionText} placeholder="Soru metnini yazın..." minHeight="4.5rem" collapsible />
      </div>

      {/* ── Görsel (SVG / Resim / Video — 3 tab) ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Medya (Opsiyonel)</label>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button type="button" onClick={() => setVisualMode('svg')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${visualMode === 'svg' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>SVG</button>
            <button type="button" onClick={() => setVisualMode('image')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${visualMode === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Görsel</button>
            <button type="button" onClick={() => setVisualMode('video')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${visualMode === 'video' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Video</button>
          </div>
        </div>
        {visualMode === 'svg' ? (
          <SvgUploader value={svg} onChange={setSvg} previewBgColor={bgColor || undefined} previewAlignClass={ALIGN_CLASS[svgAlign]} previewMaxHeight={`${svgMaxHeight}px`} />
        ) : visualMode === 'image' ? (
          <ImageUploader value={image} onChange={setImage} maxDimension={800} quality={0.7} />
        ) : (
          <div className="space-y-2">
            <input type="url" value={video} onChange={e => setVideo(e.target.value)} placeholder="https://youtube.com/watch?v=... veya https://vimeo.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            {videoEmbed && (
              <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen />
              </div>
            )}
            {video && !videoEmbed && <p className="text-xs text-red-500">Geçersiz video URL (YouTube veya Vimeo linki girin)</p>}
          </div>
        )}
      </div>

      {/* ── Stil Ayarları (collapsible) ── */}
      <div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setShowStylePanel(!showStylePanel)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <svg className={`w-4 h-4 transition-transform ${showStylePanel ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            Stil Ayarları
            <span className="text-xs text-gray-400">(yerleşim, boyut, renk)</span>
          </button>
          {showStylePanel && isStyleDirty && (
            <button type="button" onClick={resetStyles} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
              Tümü Varsayılana Getir
            </button>
          )}
        </div>
        {showStylePanel && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-600">Görsel Konumu (metin-görsel yerleşimi)</label>
                {svgPosition !== DEFAULTS.svgPosition && <button type="button" onClick={() => setSvgPosition(DEFAULTS.svgPosition)} className="text-[10px] text-gray-400 hover:text-amber-600">varsayılan</button>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { val: 'bottom' as SvgPosition, label: 'Altta', icon: '⬇️' },
                  { val: 'top' as SvgPosition, label: 'Üstte', icon: '⬆️' },
                  { val: 'left' as SvgPosition, label: 'Solda', icon: '⬅️' },
                  { val: 'right' as SvgPosition, label: 'Sağda', icon: '➡️' },
                ]).map(p => (
                  <button key={p.val} type="button" onClick={() => setSvgPosition(p.val)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${svgPosition === p.val ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <span className="text-base">{p.icon}</span>{p.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Görselin soru metnine göre konumu</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-600">Görsel Hizalama</label>
                {svgAlign !== DEFAULTS.svgAlign && <button type="button" onClick={() => setSvgAlign(DEFAULTS.svgAlign)} className="text-[10px] text-gray-400 hover:text-amber-600">varsayılan</button>}
              </div>
              <div className="flex gap-2">
                {([
                  { val: 'left' as SvgAlign, label: 'Sola Yasla', icon: '◧' },
                  { val: 'center' as SvgAlign, label: 'Ortala', icon: '◻' },
                  { val: 'right' as SvgAlign, label: 'Sağa Yasla', icon: '◨' },
                ]).map(a => (
                  <button key={a.val} type="button" onClick={() => setSvgAlign(a.val)}
                    className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs transition-colors ${svgAlign === a.val ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <span>{a.icon}</span> {a.label}
                  </button>
                ))}
              </div>
            </div>
            {(svgPosition === 'left' || svgPosition === 'right') && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-600">Metin Dikey Hizalama</label>
                    {textVerticalAlign !== DEFAULTS.textVerticalAlign && <button type="button" onClick={() => setTextVerticalAlign(DEFAULTS.textVerticalAlign)} className="text-[10px] text-gray-400 hover:text-amber-600">varsayılan</button>}
                  </div>
                  <div className="flex gap-2">
                    {([
                      { val: 'top' as TextVerticalAlign, label: 'Üst', icon: '⬆' },
                      { val: 'center' as TextVerticalAlign, label: 'Orta', icon: '⬌' },
                      { val: 'bottom' as TextVerticalAlign, label: 'Alt', icon: '⬇' },
                    ]).map(v => (
                      <button key={v.val} type="button" onClick={() => setTextVerticalAlign(v.val)}
                        className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs transition-colors ${textVerticalAlign === v.val ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        <span>{v.icon}</span> {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Görsel / Metin Genişlik Oranı: <span className="text-indigo-600 font-bold">{layoutRatio}% / {100 - layoutRatio}%</span></label>
                    {layoutRatio !== DEFAULTS.layoutRatio && <button type="button" onClick={() => setLayoutRatio(DEFAULTS.layoutRatio)} className="text-[10px] text-gray-400 hover:text-amber-600">varsayılan</button>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-10">Görsel</span>
                    <input type="range" min={20} max={80} step={5} value={layoutRatio} onChange={e => setLayoutRatio(Number(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    <span className="text-xs text-gray-400 w-10 text-right">Metin</span>
                  </div>
                  <div className="mt-2 flex gap-1 h-3 rounded overflow-hidden">
                    <div className="bg-indigo-300 rounded-l" style={{ width: `${layoutRatio}%` }} />
                    <div className="bg-gray-300 rounded-r" style={{ width: `${100 - layoutRatio}%` }} />
                  </div>
                </div>
              </>
            )}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">Soru SVG Maks. Yükseklik: <span className="text-indigo-600 font-bold">{svgMaxHeight}px</span></label>
                {svgMaxHeight !== DEFAULTS.svgMaxHeight && <button type="button" onClick={() => setSvgMaxHeight(DEFAULTS.svgMaxHeight)} className="text-[10px] text-gray-400 hover:text-amber-600">varsayılan ({DEFAULTS.svgMaxHeight}px)</button>}
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={50} max={500} step={10} value={svgMaxHeight} onChange={e => setSvgMaxHeight(Number(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <input type="number" min={50} max={500} value={svgMaxHeight} onChange={e => setSvgMaxHeight(Number(e.target.value))} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-lg text-center" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">Seçenek SVG Maks. Yükseklik: <span className="text-indigo-600 font-bold">{optionSvgMaxHeight}px</span></label>
                {optionSvgMaxHeight !== DEFAULTS.optionSvgMaxHeight && <button type="button" onClick={() => setOptionSvgMaxHeight(DEFAULTS.optionSvgMaxHeight)} className="text-[10px] text-gray-400 hover:text-amber-600">varsayılan ({DEFAULTS.optionSvgMaxHeight}px)</button>}
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={24} max={200} step={4} value={optionSvgMaxHeight} onChange={e => setOptionSvgMaxHeight(Number(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <input type="number" min={24} max={200} value={optionSvgMaxHeight} onChange={e => setOptionSvgMaxHeight(Number(e.target.value))} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-lg text-center" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">Arka Plan Rengi</label>
                {bgColor && <button type="button" onClick={() => setBgColor(DEFAULTS.bgColor)} className="text-[10px] text-gray-400 hover:text-amber-600">varsayılan</button>}
              </div>
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor || '#f9fafb'} onChange={e => setBgColor(e.target.value)} className="w-10 h-8 cursor-pointer rounded border border-gray-300 p-0.5" />
                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} placeholder="#f9fafb" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg font-mono" />
              </div>
              {bgColor && <div className="mt-2 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: bgColor }} />}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TİP BAZLI FORM ALANLARI                   */}
      {/* ═══════════════════════════════════════════ */}

      {/* ── Seçenekli Tipler (orijinal satır düzeni) ── */}
      {needsOptions(questionType) && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Seçenekler ({getOptionLabel(0)}-{getOptionLabel(options.length - 1)}) *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{options.length} seçenek</span>
              <button type="button" onClick={() => setShowBulkAdd(!showBulkAdd)} className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">+ Toplu</button>
              <button type="button" onClick={addOption} disabled={options.length >= MAX_OPTIONS} className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" title={`Seçenek ekle (maks. ${MAX_OPTIONS})`}>+ Ekle</button>
            </div>
          </div>

          {/* Bulk Add */}
          {showBulkAdd && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={4} placeholder={"Her satıra bir seçenek yazın:\nSeçenek 1\nSeçenek 2\nSeçenek 3"} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowBulkAdd(false); setBulkText(''); }} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">İptal</button>
                <button type="button" onClick={bulkAddOptions} className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Ekle</button>
              </div>
            </div>
          )}

          {/* Randomize & Puanlama */}
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

          {/* Seçenek Listesi — orijinal satır düzeni */}
          <div className="space-y-2">
            {options.map((opt, i) => {
              const isCorrect = correctAnswers.includes(i);
              const isDragging = dragIdx === i;
              const isDragOver = dragOverIdx === i;
              return (
                <div
                  key={i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  onDrop={() => handleDrop(i)}
                  className={`${isDragging ? 'opacity-40' : ''} ${isDragOver ? 'border-t-2 border-indigo-400' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {/* Drag handle */}
                    <div className="flex items-center mt-2.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
                    </div>
                    {/* Doğru cevap */}
                    <button type="button" onClick={() => toggleCorrectAnswer(i)}
                      className={`w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-colors ${questionType === 'multiple'
                        ? (isCorrect ? 'bg-green-600 text-white rounded-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-md')
                        : (isCorrect ? 'bg-green-600 text-white rounded-full' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full')}`}
                      title={isCorrect ? 'Doğru cevap' : 'Doğru cevap olarak işaretle'}>
                      {getOptionLabel(i)}
                    </button>
                    {/* Editör + kontroller */}
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <RichTextEditor value={opt.text} onChange={val => updateOption(i, 'text', val)} placeholder={opt.svg ? `Seçenek ${getOptionLabel(i)} metni (opsiyonel)` : `Seçenek ${getOptionLabel(i)} metni`} minHeight="2.2rem" collapsible />
                        </div>
                        {/* Inline kontroller */}
                        {randomizeOptions && (
                          <button type="button" onClick={() => updateOption(i, 'pinned', !opt.pinned)}
                            className={`px-1.5 py-1.5 text-xs font-medium rounded-lg border flex-shrink-0 mt-0.5 transition-colors ${opt.pinned ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`}
                            title={opt.pinned ? 'Sabitlendi' : 'Sabitle'}>
                            {opt.pinned ? '📌' : 'Pin'}
                          </button>
                        )}
                        {showScoring && (
                          <input type="number" value={opt.score ?? (isCorrect ? 1 : 0)} onChange={e => updateOption(i, 'score', Number(e.target.value))}
                            className="w-12 px-1 py-1.5 text-xs border border-gray-300 rounded-lg text-center flex-shrink-0 mt-0.5" title="Puan" />
                        )}
                        <button type="button" onClick={() => setShowOptionSvg(prev => ({ ...prev, [i]: !prev[i] }))}
                          className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 mt-0.5 ${showOptionSvg[i] || opt.svg || opt.image ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`}
                          title="Görsel ekle">
                          {opt.svg || opt.image ? '🖼' : '+ Görsel'}
                        </button>
                        <button type="button" onClick={() => setShowFeedback(prev => ({ ...prev, [i]: !prev[i] }))}
                          className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 mt-0.5 ${showFeedback[i] || opt.feedback ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'}`}
                          title="Geri bildirim">
                          💬
                        </button>
                        {options.length > MIN_OPTIONS && (
                          <button type="button" onClick={() => removeOption(i)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 mt-0.5" title={`Seçenek ${getOptionLabel(i)} sil`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                      {/* Feedback textarea */}
                      {showFeedback[i] && (
                        <textarea value={opt.feedback || ''} onChange={e => updateOption(i, 'feedback', e.target.value)} placeholder="Bu seçenek neden doğru/yanlış..." rows={2} className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-amber-50/50 focus:ring-1 focus:ring-amber-300" />
                      )}
                      {/* Görsel uploader */}
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
          <p className="text-xs text-gray-400 mt-1">
            {questionType === 'image_choice' ? 'Her seçeneğe görsel ekleyin, doğru cevabı yeşil harfe tıklayarak seçin' : questionType === 'multiple' ? 'Birden fazla doğru cevabı tıklayarak seçin' : 'Doğru cevabı yeşil harfe tıklayarak seçin'}
          </p>
        </div>
      )}

      {/* ── Eşleştirme ── */}
      {questionType === 'matching' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Eşleştirme Çiftleri *</label>
            <button type="button" onClick={addPair} className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">+ Çift Ekle</button>
          </div>
          <div className="space-y-2">
            {matchingPairs.map((pair, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-6">{i + 1}.</span>
                <input type="text" value={pair.left} onChange={e => updatePair(i, 'left', e.target.value)} placeholder="Sol öğe" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <span className="text-gray-400">↔</span>
                <input type="text" value={pair.right} onChange={e => updatePair(i, 'right', e.target.value)} placeholder="Sağ öğe" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                {matchingPairs.length > 2 && (
                  <button type="button" onClick={() => removePair(i)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">Doğru eşleşmeleri girin. Test sırasında sağ sütun karıştırılır.</p>
        </div>
      )}

      {/* ── Ölçek ── */}
      {questionType === 'scale' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">Ölçek Ayarları</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-600 mb-1 block">Min Değer</label><input type="number" value={scaleMin} onChange={e => setScaleMin(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Max Değer</label><input type="number" value={scaleMax} onChange={e => setScaleMax(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Sol Uç Etiketi</label><input type="text" value={scaleMinLabel} onChange={e => setScaleMinLabel(e.target.value)} placeholder="Hiç katılmıyorum" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Sağ Uç Etiketi</label><input type="text" value={scaleMaxLabel} onChange={e => setScaleMaxLabel(e.target.value)} placeholder="Tamamen katılıyorum" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-gray-500">{scaleMinLabel || scaleMin}</span>
            <div className="flex gap-1 flex-1 justify-center">
              {Array.from({ length: Math.min(scaleMax - scaleMin + 1, 15) }, (_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500">{scaleMin + i}</div>
              ))}
            </div>
            <span className="text-xs text-gray-500">{scaleMaxLabel || scaleMax}</span>
          </div>
        </div>
      )}

      {/* ── Yıldız ── */}
      {questionType === 'star' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Yıldız Derecelendirme Önizleme</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <svg key={n} className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            ))}
          </div>
        </div>
      )}

      {/* ── NPS ── */}
      {questionType === 'nps' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">NPS (Net Promoter Score)</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-600 mb-1 block">Sol Uç Etiketi</label><input type="text" value={scaleMinLabel} onChange={e => setScaleMinLabel(e.target.value)} placeholder="Hiç olası değil" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Sağ Uç Etiketi</label><input type="text" value={scaleMaxLabel} onChange={e => setScaleMaxLabel(e.target.value)} placeholder="Kesinlikle olası" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <div className="flex items-end gap-1 pt-2">
            <span className="text-[10px] text-gray-400 pb-1">{scaleMinLabel || 'Hiç olası değil'}</span>
            <div className="flex gap-0.5 flex-1 justify-center">
              {Array.from({ length: 11 }, (_, i) => {
                const color = i <= 6 ? 'border-red-300 text-red-600' : i <= 8 ? 'border-amber-300 text-amber-600' : 'border-green-300 text-green-600';
                return <div key={i} className={`w-7 h-7 rounded border-2 ${color} flex items-center justify-center text-[10px] font-bold`}>{i}</div>;
              })}
            </div>
            <span className="text-[10px] text-gray-400 pb-1">{scaleMaxLabel || 'Kesinlikle olası'}</span>
          </div>
        </div>
      )}

      {/* ── Slider ── */}
      {questionType === 'slider' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">Slider Ayarları</p>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs text-gray-600 mb-1 block">Min</label><input type="number" value={scaleMin} onChange={e => setScaleMin(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Max</label><input type="number" value={scaleMax} onChange={e => setScaleMax(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Adım</label><input type="number" value={scaleStep} onChange={e => setScaleStep(Number(e.target.value))} min={0.1} step={0.1} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-600 mb-1 block">Sol Uç Etiketi</label><input type="text" value={scaleMinLabel} onChange={e => setScaleMinLabel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs text-gray-600 mb-1 block">Sağ Uç Etiketi</label><input type="text" value={scaleMaxLabel} onChange={e => setScaleMaxLabel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{scaleMinLabel || scaleMin}</span><span>{scaleMaxLabel || scaleMax}</span></div>
            <input type="range" min={scaleMin} max={scaleMax} step={scaleStep} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" disabled />
          </div>
        </div>
      )}

      {/* ── Sıralama ── */}
      {questionType === 'ranking' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700 font-medium">Doğru sıralama: Yukarıdaki seçenekleri doğru sırada ekleyin. İlk seçenek = 1. sıra</p>
        </div>
      )}

      {/* ── MaxDiff ── */}
      {questionType === 'maxdiff' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">MaxDiff Doğru Cevaplar</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">En İyi (Best)</label>
              <select value={maxdiffBest} onChange={e => setMaxdiffBest(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value={-1}>Seçin...</option>
                {options.map((o, i) => <option key={i} value={i}>{getOptionLabel(i)}: {stripHtml(o.text).slice(0, 30)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">En Kötü (Worst)</label>
              <select value={maxdiffWorst} onChange={e => setMaxdiffWorst(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value={-1}>Seçin...</option>
                {options.map((o, i) => <option key={i} value={i}>{getOptionLabel(i)}: {stripHtml(o.text).slice(0, 30)}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Matris ── */}
      {questionType === 'matrix' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Matris Ayarları</p>
          <div className="flex items-center gap-4">
            <label className="text-xs text-gray-600">Satır başına:</label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="radio" checked={matrixType === 'radio'} onChange={() => setMatrixType('radio')} className="text-indigo-600" /> Tek seçim</label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="radio" checked={matrixType === 'checkbox'} onChange={() => setMatrixType('checkbox')} className="text-indigo-600" /> Çoklu seçim</label>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1"><label className="text-xs font-medium text-gray-600">Satırlar</label><button type="button" onClick={addMatrixRow} className="text-xs text-indigo-600 hover:text-indigo-700">+ Satır</button></div>
            <div className="space-y-1">
              {matrixRows.map((row, i) => (
                <div key={row.id} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                  <input type="text" value={row.text} onChange={e => { const next = [...matrixRows]; next[i] = { ...next[i], text: e.target.value }; setMatrixRows(next); }} placeholder={`Madde ${i + 1}`} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                  {matrixRows.length > 1 && <button type="button" onClick={() => removeMatrixRow(i)} className="p-1 text-gray-300 hover:text-red-500"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1"><label className="text-xs font-medium text-gray-600">Sütunlar</label><button type="button" onClick={addMatrixCol} className="text-xs text-indigo-600 hover:text-indigo-700">+ Sütun</button></div>
            <div className="flex flex-wrap gap-1">
              {matrixColumns.map((col, i) => (
                <div key={i} className="flex items-center gap-0.5">
                  <input type="text" value={col} onChange={e => { const next = [...matrixColumns]; next[i] = e.target.value; setMatrixColumns(next); }} className="w-20 px-2 py-1 border border-gray-300 rounded text-xs text-center" />
                  {matrixColumns.length > 2 && <button type="button" onClick={() => removeMatrixCol(i)} className="text-gray-300 hover:text-red-500 text-xs">×</button>}
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse">
              <thead><tr><th className="p-1.5 text-left text-gray-500"></th>{matrixColumns.map((col, i) => <th key={i} className="p-1.5 text-center text-gray-600 font-medium">{col || `S${i + 1}`}</th>)}</tr></thead>
              <tbody>
                {matrixRows.map((row, ri) => (
                  <tr key={row.id} className="border-t border-gray-200">
                    <td className="p-1.5 text-gray-700">{row.text || `Madde ${ri + 1}`}</td>
                    {matrixColumns.map((_, ci) => <td key={ci} className="p-1.5 text-center">{matrixType === 'radio' ? <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300" /> : <span className="inline-block w-4 h-4 rounded border-2 border-gray-300" />}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Dosya Yükleme ── */}
      {questionType === 'file_upload' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">Dosya Yükleme Ayarları</p>
          <div><label className="text-xs text-gray-600 mb-1 block">İzin Verilen Dosya Tipleri</label><input type="text" value={allowedFileTypes.join(', ')} onChange={e => setAllowedFileTypes(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder=".pdf, .docx, .jpg, .png" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          <div><label className="text-xs text-gray-600 mb-1 block">Maks. Dosya Boyutu (MB)</label><input type="number" value={maxFileSize} onChange={e => setMaxFileSize(Number(e.target.value))} min={1} max={100} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        </div>
      )}

      {/* ── Metin Tipleri ── */}
      {(questionType === 'short_text' || questionType === 'long_text') && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">{questionType === 'short_text' ? 'Kısa Paragraf' : 'Uzun Paragraf'} Önizleme</p>
          {questionType === 'short_text' ? (
            <input type="text" disabled placeholder={placeholder || 'Cevabınızı yazın...'} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
          ) : (
            <textarea disabled placeholder={placeholder || 'Cevabınızı yazın...'} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
          )}
        </div>
      )}

      {/* ── Tarih/Saat ── */}
      {(questionType === 'date' || questionType === 'time') && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{questionType === 'date' ? 'Tarih' : 'Saat'} Seçici Önizleme</p>
          <input type={questionType === 'date' ? 'date' : 'time'} disabled className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
        </div>
      )}

      {/* ── Çözüm ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Çözüm Açıklaması</label>
        <RichTextEditor value={solution} onChange={setSolution} placeholder="Doğru cevabın açıklamasını yazın..." minHeight="4.5rem" collapsible />
      </div>

      {/* ── Etiketler ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler</label>
        <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="virgülle ayırın: grafik, yüzde, karşılaştırma" />
      </div>

      {/* ── Zorluk Seviyesi ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk Seviyesi *</label>
        <div className="flex flex-wrap gap-2">
          {ALL_DIFFICULTIES.map(d => {
            const { bg, text } = DIFFICULTY_COLORS[d];
            const isSelected = difficulty === d;
            return (
              <button key={d} type="button" onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? `${bg} ${text} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {DIFFICULTY_LABELS[d]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Kategori & Alt Modül ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Seçin...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Modül *</label>
          <select value={subModuleId} onChange={e => setSubModuleId(e.target.value)} disabled={!categoryId} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
            <option value="">Seçin...</option>
            {filteredSubModules.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* ── Soru Ayarları (collapsible) ── */}
      <div>
        <button type="button" onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
          <svg className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          Soru Ayarları
        </button>
        {showSettings && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={required} onChange={e => setRequired(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Zorunlu soru
            </label>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Yardım Metni</label>
              <textarea value={helpText} onChange={e => setHelpText(e.target.value)} rows={2} placeholder="Soru altında görünecek açıklama..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">İpucu</label>
              <textarea value={hint} onChange={e => setHint(e.target.value)} rows={2} placeholder="Kullanıcı talep edince gösterilecek ipucu..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            {(questionType === 'short_text' || questionType === 'long_text') && (
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Placeholder</label>
                <input type="text" value={placeholder} onChange={e => setPlaceholder(e.target.value)} placeholder="Input placeholder metni" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Süre Limiti (saniye, 0 = sınırsız)</label>
              <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
        )}
      </div>

      {/* ── Validasyon (collapsible, metin/sayısal tipler için) ── */}
      {(questionType === 'short_text' || questionType === 'long_text' || questionType === 'scale' || questionType === 'slider') && (
        <div>
          <button type="button" onClick={() => setShowValidation(!showValidation)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <svg className={`w-4 h-4 transition-transform ${showValidation ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            Validasyon Kuralları
          </button>
          {showValidation && (
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              {(questionType === 'short_text' || questionType === 'long_text') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-gray-600 mb-1 block">Min Karakter</label><input type="number" value={validation.minLength || ''} onChange={e => setValidation({ ...validation, minLength: e.target.value ? Number(e.target.value) : undefined })} min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                    <div><label className="text-xs text-gray-600 mb-1 block">Max Karakter</label><input type="number" value={validation.maxLength || ''} onChange={e => setValidation({ ...validation, maxLength: e.target.value ? Number(e.target.value) : undefined })} min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  </div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Regex Pattern</label><input type="text" value={validation.pattern || ''} onChange={e => setValidation({ ...validation, pattern: e.target.value || undefined })} placeholder="^[a-zA-Z]+$" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Pattern Hata Mesajı</label><input type="text" value={validation.patternMessage || ''} onChange={e => setValidation({ ...validation, patternMessage: e.target.value || undefined })} placeholder="Sadece harf giriniz" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </>
              )}
              {(questionType === 'scale' || questionType === 'slider') && (
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-600 mb-1 block">Min Değer</label><input type="number" value={validation.minValue ?? ''} onChange={e => setValidation({ ...validation, minValue: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-600 mb-1 block">Max Değer</label><input type="number" value={validation.maxValue ?? ''} onChange={e => setValidation({ ...validation, maxValue: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Önizleme Popup Modal ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowPreviewModal(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                <h3 className="text-sm font-semibold text-gray-900">Soru Önizleme</h3>
                <span className="text-xs text-gray-400 ml-1">{QUESTION_TYPE_LABELS[questionType]}</span>
              </div>
              <button type="button" onClick={() => setShowPreviewModal(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Soru metni + Görsel */}
              {(svg || image) ? (
                (() => {
                  const isH = svgPosition === 'left' || svgPosition === 'right';
                  const activeVisual = visualMode === 'image' ? image : svg;
                  const textBlock = (
                    <div>
                      <div className="rich-text-content text-base font-semibold text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(questionText) }} />
                      {helpText && <p className="text-xs text-gray-400 italic mt-1">{helpText}</p>}
                    </div>
                  );
                  const visualBlock = (
                    <div className={`p-4 rounded-xl border border-gray-200 flex ${ALIGN_CLASS[svgAlign]}`} style={{ backgroundColor: bgColor || '#f9fafb' }}>
                      {visualMode === 'image' && image ? (
                        <img src={image} alt="Soru görseli" style={{ maxHeight: `${svgMaxHeight}px` }} className="object-contain" />
                      ) : svg ? (
                        <div className="svg-question" style={{ '--svg-max-h': `${svgMaxHeight}px` } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: svg }} />
                      ) : null}
                    </div>
                  );
                  if (!activeVisual) return textBlock;
                  return isH ? (
                    <div className={`flex gap-4 ${VALIGN_CLASS[textVerticalAlign]} ${svgPosition === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="min-w-0" style={{ width: `${100 - layoutRatio}%` }}>{textBlock}</div>
                      <div className="min-w-0" style={{ width: `${layoutRatio}%` }}>{visualBlock}</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {svgPosition === 'top' ? <>{visualBlock}{textBlock}</> : <>{textBlock}{visualBlock}</>}
                    </div>
                  );
                })()
              ) : questionText ? (
                <div>
                  <div className="rich-text-content text-base font-semibold text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(questionText) }} />
                  {helpText && <p className="text-xs text-gray-400 italic mt-1">{helpText}</p>}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Soru metni henüz girilmedi...</p>
              )}

              {/* Seçenekler */}
              {needsOptions(questionType) && options.some(o => o.text || o.svg || o.image) && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Seçenekler</p>
                  {options.map((opt, i) => {
                    if (!opt.text && !opt.svg && !opt.image) return null;
                    const isCorrect = correctAnswers.includes(i);
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                        <span className={`w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 ${questionType === 'multiple' ? 'rounded-md' : 'rounded-full'} ${isCorrect ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{getOptionLabel(i)}</span>
                        <div className="flex-1 min-w-0">
                          {opt.text && <div className="rich-text-content text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: renderMath(opt.text) }} />}
                          {opt.image && <img src={opt.image} alt="" style={{ maxHeight: `${optionSvgMaxHeight}px` }} className="mt-1 object-contain" />}
                          {opt.svg && !opt.image && <div className="svg-option mt-1" style={{ '--svg-opt-h': `${optionSvgMaxHeight}px` } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: opt.svg }} />}
                        </div>
                        {isCorrect && <svg className="w-5 h-5 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Çözüm */}
              {solution && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Çözüm</p>
                  <div className="rich-text-content text-sm text-amber-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(solution) }} />
                </div>
              )}

              {/* Video */}
              {video && getEmbedUrl(video) && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Video</p>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe src={getEmbedUrl(video)!} className="w-full h-full" allowFullScreen />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Hata ── */}
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {/* ── Butonlar ── */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowPreviewModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          Önizleme
        </button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">İptal</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            {question ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </div>
    </form>
  );
}
