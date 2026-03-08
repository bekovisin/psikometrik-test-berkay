'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { renderMath, hasMath } from '@/lib/math';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  collapsible?: boolean;
}

const FONTS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
];

const SIZES = [
  { label: 'Çok Küçük', value: '1' },
  { label: 'Küçük', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Orta', value: '4' },
  { label: 'Büyük', value: '5' },
  { label: 'Çok Büyük', value: '6' },
];

export default function RichTextEditor({ value, onChange, placeholder, minHeight = '4.5rem', collapsible = false }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [isEmpty, setIsEmpty] = useState(!value);
  const [showToolbar, setShowToolbar] = useState(!collapsible);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover] = useState({ rows: 0, cols: 0 });
  const activeCellRef = useRef<HTMLTableCellElement | null>(null);
  const [activeTableInfo, setActiveTableInfo] = useState<{ cell: HTMLTableCellElement; row: HTMLTableRowElement; table: HTMLTableElement } | null>(null);
  const [resizeInfo, setResizeInfo] = useState<{ table: HTMLTableElement; colIdx: number; startX: number; startWidths: number[] } | null>(null);
  const activeTableInfoRef = useRef<{ cell: HTMLTableCellElement; row: HTMLTableRowElement; table: HTMLTableElement } | null>(null);
  // Column selection system: Ctrl+Click to toggle, Shift+Click for range
  const [selectedCols, setSelectedCols] = useState<Set<number>>(new Set());
  const selectedColsRef = useRef<Set<number>>(new Set());
  const selectedColsTableRef = useRef<HTMLTableElement | null>(null);
  const lastClickedColRef = useRef<number>(-1);

  // Apply/remove visual highlight on selected columns
  const applyColHighlights = useCallback((table: HTMLTableElement | null, cols: Set<number>) => {
    // Remove all existing highlights
    if (editorRef.current) {
      editorRef.current.querySelectorAll('[data-col-selected]').forEach(el => {
        el.removeAttribute('data-col-selected');
      });
    }
    if (!table || cols.size === 0) return;
    // Apply highlight to cells in selected columns
    Array.from(table.rows).forEach(row => {
      Array.from(row.cells).forEach((cell, idx) => {
        if (cols.has(idx)) {
          cell.setAttribute('data-col-selected', 'true');
        }
      });
    });
  }, []);

  // Clear column selection
  const clearColSelection = useCallback(() => {
    const empty = new Set<number>();
    selectedColsRef.current = empty;
    setSelectedCols(empty);
    applyColHighlights(selectedColsTableRef.current, empty);
    selectedColsTableRef.current = null;
  }, [applyColHighlights]);

  // Highlight the active table cell based on cursor position
  const highlightActiveCell = useCallback(() => {
    if (!editorRef.current) return;
    if (activeCellRef.current) {
      activeCellRef.current.removeAttribute('data-active-cell');
      activeCellRef.current = null;
    }
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setActiveTableInfo(null);
      activeTableInfoRef.current = null;
      return;
    }
    const node = sel.anchorNode;
    if (!node) { setActiveTableInfo(null); activeTableInfoRef.current = null; return; }
    const el = node.nodeType === 3 ? node.parentElement : node as HTMLElement;
    if (!el) { setActiveTableInfo(null); activeTableInfoRef.current = null; return; }
    const cell = el.closest('td, th') as HTMLTableCellElement | null;
    if (cell && editorRef.current.contains(cell)) {
      cell.setAttribute('data-active-cell', 'true');
      activeCellRef.current = cell;
      const row = cell.closest('tr') as HTMLTableRowElement;
      const table = cell.closest('table') as HTMLTableElement;
      if (row && table) {
        const info = { cell, row, table };
        setActiveTableInfo(info);
        activeTableInfoRef.current = info;
      }
    } else {
      setActiveTableInfo(null);
      activeTableInfoRef.current = null;
    }
  }, []);

  // Wrap unwrapped tables in a scroll container for horizontal scrolling
  const ensureTableWrappers = useCallback(() => {
    if (!editorRef.current) return;
    const tables = editorRef.current.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.parentElement?.classList.contains('table-scroll-wrap')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll-wrap';
        wrapper.style.cssText = 'overflow-x:auto;max-width:100%';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }, []);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
        setIsEmpty(!value);
        // Wrap any existing tables in scroll containers
        ensureTableWrappers();
      }
    }
    isInternalChange.current = false;
  }, [value, ensureTableWrappers]);

  // Listen for selection changes to update active cell highlight
  useEffect(() => {
    const handler = () => highlightActiveCell();
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [highlightActiveCell]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    if (html === '<br>' || html === '<div><br></div>' || html.trim() === '') {
      html = '';
    }
    setIsEmpty(!html);
    isInternalChange.current = true;
    onChange(html);
  }, [onChange]);

  // Column resize: track mousemove/mouseup during drag
  useEffect(() => {
    if (!resizeInfo) return;
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const diff = e.clientX - resizeInfo.startX;
      const newWidth = Math.max(30, resizeInfo.startWidths[resizeInfo.colIdx] + diff);
      const firstRow = resizeInfo.table.rows[0];
      if (firstRow && firstRow.cells[resizeInfo.colIdx]) {
        (firstRow.cells[resizeInfo.colIdx] as HTMLElement).style.width = newWidth + 'px';
      }
    };
    const handleMouseUp = () => {
      setResizeInfo(null);
      if (editorRef.current) editorRef.current.style.cursor = '';
      handleInput();
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeInfo, handleInput]);

  const [showMathHelp, setShowMathHelp] = useState(false);
  const [showMathPreview, setShowMathPreview] = useState(false);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    handleInput();
  };

  const insertMath = (template: string) => {
    exec('insertText', template);
  };

  const insertTable = (rows: number, cols: number) => {
    if (!editorRef.current) return;
    const minColW = 100;
    const containerW = editorRef.current.offsetWidth - 24;
    const colWidth = Math.max(minColW, Math.floor(containerW / cols));
    const totalW = colWidth * cols;
    const tableWidthStyle = totalW > containerW ? `width:${totalW}px` : 'min-width:100%';
    let html = `<div class="table-scroll-wrap" style="overflow-x:auto;max-width:100%"><table style="${tableWidthStyle};margin:8px 0;table-layout:fixed">`;
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        const tag = r === 0 ? 'th' : 'td';
        const bgStyle = r === 0 ? 'background:#f3f4f6;font-weight:600;' : '';
        html += `<${tag} style="border:1px solid #d1d5db;padding:6px 10px;text-align:left;width:${colWidth}px;${bgStyle}">${r === 0 ? `Başlık ${c + 1}` : ''}</${tag}>`;
      }
      html += '</tr>';
    }
    html += '</table></div><p><br></p>';
    exec('insertHTML', html);
    setShowTablePicker(false);
  };

  // --- Table helpers ---
  const getCellIndex = (cell: HTMLTableCellElement) => {
    const row = cell.parentElement as HTMLTableRowElement;
    return Array.from(row.cells).indexOf(cell);
  };

  // Recalculate table width: if columns exceed container, set explicit width for scroll
  const syncTableWidth = (table: HTMLTableElement) => {
    const firstRow = table.rows[0];
    if (!firstRow) return;
    let totalW = 0;
    Array.from(firstRow.cells).forEach(c => {
      totalW += parseInt((c as HTMLElement).style.width) || c.offsetWidth;
    });
    const containerW = (editorRef.current?.offsetWidth || 600) - 24;
    if (totalW > containerW) {
      table.style.width = totalW + 'px';
      table.style.minWidth = '';
    } else {
      table.style.width = '';
      table.style.minWidth = '100%';
    }
  };

  const tableAddRow = (position: 'above' | 'below') => {
    if (!activeTableInfo) return;
    const { row } = activeTableInfo;
    const colCount = row.cells.length;
    const newRow = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement('td');
      td.style.cssText = 'border:1px solid #d1d5db;padding:6px 10px;text-align:left;';
      td.innerHTML = '<br>';
      newRow.appendChild(td);
    }
    if (position === 'below') {
      row.after(newRow);
    } else {
      row.before(newRow);
    }
    handleInput();
  };

  const tableAddCol = (position: 'left' | 'right') => {
    if (!activeTableInfo) return;
    const { cell, table } = activeTableInfo;
    const colIdx = getCellIndex(cell);
    table.style.tableLayout = 'fixed';
    // Ensure existing columns have explicit pixel widths before adding new one
    const firstRow = table.rows[0];
    if (firstRow) {
      Array.from(firstRow.cells).forEach(c => {
        if (!(c as HTMLElement).style.width || (c as HTMLElement).style.width.includes('%')) {
          (c as HTMLElement).style.width = c.offsetWidth + 'px';
        }
      });
    }
    const rows = table.querySelectorAll('tr');
    rows.forEach((tr, ri) => {
      const isHeader = ri === 0;
      const tag = isHeader ? 'th' : 'td';
      const newCell = document.createElement(tag);
      const bgStyle = isHeader ? 'background:#f3f4f6;font-weight:600;' : '';
      newCell.style.cssText = `border:1px solid #d1d5db;padding:6px 10px;text-align:left;width:100px;${bgStyle}`;
      newCell.innerHTML = isHeader ? 'Yeni' : '<br>';
      const refCell = tr.cells[colIdx];
      if (position === 'right') {
        refCell.after(newCell);
      } else {
        refCell.before(newCell);
      }
    });
    syncTableWidth(table);
    handleInput();
  };

  const tableDeleteRow = () => {
    if (!activeTableInfo) return;
    const { row, table } = activeTableInfo;
    const rows = table.querySelectorAll('tr');
    if (rows.length <= 1) {
      table.remove();
    } else {
      row.remove();
    }
    setActiveTableInfo(null);
    handleInput();
  };

  const tableDeleteCol = () => {
    if (!activeTableInfo) return;
    const { cell, table } = activeTableInfo;
    const colIdx = getCellIndex(cell);
    const rows = table.querySelectorAll('tr');
    const colCount = rows[0]?.cells.length || 0;
    if (colCount <= 1) {
      const wrapper = table.parentElement;
      if (wrapper?.classList.contains('table-scroll-wrap')) wrapper.remove();
      else table.remove();
    } else {
      rows.forEach(tr => {
        if (tr.cells[colIdx]) tr.cells[colIdx].remove();
      });
      syncTableWidth(table);
    }
    setActiveTableInfo(null);
    handleInput();
  };

  const tableDelete = () => {
    if (!activeTableInfo) return;
    const { table } = activeTableInfo;
    clearColSelection();
    const wrapper = table.parentElement;
    if (wrapper && wrapper.classList.contains('table-scroll-wrap')) {
      wrapper.remove();
    } else {
      table.remove();
    }
    setActiveTableInfo(null);
    handleInput();
  };

  const tableEqualDistribute = () => {
    const info = activeTableInfoRef.current || activeTableInfo;
    if (!info) return;
    const { table } = info;

    // Use the column selection from our custom selection system
    const cols = selectedColsRef.current;

    table.style.tableLayout = 'fixed';
    const firstRow = table.rows[0];
    if (!firstRow) return;

    // Helper: set width on ALL rows for a given column index
    const setColWidth = (colIdx: number, w: string) => {
      Array.from(table.rows).forEach(row => {
        if (row.cells[colIdx]) {
          (row.cells[colIdx] as HTMLElement).style.width = w;
        }
      });
    };

    // If no columns explicitly selected, equalize ALL columns
    if (cols.size <= 1) {
      const colCount = firstRow.cells.length;
      const containerW = editorRef.current?.offsetWidth || 600;
      const colWidth = Math.max(80, Math.floor((containerW - 24) / colCount));
      for (let i = 0; i < colCount; i++) {
        setColWidth(i, colWidth + 'px');
      }
      // Set exact table width = sum of all columns
      table.style.width = (colWidth * colCount) + 'px';
      table.style.minWidth = '';
    } else {
      // Equalize only selected columns: distribute their total width equally
      // First, ensure all columns have explicit pixel widths on ALL rows
      const colCount = firstRow.cells.length;
      for (let i = 0; i < colCount; i++) {
        const c = firstRow.cells[i] as HTMLElement;
        if (!c.style.width || c.style.width.includes('%')) {
          const w = c.offsetWidth + 'px';
          setColWidth(i, w);
        }
      }
      // Calculate total width of selected columns
      let selectedTotalW = 0;
      cols.forEach(idx => {
        if (firstRow.cells[idx]) {
          const cell = firstRow.cells[idx] as HTMLElement;
          selectedTotalW += parseInt(cell.style.width) || cell.offsetWidth;
        }
      });
      const equalWidth = Math.max(30, Math.floor(selectedTotalW / cols.size));
      // Set equal width on ALL rows for each selected column
      cols.forEach(idx => {
        setColWidth(idx, equalWidth + 'px');
      });
      // Set exact table width = sum of all final column widths (no rounding gaps)
      let exactTotal = 0;
      for (let i = 0; i < colCount; i++) {
        exactTotal += parseInt((firstRow.cells[i] as HTMLElement).style.width) || firstRow.cells[i].offsetWidth;
      }
      table.style.width = exactTotal + 'px';
      table.style.minWidth = '';
    }
    // Re-apply highlights after width change
    applyColHighlights(table, selectedColsRef.current);
    handleInput();
  };

  const tableWidenCol = () => {
    if (!activeTableInfo) return;
    const { cell, table } = activeTableInfo;
    const colIdx = getCellIndex(cell);
    const firstRow = table.rows[0];
    if (!firstRow) return;
    table.style.tableLayout = 'fixed';
    Array.from(firstRow.cells).forEach(c => {
      if (!(c as HTMLElement).style.width || (c as HTMLElement).style.width.includes('%')) {
        (c as HTMLElement).style.width = c.offsetWidth + 'px';
      }
    });
    const targetCell = firstRow.cells[colIdx] as HTMLElement;
    const currentW = parseInt(targetCell.style.width) || targetCell.offsetWidth;
    targetCell.style.width = (currentW + 30) + 'px';
    syncTableWidth(table);
    handleInput();
  };

  const tableNarrowCol = () => {
    if (!activeTableInfo) return;
    const { cell, table } = activeTableInfo;
    const colIdx = getCellIndex(cell);
    const firstRow = table.rows[0];
    if (!firstRow) return;
    table.style.tableLayout = 'fixed';
    Array.from(firstRow.cells).forEach(c => {
      if (!(c as HTMLElement).style.width || (c as HTMLElement).style.width.includes('%')) {
        (c as HTMLElement).style.width = c.offsetWidth + 'px';
      }
    });
    const targetCell = firstRow.cells[colIdx] as HTMLElement;
    const currentW = parseInt(targetCell.style.width) || targetCell.offsetWidth;
    targetCell.style.width = Math.max(30, currentW - 30) + 'px';
    syncTableWidth(table);
    handleInput();
  };

  // Mouse handlers for column resize
  const handleEditorMouseMove = useCallback((e: React.MouseEvent) => {
    if (resizeInfo) return; // Don't change cursor during active resize
    if (!editorRef.current) return;
    const el = e.target as HTMLElement;
    const cell = el.closest('td, th') as HTMLTableCellElement;
    if (cell && editorRef.current.contains(cell)) {
      const rect = cell.getBoundingClientRect();
      // Near right border of any cell except the last one in the row
      if (Math.abs(e.clientX - rect.right) < 6) {
        editorRef.current.style.cursor = 'col-resize';
        return;
      }
      // Near left border (except first cell)
      if (Math.abs(e.clientX - rect.left) < 6 && getCellIndex(cell) > 0) {
        editorRef.current.style.cursor = 'col-resize';
        return;
      }
    }
    editorRef.current.style.cursor = '';
  }, [resizeInfo]);

  const handleEditorMouseDown = useCallback((e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    const cell = el.closest('td, th') as HTMLTableCellElement;

    // If clicking outside a table cell, clear column selection
    if (!cell || !editorRef.current?.contains(cell)) {
      if (selectedColsRef.current.size > 0) clearColSelection();
      return;
    }

    const table = cell.closest('table') as HTMLTableElement;

    // --- Column resize (near border) ---
    const rect = cell.getBoundingClientRect();
    let targetColIdx = -1;
    if (Math.abs(e.clientX - rect.right) < 6) {
      targetColIdx = getCellIndex(cell);
    } else if (Math.abs(e.clientX - rect.left) < 6 && getCellIndex(cell) > 0) {
      targetColIdx = getCellIndex(cell) - 1;
    }
    if (targetColIdx >= 0) {
      e.preventDefault();
      e.stopPropagation();
      if (!table) return;
      table.style.tableLayout = 'fixed';
      const firstRow = table.rows[0];
      if (!firstRow) return;
      const startWidths = Array.from(firstRow.cells).map(c => c.offsetWidth);
      Array.from(firstRow.cells).forEach((c, i) => {
        (c as HTMLElement).style.width = startWidths[i] + 'px';
      });
      if (editorRef.current) editorRef.current.style.cursor = 'col-resize';
      setResizeInfo({ table, colIdx: targetColIdx, startX: e.clientX, startWidths });
      return;
    }

    // --- Column selection: Ctrl+Click (toggle) or Shift+Click (range) ---
    if ((e.ctrlKey || e.metaKey || e.shiftKey) && table) {
      e.preventDefault();
      const colIdx = getCellIndex(cell);

      // If clicking on a different table, start fresh
      if (selectedColsTableRef.current && selectedColsTableRef.current !== table) {
        clearColSelection();
      }
      selectedColsTableRef.current = table;

      let newCols = new Set(selectedColsRef.current);

      if (e.shiftKey && lastClickedColRef.current >= 0) {
        // Range select: from last clicked to current
        const from = Math.min(lastClickedColRef.current, colIdx);
        const to = Math.max(lastClickedColRef.current, colIdx);
        for (let i = from; i <= to; i++) {
          newCols.add(i);
        }
      } else {
        // Toggle this column
        if (newCols.has(colIdx)) {
          newCols.delete(colIdx);
        } else {
          newCols.add(colIdx);
        }
      }
      lastClickedColRef.current = colIdx;
      selectedColsRef.current = newCols;
      setSelectedCols(new Set(newCols));
      applyColHighlights(table, newCols);
      return;
    }

    // --- Normal click: clear column selection if any ---
    if (selectedColsRef.current.size > 0) {
      clearColSelection();
    }
    if (cell && table) {
      lastClickedColRef.current = getCellIndex(cell);
    }
  }, [applyColHighlights, clearColSelection]);

  // Close table picker on outside click
  useEffect(() => {
    if (!showTablePicker) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-table-picker]')) setShowTablePicker(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', close);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', close);
    };
  }, [showTablePicker]);

  const MATH_TEMPLATES = [
    { label: 'Kesir', code: '$\\frac{a}{b}$', desc: 'a/b kesri' },
    { label: 'Üst', code: '$x^{2}$', desc: 'Kuvvet' },
    { label: 'Alt', code: '$x_{i}$', desc: 'Alt indis' },
    { label: 'Karekök', code: '$\\sqrt{x}$', desc: 'Karekök' },
    { label: 'n. Kök', code: '$\\sqrt[n]{x}$', desc: 'n. dereceden kök' },
    { label: 'Toplam', code: '$\\sum_{i=1}^{n} x_i$', desc: 'Toplam sembolü' },
    { label: 'Çarpım', code: '$\\prod_{i=1}^{n} x_i$', desc: 'Çarpım sembolü' },
    { label: 'İntegral', code: '$\\int_{a}^{b} f(x) \\, dx$', desc: 'Belirli integral' },
    { label: 'Limit', code: '$\\lim_{x \\to \\infty} f(x)$', desc: 'Limit' },
    { label: 'Pi', code: '$\\pi$', desc: 'Pi sayısı' },
    { label: 'Ortalama', code: '$\\bar{x}$', desc: 'Ortalama (x çizgili)' },
    { label: 'Std Sapma', code: '$\\sigma$', desc: 'Sigma (standart sapma)' },
    { label: 'Eşitsizlik', code: '$\\leq$', desc: 'Küçük eşit' },
    { label: 'Artı Eksi', code: '$\\pm$', desc: 'Artı/eksi' },
    { label: 'Sonsuz', code: '$\\infty$', desc: 'Sonsuz' },
    { label: 'Yüzde', code: '$\\%$', desc: 'Yüzde' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-visible focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 relative">
      {showToolbar && (
      <div className="flex items-center gap-0.5 px-2 py-1 bg-gray-50 border-b border-gray-200 flex-wrap">
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('bold'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-sm font-bold" title="Kalın">B</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('italic'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-sm italic" title="İtalik">I</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('underline'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-sm underline" title="Altı Çizili">U</button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-sm line-through" title="Üstü Çizili">S</button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <label className="flex items-center gap-0.5 cursor-pointer px-1 py-0.5 rounded hover:bg-gray-200" title="Metin Rengi">
          <span className="text-xs font-bold text-gray-600">A</span>
          <input type="color" onChange={e => exec('foreColor', e.target.value)} className="w-4 h-4 cursor-pointer rounded border-0 p-0" />
        </label>
        <label className="flex items-center gap-0.5 cursor-pointer px-1 py-0.5 rounded hover:bg-gray-200" title="Vurgulama Rengi">
          <span className="text-xs font-bold bg-yellow-200 px-0.5 text-gray-600">A</span>
          <input type="color" defaultValue="#ffff00" onChange={e => exec('hiliteColor', e.target.value)} className="w-4 h-4 cursor-pointer rounded border-0 p-0" />
        </label>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <select
          onChange={e => { if (e.target.value) { exec('fontName', e.target.value); } e.target.selectedIndex = 0; }}
          className="text-xs h-7 px-1 border border-gray-200 rounded bg-white cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>Font</option>
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        <select
          onChange={e => { if (e.target.value) { exec('fontSize', e.target.value); } e.target.selectedIndex = 0; }}
          className="text-xs h-7 px-1 border border-gray-200 rounded bg-white cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>Boyut</option>
          {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <button type="button" onMouseDown={e => { e.preventDefault(); exec('superscript'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-xs" title="Üst Simge">
          x<sup>2</sup>
        </button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('subscript'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-xs" title="Alt Simge">
          x<sub>2</sub>
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        {/* Math buttons */}
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); insertMath('$  $'); }}
          className="h-7 px-1.5 flex items-center justify-center rounded hover:bg-purple-100 text-xs font-bold text-purple-600 border border-purple-200 bg-purple-50"
          title="Satır içi matematik ekle ($...$)"
        >
          <span className="font-serif italic">fx</span>
        </button>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); insertMath('\n$$  $$\n'); }}
          className="h-7 px-1.5 flex items-center justify-center rounded hover:bg-purple-100 text-xs text-purple-600 border border-purple-200 bg-purple-50"
          title="Blok matematik ekle ($$...$$)"
        >
          <span className="font-serif italic text-[10px]">f(x)</span>
        </button>
        <button
          type="button"
          onClick={() => setShowMathHelp(!showMathHelp)}
          className={`h-7 px-1.5 flex items-center justify-center rounded text-xs transition-colors ${showMathHelp ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-purple-500 border border-purple-200'}`}
          title="Matematik yardım ve hazır şablonlar"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
        </button>
        <button
          type="button"
          onClick={() => setShowMathPreview(!showMathPreview)}
          className={`h-7 px-1.5 flex items-center justify-center rounded text-[10px] font-medium transition-colors ${showMathPreview ? 'bg-green-600 text-white' : 'hover:bg-green-100 text-green-600 border border-green-200'}`}
          title="Matematik önizleme"
        >
          Önizle
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        {/* Hizalama */}
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200" title="Sola Hizala">
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 10H3M21 6H3M21 14H3M17 18H3" /></svg>
        </button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200" title="Ortala">
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10H6M21 6H3M21 14H3M18 18H6" /></svg>
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        {/* Liste */}
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200" title="Madde İşaretli Liste">
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" /></svg>
        </button>
        <button type="button" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200" title="Numaralı Liste">
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><text x="2" y="8" fontSize="8" fill="currentColor" fontFamily="sans-serif" fontWeight="bold">1</text><text x="2" y="14" fontSize="8" fill="currentColor" fontFamily="sans-serif" fontWeight="bold">2</text><text x="2" y="20" fontSize="8" fill="currentColor" fontFamily="sans-serif" fontWeight="bold">3</text></svg>
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        {/* Tablo */}
        <div className="relative" data-table-picker>
          <button
            type="button"
            onClick={() => setShowTablePicker(!showTablePicker)}
            className={`h-7 px-1.5 flex items-center justify-center rounded text-xs font-medium transition-colors ${showTablePicker ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-blue-600 border border-blue-200 bg-blue-50'}`}
            title="Tablo Ekle"
          >
            <svg className="w-4 h-4 mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>
            Tablo
          </button>
          {showTablePicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50" data-table-picker>
              <p className="text-xs text-gray-500 mb-1.5 text-center">
                {tableHover.rows > 0 ? `${tableHover.rows} × ${tableHover.cols}` : 'Satır × Sütun seçin'}
              </p>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                {Array.from({ length: 6 }, (_, r) =>
                  Array.from({ length: 6 }, (_, c) => (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      className={`w-5 h-5 border rounded-sm transition-colors ${
                        r < tableHover.rows && c < tableHover.cols
                          ? 'bg-blue-500 border-blue-600'
                          : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                      }`}
                      onMouseEnter={() => setTableHover({ rows: r + 1, cols: c + 1 })}
                      onMouseLeave={() => setTableHover({ rows: 0, cols: 0 })}
                      onClick={() => insertTable(r + 1, c + 1)}
                    />
                  ))
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  className="w-full text-xs text-blue-600 hover:bg-blue-50 rounded px-2 py-1 text-center"
                  onClick={() => insertTable(3, 4)}
                >
                  Hızlı: 3×4 Tablo
                </button>
              </div>
            </div>
          )}
        </div>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <button type="button" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-xs text-gray-400" title="Formatı Temizle">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 10L3 10M21 6L3 6M21 14L3 14M17 18L3 18" /></svg>
        </button>

        {collapsible && (
          <>
            <span className="w-px h-5 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => setShowToolbar(false)}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
              title="Araç çubuğunu gizle"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </>
        )}
      </div>
      )}

      {/* Math Help Panel */}
      {showToolbar && showMathHelp && (
        <div className="px-3 py-2 bg-purple-50 border-b border-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-purple-700">Matematik Şablonları</p>
            <p className="text-[10px] text-purple-500">Tıklayarak metne ekleyin</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MATH_TEMPLATES.map(t => (
              <button
                key={t.label}
                type="button"
                onClick={() => { insertMath(t.code); setShowMathHelp(false); }}
                className="px-2 py-1 bg-white rounded border border-purple-200 text-[10px] font-medium text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-colors"
                title={`${t.desc}: ${t.code}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-purple-600 space-y-0.5 pt-1 border-t border-purple-200">
            <p><strong>Kullanım:</strong> <code className="bg-purple-100 px-1 rounded">$...$</code> satır içi, <code className="bg-purple-100 px-1 rounded">$$...$$</code> blok matematik</p>
            <p><strong>Örnek:</strong> <code className="bg-purple-100 px-1 rounded">$x^2 + y^2 = z^2$</code> veya <code className="bg-purple-100 px-1 rounded">$\frac&#123;a&#125;&#123;b&#125;$</code></p>
          </div>
        </div>
      )}

      <div className="relative">
        {!showToolbar && collapsible && (
          <button
            type="button"
            onClick={() => setShowToolbar(true)}
            className="absolute top-1 right-1 z-10 p-1 rounded hover:bg-purple-50 text-gray-300 hover:text-purple-500 transition-colors"
            title="Zengin metin editörü aç"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
        )}
        {isEmpty && placeholder && (
          <div className="absolute top-2 left-3 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onMouseDown={handleEditorMouseDown}
          onMouseMove={handleEditorMouseMove}
          onFocus={() => { if (editorRef.current && !editorRef.current.innerHTML) setIsEmpty(true); }}
          className="px-3 py-2 text-sm outline-none rte-editor overflow-x-hidden"
          style={{ minHeight }}
          suppressContentEditableWarning
        />
      </div>

      {/* Resize overlay - captures all mouse events during column drag */}
      {resizeInfo && (
        <div className="fixed inset-0 z-[60] cursor-col-resize" style={{ userSelect: 'none' }} />
      )}

      {/* Floating Table Toolbar - absolutely positioned below editor, no layout shift */}
      {activeTableInfo && !resizeInfo && (
        <div className="absolute left-0 right-0 top-full z-30">
          <div className="flex items-center gap-1 px-2 py-1.5 bg-blue-50 border border-blue-200 border-t-0 rounded-b-lg shadow-md flex-wrap">
            <span className="text-[10px] font-semibold text-blue-600 uppercase mr-1">Tablo:</span>

            {/* Add row */}
            <button type="button" onMouseDown={e => { e.preventDefault(); tableAddRow('above'); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors" title="Üste satır ekle">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              Satır
            </button>
            <button type="button" onMouseDown={e => { e.preventDefault(); tableAddRow('below'); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors" title="Alta satır ekle">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
              Satır
            </button>

            <span className="w-px h-4 bg-blue-200 mx-0.5" />

            {/* Add column */}
            <button type="button" onMouseDown={e => { e.preventDefault(); tableAddCol('left'); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-green-200 text-green-700 hover:bg-green-100 transition-colors" title="Sola sütun ekle">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Sütun
            </button>
            <button type="button" onMouseDown={e => { e.preventDefault(); tableAddCol('right'); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-green-200 text-green-700 hover:bg-green-100 transition-colors" title="Sağa sütun ekle">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              Sütun
            </button>

            <span className="w-px h-4 bg-blue-200 mx-0.5" />

            {/* Column width controls */}
            <button type="button" onMouseDown={e => { e.preventDefault(); tableNarrowCol(); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors" title="Bu sütunu daralt (-30px)">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12h16M15 5l-3 7 3 7M9 5l3 7-3 7" /></svg>
              Daralt
            </button>
            <button type="button" onMouseDown={e => { e.preventDefault(); tableWidenCol(); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors" title="Bu sütunu genişlet (+30px)">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12h16M9 5l3 7-3 7M15 5l-3 7 3 7" /></svg>
              Genişlet
            </button>
            <button type="button" onMouseDown={e => { e.preventDefault(); tableEqualDistribute(); }}
              className={`h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium transition-colors ${selectedCols.size > 1 ? 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600' : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`} title={selectedCols.size > 1 ? `${selectedCols.size} seçili sütunu eşitle` : 'Tüm sütunları eşitle (Ctrl+Click ile sütun seç)'}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M8 6v12M16 6v12" /></svg>
              {selectedCols.size > 1 ? `Eşitle (${selectedCols.size})` : 'Eşitle'}
            </button>
            {selectedCols.size > 0 && (
              <button type="button" onMouseDown={e => { e.preventDefault(); clearColSelection(); }}
                className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors" title="Sütun seçimini temizle">
                ✕ Seçim
              </button>
            )}

            <span className="w-px h-4 bg-blue-200 mx-0.5" />

            {/* Delete */}
            <button type="button" onMouseDown={e => { e.preventDefault(); tableDeleteRow(); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-red-200 text-red-600 hover:bg-red-100 transition-colors" title="Bu satırı sil">
              Satır Sil
            </button>
            <button type="button" onMouseDown={e => { e.preventDefault(); tableDeleteCol(); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-white border border-red-200 text-red-600 hover:bg-red-100 transition-colors" title="Bu sütunu sil">
              Sütun Sil
            </button>

            <span className="w-px h-4 bg-blue-200 mx-0.5" />

            <button type="button" onMouseDown={e => { e.preventDefault(); tableDelete(); }}
              className="h-6 px-1.5 flex items-center gap-1 rounded text-[10px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors" title="Tabloyu tamamen sil">
              Tablo Sil
            </button>
          </div>
        </div>
      )}

      {/* Math Preview */}
      {showToolbar && showMathPreview && value && hasMath(value) && (
        <div className="px-3 py-2 bg-green-50 border-t border-green-200">
          <p className="text-[10px] font-semibold text-green-700 mb-1">Matematik Önizleme</p>
          <div
            className="text-sm text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMath(value) }}
          />
        </div>
      )}
    </div>
  );
}
