import katex from 'katex';

/**
 * Render math expressions within text/HTML.
 *
 * Syntax:
 *   $$...$$  →  display (block) math
 *   $...$    →  inline math
 *
 * Works with both plain text and HTML content.
 * Non-math portions are left untouched.
 */
export function renderMath(input: string): string {
  if (!input) return input;

  // Step 1: Replace $$...$$ (display math) — must come first (greedy before single $)
  let result = input.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex: string) => {
    try {
      return katex.renderToString(tex.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch {
      return `<span class="text-red-500 text-xs">[Matematik hatası: ${tex}]</span>`;
    }
  });

  // Step 2: Replace $...$ (inline math) — avoid matching escaped \$ or empty $$
  result = result.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$/g, (_match, tex: string) => {
    try {
      return katex.renderToString(tex.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch {
      return `<span class="text-red-500 text-xs">[Matematik hatası: ${tex}]</span>`;
    }
  });

  return result;
}

/**
 * Check if text contains any math expressions ($...$ or $$...$$)
 */
export function hasMath(text: string): boolean {
  if (!text) return false;
  return /\$\$[\s\S]+?\$\$|\$(?:[^$\\]|\\.)+?\$/.test(text);
}
