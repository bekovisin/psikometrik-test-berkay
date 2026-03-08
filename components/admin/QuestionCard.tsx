'use client';

import { Question, QUESTION_TYPE_LABELS, QuestionType, ReviewStatus, REVIEW_STATUS_COLORS } from '@/lib/types';
import DifficultyBadge from './DifficultyBadge';
import VisualContentRenderer from './VisualContentRenderer';

const getOptionLabel = (i: number) => String.fromCharCode(65 + i);

const TYPE_BADGE_COLORS: Partial<Record<QuestionType, string>> = {
  single: 'bg-blue-50 text-blue-600',
  multiple: 'bg-violet-50 text-violet-600',
  dropdown: 'bg-cyan-50 text-cyan-600',
  image_choice: 'bg-pink-50 text-pink-600',
  short_text: 'bg-gray-50 text-gray-600',
  long_text: 'bg-gray-50 text-gray-600',
  scale: 'bg-amber-50 text-amber-600',
  star: 'bg-yellow-50 text-yellow-600',
  nps: 'bg-emerald-50 text-emerald-600',
  slider: 'bg-orange-50 text-orange-600',
  ranking: 'bg-indigo-50 text-indigo-600',
  matching: 'bg-teal-50 text-teal-600',
  maxdiff: 'bg-rose-50 text-rose-600',
  matrix: 'bg-purple-50 text-purple-600',
  file_upload: 'bg-slate-50 text-slate-600',
  date: 'bg-sky-50 text-sky-600',
  time: 'bg-sky-50 text-sky-600',
};

export default function QuestionCard({ question, onEdit, onDelete, onSelect }: {
  question: Question;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
}) {
  const qType: QuestionType = question.questionType || 'single';
  const correctAnswers = question.correctAnswers || [question.correctAnswer];

  const renderCorrectInfo = () => {
    switch (qType) {
      case 'single':
      case 'dropdown':
        return <span className="font-medium text-green-600">Doğru: {getOptionLabel(correctAnswers[0])}</span>;
      case 'multiple':
        return <span className="font-medium text-green-600">Doğru: {correctAnswers.map(i => getOptionLabel(i)).join(', ')}</span>;
      case 'ranking':
        return <span className="font-medium text-indigo-600">{question.options.length} öğe sıralama</span>;
      case 'matching':
        return <span className="font-medium text-teal-600">{(question.matchingPairs || []).length} çift</span>;
      case 'maxdiff':
        return <span className="font-medium text-rose-600">MaxDiff {question.options.length} öğe</span>;
      case 'scale':
      case 'slider':
        return <span className="text-amber-600">{question.scaleMin || 1}-{question.scaleMax || 5} arası</span>;
      case 'star':
        return <span className="text-yellow-600">★ 1-5</span>;
      case 'nps':
        return <span className="text-emerald-600">NPS 0-10</span>;
      case 'matrix':
        return <span className="text-purple-600">{(question.matrixRows || []).length}×{(question.matrixColumns || []).length}</span>;
      case 'short_text':
      case 'long_text':
        return <span className="text-gray-500">Metin yanıtı</span>;
      case 'file_upload':
        return <span className="text-gray-500">Dosya yükleme</span>;
      case 'date':
        return <span className="text-sky-600">Tarih</span>;
      case 'time':
        return <span className="text-sky-600">Saat</span>;
      default:
        return <span className="font-medium text-green-600">Doğru: {getOptionLabel(correctAnswers[0])}</span>;
    }
  };

  return (
    <div
      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tip Badge */}
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${TYPE_BADGE_COLORS[qType] || 'bg-gray-50 text-gray-600'}`}>
            {QUESTION_TYPE_LABELS[qType] || 'Tekli Seçim'}
          </span>
          <DifficultyBadge difficulty={question.difficulty} />
          {/* Review Status Dot */}
          {question.reviewStatus && question.reviewStatus !== 'unreviewed' && (
            <span
              className={`w-2.5 h-2.5 rounded-full ${REVIEW_STATUS_COLORS[question.reviewStatus as ReviewStatus].dot}`}
              title={question.reviewStatus === 'flagged' ? 'Sorunlu' : 'Onaylandı'}
            />
          )}
          {question.visualContent && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-indigo-50 text-indigo-600">
              {question.visualContent.type === 'text' ? 'Metin' : question.visualContent.type === 'table' ? 'Tablo' : question.visualContent.type === 'svg' ? 'SVG' : question.visualContent.type === 'image' ? 'Görsel' : 'Video'}
            </span>
          )}
          {!question.visualContent && question.svg && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">SVG</span>
          )}
          {!question.visualContent && question.image && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-600">Görsel</span>
          )}
          {question.video && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-600">Video</span>
          )}
          {question.tags?.map(tag => (
            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-indigo-50 text-indigo-600 border border-indigo-100">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
          {onEdit && (
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors" title="Düzenle">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors" title="Sil">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="rich-text-content text-sm text-gray-800 mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: question.questionText }} />

      {/* Yeni visualContent varsa compact mode ile göster */}
      {question.visualContent && (question.visualContent.content || question.visualContent.tableData || question.visualContent.image) && (
        <div className="mt-2 max-h-24 overflow-hidden">
          <VisualContentRenderer content={question.visualContent} compact maxHeight={96} />
        </div>
      )}
      {/* Eski format: image */}
      {!question.visualContent && question.image && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg overflow-hidden max-h-24 flex justify-center">
          <img src={question.image} alt="Soru görseli" className="max-h-20 object-contain" />
        </div>
      )}
      {/* Eski format: svg */}
      {!question.visualContent && question.svg && !question.image && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg overflow-hidden max-h-24">
          <div className="svg-card-preview" dangerouslySetInnerHTML={{ __html: question.svg }} />
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        {renderCorrectInfo()}
        {question.options.length > 0 && <>
          <span>|</span>
          <span>{question.options.length} şık</span>
        </>}
        <span>|</span>
        <span className="text-gray-400">{question.id}</span>
      </div>
    </div>
  );
}
