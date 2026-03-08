'use client';

import { useState, useRef, useCallback } from 'react';

interface SvgUploaderProps {
  value: string;
  onChange: (svg: string) => void;
  label?: string;
  compact?: boolean;
  previewBgColor?: string;
  previewAlignClass?: string;
  previewMaxHeight?: string;
}

export default function SvgUploader({
  value,
  onChange,
  label,
  compact = false,
  previewBgColor,
  previewAlignClass = 'justify-center',
  previewMaxHeight,
}: SvgUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setError('');
    const validTypes = ['image/svg+xml'];
    const isSvgExt = file.name.toLowerCase().endsWith('.svg');
    if (!validTypes.includes(file.type) && !isSvgExt) {
      setError('Sadece SVG dosyaları desteklenir (.svg)');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('SVG dosyası 20MB\'dan küçük olmalı');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      if (!text.includes('<svg')) {
        setError('Geçerli bir SVG dosyası değil');
        return;
      }
      onChange(text);
      setShowCode(false);
    };
    reader.onerror = () => setError('Dosya okunamadı');
    reader.readAsText(file);
  }, [onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  /* ── SVG yüklü: Önizleme modu ── */
  if (value && !showCode) {
    return (
      <div className={compact ? 'space-y-1' : 'space-y-2'}>
        {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
        <div className="relative group">
          <div
            className={`${compact ? 'p-2' : 'p-4'} rounded-xl border border-gray-200 flex ${previewAlignClass}`}
            style={{ backgroundColor: previewBgColor || '#f9fafb' }}
          >
            <div
              className={compact ? 'svg-option' : 'svg-question'}
              style={
                compact
                  ? ({ '--svg-opt-h': previewMaxHeight || '48px' } as React.CSSProperties)
                  : ({ '--svg-max-h': previewMaxHeight || '200px' } as React.CSSProperties)
              }
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
          {/* Hover butonları */}
          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="px-1.5 py-0.5 bg-white rounded shadow text-[10px] font-medium text-gray-600 hover:text-indigo-600"
            >
              Kodu Düzenle
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-1.5 py-0.5 bg-white rounded shadow text-[10px] font-medium text-gray-600 hover:text-indigo-600"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-1.5 py-0.5 bg-white rounded shadow text-[10px] font-medium text-gray-600 hover:text-red-600"
            >
              Kaldır
            </button>
          </div>
        </div>
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <input ref={fileRef} type="file" accept=".svg,image/svg+xml" className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  /* ── Kod düzenleme modu (SVG var ve code açık) ── */
  if (value && showCode) {
    return (
      <div className={compact ? 'space-y-1' : 'space-y-2'}>
        {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              Dosya Yükle
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onChange('')} className="text-xs text-red-500 hover:text-red-600">
              Kaldır
            </button>
            <button type="button" onClick={() => setShowCode(false)} className="text-xs text-indigo-600 hover:text-indigo-700">
              Önizleme
            </button>
          </div>
        </div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={compact ? 3 : 5}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${compact ? 'text-[10px]' : 'text-xs'}`}
          placeholder='<svg viewBox="0 0 400 250">...</svg>'
        />
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <input ref={fileRef} type="file" accept=".svg,image/svg+xml" className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  /* ── Boş durum: Sürükle-bırak + Dosya Seç + Kod Yaz ── */
  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center
          ${compact ? 'p-3' : 'p-5'}
          ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
      >
        <svg className={`text-gray-300 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className={`text-gray-500 ${compact ? 'text-[10px] mt-1' : 'text-xs mt-2'}`}>
          {compact ? 'SVG sürükle veya tıkla' : 'SVG dosyasını sürükle bırak veya tıkla'}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">Sadece .svg dosyaları &middot; Maks 20MB</p>
      </div>

      {/* Kod ile yazma seçeneği */}
      <button
        type="button"
        onClick={e => { e.stopPropagation(); setShowCode(true); onChange(''); }}
        className={`flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors ${compact ? 'text-[10px]' : 'text-xs'}`}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
        SVG kodunu elle yaz
      </button>

      {error && <p className="text-[10px] text-red-500">{error}</p>}
      <input ref={fileRef} type="file" accept=".svg,image/svg+xml" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
