'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';
import { getQuestions, deleteQuestion, addQuestion, updateQuestion } from '@/lib/store';
import { Question, Difficulty, ALL_DIFFICULTIES, DIFFICULTY_LABELS, DIFFICULTY_COLORS, ReviewStatus, ALL_REVIEW_STATUSES, REVIEW_STATUS_LABELS, REVIEW_STATUS_COLORS } from '@/lib/types';
import QuestionCard from '@/components/admin/QuestionCard';
import QuestionDetail from '@/components/admin/QuestionDetail';
import QuestionForm from '@/components/admin/QuestionForm';
import DeleteConfirm from '@/components/admin/DeleteConfirm';
import Link from 'next/link';

export default function SubModulePage() {
  const params = useParams();
  const router = useRouter();
  const catSlug = params.category as string;
  const subSlug = params.submodule as string;

  const category = categories.find(c => c.slug === catSlug);
  const subModule = subModules.find(s => s.slug === subSlug && s.categoryId === category?.id);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQs, setAllQs] = useState<Question[]>([]);
  const [filter, setFilter] = useState<Difficulty | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewStatus | null>(null);
  const [selected, setSelected] = useState<Question | null>(null);
  const [editing, setEditing] = useState<Question | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [deleting, setDeleting] = useState<Question | null>(null);

  const reload = useCallback(async () => {
    if (category && subModule) {
      try {
        const all = await getQuestions({ categoryId: category.id, subModuleId: subModule.id });
        setAllQs(all);
        let qs = all;
        if (filter) qs = qs.filter(q => q.difficulty === filter);
        if (reviewFilter) qs = qs.filter(q => (q.reviewStatus || 'unreviewed') === reviewFilter);
        setQuestions(qs);
      } catch (err) {
        console.error('Sorular yüklenemedi:', err);
      }
    }
  }, [category, subModule, filter, reviewFilter]);

  useEffect(() => { reload(); }, [reload]);

  if (!category || !subModule) return <div className="text-center py-20 text-gray-500">Alt modül bulunamadı</div>;

  const handleDelete = async () => {
    if (deleting) {
      await deleteQuestion(deleting.id);
      setDeleting(null);
      setSelected(null);
      reload();
    }
  };

  const handleSaveNew = async (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addQuestion(data);
    setShowNewForm(false);
    reload();
  };

  const handleSaveEdit = async (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) {
      const updatedData = { ...data, reviewStatus: 'verified' as ReviewStatus };
      await updateQuestion(editing.id, updatedData);
      setEditing(null);
      setSelected(null);
      reload();
    }
  };

  const handleReviewStatusChange = async (questionId: string, status: ReviewStatus) => {
    await updateQuestion(questionId, { reviewStatus: status } as Partial<Omit<Question, 'id' | 'createdAt'>>);

    // selected'ı güncelle (modal açıksa yeni durumu göstersin)
    if (selected && selected.id === questionId) {
      setSelected({ ...selected, reviewStatus: status });
    }
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{subModule.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{subModule.nameEn} — {subModule.whatItMeasures}</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>
          Yeni Soru
        </button>
      </div>

      {/* Zorluk Filtresi */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${!filter ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          Tümü ({allQs.length})
        </button>
        {ALL_DIFFICULTIES.map(d => {
          const count = allQs.filter(q => q.difficulty === d).length;
          const { bg, text } = DIFFICULTY_COLORS[d];
          return (
            <button
              key={d}
              onClick={() => setFilter(filter === d ? null : d)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === d ? `${bg} ${text} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {DIFFICULTY_LABELS[d]} ({count})
            </button>
          );
        })}
      </div>

      {/* İnceleme Durumu Filtresi */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mr-1">Durum:</span>
        <button
          onClick={() => setReviewFilter(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${!reviewFilter ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          Tümü
        </button>
        {ALL_REVIEW_STATUSES.map(s => {
          const count = allQs.filter(q => (q.reviewStatus || 'unreviewed') === s).length;
          if (count === 0 && s !== 'unreviewed') return null;
          const { bg, text } = REVIEW_STATUS_COLORS[s];
          return (
            <button
              key={s}
              onClick={() => setReviewFilter(reviewFilter === s ? null : s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${reviewFilter === s ? `${bg} ${text} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {REVIEW_STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Soru Listesi */}
      {questions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-300 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <p className="text-gray-500 mt-3">Henüz soru eklenmemiş</p>
          <button onClick={() => setShowNewForm(true)} className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">İlk soruyu ekle</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              onSelect={() => setSelected(q)}
              onEdit={() => setEditing(q)}
              onDelete={() => setDeleting(q)}
            />
          ))}
        </div>
      )}

      {/* Modaller */}
      {selected && !editing && (
        <QuestionDetail
          question={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setSelected(null); }}
          onDelete={() => { setDeleting(selected); setSelected(null); }}
          onFlag={() => handleReviewStatusChange(selected.id, 'flagged')}
          onVerify={() => handleReviewStatusChange(selected.id, 'verified')}
        />
      )}

      {(editing || showNewForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => { setEditing(null); setShowNewForm(false); }} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
            </h2>
            <QuestionForm
              question={editing || undefined}
              defaultCategoryId={category.id}
              defaultSubModuleId={subModule.id}
              onSave={editing ? handleSaveEdit : handleSaveNew}
              onCancel={() => { setEditing(null); setShowNewForm(false); }}
            />
          </div>
        </div>
      )}

      {deleting && (
        <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}
