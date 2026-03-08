"""SVG Generator — Create SVG visuals matching existing seed file quality.

Design system extracted from:
  - seed-tp-sozel.ts (passage/document)
  - seed-capp-sozel.ts (passage)
  - seed-tp-sayisal.ts (table/chart)
  - seed-capp-sayisal.ts (table/chart)

Color palette (Tailwind Slate):
  #f8fafc  slate-50  (background)
  #f1f5f9  slate-100 (light grid lines)
  #e2e8f0  slate-200 (header bottom border)
  #cbd5e1  slate-300 (main separators)
  #94a3b8  slate-400 (axis lines)
  #64748b  slate-500 (axis labels)
  #475569  slate-600 (header text)
  #334155  slate-700 (body text)
  #1e293b  slate-900 (title text)
"""
import json
import textwrap
from typing import Optional


def generate_svg(visual_content: dict, module: str, svg_name: str) -> str:
    """
    Generate SVG markup from visual content.

    Args:
        visual_content: {type, title, content} from Claude API
        module: Module ID for styling
        svg_name: SVG constant name (e.g., SVG_TS1)

    Returns:
        SVG string
    """
    if not visual_content:
        return ''

    content_type = visual_content.get('type', 'passage')
    title = visual_content.get('title', '')
    content = visual_content.get('content', '')

    # DEBUG: Log what we received
    import sys
    content_preview = str(content)[:100] if content else 'EMPTY'
    print(f'   🎨 SVG [{svg_name}] type={content_type}, title="{title[:40]}", content={content_preview}', file=sys.stderr)

    # Auto-detect type if content looks like table data
    if content_type == 'passage' and content:
        if isinstance(content, dict) and ('headers' in content or 'rows' in content):
            content_type = 'table'
        elif isinstance(content, str):
            try:
                parsed = json.loads(content)
                if isinstance(parsed, dict) and ('headers' in parsed or 'rows' in parsed):
                    content_type = 'table'
            except (json.JSONDecodeError, TypeError):
                pass

    if content_type == 'table':
        return _generate_table_svg(title, content, module)
    elif content_type == 'chart':
        return _generate_chart_svg(title, content, module)
    elif content_type == 'document':
        return _generate_document_svg(title, content, module)
    else:  # passage
        return _generate_passage_svg(title, content, module)


# ═══════════════════════════════════════════════════════════════════
# DESIGN CONSTANTS — Consistent across all SVG types
# ═══════════════════════════════════════════════════════════════════
# Reference: Q8 (viewBox ~655px, font 12/13) looks ideal in the
# preview container (~660px).  Narrower viewBox gets SCALED UP by
# the browser, making fonts appear oversized.  Solution: keep all
# viewBox widths close to 660px so scaling factor ≈ 1.0.
#
# Passage/Document: fixed width, fixed fonts, dynamic height
_TEXT_WIDTH = 660       # ViewBox width ≈ container → no scaling
_TEXT_MARGIN = 30       # Equal left/right margin
_TEXT_FONT = 12         # Body font size (matches Q8 ideal)
_TEXT_LINE_H = 19       # Line height for body text at font-12
_TEXT_MAX_CHARS = 83    # Max chars per line: (660 - 60) / 7.2 ≈ 83
_TITLE_FONT = 13        # Title font size (matches Q8)

# Table: fixed fonts, adaptive width, dynamic height
_TBL_TITLE_FONT = 13    # Table title font
_TBL_HEADER_FONT = 12   # Header font (bold) — matches existing seed
_TBL_BODY_FONT = 12     # Body font — matches existing seed
_TBL_ROW_H = 27         # Row height
_TBL_MARGIN = 30        # Equal left/right margin
_TBL_MIN_W = 620        # Min table viewBox width (was 480 — too narrow)
_TBL_MAX_W = 700        # Max table viewBox width
_TBL_CHAR_W = 7.2       # Approx px per char at font-size 12


# === PASSAGE ===
def _generate_passage_svg(title: str, content: str, module: str) -> str:
    """Generate SVG for text passages.

    ViewBox 660px ≈ container width → no browser up-scaling.
    Fonts 12/13 match Q8 ideal.  Dynamic height.
    """
    width = _TEXT_WIDTH
    margin = _TEXT_MARGIN

    lines = _wrap_text(content, max_chars=_TEXT_MAX_CHARS)
    # Dynamic height: title area + gap + lines + bottom padding
    height = max(140, 40 + len(lines) * _TEXT_LINE_H + 24)

    text_elements = []
    y = 58
    for line in lines:
        escaped = _escape_svg(line)
        text_elements.append(
            f'<text x="{margin}" y="{y}" font-size="{_TEXT_FONT}" fill="#334155">{escaped}</text>'
        )
        y += _TEXT_LINE_H

    half_w = width // 2
    title_escaped = _escape_svg(title or 'Pasaj')
    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">',
        '<defs><style>text{font-family:Arial,sans-serif}</style></defs>',
        f'<rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'<text x="{half_w}" y="24" text-anchor="middle" font-size="{_TITLE_FONT}" font-weight="700" fill="#1e293b">{title_escaped}</text>',
        f'<line x1="{margin}" y1="36" x2="{width - margin}" y2="36" stroke="#cbd5e1"/>',
    ]
    svg_parts.extend(text_elements)
    svg_parts.append('</svg>')
    return ''.join(svg_parts)


# === DOCUMENT ===
def _generate_document_svg(title: str, content: str, module: str) -> str:
    """Generate SVG for business documents.

    ViewBox 660px ≈ container width → no browser up-scaling.
    Fonts 12/13 match Q8 ideal.  Dynamic height.
    """
    width = _TEXT_WIDTH
    margin = _TEXT_MARGIN

    lines = _wrap_text(content, max_chars=_TEXT_MAX_CHARS)
    # Dynamic height: title area + gap + lines + bottom padding
    height = max(140, 42 + len(lines) * _TEXT_LINE_H + 24)

    text_elements = []
    y = 62
    for line in lines:
        escaped = _escape_svg(line)
        text_elements.append(
            f'<text x="{margin}" y="{y}" font-size="{_TEXT_FONT}" fill="#334155">{escaped}</text>'
        )
        y += _TEXT_LINE_H

    half_w = width // 2
    title_escaped = _escape_svg(title or 'Belge')
    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">',
        '<defs><style>text{font-family:Arial,sans-serif}</style></defs>',
        f'<rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'<text x="{half_w}" y="24" text-anchor="middle" font-size="{_TITLE_FONT}" font-weight="700" fill="#1e293b">{title_escaped}</text>',
        f'<line x1="{margin}" y1="38" x2="{width - margin}" y2="38" stroke="#cbd5e1"/>',
    ]
    svg_parts.extend(text_elements)
    svg_parts.append('</svg>')
    return ''.join(svg_parts)


# === TABLE (TP Sayısal / CAPP Sayısal style) ===
def _generate_table_svg(title: str, content: str, module: str) -> str:
    """Generate SVG for tables — matches seed-tp-sayisal.ts style.

    Fixed fonts (header=12 bold, body=12, title=13), equal margins (30px),
    adaptive width (480-700px based on content), dynamic height.
    """
    try:
        if isinstance(content, str):
            data = json.loads(content)
        else:
            data = content
    except (json.JSONDecodeError, TypeError):
        return _generate_passage_svg(title, str(content), module)

    headers = data.get('headers', [])
    rows = data.get('rows', [])

    if not headers or not rows:
        return _generate_passage_svg(title, str(content), module)

    col_count = len(headers)
    row_count = len(rows)
    margin = _TBL_MARGIN
    row_height = _TBL_ROW_H
    font_size = _TBL_BODY_FONT
    header_font = _TBL_HEADER_FONT
    char_w = _TBL_CHAR_W

    # ── Calculate needed width from content ──
    # Estimate header text widths at font-size 12
    header_text_widths = [len(h) * char_w + 20 for h in headers]

    # Also check body cell widths (use widest cell per column)
    max_body_widths = [0] * col_count
    for row in rows:
        for c_idx, cell in enumerate(row):
            if c_idx < col_count:
                cell_len = len(str(cell)) if cell is not None else 0
                max_body_widths[c_idx] = max(max_body_widths[c_idx], cell_len * char_w + 20)

    # Use the wider of header vs body for each column
    col_needed = [max(header_text_widths[i], max_body_widths[i]) for i in range(col_count)]
    total_needed = sum(col_needed) + margin * 2

    # Clamp width to min/max range
    width = max(_TBL_MIN_W, min(_TBL_MAX_W, int(total_needed)))
    table_width = width - margin * 2

    # ── Column widths (proportional) ──
    min_col_width = 50
    first_col_extra = 20  # extra px for label column

    raw_widths = [max(min_col_width, len(h) * char_w + 16) for h in headers]
    # Factor in body cell widths too
    for i in range(col_count):
        raw_widths[i] = max(raw_widths[i], max_body_widths[i])
    raw_widths[0] = max(raw_widths[0], min_col_width + first_col_extra)
    total_raw = sum(raw_widths)

    # Scale to fit table_width
    col_widths = [int(w * table_width / total_raw) for w in raw_widths]

    # Column center positions
    col_positions = []
    x_acc = margin
    for i, cw in enumerate(col_widths):
        if i == 0:
            col_positions.append(x_acc + 10)  # left-aligned with padding
        else:
            col_positions.append(x_acc + cw // 2)  # center-aligned
        x_acc += cw

    # ── Header wrapping ──
    wrapped_headers = []
    header_has_wrap = False
    for i, h in enumerate(headers):
        avail_chars = max(6, int(col_widths[i] / char_w) - 2)
        if len(h) > avail_chars and len(h) > 10:
            # Split at space nearest to middle
            mid = len(h) // 2
            best_split = -1
            for offset in range(min(8, mid)):
                if mid + offset < len(h) and h[mid + offset] == ' ':
                    best_split = mid + offset
                    break
                if mid - offset >= 0 and h[mid - offset] == ' ':
                    best_split = mid - offset
                    break
            if best_split > 0:
                wrapped_headers.append((h[:best_split], h[best_split + 1:]))
                header_has_wrap = True
            else:
                wrapped_headers.append((h,))
        else:
            wrapped_headers.append((h,))

    # ── Vertical geometry ──
    header_top_y = 48 if header_has_wrap else 55
    header_line1_y = header_top_y
    header_line2_y = header_top_y + 14  # slightly more space for font-size 12
    header_bottom_y = (header_line2_y + 12) if header_has_wrap else 65
    first_row_y = header_bottom_y + 19
    height = max(200, 38 + (row_count + 1) * row_height + (44 if header_has_wrap else 32))

    half_w = width // 2
    title_escaped = _escape_svg(title or 'Tablo')

    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">',
        '<defs><style>text{font-family:Arial,sans-serif}</style></defs>',
        f'<rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'<text x="{half_w}" y="22" text-anchor="middle" font-size="{_TBL_TITLE_FONT}" font-weight="700" fill="#1e293b">{title_escaped}</text>',
        f'<line x1="{margin}" y1="38" x2="{width - margin}" y2="38" stroke="#cbd5e1"/>',
    ]

    # Header row (with optional 2-line wrapping)
    for i, parts in enumerate(wrapped_headers):
        x = col_positions[i]
        anchor = '' if i == 0 else ' text-anchor="middle"'

        if len(parts) == 2:
            h1_escaped = _escape_svg(parts[0])
            h2_escaped = _escape_svg(parts[1])
            elements.append(
                f'<text x="{x}" y="{header_line1_y}"{anchor} font-size="{header_font}" font-weight="bold" fill="#475569">{h1_escaped}</text>'
            )
            elements.append(
                f'<text x="{x}" y="{header_line2_y}"{anchor} font-size="{header_font}" font-weight="bold" fill="#475569">{h2_escaped}</text>'
            )
        else:
            h_escaped = _escape_svg(parts[0])
            y_pos = (header_line1_y + header_line2_y) // 2 if header_has_wrap else header_line1_y
            elements.append(
                f'<text x="{x}" y="{y_pos}"{anchor} font-size="{header_font}" font-weight="bold" fill="#475569">{h_escaped}</text>'
            )

    # Header bottom border
    elements.append(
        f'<line x1="{margin}" y1="{header_bottom_y}" x2="{width - margin}" y2="{header_bottom_y}" stroke="#e2e8f0"/>'
    )

    # Data rows
    for r_idx, row in enumerate(rows):
        y_text = first_row_y + r_idx * row_height
        y_line = y_text + 8

        is_total = (r_idx == row_count - 1 and
                    any(str(cell).lower() in ('toplam', 'total', 'genel toplam')
                        for cell in row[:1]))

        for c_idx, cell in enumerate(row):
            if c_idx >= len(col_positions):
                break
            cell_str = str(cell) if cell is not None else ''
            cell_escaped = _escape_svg(cell_str)
            x = col_positions[c_idx]
            font_weight = ' font-weight="bold"' if is_total else ''
            fill = '#334155'

            if c_idx == 0:
                elements.append(
                    f'<text x="{x}" y="{y_text}" font-size="{font_size}"{font_weight} fill="{fill}">{cell_escaped}</text>'
                )
            else:
                elements.append(
                    f'<text x="{x}" y="{y_text}" text-anchor="middle" font-size="{font_size}"{font_weight} fill="{fill}">{cell_escaped}</text>'
                )

        # Row separator
        if is_total:
            sep_y = y_text - row_height + 8
            elements.append(
                f'<line x1="{margin}" y1="{sep_y}" x2="{width - margin}" y2="{sep_y}" stroke="#cbd5e1"/>'
            )
        else:
            elements.append(
                f'<line x1="{margin}" y1="{y_line}" x2="{width - margin}" y2="{y_line}" stroke="#f1f5f9"/>'
            )

    elements.append('</svg>')
    return ''.join(elements)


# === CHART (Bar chart — TP Sayısal / CAPP Sayısal style) ===
def _generate_chart_svg(title: str, content: str, module: str) -> str:
    """Generate SVG for bar charts — matches seed-tp-sayisal.ts exactly."""
    try:
        if isinstance(content, str):
            data = json.loads(content)
        else:
            data = content
    except (json.JSONDecodeError, TypeError):
        return _generate_passage_svg(title, str(content), module)

    labels = data.get('labels', [])
    values = data.get('values', [])
    unit = data.get('unit', '')

    if not labels or not values:
        return _generate_passage_svg(title, str(content), module)

    bar_count = len(labels)
    max_val = max(float(v) for v in values) if values else 1

    # Round max value up to nice number
    nice_max = _nice_ceil(max_val)

    # Dynamic width based on bar count
    if bar_count <= 4:
        width = 460
    elif bar_count <= 6:
        width = 520
    else:
        width = 580

    height = 240
    half_w = width // 2

    # Chart area
    chart_left = 60
    chart_right = width - 40
    chart_top = 35
    chart_bottom = 195
    chart_height = chart_bottom - chart_top

    # Color palettes matching existing seeds
    if 'capp' in module:
        colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']
    else:
        # TP style: indigo/purple gradient
        colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#06b6d4', '#0891b2', '#818cf8']

    # Bar width & spacing
    available_width = chart_right - chart_left - 40  # margins
    bar_spacing = available_width // bar_count
    bar_width = min(60, bar_spacing - 20)

    title_escaped = _escape_svg(title or 'Grafik')

    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">',
        '<defs><style>text{font-family:Arial,sans-serif}</style></defs>',
        f'<rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'<text x="{half_w}" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">{title_escaped}</text>',
    ]

    # Axes
    elements.append(
        f'<line x1="{chart_left}" y1="{chart_bottom}" x2="{chart_right}" y2="{chart_bottom}" stroke="#94a3b8"/>'
    )
    elements.append(
        f'<line x1="{chart_left}" y1="{chart_bottom}" x2="{chart_left}" y2="{chart_top}" stroke="#94a3b8"/>'
    )

    # Y-axis labels & grid lines (4 intervals)
    for i in range(5):
        y = chart_bottom - (chart_height * i / 4)
        val = nice_max * i / 4
        elements.append(
            f'<text x="{chart_left - 5}" y="{y + 4}" text-anchor="end" font-size="9" fill="#64748b">{_format_number(val)}</text>'
        )
        if i > 0:  # dashed grid lines
            elements.append(
                f'<line x1="{chart_left}" y1="{y}" x2="{chart_right}" y2="{y}" stroke="#f1f5f9" stroke-dasharray="3,3"/>'
            )

    # Bars
    for i, (label, value) in enumerate(zip(labels, values)):
        val = float(value)
        bar_h = (val / nice_max) * chart_height if nice_max > 0 else 0
        x = chart_left + 20 + i * bar_spacing
        y = chart_bottom - bar_h
        color = colors[i % len(colors)]
        label_escaped = _escape_svg(str(label))

        # Bar
        elements.append(
            f'<rect x="{x}" y="{y:.0f}" width="{bar_width}" height="{bar_h:.0f}" fill="{color}" rx="3"/>'
        )
        # Value label above bar
        elements.append(
            f'<text x="{x + bar_width // 2}" y="{y - 5:.0f}" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e293b">{_format_number(val)}</text>'
        )
        # X-axis label
        elements.append(
            f'<text x="{x + bar_width // 2}" y="210" text-anchor="middle" font-size="9" fill="#475569">{label_escaped}</text>'
        )

    # Unit label if provided
    if unit:
        elements.append(
            f'<text x="{half_w}" y="230" text-anchor="middle" font-size="9" fill="#64748b">({unit})</text>'
        )

    elements.append('</svg>')
    return ''.join(elements)


# === HELPERS ===

def _wrap_text(text: str, max_chars: int = 75) -> list:
    """Wrap text into lines that fit within SVG width."""
    if not text:
        return []
    return textwrap.wrap(text, width=max_chars)


def _escape_svg(text: str) -> str:
    """Escape special characters for SVG text elements."""
    return (text
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
            .replace("'", '&apos;'))


def _nice_ceil(value: float) -> float:
    """Round up to a nice number for axis labels."""
    if value <= 0:
        return 100
    import math
    magnitude = 10 ** math.floor(math.log10(value))
    normalized = value / magnitude
    if normalized <= 1:
        nice = 1
    elif normalized <= 2:
        nice = 2
    elif normalized <= 2.5:
        nice = 2.5
    elif normalized <= 5:
        nice = 5
    else:
        nice = 10
    return nice * magnitude


def _format_number(value: float) -> str:
    """Format number for display (Turkish style with dots)."""
    if value == int(value):
        val_int = int(value)
        if val_int >= 1000:
            # Turkish number formatting: 1.000, 10.000
            s = f'{val_int:,}'.replace(',', '.')
            return s
        return str(val_int)
    return f'{value:.1f}'
