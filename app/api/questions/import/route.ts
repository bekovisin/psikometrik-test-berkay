import { NextRequest, NextResponse } from 'next/server';
import { dbImportQuestions } from '@/lib/db-queries';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const incoming = data.questions || data;

    if (!Array.isArray(incoming)) {
      return NextResponse.json({ error: 'Geçersiz format: questions dizisi bekleniyor' }, { status: 400 });
    }

    const result = await dbImportQuestions(incoming);
    return NextResponse.json(result);
  } catch (error) {
    console.error('POST /api/questions/import error:', error);
    return NextResponse.json({ error: 'İçe aktarma hatası' }, { status: 500 });
  }
}
