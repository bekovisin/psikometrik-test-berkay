'use client';

import { Question, Difficulty, ReviewStatus } from './types';

// ── API Base URL ──
const API_BASE = '/api/questions';

// ── Filter interface ──
export interface QuestionFilters {
  categoryId?: string;
  subModuleId?: string;
  difficulty?: Difficulty;
  reviewStatus?: ReviewStatus;
  search?: string;
}

// ── Questions API ──

export async function getAllQuestions(): Promise<Question[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Sorular alınamadı');
  return res.json();
}

export async function getQuestions(filters?: QuestionFilters): Promise<Question[]> {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);
  if (filters?.subModuleId) params.set('subModuleId', filters.subModuleId);
  if (filters?.difficulty) params.set('difficulty', filters.difficulty);
  if (filters?.reviewStatus) params.set('reviewStatus', filters.reviewStatus);
  if (filters?.search) params.set('search', filters.search);

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Sorular alınamadı');
  return res.json();
}

export async function getQuestion(id: string): Promise<Question | undefined> {
  const res = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Soru alınamadı');
  return res.json();
}

export async function addQuestion(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Soru eklenemedi');
  return res.json();
}

export async function updateQuestion(
  id: string,
  data: Partial<Omit<Question, 'id' | 'createdAt'>>
): Promise<Question | null> {
  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Soru güncellenemedi');
  return res.json();
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const res = await fetch(API_BASE, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error('Soru silinemedi');
  return true;
}

// ── Export / Import ──

export async function exportJSON(): Promise<string> {
  const res = await fetch(`${API_BASE}/export`);
  if (!res.ok) throw new Error('Dışa aktarma hatası');
  const data = await res.json();
  return JSON.stringify(data, null, 2);
}

export async function importJSON(jsonString: string): Promise<{ imported: number; errors: string[] }> {
  try {
    const data = JSON.parse(jsonString);
    const incoming = data.questions || data;

    if (!Array.isArray(incoming)) {
      return { imported: 0, errors: ['Geçersiz JSON formatı'] };
    }

    const res = await fetch(`${API_BASE}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: incoming }),
    });

    if (!res.ok) {
      return { imported: 0, errors: ['API hatası'] };
    }

    return res.json();
  } catch {
    return { imported: 0, errors: ['JSON parse hatası'] };
  }
}

// ── Stats ──

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('İstatistik alınamadı');
  return res.json();
}
