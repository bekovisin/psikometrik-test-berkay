'use client';

import { useEffect, useState } from 'react';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';
import { getStats } from '@/lib/store';
import CategoryCard from '@/components/admin/CategoryCard';

export default function SoruBankasiPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => { getStats().then(setStats).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Soru Bankası</h1>
        <p className="text-sm text-gray-500 mt-1">8 ana kategori, {subModules.length} alt modül</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map(cat => {
          const subs = subModules.filter(s => s.categoryId === cat.id);
          const qCount = stats?.byCategory[cat.id] || 0;
          return <CategoryCard key={cat.id} category={cat} subModuleCount={subs.length} questionCount={qCount} />;
        })}
      </div>
    </div>
  );
}
