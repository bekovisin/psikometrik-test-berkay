'use client';

import { useState, useCallback } from 'react';
import { VisualContent, VisualContentType, TableData } from '@/lib/types';
import RichTextEditor from './RichTextEditor';
import TableEditor from './TableEditor';
import SvgUploader from './SvgUploader';
import ImageUploader from './ImageUploader';
import { getEmbedUrl } from '@/lib/utils';

interface VisualContentEditorProps {
  value: VisualContent | undefined;
  onChange: (vc: VisualContent | undefined) => void;
  svgPreviewBgColor?: string;
}

const MODES: { type: VisualContentType; label: string; icon: string }[] = [
  { type: 'text', label: 'Metin', icon: '¶' },
  { type: 'table', label: 'Tablo', icon: '▦' },
  { type: 'svg', label: 'SVG', icon: '◇' },
  { type: 'image', label: 'Görsel', icon: '🖼' },
  { type: 'video', label: 'Video', icon: '▶' },
];

const DEFAULT_TABLE: TableData = {
  headers: ['Sütun 1', 'Sütun 2', 'Sütun 3'],
  rows: [
    ['', '', ''],
    ['', '', ''],
  ],
};

/**
 * VisualContentEditor — Soru editörü ve soru üretici için ortak görsel düzenleyici.
 *
 * Yapı:
 * ┌──────────────────────────────────────────┐
 * │ BAŞLIK (RichTextEditor, compact)          │
 * │──────────────────────────────────────────│
 * │ [Metin] [Tablo] [SVG] [Görsel] [Video]   │
 * │ İÇERİK ALANI (seçilen moda göre)         │
 * │──────────────────────────────────────────│
 * │ AÇIKLAMA (RichTextEditor, compact)        │
 * └──────────────────────────────────────────┘
 */
export default function VisualContentEditor({ value, onChange, svgPreviewBgColor }: VisualContentEditorProps) {
  // Eğer value yoksa, varsayılan bir başlangıç durumu kullan
  const vc: VisualContent = value || { type: 'text' };
  const [isExpanded, setIsExpanded] = useState(!!value);

  const update = useCallback((partial: Partial<VisualContent>) => {
    const updated = { ...vc, ...partial };
    onChange(updated);
  }, [vc, onChange]);

  const setType = useCallback((type: VisualContentType) => {
    // Mod değiştirildiğinde type-specific alanları temizle ama başlık/açıklama kalsın
    const base: VisualContent = {
      type,
      title: vc.title,
      description: vc.description,
    };
    if (type === 'table') {
      base.tableData = vc.tableData || DEFAULT_TABLE;
    } else if (type === 'text') {
      base.content = vc.type === 'text' ? vc.content : '';
    } else if (type === 'svg') {
      base.content = vc.type === 'svg' ? vc.content : '';
    } else if (type === 'image') {
      base.image = vc.type === 'image' ? vc.image : '';
    } else if (type === 'video') {
      base.content = vc.type === 'video' ? vc.content : '';
    }
    onChange(base);
  }, [vc, onChange]);

  const clear = useCallback(() => {
    onChange(undefined);
    setIsExpanded(false);
  }, [onChange]);

  // Henüz görsel eklenmemişse, "Görsel Ekle" butonu göster
  if (!isExpanded && !value) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsExpanded(true);
          onChange({ type: 'text' });
        }}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
        Görsel İçerik Ekle
      </button>
    );
  }

  const videoEmbed = vc.type === 'video' && vc.content ? getEmbedUrl(vc.content) : null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Üst bar — mod seçici + kaldır */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
          {MODES.map(m => (
            <button
              key={m.type}
              type="button"
              onClick={() => setType(m.type)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${vc.type === m.type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <span className="mr-1">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={clear}
          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Görsel içeriği kaldır"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Başlık */}
      <div className="px-3 py-2 border-b border-gray-100">
        <RichTextEditor
          value={vc.title || ''}
          onChange={title => update({ title })}
          placeholder="Başlık (opsiyonel)..."
          minHeight="2rem"
          collapsible
        />
      </div>

      {/* Çizgi (başlık ile içerik arasında) */}
      <div className="border-t border-gray-300" />

      {/* İçerik Alanı */}
      <div className="p-3">
        {vc.type === 'text' && (
          <RichTextEditor
            value={vc.content || ''}
            onChange={content => update({ content })}
            placeholder="Metin içeriği yazın (pasaj, iş belgesi, açıklama vb.)..."
            minHeight="6rem"
          />
        )}

        {vc.type === 'table' && (
          <TableEditor
            value={vc.tableData || DEFAULT_TABLE}
            onChange={tableData => update({ tableData })}
          />
        )}

        {vc.type === 'svg' && (
          <SvgUploader
            value={vc.content || ''}
            onChange={content => update({ content })}
            previewBgColor={svgPreviewBgColor}
          />
        )}

        {vc.type === 'image' && (
          <ImageUploader
            value={vc.image || ''}
            onChange={image => update({ image })}
            maxDimension={800}
            quality={0.7}
          />
        )}

        {vc.type === 'video' && (
          <div className="space-y-2">
            <input
              type="url"
              value={vc.content || ''}
              onChange={e => update({ content: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
            />
            {vc.content && !videoEmbed && (
              <p className="text-xs text-red-500">Geçersiz video URL</p>
            )}
            {videoEmbed && (
              <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe src={videoEmbed} className="absolute inset-0 w-full h-full" allowFullScreen />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Çizgi (içerik ile açıklama arasında) */}
      <div className="border-t border-gray-200" />

      {/* Açıklama */}
      <div className="px-3 py-2">
        <RichTextEditor
          value={vc.description || ''}
          onChange={description => update({ description })}
          placeholder="Açıklama / kaynak notu (opsiyonel)..."
          minHeight="1.5rem"
          collapsible
        />
      </div>
    </div>
  );
}
