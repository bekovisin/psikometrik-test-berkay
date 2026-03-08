import { db } from '@/db';
import { questions, QuestionRow, NewQuestionRow } from '@/db/schema';
import { eq, and, ilike, sql, desc } from 'drizzle-orm';
import type { Question } from './types';

// ── Row ↔ Question dönüşümleri ──

function rowToQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    categoryId: row.categoryId,
    subModuleId: row.subModuleId,
    difficulty: row.difficulty as Question['difficulty'],
    questionText: row.questionText,
    questionType: (row.questionType || 'single') as Question['questionType'],
    reviewStatus: (row.reviewStatus || 'unreviewed') as Question['reviewStatus'],
    correctAnswer: row.correctAnswer,
    correctAnswers: row.correctAnswers ?? undefined,
    solution: row.solution,
    tags: row.tags ?? undefined,
    options: row.options as Question['options'],
    visualContent: row.visualContent as Question['visualContent'],
    svg: row.svg ?? undefined,
    image: row.image ?? undefined,
    svgPosition: row.svgPosition as Question['svgPosition'],
    svgMaxHeight: row.svgMaxHeight ?? undefined,
    optionSvgMaxHeight: row.optionSvgMaxHeight ?? undefined,
    bgColor: row.bgColor ?? undefined,
    svgAlign: row.svgAlign as Question['svgAlign'],
    textVerticalAlign: row.textVerticalAlign as Question['textVerticalAlign'],
    layoutRatio: row.layoutRatio ?? undefined,
    randomizeOptions: row.randomizeOptions ?? undefined,
    video: row.video ?? undefined,
    required: row.required ?? undefined,
    helpText: row.helpText ?? undefined,
    hint: row.hint ?? undefined,
    placeholder: row.placeholder ?? undefined,
    timeLimit: row.timeLimit ?? undefined,
    validation: row.validation as Question['validation'],
    scaleMin: row.scaleMin ?? undefined,
    scaleMax: row.scaleMax ?? undefined,
    scaleMinLabel: row.scaleMinLabel ?? undefined,
    scaleMaxLabel: row.scaleMaxLabel ?? undefined,
    scaleStep: row.scaleStep ?? undefined,
    correctOrder: row.correctOrder ?? undefined,
    matchingPairs: row.matchingPairs as Question['matchingPairs'],
    maxdiffBest: row.maxdiffBest ?? undefined,
    maxdiffWorst: row.maxdiffWorst ?? undefined,
    matrixRows: row.matrixRows as Question['matrixRows'],
    matrixColumns: row.matrixColumns ?? undefined,
    matrixType: row.matrixType as Question['matrixType'],
    allowedFileTypes: row.allowedFileTypes ?? undefined,
    maxFileSize: row.maxFileSize ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function questionToRow(q: Partial<Question> & { id: string }): NewQuestionRow {
  return {
    id: q.id,
    categoryId: q.categoryId!,
    subModuleId: q.subModuleId!,
    difficulty: q.difficulty!,
    questionText: q.questionText!,
    questionType: q.questionType || 'single',
    reviewStatus: q.reviewStatus || 'unreviewed',
    correctAnswer: q.correctAnswer!,
    correctAnswers: q.correctAnswers ?? null,
    solution: q.solution!,
    tags: q.tags ?? null,
    options: q.options!,
    visualContent: q.visualContent ?? null,
    svg: q.svg ?? null,
    image: q.image ?? null,
    svgPosition: q.svgPosition ?? null,
    svgMaxHeight: q.svgMaxHeight ?? null,
    optionSvgMaxHeight: q.optionSvgMaxHeight ?? null,
    bgColor: q.bgColor ?? null,
    svgAlign: q.svgAlign ?? null,
    textVerticalAlign: q.textVerticalAlign ?? null,
    layoutRatio: q.layoutRatio ?? null,
    randomizeOptions: q.randomizeOptions ?? null,
    video: q.video ?? null,
    required: q.required ?? null,
    helpText: q.helpText ?? null,
    hint: q.hint ?? null,
    placeholder: q.placeholder ?? null,
    timeLimit: q.timeLimit ?? null,
    validation: q.validation ?? null,
    scaleMin: q.scaleMin ?? null,
    scaleMax: q.scaleMax ?? null,
    scaleMinLabel: q.scaleMinLabel ?? null,
    scaleMaxLabel: q.scaleMaxLabel ?? null,
    scaleStep: q.scaleStep ?? null,
    correctOrder: q.correctOrder ?? null,
    matchingPairs: q.matchingPairs ?? null,
    maxdiffBest: q.maxdiffBest ?? null,
    maxdiffWorst: q.maxdiffWorst ?? null,
    matrixRows: q.matrixRows ?? null,
    matrixColumns: q.matrixColumns ?? null,
    matrixType: q.matrixType ?? null,
    allowedFileTypes: q.allowedFileTypes ?? null,
    maxFileSize: q.maxFileSize ?? null,
    createdAt: q.createdAt ? new Date(q.createdAt) : new Date(),
    updatedAt: new Date(),
  };
}

// ── Query functions ──

export interface DBQuestionFilters {
  categoryId?: string;
  subModuleId?: string;
  difficulty?: string;
  reviewStatus?: string;
  search?: string;
}

export async function dbGetQuestions(filters?: DBQuestionFilters): Promise<Question[]> {
  const conditions = [];

  if (filters?.categoryId) {
    conditions.push(eq(questions.categoryId, filters.categoryId));
  }
  if (filters?.subModuleId) {
    conditions.push(eq(questions.subModuleId, filters.subModuleId));
  }
  if (filters?.difficulty) {
    conditions.push(eq(questions.difficulty, filters.difficulty));
  }
  if (filters?.reviewStatus) {
    conditions.push(eq(questions.reviewStatus!, filters.reviewStatus));
  }
  if (filters?.search) {
    conditions.push(ilike(questions.questionText, `%${filters.search}%`));
  }

  const rows = conditions.length > 0
    ? await db.select().from(questions).where(and(...conditions))
    : await db.select().from(questions);

  return rows.map(rowToQuestion);
}

export async function dbGetQuestion(id: string): Promise<Question | null> {
  const rows = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return rows.length > 0 ? rowToQuestion(rows[0]) : null;
}

export async function dbAddQuestion(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
  const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date();
  const row = questionToRow({ ...data, id } as Question & { id: string });
  row.createdAt = now;
  row.updatedAt = now;

  const inserted = await db.insert(questions).values(row).returning();
  return rowToQuestion(inserted[0]);
}

export async function dbUpdateQuestion(
  id: string,
  data: Partial<Omit<Question, 'id' | 'createdAt'>>
): Promise<Question | null> {
  // Build update object dynamically
  const updateObj: Record<string, unknown> = { updatedAt: new Date() };

  if (data.categoryId !== undefined) updateObj.categoryId = data.categoryId;
  if (data.subModuleId !== undefined) updateObj.subModuleId = data.subModuleId;
  if (data.difficulty !== undefined) updateObj.difficulty = data.difficulty;
  if (data.questionText !== undefined) updateObj.questionText = data.questionText;
  if (data.questionType !== undefined) updateObj.questionType = data.questionType;
  if (data.reviewStatus !== undefined) updateObj.reviewStatus = data.reviewStatus;
  if (data.correctAnswer !== undefined) updateObj.correctAnswer = data.correctAnswer;
  if (data.correctAnswers !== undefined) updateObj.correctAnswers = data.correctAnswers;
  if (data.solution !== undefined) updateObj.solution = data.solution;
  if (data.tags !== undefined) updateObj.tags = data.tags;
  if (data.options !== undefined) updateObj.options = data.options;
  if (data.visualContent !== undefined) updateObj.visualContent = data.visualContent;
  if (data.svg !== undefined) updateObj.svg = data.svg;
  if (data.image !== undefined) updateObj.image = data.image;
  if (data.svgPosition !== undefined) updateObj.svgPosition = data.svgPosition;
  if (data.svgMaxHeight !== undefined) updateObj.svgMaxHeight = data.svgMaxHeight;
  if (data.optionSvgMaxHeight !== undefined) updateObj.optionSvgMaxHeight = data.optionSvgMaxHeight;
  if (data.bgColor !== undefined) updateObj.bgColor = data.bgColor;
  if (data.svgAlign !== undefined) updateObj.svgAlign = data.svgAlign;
  if (data.textVerticalAlign !== undefined) updateObj.textVerticalAlign = data.textVerticalAlign;
  if (data.layoutRatio !== undefined) updateObj.layoutRatio = data.layoutRatio;

  const updated = await db
    .update(questions)
    .set(updateObj)
    .where(eq(questions.id, id))
    .returning();

  return updated.length > 0 ? rowToQuestion(updated[0]) : null;
}

export async function dbDeleteQuestion(id: string): Promise<boolean> {
  const deleted = await db.delete(questions).where(eq(questions.id, id)).returning();
  return deleted.length > 0;
}

export async function dbGetStats() {
  const allRows = await db.select().from(questions);

  const byCategory: Record<string, number> = {};
  const bySubModule: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};

  for (const row of allRows) {
    byCategory[row.categoryId] = (byCategory[row.categoryId] || 0) + 1;
    bySubModule[row.subModuleId] = (bySubModule[row.subModuleId] || 0) + 1;
    byDifficulty[row.difficulty] = (byDifficulty[row.difficulty] || 0) + 1;
  }

  const recentRows = [...allRows]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return {
    total: allRows.length,
    byCategory,
    bySubModule,
    byDifficulty,
    recentQuestions: recentRows.map(rowToQuestion),
  };
}

export async function dbImportQuestions(incoming: Question[]): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  for (const q of incoming) {
    if (!q.id || !q.categoryId || !q.subModuleId || !q.questionText || !q.options) {
      errors.push(`Eksik alan: ${q.id || 'ID yok'}`);
      continue;
    }

    try {
      const row = questionToRow(q);
      await db
        .insert(questions)
        .values(row)
        .onConflictDoUpdate({
          target: questions.id,
          set: {
            ...row,
            id: undefined as any, // Don't update PK
            createdAt: undefined as any, // Keep original
            updatedAt: new Date(),
          },
        });
      imported++;
    } catch (err) {
      errors.push(`Hata: ${q.id} — ${(err as Error).message}`);
    }
  }

  return { imported, errors };
}

export async function dbExportQuestions(): Promise<Question[]> {
  const rows = await db.select().from(questions);
  return rows.map(rowToQuestion);
}
