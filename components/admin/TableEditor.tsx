'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TableData } from '@/lib/types';

interface TableEditorProps {
  value: TableData;
  onChange: (data: TableData) => void;
}

/**
 * TableEditor — Satır/sütun ekle-sil, hücre inline edit, responsive tablo düzenleyici.
 * Font boyutu: CSS clamp() ile alan yeterli olduğunda 14px, sıkışırsa 11px'e kadar küçülür.
 */
export default function TableEditor({ value, onChange }: TableEditorProps) {
  const { headers, rows } = value;
  const [editingCell, setEditingCell] = useState<{ type: 'header' | 'body'; row: number; col: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const colCount = headers.length;
  const rowCount = rows.length;

  // ── Hücre düzenleme ──

  const updateHeader = useCallback((colIdx: number, val: string) => {
    const newHeaders = [...headers];
    newHeaders[colIdx] = val;
    onChange({ ...value, headers: newHeaders });
  }, [headers, onChange, value]);

  const updateCell = useCallback((rowIdx: number, colIdx: number, val: string) => {
    const newRows = rows.map((r, ri) => ri === rowIdx ? r.map((c, ci) => ci === colIdx ? val : c) : [...r]);
    onChange({ ...value, rows: newRows });
  }, [rows, onChange, value]);

  // ── Satır işlemleri ──

  const addRow = useCallback(() => {
    const newRow = Array(colCount).fill('');
    onChange({ ...value, rows: [...rows, newRow] });
  }, [colCount, rows, onChange, value]);

  const deleteRow = useCallback((rowIdx: number) => {
    if (rowCount <= 1) return;
    onChange({ ...value, rows: rows.filter((_, i) => i !== rowIdx) });
  }, [rows, rowCount, onChange, value]);

  // ── Sütun işlemleri ──

  const addColumn = useCallback(() => {
    const newHeaders = [...headers, `Sütun ${colCount + 1}`];
    const newRows = rows.map(r => [...r, '']);
    onChange({ ...value, headers: newHeaders, rows: newRows });
  }, [headers, rows, colCount, onChange, value]);

  const deleteColumn = useCallback((colIdx: number) => {
    if (colCount <= 1) return;
    const newHeaders = headers.filter((_, i) => i !== colIdx);
    const newRows = rows.map(r => r.filter((_, i) => i !== colIdx));
    const newWidths = value.columnWidths?.filter((_, i) => i !== colIdx);
    onChange({ ...value, headers: newHeaders, rows: newRows, columnWidths: newWidths });
  }, [headers, rows, colCount, onChange, value]);

  // ── Inline edit handlers ──

  const startEdit = (type: 'header' | 'body', row: number, col: number) => {
    setEditingCell({ type, row, col });
  };

  const commitEdit = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === 'Escape') {
      commitEdit();
    }
  };

  const isEditing = (type: 'header' | 'body', row: number, col: number) =>
    editingCell?.type === type && editingCell?.row === row && editingCell?.col === col;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          Satır
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          Sütun
        </button>
        <span className="text-[10px] text-gray-400">{rowCount} satır &times; {colCount} sütun</span>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse" style={{ fontSize: 'clamp(11px, 2vw, 14px)' }}>
          <thead>
            <tr>
              {headers.map((h, ci) => (
                <th
                  key={ci}
                  className="border border-gray-200 bg-gray-100 font-semibold text-gray-700 text-left relative group"
                >
                  {isEditing('header', 0, ci) ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={h}
                      onChange={e => updateHeader(ci, e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1.5 bg-white border-2 border-indigo-400 rounded text-xs font-semibold outline-none"
                    />
                  ) : (
                    <div
                      className="px-2 py-1.5 cursor-text min-h-[28px] hover:bg-gray-200/50"
                      onClick={() => startEdit('header', 0, ci)}
                    >
                      {h || <span className="text-gray-400 italic">Ba\u015fl\u0131k</span>}
                    </div>
                  )}
                  {/* Sütun sil */}
                  {colCount > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteColumn(ci)}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] leading-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                      title="S\u00fctunu sil"
                    >
                      \u00d7
                    </button>
                  )}
                </th>
              ))}
              <th className="w-8 border border-gray-200 bg-gray-50" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? '' : 'bg-gray-50/50'}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="border border-gray-200 text-gray-700 relative"
                  >
                    {isEditing('body', ri, ci) ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={cell}
                        onChange={e => updateCell(ri, ci, e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                        className="w-full px-2 py-1 bg-white border-2 border-indigo-400 rounded text-xs outline-none"
                      />
                    ) : (
                      <div
                        className="px-2 py-1 cursor-text min-h-[24px] hover:bg-indigo-50/50"
                        onClick={() => startEdit('body', ri, ci)}
                      >
                        {cell || <span className="text-gray-300">&mdash;</span>}
                      </div>
                    )}
                  </td>
                ))}
                {/* Satır sil */}
                <td className="w-8 border border-gray-200 bg-gray-50 text-center">
                  {rowCount > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteRow(ri)}
                      className="w-5 h-5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors inline-flex items-center justify-center"
                      title="Sat\u0131r\u0131 sil"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
