import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const DEFAULT_ROOT = path.join(os.homedir(), 'Desktop', 'AC-soru bankası-v2');

export async function GET(req: NextRequest) {
  const dirParam = req.nextUrl.searchParams.get('path') || DEFAULT_ROOT;
  const dir = path.resolve(dirParam);

  // Safety: only allow browsing within Desktop/AC-soru bankası or common paths
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: 'Klasör bulunamadı', path: dir }, { status: 404 });
  }

  try {
    const stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: 'Bu bir klasör değil', path: dir }, { status: 400 });
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const folders: { name: string; path: string; hasSubfolders: boolean; pdfCount: number }[] = [];
    let pdfCount = 0;

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue; // skip hidden

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Count PDFs in subfolder and check for sub-subfolders
        const subEntries = fs.readdirSync(fullPath, { withFileTypes: true });
        const subPdfs = subEntries.filter(e => e.isFile() && e.name.toLowerCase().endsWith('.pdf')).length;
        const hasSubs = subEntries.some(e => e.isDirectory() && !e.name.startsWith('.'));
        folders.push({ name: entry.name, path: fullPath, hasSubfolders: hasSubs, pdfCount: subPdfs });
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
        pdfCount++;
      }
    }

    // Sort folders naturally
    folders.sort((a, b) => a.name.localeCompare(b.name, 'tr', { numeric: true }));

    return NextResponse.json({
      currentPath: dir,
      parentPath: path.dirname(dir) !== dir ? path.dirname(dir) : null,
      rootPath: DEFAULT_ROOT,
      folders,
      pdfCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
