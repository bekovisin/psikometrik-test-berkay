import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max

const PYTHON_PATH = '/Library/Frameworks/Python.framework/Versions/3.12/bin/python3';
const GENERATOR_DIR = path.join(process.cwd(), 'tools', 'question-generator');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, counts, optionsCount, pdfPath } = body;

    if (!module) {
      return Response.json({ error: 'module parametresi gerekli' }, { status: 400 });
    }

    // Build CLI arguments
    const args: string[] = [
      'main.py',
      '--module', module,
      '--options', String(optionsCount || 5),
    ];

    // Add per-difficulty counts
    if (counts) {
      if (counts['cok-kolay'] !== undefined) args.push('--cok-kolay', String(counts['cok-kolay']));
      if (counts['kolay'] !== undefined) args.push('--kolay', String(counts['kolay']));
      if (counts['orta'] !== undefined) args.push('--orta', String(counts['orta']));
      if (counts['zor'] !== undefined) args.push('--zor', String(counts['zor']));
      if (counts['cok-zor'] !== undefined) args.push('--cok-zor', String(counts['cok-zor']));
    }

    // Add PDF path if provided
    if (pdfPath) {
      args.push('--pdf', pdfPath);
    }

    args.push('--verbose');

    // Create ReadableStream for SSE
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        function sendSSE(data: object) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        }

        function sendLog(text: string, level: 'info' | 'success' | 'error' | 'progress' = 'info') {
          sendSSE({ type: 'log', text, level });
        }

        sendLog(`Python pipeline başlatılıyor...`);
        sendLog(`Modül: ${module}, Seçenek: ${optionsCount || 5} şık`);
        if (pdfPath) sendLog(`PDF Kaynak: ${pdfPath}`);

        const child = spawn(PYTHON_PATH, args, {
          cwd: GENERATOR_DIR,
          env: {
            ...process.env,
            PYTHONUNBUFFERED: '1', // Ensure real-time output
            PYTHONIOENCODING: 'utf-8',
          },
        });

        let totalQuestions = 0;
        let currentStep = 0;
        const totalSteps = 9;
        let outputFile = '';
        let verifiedCount = 0;
        let reviewCount = 0;

        function parseProgress(line: string) {
          // Parse step indicators: [1/9], [2/9], etc.
          const stepMatch = line.match(/\[(\d+)\/9\]/);
          if (stepMatch) {
            currentStep = parseInt(stepMatch[1]);
            const progressValue = Math.round((currentStep / totalSteps) * 90);
            sendSSE({ type: 'progress', value: progressValue });
          }

          // Parse completion markers
          if (line.includes('✅')) {
            const countMatch = line.match(/(\d+)\s+soru\s+üretildi/);
            if (countMatch) {
              totalQuestions += parseInt(countMatch[1]);
            }
          }

          // Parse output file path
          if (line.includes('📁 Dosya:')) {
            outputFile = line.replace(/.*📁 Dosya:\s*/, '').trim();
          }

          // Parse validation counts
          const verifiedMatch = line.match(/Doğrulandı:\s*(\d+)/);
          if (verifiedMatch) verifiedCount = parseInt(verifiedMatch[1]);
          const reviewMatch = line.match(/İnceleme gerekli:\s*(\d+)/);
          if (reviewMatch) reviewCount = parseInt(reviewMatch[1]);

          // Parse total
          if (line.includes('📝 Toplam:')) {
            const m = line.match(/(\d+)\s+soru/);
            if (m) totalQuestions = parseInt(m[1]);
          }

          // Determine log level
          let level: 'info' | 'success' | 'error' | 'progress' = 'info';
          if (line.includes('✅') || line.includes('🎉')) level = 'success';
          else if (line.includes('❌') || line.includes('⚠️')) level = 'error';
          else if (line.includes('🚀') || line.includes('🧠') || line.includes('📄') || line.includes('🔍') || line.includes('🎨') || line.includes('⚖️') || line.includes('✍️') || line.includes('🔎') || line.includes('📊')) level = 'progress';

          return level;
        }

        let stdoutBuffer = '';
        child.stdout.on('data', (data: Buffer) => {
          stdoutBuffer += data.toString('utf-8');
          const lines = stdoutBuffer.split('\n');
          stdoutBuffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            const level = parseProgress(trimmed);
            sendLog(trimmed, level);
          }
        });

        let stderrBuffer = '';
        child.stderr.on('data', (data: Buffer) => {
          stderrBuffer += data.toString('utf-8');
          const lines = stderrBuffer.split('\n');
          stderrBuffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            // Skip Python warnings
            if (trimmed.includes('DeprecationWarning') || trimmed.includes('UserWarning')) continue;
            sendLog(`[stderr] ${trimmed}`, 'error');
          }
        });

        child.on('close', (code: number | null) => {
          // Flush remaining buffers
          if (stdoutBuffer.trim()) {
            const level = parseProgress(stdoutBuffer.trim());
            sendLog(stdoutBuffer.trim(), level);
          }
          if (stderrBuffer.trim() && !stderrBuffer.includes('Warning')) {
            sendLog(`[stderr] ${stderrBuffer.trim()}`, 'error');
          }

          if (code === 0) {
            sendSSE({
              type: 'complete',
              result: {
                totalQuestions,
                verifiedCount,
                reviewCount,
                module,
                outputFile: outputFile || `tools/question-generator/output/seed-${module}.ts`,
              },
            });
          } else {
            sendSSE({
              type: 'error',
              text: `Python işlemi hata kodu ile sonlandı: ${code}`,
            });
          }

          controller.close();
        });

        child.on('error', (err: Error) => {
          sendLog(`Süreç başlatılamadı: ${err.message}`, 'error');
          sendSSE({ type: 'error', text: err.message });
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return Response.json({ error: message }, { status: 500 });
  }
}
