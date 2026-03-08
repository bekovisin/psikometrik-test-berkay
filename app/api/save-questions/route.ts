export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// ── Module Seed Map ──
// Maps module slug to seed file info (file name, export name, ID prefix)
const MODULE_SEED_MAP: Record<string, { file: string; export: string; prefix: string }> = {
  'tp-sayisal':              { file: 'seed-tp-sayisal.ts',              export: 'seedTpSayisal',              prefix: 'seed-tps' },
  'tp-sozel':                { file: 'seed-tp-sozel.ts',                export: 'seedTpSozel',                prefix: 'seed-ts' },
  'capp-sayisal':            { file: 'seed-capp-sayisal.ts',            export: 'seedCappSayisal',            prefix: 'seed-cps' },
  'capp-sozel':              { file: 'seed-capp-sozel.ts',              export: 'seedCappSozel',              prefix: 'seed-cs' },
  'sayisal-muhakeme':        { file: 'seed-numerical-reasoning.ts',     export: 'seedNumericalReasoning',     prefix: 'seed-nr' },
  'sayisal-okuma-anlama':    { file: 'seed-sayisal-okuma.ts',           export: 'seedSayisalOkuma',           prefix: 'seed-so' },
  'sayisal-kritik-akil':     { file: 'seed-sayisal-kritik-tables.ts',   export: 'seedSayisalKritikTables',    prefix: 'seed-skt' },
  'sayisal-karsilastirma':   { file: 'seed-sayisal-karsilastirma.ts',   export: 'seedSayisalKarsilastirma',   prefix: 'seed-sk' },
  'sozel-muhakeme':          { file: 'seed-sozel-muhakeme.ts',          export: 'seedSozelMuhakeme',          prefix: 'seed-sm' },
  'sozel-okuma-anlama':      { file: 'seed-sozel-okuma-anlama.ts',      export: 'seedSozelOkumaAnlama',       prefix: 'seed-soa' },
  'kiyaslar':                { file: 'seed-kiyaslar.ts',                export: 'seedKiyaslar',               prefix: 'seed-ky' },
  'mantiksal':               { file: 'seed-mantiksal.ts',               export: 'seedMantiksal',              prefix: 'seed-mt' },
  'tumevarimsal':            { file: 'seed-tumevarimsal.ts',            export: 'seedTumevarimsal',           prefix: 'seed-tv' },
  'tumdengelimsel':          { file: 'seed-tumdengelimsel.ts',          export: 'seedTumdengelimsel',         prefix: 'seed-td' },
  'diyagramatik':            { file: 'seed-diyagramatik.ts',            export: 'seedDiyagramatik',           prefix: 'seed-dy' },
  'argumanlar':              { file: 'seed-argumanlar.ts',              export: 'seedArgumanlar',             prefix: 'seed-ar' },
  'varsayimlar':             { file: 'seed-varsayimlar.ts',             export: 'seedVarsayimlar',            prefix: 'seed-vr' },
  'cikarimlar':              { file: 'seed-cikarimlar.ts',              export: 'seedCikarimlar',             prefix: 'seed-ck' },
  'cikarsamalar':            { file: 'seed-cikarsamalar.ts',            export: 'seedCikarsamalar',           prefix: 'seed-cks' },
  'bilgi-yorumlama':         { file: 'seed-bilgi-yorumlama.ts',         export: 'seedBilgiYorumlama',         prefix: 'seed-by' },
  'elestirel-tam-test':      { file: 'seed-elestirel-tam-test.ts',      export: 'seedElestirelTamTest',       prefix: 'seed-ett' },
  'elestirel-kiyaslar':      { file: 'seed-elestirel-kiyaslar.ts',      export: 'seedElestirelKiyaslar',      prefix: 'seed-ek' },
  'hata-bulma':              { file: 'seed-hata-bulma.ts',              export: 'seedHataBulma',              prefix: 'seed-hb' },
  'mekanik':                 { file: 'seed-mekanik.ts',                 export: 'seedMekanik',                prefix: 'seed-mk' },
  'sjt':                     { file: 'seed-sjt.ts',                     export: 'seedSjt',                    prefix: 'seed-sj' },
  'in-tray':                 { file: 'seed-in-tray.ts',                 export: 'seedInTray',                 prefix: 'seed-it' },
  'e-tray':                  { file: 'seed-e-tray.ts',                  export: 'seedETray',                  prefix: 'seed-et' },
  'vaka-analizi':            { file: 'seed-vaka-analizi.ts',            export: 'seedVakaAnalizi',            prefix: 'seed-va' },
  'sunum-egzersizi':         { file: 'seed-sunum-egzersizi.ts',         export: 'seedSunumEgzersizi',         prefix: 'seed-se' },
  'grup-egzersizi':          { file: 'seed-grup-egzersizi.ts',          export: 'seedGrupEgzersizi',          prefix: 'seed-ge' },
};

const SEED_DIR = path.join(process.cwd(), 'data', 'questions');
const STORE_FILE = path.join(process.cwd(), 'lib', 'store.ts');

// ── Store.ts Auto-Import ──

/** Ensure that the seed file is imported in store.ts and included in getSeedQuestions() */
function ensureStoreImport(seedFile: string, exportName: string): void {
  if (!fs.existsSync(STORE_FILE)) return;

  let storeContent = fs.readFileSync(STORE_FILE, 'utf-8');

  // Check if import already exists
  if (storeContent.includes(`from '@/data/questions/${seedFile.replace('.ts', '')}'`)) {
    return; // Already imported
  }

  // Build import line
  const importPath = `@/data/questions/${seedFile.replace('.ts', '')}`;
  const importLine = `import { ${exportName} } from '${importPath}';`;

  // Find last import line and insert after it
  const importRegex = /^import\s+.*from\s+'@\/data\/questions\/.*';$/gm;
  let lastImportMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(storeContent)) !== null) {
    lastImportMatch = match;
  }

  if (lastImportMatch) {
    const insertPos = lastImportMatch.index + lastImportMatch[0].length;
    storeContent = storeContent.slice(0, insertPos) + '\n' + importLine + storeContent.slice(insertPos);
  } else {
    // No existing question imports found — add after the last import
    const lastImportIdx = storeContent.lastIndexOf("import ");
    if (lastImportIdx !== -1) {
      const lineEnd = storeContent.indexOf('\n', lastImportIdx);
      storeContent = storeContent.slice(0, lineEnd + 1) + importLine + '\n' + storeContent.slice(lineEnd + 1);
    }
  }

  // Add to getSeedQuestions() spread
  const spreadPattern = /return\s+\[([\s\S]*?)\];/;
  const spreadMatch = spreadPattern.exec(storeContent);
  if (spreadMatch) {
    const currentSpreads = spreadMatch[1].trim();
    // Check if already included
    if (!currentSpreads.includes(`(${exportName}`)) {
      const newSpread = `, ...(${exportName} || [])`;
      const closingBracket = spreadMatch.index + spreadMatch[0].lastIndexOf(']');
      storeContent = storeContent.slice(0, closingBracket) + newSpread + storeContent.slice(closingBracket);
    }
  }

  // Bump seed version
  const versionRegex = /const CURRENT_SEED_VERSION = '(\d+)'/;
  const versionMatch = versionRegex.exec(storeContent);
  if (versionMatch) {
    const currentVersion = parseInt(versionMatch[1], 10);
    storeContent = storeContent.replace(
      versionRegex,
      `const CURRENT_SEED_VERSION = '${currentVersion + 1}'`,
    );
  }

  fs.writeFileSync(STORE_FILE, storeContent, 'utf-8');
  console.log(`[save-questions] store.ts updated: added import for ${exportName}`);
}

// ── Helpers ──

/** Escape a string for use inside single-quoted TS literals */
function escapeTS(text: string): string {
  if (typeof text !== 'string') return String(text ?? '');
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2018/g, "\\'")  // LEFT SINGLE QUOTATION MARK
    .replace(/\u2019/g, "\\'")  // RIGHT SINGLE QUOTATION MARK
    .replace(/\u201C/g, '\\"')  // LEFT DOUBLE QUOTATION MARK
    .replace(/\u201D/g, '\\"')  // RIGHT DOUBLE QUOTATION MARK
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/** Format tableData as an inline TS object string */
function formatTableDataTS(td: { headers: string[]; rows: string[][]; columnWidths?: number[] }): string {
  const headers = td.headers.map((h: string) => `'${escapeTS(h)}'`).join(', ');
  const rows = td.rows
    .map((row: string[]) => `[${row.map((cell: string) => `'${escapeTS(cell)}'`).join(', ')}]`)
    .join(', ');
  let result = `{ headers: [${headers}], rows: [${rows}]`;
  if (td.columnWidths && td.columnWidths.length > 0) {
    result += `, columnWidths: [${td.columnWidths.join(', ')}]`;
  }
  result += ' }';
  return result;
}

/**
 * Format visualContent as an inline TS object string.
 * Returns { inline: string, svgConst?: { name: string, value: string } }
 * If type is 'svg', the SVG content goes into a separate const.
 */
function formatVisualContentTS(
  vc: { type: string; title?: string; description?: string; content?: string; image?: string; tableData?: { headers: string[]; rows: string[][]; columnWidths?: number[] } },
  svgConstName?: string,
): { inline: string; svgConst?: { name: string; value: string } } {
  const parts: string[] = [`type: '${escapeTS(vc.type)}'`];
  let svgConst: { name: string; value: string } | undefined;

  if (vc.title !== undefined && vc.title !== null) {
    parts.push(`title: '${escapeTS(vc.title)}'`);
  }
  if (vc.description !== undefined && vc.description !== null) {
    parts.push(`description: '${escapeTS(vc.description)}'`);
  }

  switch (vc.type) {
    case 'text':
      if (vc.content !== undefined && vc.content !== null) {
        parts.push(`content: '${escapeTS(vc.content)}'`);
      }
      break;
    case 'table':
      if (vc.tableData) {
        parts.push(`tableData: ${formatTableDataTS(vc.tableData)}`);
      }
      break;
    case 'svg':
      if (vc.content && svgConstName) {
        // SVG goes into a const above the array
        svgConst = { name: svgConstName, value: vc.content };
        parts.push(`content: ${svgConstName}`);
      } else if (vc.content) {
        // Fallback: inline (not ideal for large SVGs)
        parts.push(`content: '${escapeTS(vc.content)}'`);
      }
      break;
    case 'image':
      if (vc.image !== undefined && vc.image !== null) {
        parts.push(`image: '${escapeTS(vc.image)}'`);
      }
      break;
    case 'video':
      if (vc.content !== undefined && vc.content !== null) {
        parts.push(`content: '${escapeTS(vc.content)}'`);
      }
      break;
    default:
      // Unknown type — include content/image if present
      if (vc.content !== undefined && vc.content !== null) {
        parts.push(`content: '${escapeTS(vc.content)}'`);
      }
      if (vc.image !== undefined && vc.image !== null) {
        parts.push(`image: '${escapeTS(vc.image)}'`);
      }
      break;
  }

  return { inline: `{ ${parts.join(', ')} }`, svgConst };
}

/** Format a single question as a one-line TS object literal */
function formatQuestionTS(
  q: Record<string, unknown>,
  svgConstName?: string,
): { line: string; svgConst?: { name: string; value: string } } {
  const parts: string[] = [];
  let svgConst: { name: string; value: string } | undefined;

  // id
  parts.push(`id: '${escapeTS(q.id as string)}'`);

  // categoryId
  parts.push(`categoryId: '${escapeTS(q.categoryId as string)}'`);

  // subModuleId
  parts.push(`subModuleId: '${escapeTS(q.subModuleId as string)}'`);

  // difficulty
  parts.push(`difficulty: '${escapeTS(q.difficulty as string)}'`);

  // questionText
  parts.push(`questionText: '${escapeTS(q.questionText as string)}'`);

  // visualContent (new dual-mode field)
  if (q.visualContent && typeof q.visualContent === 'object') {
    const vcResult = formatVisualContentTS(
      q.visualContent as { type: string; title?: string; description?: string; content?: string; image?: string; tableData?: { headers: string[]; rows: string[][]; columnWidths?: number[] } },
      svgConstName,
    );
    parts.push(`visualContent: ${vcResult.inline}`);
    svgConst = vcResult.svgConst;
  }

  // svg (legacy field — inline const reference or raw)
  if (q.svg && typeof q.svg === 'string' && !q.visualContent) {
    // If there is a separate SVG const for this, reference it
    if (svgConstName && !svgConst) {
      svgConst = { name: svgConstName, value: q.svg as string };
      parts.push(`svg: ${svgConstName}`);
    } else {
      parts.push(`svg: '${escapeTS(q.svg as string)}'`);
    }
  }

  // image (legacy base64 field)
  if (q.image && typeof q.image === 'string') {
    parts.push(`image: '${escapeTS(q.image as string)}'`);
  }

  // Optional layout fields
  if (q.svgMaxHeight !== undefined) parts.push(`svgMaxHeight: ${q.svgMaxHeight}`);
  if (q.optionSvgMaxHeight !== undefined) parts.push(`optionSvgMaxHeight: ${q.optionSvgMaxHeight}`);
  if (q.bgColor) parts.push(`bgColor: '${escapeTS(q.bgColor as string)}'`);
  if (q.svgPosition) parts.push(`svgPosition: '${escapeTS(q.svgPosition as string)}'`);
  if (q.svgAlign) parts.push(`svgAlign: '${escapeTS(q.svgAlign as string)}'`);
  if (q.textVerticalAlign) parts.push(`textVerticalAlign: '${escapeTS(q.textVerticalAlign as string)}'`);
  if (q.layoutRatio !== undefined) parts.push(`layoutRatio: ${q.layoutRatio}`);

  // options
  const optionsStr = (q.options as Array<{ label: string; text: string; svg?: string; image?: string; pinned?: boolean; score?: number; feedback?: string }>)
    .map((opt) => {
      const optParts: string[] = [
        `label: '${escapeTS(opt.label)}'`,
        `text: '${escapeTS(opt.text)}'`,
      ];
      if (opt.svg) optParts.push(`svg: '${escapeTS(opt.svg)}'`);
      if (opt.image) optParts.push(`image: '${escapeTS(opt.image)}'`);
      if (opt.pinned !== undefined) optParts.push(`pinned: ${opt.pinned}`);
      if (opt.score !== undefined) optParts.push(`score: ${opt.score}`);
      if (opt.feedback) optParts.push(`feedback: '${escapeTS(opt.feedback)}'`);
      return `{ ${optParts.join(', ')} }`;
    })
    .join(', ');
  parts.push(`options: [${optionsStr}]`);

  // correctAnswer
  parts.push(`correctAnswer: ${q.correctAnswer}`);

  // correctAnswers (optional)
  if (q.correctAnswers && Array.isArray(q.correctAnswers)) {
    parts.push(`correctAnswers: [${(q.correctAnswers as number[]).join(', ')}]`);
  }

  // solution
  parts.push(`solution: '${escapeTS(q.solution as string)}'`);

  // tags
  if (q.tags && Array.isArray(q.tags) && (q.tags as string[]).length > 0) {
    const tagsStr = (q.tags as string[]).map((t: string) => `'${escapeTS(t)}'`).join(', ');
    parts.push(`tags: [${tagsStr}]`);
  }

  // questionType (optional)
  if (q.questionType && q.questionType !== 'single') {
    parts.push(`questionType: '${escapeTS(q.questionType as string)}'`);
  }

  // reviewStatus (optional, only when not 'unreviewed')
  if (q.reviewStatus && q.reviewStatus !== 'unreviewed') {
    parts.push(`reviewStatus: '${escapeTS(q.reviewStatus as string)}'`);
  }

  // timestamps
  parts.push('createdAt: T');
  parts.push('updatedAt: T');

  return { line: `  { ${parts.join(', ')} },`, svgConst };
}

/**
 * Count existing questions in a seed file by searching for ID patterns.
 * Returns the highest numeric suffix found.
 */
function countExistingQuestions(content: string, prefix: string): number {
  const regex = new RegExp(`id:\\s*'${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)'`, 'g');
  let maxNum = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const num = parseInt(match[1], 10);
    if (num > maxNum) maxNum = num;
  }
  return maxNum;
}

/**
 * Count existing SVG consts in a seed file.
 * Returns the highest numeric suffix for the given pattern.
 */
function countExistingSvgConsts(content: string): number {
  const regex = /const\s+SVG_\w+?(\d+)\s*=/g;
  let maxNum = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const num = parseInt(match[1], 10);
    if (num > maxNum) maxNum = num;
  }
  return maxNum;
}

/** Create a brand-new seed file template */
function createNewSeedFile(exportName: string): string {
  return `import { Question } from '@/lib/types';

const T = '2025-02-01T00:00:00.000Z';

export const ${exportName}: Question[] = [
];
`;
}

// ── POST: Save approved questions to seed file ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, questions } = body as { module: string; questions: Record<string, unknown>[] };

    // Validate input
    if (!module || typeof module !== 'string') {
      return Response.json({ error: 'module parametresi gerekli (string).' }, { status: 400 });
    }
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return Response.json({ error: 'questions parametresi gerekli (bonempty array).' }, { status: 400 });
    }

    const seedInfo = MODULE_SEED_MAP[module];
    if (!seedInfo) {
      return Response.json(
        { error: `Bilinmeyen moduel: "${module}". Gecerli moduller: ${Object.keys(MODULE_SEED_MAP).join(', ')}` },
        { status: 400 },
      );
    }

    const filePath = path.join(SEED_DIR, seedInfo.file);
    const { export: exportName, prefix } = seedInfo;

    // Read existing file or create new
    let content: string;
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      content = createNewSeedFile(exportName);
    }

    // Determine starting ID number
    const existingMax = countExistingQuestions(content, prefix);
    let nextNum = existingMax + 1;

    // Determine starting SVG const number
    let nextSvgNum = countExistingSvgConsts(content) + 1;

    // Build new lines and SVG consts
    const newLines: string[] = [];
    const newSvgConsts: string[] = [];

    for (const q of questions) {
      // Assign new ID
      const newId = `${prefix}-${nextNum}`;
      q.id = newId;
      nextNum++;

      // Auto-set svgPosition to 'top' for questions with visualContent (if not already set)
      if (q.visualContent && !q.svgPosition) {
        q.svgPosition = 'top';
      }

      // Determine SVG const name if needed
      let svgConstName: string | undefined;
      const vc = q.visualContent as { type?: string; content?: string } | undefined;
      const hasSvgVisual = vc && vc.type === 'svg' && vc.content;
      const hasLegacySvg = q.svg && typeof q.svg === 'string' && !q.visualContent;

      if (hasSvgVisual || hasLegacySvg) {
        svgConstName = `SVG_${nextSvgNum}`;
        nextSvgNum++;
      }

      const result = formatQuestionTS(q, svgConstName);
      newLines.push(result.line);
      if (result.svgConst) {
        // Escape backtick in SVG for template literal
        const safeSvg = result.svgConst.value.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
        newSvgConsts.push(`const ${result.svgConst.name} = \`${safeSvg}\`;`);
      }
    }

    // Insert SVG consts before the export line
    if (newSvgConsts.length > 0) {
      const exportPattern = new RegExp(`export\\s+const\\s+${exportName}`);
      const exportMatch = exportPattern.exec(content);
      if (exportMatch && exportMatch.index !== undefined) {
        const insertPos = exportMatch.index;
        const svgBlock = newSvgConsts.join('\n\n') + '\n\n';
        content = content.slice(0, insertPos) + svgBlock + content.slice(insertPos);
      }
    }

    // Insert new question lines before the closing `];`
    const closingBracketRegex = /\n];(\s*)$/;
    const closingMatch = closingBracketRegex.exec(content);

    if (closingMatch) {
      const insertPos = closingMatch.index;
      const newBlock = '\n' + newLines.join('\n') + '\n';
      content = content.slice(0, insertPos) + newBlock + content.slice(insertPos);
    } else {
      // Fallback: try to find the last `];` in file
      const lastBracketIdx = content.lastIndexOf('];');
      if (lastBracketIdx !== -1) {
        const newBlock = '\n' + newLines.join('\n') + '\n';
        content = content.slice(0, lastBracketIdx) + newBlock + content.slice(lastBracketIdx);
      } else {
        return Response.json(
          { error: `Seed dosyasinda kapatan "];" bulunamadi: ${seedInfo.file}` },
          { status: 500 },
        );
      }
    }

    // Write file
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');

    // Ensure store.ts has the import for this seed file
    try {
      ensureStoreImport(seedInfo.file, seedInfo.export);
    } catch (storeErr) {
      console.error('[save-questions] store.ts update failed:', storeErr);
      // Non-fatal: seed file is saved, store import can be added manually
    }

    const savedIds = questions.map((q) => q.id as string);

    return Response.json({
      success: true,
      file: seedInfo.file,
      savedCount: questions.length,
      savedIds,
      totalInFile: countExistingQuestions(content, prefix),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('[save-questions POST]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}

// ── DELETE: Remove questions from seed file ──
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, questionIds } = body as { module: string; questionIds: string[] };

    // Validate input
    if (!module || typeof module !== 'string') {
      return Response.json({ error: 'module parametresi gerekli (string).' }, { status: 400 });
    }
    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return Response.json({ error: 'questionIds parametresi gerekli (bonempty array).' }, { status: 400 });
    }

    const seedInfo = MODULE_SEED_MAP[module];
    if (!seedInfo) {
      return Response.json(
        { error: `Bilinmeyen modul: "${module}". Gecerli moduller: ${Object.keys(MODULE_SEED_MAP).join(', ')}` },
        { status: 400 },
      );
    }

    const filePath = path.join(SEED_DIR, seedInfo.file);

    if (!fs.existsSync(filePath)) {
      return Response.json({ error: `Seed dosyasi bulunamadi: ${seedInfo.file}` }, { status: 404 });
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    let removedCount = 0;

    for (const qId of questionIds) {
      // Build a regex that matches the entire single-line question entry
      // Pattern: optional whitespace + `{ id: 'the-id', ... },` + optional newline
      const escapedId = qId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const lineRegex = new RegExp(
        `[ \\t]*\\{[^\\n]*id:\\s*'${escapedId}'[^\\n]*\\},?[ \\t]*\\n?`,
        'g',
      );

      const before = content;
      content = content.replace(lineRegex, '');
      if (content !== before) {
        removedCount++;
      }
    }

    // Clean up: remove any double blank lines left behind
    content = content.replace(/\n{3,}/g, '\n\n');

    // Clean up: ensure no trailing comma before `];`
    content = content.replace(/,(\s*)\];/g, '$1\n];');

    // Write file back
    fs.writeFileSync(filePath, content, 'utf-8');

    return Response.json({
      success: true,
      file: seedInfo.file,
      removedCount,
      requestedCount: questionIds.length,
      remainingInFile: countExistingQuestions(content, seedInfo.prefix),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('[save-questions DELETE]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}

// ── PUT: Update an existing question in its seed file ──
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, question } = body as { module: string; question: Record<string, unknown> };

    // Validate input
    if (!module || typeof module !== 'string') {
      return Response.json({ error: 'module parametresi gerekli (string).' }, { status: 400 });
    }
    if (!question || typeof question !== 'object' || !question.id) {
      return Response.json({ error: 'question parametresi gerekli (id içeren obje).' }, { status: 400 });
    }

    const questionId = question.id as string;

    // Build regex to find the question line by ID
    const escapedId = questionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRegex = new RegExp(
      `[ \\t]*\\{[^\\n]*id:\\s*'${escapedId}'[^\\n]*\\},?[ \\t]*`,
    );

    // Strategy: First try the module-mapped file, then search all seed files
    // (A submodule may have questions spread across multiple seed files)
    let filePath: string | null = null;
    let content: string = '';
    let match: RegExpExecArray | null = null;
    let foundFile: string = '';

    // 1) Try the module-mapped file first
    const seedInfo = MODULE_SEED_MAP[module];
    if (seedInfo) {
      const candidatePath = path.join(SEED_DIR, seedInfo.file);
      if (fs.existsSync(candidatePath)) {
        const candidateContent = fs.readFileSync(candidatePath, 'utf-8');
        const candidateMatch = lineRegex.exec(candidateContent);
        if (candidateMatch) {
          filePath = candidatePath;
          content = candidateContent;
          match = candidateMatch;
          foundFile = seedInfo.file;
        }
      }
    }

    // 2) If not found, search all seed files in the directory
    if (!match) {
      const allSeedFiles = fs.readdirSync(SEED_DIR).filter(f => f.startsWith('seed-') && f.endsWith('.ts'));
      for (const seedFile of allSeedFiles) {
        const candidatePath = path.join(SEED_DIR, seedFile);
        const candidateContent = fs.readFileSync(candidatePath, 'utf-8');
        const candidateMatch = lineRegex.exec(candidateContent);
        if (candidateMatch) {
          filePath = candidatePath;
          content = candidateContent;
          match = candidateMatch;
          foundFile = seedFile;
          break;
        }
      }
    }

    if (!match || !filePath) {
      return Response.json(
        { error: `Soru bulunamadı: "${questionId}" hiçbir seed dosyasında bulunamadı.` },
        { status: 404 },
      );
    }

    // Check if the old line references an SVG const (e.g., svg: SVG_TP_G1)
    const oldLine = match[0];
    const svgConstRefMatch = oldLine.match(/svg:\s+(SVG_\w+)/);
    const vcSvgConstRefMatch = oldLine.match(/content:\s+(SVG_\w+)/);

    // Determine SVG const name to preserve reference
    let svgConstName: string | undefined;
    if (svgConstRefMatch) {
      svgConstName = svgConstRefMatch[1];
    } else if (vcSvgConstRefMatch) {
      svgConstName = vcSvgConstRefMatch[1];
    }

    // Format the updated question
    const result = formatQuestionTS(question, svgConstName);

    // Replace the old line with the new one
    content = content.replace(lineRegex, result.line);

    // Write file back
    fs.writeFileSync(filePath, content, 'utf-8');

    return Response.json({
      success: true,
      file: foundFile,
      updatedId: questionId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('[save-questions PUT]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
