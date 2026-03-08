export type Difficulty = 'cok-kolay' | 'kolay' | 'orta' | 'zor' | 'cok-zor';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  'cok-kolay': 'Çok Kolay',
  'kolay': 'Kolay',
  'orta': 'Orta',
  'zor': 'Zor',
  'cok-zor': 'Çok Zor',
};

export const DIFFICULTY_COLORS: Record<Difficulty, { bg: string; text: string }> = {
  'cok-kolay': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'kolay': { bg: 'bg-green-100', text: 'text-green-800' },
  'orta': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'zor': { bg: 'bg-red-100', text: 'text-red-800' },
  'cok-zor': { bg: 'bg-purple-100', text: 'text-purple-800' },
};

export const ALL_DIFFICULTIES: Difficulty[] = ['cok-kolay', 'kolay', 'orta', 'zor', 'cok-zor'];

// ── İnceleme Durumu ──
export type ReviewStatus = 'unreviewed' | 'flagged' | 'verified';

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  'unreviewed': 'İncelenmedi',
  'flagged': 'Sorunlu',
  'verified': 'Onaylandı',
};

export const REVIEW_STATUS_COLORS: Record<ReviewStatus, { bg: string; text: string; dot: string }> = {
  'unreviewed': { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
  'flagged': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  'verified': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

export const ALL_REVIEW_STATUSES: ReviewStatus[] = ['unreviewed', 'flagged', 'verified'];

// ── 17 Soru Tipi ──
export type QuestionType =
  | 'single' | 'multiple' | 'dropdown' | 'image_choice'
  | 'short_text' | 'long_text'
  | 'scale' | 'star' | 'nps' | 'slider'
  | 'ranking'
  | 'matching'
  | 'maxdiff'
  | 'matrix'
  | 'file_upload'
  | 'date' | 'time';

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single: 'Tekli Seçim',
  multiple: 'Çoklu Seçim',
  dropdown: 'Dropdown',
  image_choice: 'Resim Seçimi',
  short_text: 'Kısa Paragraf',
  long_text: 'Uzun Paragraf',
  scale: 'Ölçek',
  star: 'Yıldız',
  nps: 'NPS',
  slider: 'Slider',
  ranking: 'Sıralama',
  matching: 'Eşleştirme',
  maxdiff: 'MaxDiff',
  matrix: 'Matris',
  file_upload: 'Dosya Yükleme',
  date: 'Tarih',
  time: 'Saat',
};

export const QUESTION_TYPE_GROUPS: Record<string, QuestionType[]> = {
  'Seçenekli': ['single', 'multiple', 'dropdown', 'image_choice'],
  'Metin': ['short_text', 'long_text'],
  'Derecelendirme': ['scale', 'star', 'nps', 'slider'],
  'Sıralama & Eşleştirme': ['ranking', 'matching', 'maxdiff'],
  'Gelişmiş': ['matrix', 'file_upload'],
  'Tarih/Saat': ['date', 'time'],
};

export const QUESTION_TYPE_ICONS: Record<QuestionType, string> = {
  single: '○', multiple: '☑', dropdown: '▾', image_choice: '🖼',
  short_text: 'Aa', long_text: '¶',
  scale: '⊕', star: '★', nps: '📊', slider: '⊟',
  ranking: '↕', matching: '↔', maxdiff: '⇔',
  matrix: '▦', file_upload: '📎',
  date: '📅', time: '⏰',
};

export const OPTION_BASED_TYPES: QuestionType[] = [
  'single', 'multiple', 'dropdown', 'image_choice',
  'ranking', 'matching', 'maxdiff',
];

export interface QuestionOption {
  label: string;
  text: string;
  svg?: string;
  image?: string; // base64 data URL (compressed)
  pinned?: boolean;
  score?: number;
  feedback?: string;
}

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  minValue?: number;
  maxValue?: number;
}

export interface MatrixRow {
  id: string;
  text: string;
}

export type SvgPosition = 'top' | 'bottom' | 'left' | 'right';
export type SvgAlign = 'center' | 'left' | 'right';
export type TextVerticalAlign = 'top' | 'center' | 'bottom';

// ── Görsel İçerik (Dual-Mode Content Area) ──
export type VisualContentType = 'text' | 'table' | 'svg' | 'image' | 'video';

export interface TableData {
  headers: string[];
  rows: string[][];
  columnWidths?: number[]; // opsiyonel kolon genişlik yüzdeleri
}

export interface VisualContent {
  type: VisualContentType;
  title?: string;           // Rich HTML (başlık)
  description?: string;     // Rich HTML (açıklama)
  content?: string;         // 'text' → rich HTML, 'svg' → SVG string, 'video' → URL
  image?: string;           // 'image' → base64 data URL
  tableData?: TableData;    // 'table' → yapılandırılmış tablo verisi
}

export interface Question {
  id: string;
  categoryId: string;
  subModuleId: string;
  difficulty: Difficulty;
  questionText: string;
  svg?: string;
  image?: string; // base64 data URL (compressed)
  svgMaxHeight?: number;
  optionSvgMaxHeight?: number;
  bgColor?: string;
  svgPosition?: SvgPosition;
  svgAlign?: SvgAlign;
  textVerticalAlign?: TextVerticalAlign;
  layoutRatio?: number;
  options: QuestionOption[];
  correctAnswer: number; // geriye dönük uyum
  correctAnswers?: number[];
  solution: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;

  // ── İnceleme Durumu ──
  reviewStatus?: ReviewStatus; // default: 'unreviewed'

  // ── Soru Tipi ──
  questionType?: QuestionType; // default: 'single'

  // ── Görsel İçerik (Yeni — Dual-Mode) ──
  visualContent?: VisualContent;

  // ── Randomize & Video ──
  randomizeOptions?: boolean;
  video?: string;

  // ── Soru Ayarları ──
  required?: boolean;
  helpText?: string;
  hint?: string;
  placeholder?: string;
  timeLimit?: number;

  // ── Validasyon ──
  validation?: ValidationRules;

  // ── Ölçek/NPS/Slider ──
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  scaleStep?: number;

  // ── Sıralama ──
  correctOrder?: number[];

  // ── Eşleştirme ──
  matchingPairs?: { left: string; right: string }[];

  // ── MaxDiff ──
  maxdiffBest?: number;
  maxdiffWorst?: number;

  // ── Matris ──
  matrixRows?: MatrixRow[];
  matrixColumns?: string[];
  matrixType?: 'radio' | 'checkbox';

  // ── Dosya Yükleme ──
  allowedFileTypes?: string[];
  maxFileSize?: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

export interface SubModule {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  whatItMeasures: string;
  referenceSource: string;
}
