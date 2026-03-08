import { NextResponse } from 'next/server';
import { dbImportQuestions } from '@/lib/db-queries';
import type { Question } from '@/lib/types';

// Import all seed files
import { seedQuestions } from '@/data/questions/seed';
import { seedQuestionsBatch2 } from '@/data/questions/seed-batch2';
import { seedNumericalReasoning4 } from '@/data/questions/seed-numerical-reasoning-4';
import { seedNumericalReasoning5 } from '@/data/questions/seed-numerical-reasoning-5';
import { seedSayisalOkumaCharts } from '@/data/questions/seed-sayisal-okuma-charts';
import { seedSayisalKritikCharts } from '@/data/questions/seed-sayisal-kritik-charts';
import { seedSayisalKarsilastirma } from '@/data/questions/seed-sayisal-karsilastirma';
import { seedCappSayisal } from '@/data/questions/seed-capp-sayisal';
import { seedTpSayisal } from '@/data/questions/seed-tp-sayisal';
import { seedSozelMuhakeme } from '@/data/questions/seed-sozel-muhakeme';
import { seedSayisalKritikTables } from '@/data/questions/seed-sayisal-kritik-tables';

export async function POST() {
  try {
    const allSeedQuestions: Question[] = [
      ...(seedQuestions || []),
      ...(seedQuestionsBatch2 || []),
      ...(seedNumericalReasoning4 || []),
      ...(seedNumericalReasoning5 || []),
      ...(seedSayisalOkumaCharts || []),
      ...(seedSayisalKritikCharts || []),
      ...(seedSayisalKarsilastirma || []),
      ...(seedCappSayisal || []),
      ...(seedTpSayisal || []),
      ...(seedSozelMuhakeme || []),
      ...(seedSayisalKritikTables || []),
    ];

    console.log(`Migrating ${allSeedQuestions.length} seed questions to database...`);

    const result = await dbImportQuestions(allSeedQuestions);

    return NextResponse.json({
      success: true,
      total: allSeedQuestions.length,
      imported: result.imported,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migrasyon hatası', details: (error as Error).message },
      { status: 500 }
    );
  }
}
