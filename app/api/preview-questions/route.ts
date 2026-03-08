import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'tools', 'question-generator', 'output');

// Module to actual file name mapping (matches config.py MODULE_SEED_MAP)
const MODULE_FILE_MAP: Record<string, string> = {
  'sayisal-muhakeme': 'seed-numerical-reasoning',
  'sayisal-okuma-anlama': 'seed-sayisal-okuma',
  'sayisal-kritik-akil': 'seed-sayisal-kritik-tables',
  'sayisal-karsilastirma': 'seed-sayisal-karsilastirma',
  'capp-sayisal': 'seed-capp-sayisal',
  'tp-sayisal': 'seed-tp-sayisal',
  'sozel-muhakeme': 'seed-sozel-muhakeme',
  'sozel-okuma-anlama': 'seed-sozel-okuma-anlama',
  'kiyaslar': 'seed-kiyaslar',
  'capp-sozel': 'seed-capp-sozel',
  'tp-sozel': 'seed-tp-sozel',
};

export async function GET(req: NextRequest) {
  const module = req.nextUrl.searchParams.get('module');
  if (!module) {
    return NextResponse.json({ error: 'module parametresi gerekli' }, { status: 400 });
  }

  // Use mapped filename or fallback to seed-{module}
  const baseName = MODULE_FILE_MAP[module] || `seed-${module}`;
  const jsonFile = path.join(OUTPUT_DIR, `${baseName}.json`);

  if (!fs.existsSync(jsonFile)) {
    // Also try the simple format as fallback
    const fallbackFile = path.join(OUTPUT_DIR, `seed-${module}.json`);
    if (fs.existsSync(fallbackFile)) {
      try {
        const content = fs.readFileSync(fallbackFile, 'utf-8');
        const questions = JSON.parse(content);
        return NextResponse.json({ questions, count: questions.length, module });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Önizleme dosyası bulunamadı', file: jsonFile }, { status: 404 });
  }

  try {
    const content = fs.readFileSync(jsonFile, 'utf-8');
    const questions = JSON.parse(content);
    return NextResponse.json({ questions, count: questions.length, module });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
