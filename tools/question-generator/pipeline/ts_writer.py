"""TypeScript Writer — Generate seed-*.ts files with visualContent support.

New format: visualContent as inline TypeScript object (no SVG constants).
Supports all VisualContent types: text, table, svg, image, video.
"""
from pathlib import Path
import json


def write_ts_file(questions: list, output_path: Path, export_name: str,
                  module: str, category: str):
    """
    Write questions to a TypeScript file in the project's seed format.

    Generates:
    - visualContent inline objects (text/table/svg)
    - Question array with all required fields
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    lines = []

    # Header
    lines.append("import { Question } from '@/lib/types';")
    lines.append("")
    lines.append("const T = '2025-02-01T00:00:00.000Z';")
    lines.append("")
    lines.append(f"// ===== {module.upper()} — {len(questions)} SORU =====")
    lines.append("")

    # SVG constants for chart-type visualContent (backtick strings)
    svg_count = 0
    for i, q in enumerate(questions):
        vc = q.get('visualContent', {})
        if vc.get('type') == 'svg' and vc.get('content'):
            svg_name = f"SVG_{i + 1}"
            q['_svg_const_name'] = svg_name
            lines.append(f"const {svg_name} = `{vc['content']}`;")
            lines.append("")
            svg_count += 1

    if svg_count > 0:
        lines.append(f"// ===== {svg_count} SVG grafik =====")
        lines.append("")

    # Question Array
    lines.append(f"export const {export_name}: Question[] = [")

    for i, q in enumerate(questions):
        q_line = _format_question(q)
        comma = ',' if i < len(questions) - 1 else ''
        lines.append(f"  {q_line}{comma}")

    lines.append("];")
    lines.append("")

    content = '\n'.join(lines)
    output_path.write_text(content, encoding='utf-8')
    print(f'   📁 {output_path} ({len(content)} bytes)')


def _format_question(q: dict) -> str:
    """Format a single question as a TypeScript object literal."""
    opts = []
    for opt in q.get('options', []):
        label = _escape_ts(opt.get('label', ''))
        text = _escape_ts(opt.get('text', ''))
        opts.append(f"{{ label: '{label}', text: '{text}' }}")

    options_str = ', '.join(opts)

    tags = q.get('tags', [])
    tags_str = ', '.join([f"'{_escape_ts(t)}'" for t in tags])

    parts = [
        f"id: '{_escape_ts(q.get('id', ''))}'",
        f"categoryId: '{_escape_ts(q.get('categoryId', ''))}'",
        f"subModuleId: '{_escape_ts(q.get('subModuleId', ''))}'",
        f"difficulty: '{_escape_ts(q.get('difficulty', ''))}'",
        f"questionText: '{_escape_ts(q.get('questionText', ''))}'",
    ]

    # ── VisualContent (new format) ──
    vc = q.get('visualContent', {})
    if vc and vc.get('type'):
        vc_str = _format_visual_content(vc, q.get('_svg_const_name'))
        parts.append(f"visualContent: {vc_str}")

    parts.extend([
        f"options: [{options_str}]",
        f"correctAnswer: {q.get('correctAnswer', 0)}",
        f"solution: '{_escape_ts(q.get('solution', ''))}'",
        f"tags: [{tags_str}]",
    ])

    # Auto-set svgPosition to 'top' for questions with visualContent
    if vc and vc.get('type'):
        parts.append("svgPosition: 'top'")

    parts.extend([
        f"createdAt: T",
        f"updatedAt: T",
    ])

    return '{ ' + ', '.join(parts) + ' }'


def _format_visual_content(vc: dict, svg_const_name: str = None) -> str:
    """Format visualContent as TypeScript object literal."""
    vc_type = vc.get('type', 'text')
    parts = [f"type: '{vc_type}'"]

    if vc.get('title'):
        parts.append(f"title: '{_escape_ts(vc['title'])}'")

    if vc.get('description'):
        parts.append(f"description: '{_escape_ts(vc['description'])}'")

    # ── Type-specific content ──
    if vc_type == 'text' and vc.get('content'):
        parts.append(f"content: '{_escape_ts(vc['content'])}'")

    elif vc_type == 'table' and vc.get('tableData'):
        td = vc['tableData']
        td_str = _format_table_data(td)
        parts.append(f"tableData: {td_str}")

    elif vc_type == 'svg':
        # Reference the SVG constant (already defined above)
        if svg_const_name:
            parts.append(f"content: {svg_const_name}")
        elif vc.get('content'):
            # Fallback: inline backtick
            parts.append(f"content: `{vc['content']}`")

    elif vc_type == 'image' and vc.get('image'):
        parts.append(f"image: '{_escape_ts(vc['image'])}'")

    elif vc_type == 'video' and vc.get('content'):
        parts.append(f"content: '{_escape_ts(vc['content'])}'")

    return '{ ' + ', '.join(parts) + ' }'


def _format_table_data(td: dict) -> str:
    """Format tableData as TypeScript object literal."""
    headers = td.get('headers', [])
    rows = td.get('rows', [])

    headers_str = ', '.join([f"'{_escape_ts(h)}'" for h in headers])

    rows_parts = []
    for row in rows:
        cells = ', '.join([f"'{_escape_ts(c)}'" for c in row])
        rows_parts.append(f"[{cells}]")
    rows_str = ', '.join(rows_parts)

    td_parts = [
        f"headers: [{headers_str}]",
        f"rows: [{rows_str}]",
    ]

    # Optional column widths
    if td.get('columnWidths'):
        cw_str = ', '.join([str(w) for w in td['columnWidths']])
        td_parts.append(f"columnWidths: [{cw_str}]")

    return '{ ' + ', '.join(td_parts) + ' }'


def _escape_ts(text: str) -> str:
    """Escape text for TypeScript single-quoted strings."""
    if not text:
        return ''
    return (text
            .replace('\\', '\\\\')
            .replace("'", "\\'")
            .replace('\u2018', "\\'")   # LEFT SINGLE QUOTATION MARK
            .replace('\u2019', "\\'")   # RIGHT SINGLE QUOTATION MARK
            .replace('\u201C', '\\"')   # LEFT DOUBLE QUOTATION MARK
            .replace('\u201D', '\\"')   # RIGHT DOUBLE QUOTATION MARK
            .replace('\n', ' ')
            .replace('\r', '')
            .replace('\t', ' '))
