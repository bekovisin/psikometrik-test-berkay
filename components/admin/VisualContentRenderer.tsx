'use client';

import { VisualContent } from '@/lib/types';
import { renderMath } from '@/lib/math';

interface VisualContentRendererProps {
  content: VisualContent;
  bgColor?: string;
  maxHeight?: number;
  compact?: boolean; // mini preview modu (QuestionCard)
}

/**
 * VisualContentRenderer — Soru görsellerini READ modunda render eder.
 *
 * Yapı:
 * ┌──────────────────────────────┐
 * │ BAŞLIK (rich HTML)           │
 * │──────────────────────────────│ ← çizgi
 * │ İÇERİK (metin/tablo/svg/...) │
 * │──────────────────────────────│ ← çizgi (açıklama varsa)
 * │ AÇIKLAMA (rich HTML)         │
 * └──────────────────────────────┘
 */
export default function VisualContentRenderer({ content, bgColor, maxHeight, compact }: VisualContentRendererProps) {
  const hasTitle = content.title && content.title.replace(/<[^>]*>/g, '').trim().length > 0;
  const hasDescription = content.description && content.description.replace(/<[^>]*>/g, '').trim().length > 0;

  return (
    <div
      className={`rounded-xl border border-gray-200 overflow-hidden ${compact ? 'text-xs' : ''}`}
      style={{ backgroundColor: bgColor || '#f9fafb', maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflow: maxHeight ? 'hidden' : undefined }}
    >
      {/* Başlık */}
      {hasTitle && (
        <>
          <div className={`${compact ? 'px-2 py-1' : 'px-4 py-2.5'}`}>
            <div
              className={`rich-text-content font-semibold text-gray-800 ${compact ? 'text-xs' : 'text-sm'}`}
              dangerouslySetInnerHTML={{ __html: renderMath(content.title!) }}
            />
          </div>
          <div className="border-t border-gray-300" />
        </>
      )}

      {/* İçerik */}
      <div className={content.type === 'table' ? '' : (compact ? 'p-2' : 'p-4')}>
        {content.type === 'text' && content.content && (
          <div
            className={`rich-text-content text-gray-700 leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}
            dangerouslySetInnerHTML={{ __html: renderMath(content.content) }}
          />
        )}

        {content.type === 'table' && content.tableData && (
          <TableRenderer data={content.tableData} compact={compact} />
        )}

        {content.type === 'svg' && content.content && (
          <div
            className="[&>svg]:max-w-full [&>svg]:h-auto [&>svg]:mx-auto"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        )}

        {content.type === 'image' && content.image && (
          <div className="flex justify-center">
            <img
              src={content.image}
              alt="Soru görseli"
              className="object-contain max-w-full"
              style={{ maxHeight: maxHeight ? `${maxHeight - 80}px` : '400px' }}
            />
          </div>
        )}

        {content.type === 'video' && content.content && (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getVideoEmbedUrl(content.content)}
              className="absolute inset-0 w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Açıklama */}
      {hasDescription && (
        <>
          <div className="border-t border-gray-300" />
          <div className={`${compact ? 'px-2 py-1' : 'px-4 py-2'}`}>
            <div
              className={`rich-text-content text-gray-500 italic ${compact ? 'text-[10px]' : 'text-xs'}`}
              dangerouslySetInnerHTML={{ __html: renderMath(content.description!) }}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ── Tablo Renderer ──

function TableRenderer({ data, compact }: { data: { headers: string[]; rows: string[][]; columnWidths?: number[] }; compact?: boolean }) {
  const { headers, rows, columnWidths } = data;
  if (!headers.length && !rows.length) return null;

  return (
    <div className="overflow-x-auto -mb-px">
      <table className="w-full border-collapse">
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`border border-gray-300 bg-gray-100 font-semibold text-gray-700 text-left ${compact ? 'px-1.5 py-1 text-[10px]' : 'px-3 py-2 text-xs'}`}
                  style={columnWidths?.[i] ? { width: `${columnWidths[i]}%` } : undefined}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? '' : 'bg-gray-50/50'}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border border-gray-200 text-gray-700 ${ri === rows.length - 1 ? 'border-b-0' : ''} ${compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-3 py-1.5 text-xs'}`}
                  style={columnWidths?.[ci] ? { width: `${columnWidths[ci]}%` } : undefined}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Video URL → Embed URL ──

function getVideoEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}
