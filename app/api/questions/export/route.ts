import { NextResponse } from 'next/server';
import { dbExportQuestions } from '@/lib/db-queries';

export async function GET() {
  try {
    const questions = await dbExportQuestions();
    return NextResponse.json({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      questions,
    });
  } catch (error) {
    console.error('GET /api/questions/export error:', error);
    return NextResponse.json({ error: 'Dışa aktarma hatası' }, { status: 500 });
  }
}
