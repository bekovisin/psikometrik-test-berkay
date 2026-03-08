import {
  pgTable,
  text,
  integer,
  real,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

// ── Questions Table ──
export const questions = pgTable(
  'questions',
  {
    id: text('id').primaryKey(),
    categoryId: text('category_id').notNull(),
    subModuleId: text('sub_module_id').notNull(),
    difficulty: text('difficulty').notNull(),
    questionText: text('question_text').notNull(),
    questionType: text('question_type').default('single'),
    reviewStatus: text('review_status').default('unreviewed'),
    correctAnswer: integer('correct_answer').notNull(),
    correctAnswers: jsonb('correct_answers').$type<number[]>(),
    solution: text('solution').notNull(),
    tags: jsonb('tags').$type<string[]>(),
    options: jsonb('options').$type<Array<{
      label: string;
      text: string;
      svg?: string;
      image?: string;
      pinned?: boolean;
      score?: number;
      feedback?: string;
    }>>().notNull(),
    visualContent: jsonb('visual_content').$type<{
      type: string;
      title?: string;
      description?: string;
      content?: string;
      image?: string;
      tableData?: { headers: string[]; rows: string[][]; columnWidths?: number[] };
    }>(),
    svg: text('svg'),
    image: text('image'),
    svgPosition: text('svg_position'),
    svgMaxHeight: integer('svg_max_height'),
    optionSvgMaxHeight: integer('option_svg_max_height'),
    bgColor: text('bg_color'),
    svgAlign: text('svg_align'),
    textVerticalAlign: text('text_vertical_align'),
    layoutRatio: real('layout_ratio'),
    // Extended fields
    randomizeOptions: jsonb('randomize_options').$type<boolean>(),
    video: text('video'),
    required: jsonb('required_field').$type<boolean>(),
    helpText: text('help_text'),
    hint: text('hint'),
    placeholder: text('placeholder'),
    timeLimit: integer('time_limit'),
    validation: jsonb('validation').$type<{
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      patternMessage?: string;
      minValue?: number;
      maxValue?: number;
    }>(),
    scaleMin: integer('scale_min'),
    scaleMax: integer('scale_max'),
    scaleMinLabel: text('scale_min_label'),
    scaleMaxLabel: text('scale_max_label'),
    scaleStep: integer('scale_step'),
    correctOrder: jsonb('correct_order').$type<number[]>(),
    matchingPairs: jsonb('matching_pairs').$type<Array<{ left: string; right: string }>>(),
    maxdiffBest: integer('maxdiff_best'),
    maxdiffWorst: integer('maxdiff_worst'),
    matrixRows: jsonb('matrix_rows').$type<Array<{ id: string; text: string }>>(),
    matrixColumns: jsonb('matrix_columns').$type<string[]>(),
    matrixType: text('matrix_type'),
    allowedFileTypes: jsonb('allowed_file_types').$type<string[]>(),
    maxFileSize: integer('max_file_size'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_questions_category').on(table.categoryId),
    index('idx_questions_submodule').on(table.subModuleId),
    index('idx_questions_difficulty').on(table.difficulty),
    index('idx_questions_review_status').on(table.reviewStatus),
    index('idx_questions_category_submodule').on(table.categoryId, table.subModuleId),
  ]
);

// Type inference helpers
export type QuestionRow = typeof questions.$inferSelect;
export type NewQuestionRow = typeof questions.$inferInsert;
