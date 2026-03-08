'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';
import { getQuestions } from '@/lib/store';
import { ALL_DIFFICULTIES, Question } from '@/lib/types';
import SubModuleCard from '@/components/admin/SubModuleCard';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const category = categories.find(c => c.slug === slug);
  const subs = subModules.filter(s => s.categoryId === category?.id);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (category) {
      getQuestions({ categoryId: category.id }).then(setQuestions).catch(console.error);
    }
  }, [category]);

  if (!category) return <div className="text-center py-20 text-gray-500">Kategori bulunamadı</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{category.nameEn} — {subs.length} alt modül, {questions.length} soru</p>
        </div>
        <Link
          href={`/admin/soru-bankasi/yeni?category=${category.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>
          Yeni Soru
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subs.map(sub => {
          const subQ = questions.filter(q => q.subModuleId === sub.id);
          const counts: Record<string, number> = {};
          ALL_DIFFICULTIES.forEach(d => {
            counts[d] = subQ.filter(q => q.difficulty === d).length;
          });
          return <SubModuleCard key={sub.id} subModule={sub} categorySlug={slug} questionCounts={counts} />;
        })}
      </div>
    </div>
  );
}
