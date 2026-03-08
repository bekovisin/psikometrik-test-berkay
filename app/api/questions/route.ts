import { NextRequest, NextResponse } from 'next/server';
import { dbGetQuestions, dbGetQuestion, dbAddQuestion, dbUpdateQuestion, dbDeleteQuestion } from '@/lib/db-queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      categoryId: searchParams.get('categoryId') || undefined,
      subModuleId: searchParams.get('subModuleId') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      reviewStatus: searchParams.get('reviewStatus') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Single question by ID
    const id = searchParams.get('id');
    if (id) {
      const question = await dbGetQuestion(id);
      if (!question) {
        return NextResponse.json({ error: 'Soru bulunamadı' }, { status: 404 });
      }
      return NextResponse.json(question);
    }

    const questions = await dbGetQuestions(filters);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('GET /api/questions error:', error);
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const question = await dbAddQuestion(data);
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('POST /api/questions error:', error);
    return NextResponse.json({ error: 'Soru eklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }
    const updated = await dbUpdateQuestion(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Soru bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/questions error:', error);
    return NextResponse.json({ error: 'Soru güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }
    const deleted = await dbDeleteQuestion(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Soru bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/questions error:', error);
    return NextResponse.json({ error: 'Soru silinemedi' }, { status: 500 });
  }
}
