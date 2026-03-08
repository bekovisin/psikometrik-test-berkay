import { NextResponse } from 'next/server';
import { dbGetStats } from '@/lib/db-queries';
import { categories } from '@/data/categories';
import { subModules } from '@/data/sub-modules';

export async function GET() {
  try {
    const stats = await dbGetStats();
    return NextResponse.json({
      ...stats,
      categoryCount: categories.length,
      subModuleCount: subModules.length,
    });
  } catch (error) {
    console.error('GET /api/questions/stats error:', error);
    return NextResponse.json({ error: 'İstatistik alınamadı' }, { status: 500 });
  }
}
