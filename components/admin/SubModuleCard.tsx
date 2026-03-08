import Link from 'next/link';
import { SubModule, ALL_DIFFICULTIES, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types';

export default function SubModuleCard({ subModule, categorySlug, questionCounts }: { subModule: SubModule; categorySlug: string; questionCounts: Record<string, number> }) {
  const total = Object.values(questionCounts).reduce((a, b) => a + b, 0);

  return (
    <Link
      href={`/admin/soru-bankasi/${categorySlug}/${subModule.slug}`}
      className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{subModule.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subModule.nameEn}</p>
        </div>
        <span className="text-lg font-bold text-indigo-600">{total}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">{subModule.whatItMeasures}</p>
      <div className="flex items-center gap-1.5 mt-3">
        {ALL_DIFFICULTIES.map(d => {
          const count = questionCounts[d] || 0;
          const { bg, text } = DIFFICULTY_COLORS[d];
          return (
            <span key={d} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${count > 0 ? `${bg} ${text}` : 'bg-gray-50 text-gray-400'}`}>
              {DIFFICULTY_LABELS[d].charAt(0)}{count > 0 && <span className="font-bold">{count}</span>}
            </span>
          );
        })}
      </div>
    </Link>
  );
}
