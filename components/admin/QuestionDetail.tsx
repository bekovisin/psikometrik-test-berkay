'use client';

import { Question, SvgPosition, SvgAlign, TextVerticalAlign, QUESTION_TYPE_LABELS, QuestionType, ReviewStatus, REVIEW_STATUS_LABELS, REVIEW_STATUS_COLORS } from '@/lib/types';
import { renderMath } from '@/lib/math';
import { getEmbedUrl } from '@/lib/utils';
import DifficultyBadge from './DifficultyBadge';
import VisualContentRenderer from './VisualContentRenderer';

const getOptionLabel = (i: number) => String.fromCharCode(65 + i);

const ALIGN_CLASS: Record<SvgAlign, string> = { center: 'justify-center', left: 'justify-start', right: 'justify-end' };
const VALIGN_CLASS: Record<TextVerticalAlign, string> = { top: 'items-start', center: 'items-center', bottom: 'items-end' };

const TYPE_BADGE_COLORS: Partial<Record<QuestionType, string>> = {
  single: 'bg-blue-100 text-blue-700',
  multiple: 'bg-violet-100 text-violet-700',
  dropdown: 'bg-cyan-100 text-cyan-700',
  image_choice: 'bg-pink-100 text-pink-700',
  short_text: 'bg-gray-100 text-gray-700',
  long_text: 'bg-gray-100 text-gray-700',
  scale: 'bg-amber-100 text-amber-700',
  star: 'bg-yellow-100 text-yellow-700',
  nps: 'bg-emerald-100 text-emerald-700',
  slider: 'bg-orange-100 text-orange-700',
  ranking: 'bg-indigo-100 text-indigo-700',
  matching: 'bg-teal-100 text-teal-700',
  maxdiff: 'bg-rose-100 text-rose-700',
  matrix: 'bg-purple-100 text-purple-700',
  file_upload: 'bg-slate-100 text-slate-700',
  date: 'bg-sky-100 text-sky-700',
  time: 'bg-sky-100 text-sky-700',
};

export default function QuestionDetail({ question, onClose, onEdit, onDelete, onFlag, onVerify }: {
  question: Question;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFlag?: () => void;
  onVerify?: () => void;
}) {
  const svgMaxH = question.svgMaxHeight || 300;
  const optSvgMaxH = question.optionSvgMaxHeight || 48;
  const svgPos: SvgPosition = question.svgPosition || 'top';
  const svgAl: SvgAlign = question.svgAlign || 'center';
  const textVA: TextVerticalAlign = question.textVerticalAlign || 'top';
  const ratio = question.layoutRatio || 50;
  const qType: QuestionType = question.questionType || 'single';
  const correctAnswers = question.correctAnswers || [question.correctAnswer];

  const exportSvg = () => {
    if (!question.svg) return;
    const blob = new Blob([question.svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `soru-${question.id}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const videoEmbed = question.video ? getEmbedUrl(question.video) : null;

  const renderText = () => (
    <div>
      <div className="rich-text-content text-base font-semibold text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(question.questionText) }} />
      {question.helpText && <p className="text-xs text-gray-400 italic mt-1">{question.helpText}</p>}
    </div>
  );

  const hasVisual = !!(question.visualContent || question.svg || question.image);

  const renderVisual = () => {
    // Yeni visualContent varsa → VisualContentRenderer kullan
    if (question.visualContent) {
      return (
        <VisualContentRenderer
          content={question.visualContent}
          bgColor={question.bgColor}
          maxHeight={svgMaxH}
        />
      );
    }
    // Eski format: image
    if (question.image) {
      return (
        <div className="relative group">
          <div className={`p-4 rounded-xl border border-gray-200 flex ${ALIGN_CLASS[svgAl]}`} style={{ backgroundColor: question.bgColor || '#f9fafb' }}>
            <img src={question.image} alt="Soru görseli" style={{ maxHeight: `${svgMaxH}px` }} className="object-contain" />
          </div>
        </div>
      );
    }
    // Eski format: svg
    if (question.svg) {
      return (
        <div className="relative group">
          <div className={`p-4 rounded-xl border border-gray-200 flex ${ALIGN_CLASS[svgAl]}`} style={{ backgroundColor: question.bgColor || '#f9fafb' }}>
            <div className="svg-question" style={{ '--svg-max-h': `${svgMaxH}px` } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: question.svg }} />
          </div>
          <button onClick={exportSvg} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 px-2 py-1 bg-white rounded-lg shadow text-xs font-medium text-gray-600 hover:text-indigo-600 transition-all">SVG İndir</button>
        </div>
      );
    }
    return null;
  };

  const isHorizontal = svgPos === 'left' || svgPos === 'right';

  // ── Seçenekli render ──
  const renderOptions = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase">Seçenekler</p>
      {question.options.map((opt, i) => {
        const isCorrect = correctAnswers.includes(i);
        const hasOptVisual = !!(opt.svg || opt.image);
        return (
          <div key={i} className={`flex ${hasOptVisual ? 'items-start' : 'items-center'} gap-3 p-3 rounded-lg border ${isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <span className={`w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 ${qType === 'multiple' ? 'rounded-md' : 'rounded-full'} ${isCorrect ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {getOptionLabel(i)}
            </span>
            <div className="flex-1 min-w-0">
              {opt.text && <div className="rich-text-content text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: renderMath(opt.text) }} />}
              {opt.image && (
                <div className={`${opt.text ? 'mt-2' : ''} inline-block p-2 rounded border border-gray-100`} style={{ backgroundColor: question.bgColor || 'white' }}>
                  <img src={opt.image} alt={`Seçenek ${getOptionLabel(i)}`} style={{ maxHeight: `${optSvgMaxH}px` }} className="object-contain" />
                </div>
              )}
              {opt.svg && !opt.image && (
                <div className={`${opt.text ? 'mt-2' : ''} inline-block p-2 rounded border border-gray-100`} style={{ backgroundColor: question.bgColor || 'white' }}>
                  <div className="svg-option" style={{ '--svg-opt-h': `${optSvgMaxH}px` } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: opt.svg }} />
                </div>
              )}
              {opt.feedback && <p className="text-xs text-amber-600 mt-1 italic">{opt.feedback}</p>}
              {opt.pinned && <span className="inline-block mt-1 text-[10px] text-amber-500">📌 Sabit</span>}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {opt.score !== undefined && opt.score !== 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${opt.score > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{opt.score > 0 ? '+' : ''}{opt.score}</span>
              )}
              {isCorrect && <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Ölçek render ──
  const renderScale = () => {
    const min = question.scaleMin ?? 1;
    const max = question.scaleMax ?? 5;
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase">Ölçek</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{question.scaleMinLabel || min}</span>
          <div className="flex gap-1 flex-1 justify-center">
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500">{min + i}</div>
            ))}
          </div>
          <span className="text-xs text-gray-500">{question.scaleMaxLabel || max}</span>
        </div>
      </div>
    );
  };

  // ── Yıldız render ──
  const renderStar = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase">Yıldız Derecelendirme</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <svg key={n} className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        ))}
      </div>
    </div>
  );

  // ── NPS render ──
  const renderNps = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase">NPS (0-10)</p>
      <div className="flex items-end gap-1">
        <span className="text-[10px] text-gray-400 pb-1">{question.scaleMinLabel || 'Hiç olası değil'}</span>
        <div className="flex gap-0.5 flex-1 justify-center">
          {Array.from({ length: 11 }, (_, i) => {
            const color = i <= 6 ? 'border-red-300 text-red-600 bg-red-50' : i <= 8 ? 'border-amber-300 text-amber-600 bg-amber-50' : 'border-green-300 text-green-600 bg-green-50';
            return <div key={i} className={`w-7 h-7 rounded border-2 ${color} flex items-center justify-center text-[10px] font-bold`}>{i}</div>;
          })}
        </div>
        <span className="text-[10px] text-gray-400 pb-1">{question.scaleMaxLabel || 'Kesinlikle olası'}</span>
      </div>
    </div>
  );

  // ── Slider render ──
  const renderSlider = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase">Slider</p>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{question.scaleMinLabel || question.scaleMin || 0}</span>
        <span className="text-gray-400">adım: {question.scaleStep || 1}</span>
        <span>{question.scaleMaxLabel || question.scaleMax || 100}</span>
      </div>
      <input type="range" min={question.scaleMin || 0} max={question.scaleMax || 100} step={question.scaleStep || 1} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" disabled />
    </div>
  );

  // ── Eşleştirme render ──
  const renderMatching = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase">Eşleştirme</p>
      <div className="space-y-1">
        {(question.matchingPairs || []).map((pair, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200">
            <span className="text-xs font-bold text-gray-400">{i + 1}.</span>
            <span className="flex-1 text-sm text-gray-800 bg-blue-50 px-2 py-1 rounded">{pair.left}</span>
            <span className="text-gray-400">↔</span>
            <span className="flex-1 text-sm text-gray-800 bg-green-50 px-2 py-1 rounded">{pair.right}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── MaxDiff render ──
  const renderMaxdiff = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase">MaxDiff Seçenekler</p>
      {question.options.map((opt, i) => {
        const isBest = question.maxdiffBest === i;
        const isWorst = question.maxdiffWorst === i;
        return (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${isBest ? 'border-green-300 bg-green-50' : isWorst ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
            {isWorst && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">En Kötü</span>}
            {isBest && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">En İyi</span>}
            {!isBest && !isWorst && <span className="w-16" />}
            <span className="text-sm text-gray-800 flex-1">{opt.text}</span>
          </div>
        );
      })}
    </div>
  );

  // ── Matris render ──
  const renderMatrix = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase">Matris ({question.matrixType === 'checkbox' ? 'Çoklu Seçim' : 'Tekli Seçim'})</p>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-left text-gray-500 font-medium"></th>
              {(question.matrixColumns || []).map((col, i) => <th key={i} className="p-2 text-center text-gray-600 font-medium">{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {(question.matrixRows || []).map((row, ri) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="p-2 text-gray-700">{row.text}</td>
                {(question.matrixColumns || []).map((_, ci) => (
                  <td key={ci} className="p-2 text-center">
                    {question.matrixType === 'checkbox'
                      ? <span className="inline-block w-4 h-4 rounded border-2 border-gray-300" />
                      : <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Tip bazlı cevap alanı ──
  const renderTypeSpecificContent = () => {
    switch (qType) {
      case 'single':
      case 'multiple':
      case 'dropdown':
      case 'image_choice':
      case 'ranking':
        return renderOptions();
      case 'matching':
        return renderMatching();
      case 'maxdiff':
        return renderMaxdiff();
      case 'scale':
        return renderScale();
      case 'star':
        return renderStar();
      case 'nps':
        return renderNps();
      case 'slider':
        return renderSlider();
      case 'matrix':
        return renderMatrix();
      case 'short_text':
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Metin Yanıtı</p>
            <input type="text" disabled placeholder={question.placeholder || 'Cevabınızı yazın...'} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
          </div>
        );
      case 'long_text':
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Metin Yanıtı</p>
            <textarea disabled placeholder={question.placeholder || 'Cevabınızı yazın...'} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
          </div>
        );
      case 'file_upload':
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Dosya Yükleme</p>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-xs text-gray-500">İzin verilen: {(question.allowedFileTypes || []).join(', ')}</p>
              <p className="text-xs text-gray-400">Maks. boyut: {question.maxFileSize || 10}MB</p>
            </div>
          </div>
        );
      case 'date':
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Tarih Seçici</p>
            <input type="date" disabled className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
          </div>
        );
      case 'time':
        return (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Saat Seçici</p>
            <input type="time" disabled className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tip Badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TYPE_BADGE_COLORS[qType] || 'bg-gray-100 text-gray-700'}`}>
              {QUESTION_TYPE_LABELS[qType] || 'Tekli Seçim'}
            </span>
            <DifficultyBadge difficulty={question.difficulty} size="md" />
            {question.required === false && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Opsiyonel</span>}
            {question.randomizeOptions && <span className="text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">Karışık</span>}
            {question.timeLimit && question.timeLimit > 0 && <span className="text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">{question.timeLimit}sn</span>}
            <span className="text-xs text-gray-400 font-mono">{question.id}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Review Status Badge */}
            {(() => {
              const status: ReviewStatus = (question.reviewStatus as ReviewStatus) || 'unreviewed';
              const colors = REVIEW_STATUS_COLORS[status];
              return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  {REVIEW_STATUS_LABELS[status]}
                </span>
              );
            })()}
            <span className="w-px h-5 bg-gray-200 mx-0.5" />
            {/* Flag/Verify Action Buttons */}
            {onFlag && (question.reviewStatus || 'unreviewed') !== 'flagged' && (
              <button onClick={onFlag} className="px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Sorunlu</button>
            )}
            {onVerify && (question.reviewStatus || 'unreviewed') !== 'verified' && (
              <button onClick={onVerify} className="px-2.5 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors">Onayla</button>
            )}
            <button onClick={onEdit} className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">Düzenle</button>
            <button onClick={onDelete} className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Sil</button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="px-6 pt-5 pb-8 space-y-5">
          {/* Soru Metni + Görsel Layout */}
          {hasVisual ? (
            isHorizontal ? (
              <div className={`flex gap-4 ${VALIGN_CLASS[textVA]} ${svgPos === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="min-w-0" style={{ width: `${100 - ratio}%` }}>{renderText()}</div>
                <div className="min-w-0" style={{ width: `${ratio}%` }}>{renderVisual()}</div>
              </div>
            ) : (
              <div className="space-y-4">
                {svgPos === 'top' ? <>{renderVisual()}{renderText()}</> : <>{renderText()}{renderVisual()}</>}
              </div>
            )
          ) : (
            renderText()
          )}

          {/* Video Embed */}
          {videoEmbed && (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe src={videoEmbed} className="absolute inset-0 w-full h-full rounded-lg" allowFullScreen />
            </div>
          )}

          {/* Hint */}
          {question.hint && (
            <details className="group">
              <summary className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-700 font-medium">İpucu göster</summary>
              <p className="mt-1 text-xs text-gray-600 bg-indigo-50 border border-indigo-100 rounded-lg p-2">{question.hint}</p>
            </details>
          )}

          {/* Tip Bazlı İçerik */}
          {renderTypeSpecificContent()}

          {/* Çözüm */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 uppercase mb-2">Çözüm</p>
            <div className="rich-text-content text-sm text-amber-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMath(question.solution) }} />
          </div>

          {/* Validasyon Kuralları */}
          {question.validation && (question.validation.minLength || question.validation.maxLength || question.validation.pattern) && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Validasyon</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                {question.validation.minLength && <span>Min: {question.validation.minLength} karakter</span>}
                {question.validation.maxLength && <span>Max: {question.validation.maxLength} karakter</span>}
                {question.validation.pattern && <span>Pattern: <code className="bg-gray-200 px-1 rounded">{question.validation.pattern}</code></span>}
              </div>
            </div>
          )}

          {/* Etiketler */}
          {question.tags && question.tags.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500">Etiketler:</span>
                {question.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
