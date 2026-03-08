import Link from 'next/link';
import { Category } from '@/lib/types';

const colorClasses: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  blue: { bg: 'hover:bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', iconBg: 'bg-blue-100' },
  emerald: { bg: 'hover:bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', iconBg: 'bg-emerald-100' },
  violet: { bg: 'hover:bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', iconBg: 'bg-violet-100' },
  orange: { bg: 'hover:bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', iconBg: 'bg-orange-100' },
  rose: { bg: 'hover:bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', iconBg: 'bg-rose-100' },
  slate: { bg: 'hover:bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', iconBg: 'bg-slate-100' },
  teal: { bg: 'hover:bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', iconBg: 'bg-teal-100' },
  indigo: { bg: 'hover:bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', iconBg: 'bg-indigo-100' },
};

export default function CategoryCard({ category, subModuleCount, questionCount }: { category: Category; subModuleCount: number; questionCount: number }) {
  const colors = colorClasses[category.color] || colorClasses.blue;

  return (
    <Link
      href={`/admin/soru-bankasi/${category.slug}`}
      className={`block p-5 bg-white rounded-xl border ${colors.border} ${colors.bg} transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${colors.iconBg} ${colors.text} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <div className="w-5 h-5" dangerouslySetInnerHTML={{ __html: category.icon }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold ${colors.text} truncate`}>{category.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{category.nameEn}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3 line-clamp-2">{category.description}</p>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{questionCount}</p>
          <p className="text-xs text-gray-500">Soru</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{subModuleCount}</p>
          <p className="text-xs text-gray-500">Alt Modül</p>
        </div>
      </div>
    </Link>
  );
}
