'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  value: string; // base64 data URL or ''
  onChange: (dataUrl: string) => void;
  maxDimension?: number; // max width/height in px
  quality?: number; // JPEG quality 0-1
  label?: string;
  compact?: boolean; // smaller UI for options
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function dataUrlSize(dataUrl: string): number {
  // base64 length * 3/4 gives approximate binary size
  const base64 = dataUrl.split(',')[1] || '';
  return Math.round(base64.length * 3 / 4);
}

async function compressImage(
  file: File,
  maxDim: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        let { width, height } = img;

        // Scale down if needed
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round(height * (maxDim / width));
            width = maxDim;
          } else {
            width = Math.round(width * (maxDim / height));
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas desteklenmiyor')); return; }

        ctx.drawImage(img, 0, 0, width, height);

        // Use JPEG for photos (smaller), PNG for transparency
        const isPng = file.type === 'image/png';
        const hasTransparency = isPng; // assume PNG might have transparency

        let dataUrl: string;
        if (hasTransparency) {
          // Try PNG first, fall back to JPEG if too large
          dataUrl = canvas.toDataURL('image/png');
          const pngSize = dataUrlSize(dataUrl);
          if (pngSize > 200 * 1024) {
            // If PNG > 200KB, convert to JPEG
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } else {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Görsel yüklenemedi'));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  value,
  onChange,
  maxDimension = 800,
  quality = 0.7,
  label,
  compact = false,
}: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError('');

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Desteklenen formatlar: PNG, JPEG, GIF, WebP');
      return;
    }

    // Validate size (max 10MB raw)
    if (file.size > 10 * 1024 * 1024) {
      setError('Dosya 10MB\'dan küçük olmalı');
      return;
    }

    setCompressing(true);
    try {
      const compressed = await compressImage(file, maxDimension, quality);
      onChange(compressed);
    } catch (e) {
      setError((e as Error).message || 'Sıkıştırma hatası');
    } finally {
      setCompressing(false);
    }
  }, [maxDimension, quality, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

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

  if (value) {
    // Preview mode
    const size = dataUrlSize(value);
    return (
      <div className={compact ? 'space-y-1' : 'space-y-2'}>
        {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
        <div className="relative group">
          <div className={`border border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${compact ? 'p-1' : 'p-2'} flex justify-center`}>
            <img
              src={value}
              alt="Yüklenen görsel"
              className={compact ? 'max-h-20 object-contain' : 'max-h-48 object-contain'}
            />
          </div>
          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <p className="text-[10px] text-gray-400">{formatBytes(size)} &middot; Maks boyut: {maxDimension}px</p>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  // Upload mode
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
        {compressing ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" /></svg>
            Sıkıştırılıyor...
          </div>
        ) : (
          <>
            <svg className={`text-gray-300 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className={`text-gray-500 ${compact ? 'text-[10px] mt-1' : 'text-xs mt-2'}`}>
              {compact ? 'Tıkla veya sürükle' : 'Görsel yüklemek için tıkla veya sürükle bırak'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPEG, GIF, WebP &middot; Maks 10MB</p>
          </>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
