"""Visual Content Generator — Process visual content from Claude API output.

For text/table content: Returns structured JSON (no SVG — native HTML render).
For chart content: Generates SVG markup.

Type mapping (Claude output → TypeScript VisualContent):
  passage/document → type='text', content as HTML paragraphs
  table            → type='table', tableData as structured {headers, rows}
  chart            → type='svg', content as SVG string
"""
import json
import math
import sys
from typing import Optional


def process_visual_content(question: dict, module: str) -> dict:
    """
    Process and normalize the visualContent field from a question.

    Transforms Claude's raw output types (passage/document/table/chart)
    into our TypeScript VisualContent format (text/table/svg).

    Args:
        question: Question dict with optional 'visualContent' field
        module: Module ID for chart styling

    Returns:
        Normalized visualContent dict, or empty dict if no visual content
    """
    vc = question.get('visualContent', {})
    if not vc or not vc.get('type'):
        return {}

    raw_type = vc.get('type', '').lower().strip()
    title = vc.get('title', '')
    description = vc.get('description', '')
    content = vc.get('content', '')

    print(f'   🎨 Visual [{raw_type}] title="{title[:50]}"', file=sys.stderr)

    # Auto-detect: if content looks like table JSON but type says passage
    if raw_type in ('passage', 'document', 'text') and content:
        if _looks_like_table(content):
            raw_type = 'table'
            print(f'      ↳ Auto-detect: passage → table', file=sys.stderr)

    # Map Claude's content types to our TypeScript types
    if raw_type in ('passage', 'document', 'text'):
        return _process_text_content(title, description, content)
    elif raw_type == 'table':
        return _process_table_content(title, description, content)
    elif raw_type == 'chart':
        return _process_chart_content(title, description, content, module)
    else:
        # Unknown type → treat as text
        print(f'      ↳ Bilinmeyen tip "{raw_type}", text olarak işleniyor', file=sys.stderr)
        return _process_text_content(title, description, content)


def _looks_like_table(content) -> bool:
    """Check if content looks like table data."""
    if isinstance(content, dict) and ('headers' in content or 'rows' in content):
        return True
    if isinstance(content, str):
        try:
            parsed = json.loads(content)
            return isinstance(parsed, dict) and ('headers' in parsed or 'rows' in parsed)
        except (json.JSONDecodeError, TypeError):
            pass
    return False


# ═══════════════════════════════════════════════════════════════════
# TEXT (passage / document → type='text')
# ═══════════════════════════════════════════════════════════════════

def _process_text_content(title: str, description: str, content: str) -> dict:
    """Convert passage/document content to type='text' with HTML."""
    if not content:
        return {}

    html_content = _text_to_html(content)

    result = {'type': 'text', 'content': html_content}
    if title:
        result['title'] = title
    if description:
        result['description'] = description
    return result


def _text_to_html(text: str) -> str:
    """Convert plain text to HTML paragraphs.

    If text already contains HTML tags, returns as-is.
    """
    if not text:
        return ''

    # If already HTML, return as-is
    if '<p>' in text or '<div>' in text or '<br' in text or '<ul>' in text:
        return text

    # Split by double newlines for paragraphs
    paragraphs = text.split('\n\n')
    if len(paragraphs) <= 1:
        paragraphs = text.split('\n')

    html_parts = []
    for p in paragraphs:
        p = p.strip()
        if p:
            # Escape HTML entities in plain text
            p = p.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            html_parts.append(f'<p>{p}</p>')

    return ''.join(html_parts) if html_parts else f'<p>{text}</p>'


# ═══════════════════════════════════════════════════════════════════
# TABLE (table → type='table')
# ═══════════════════════════════════════════════════════════════════

def _process_table_content(title: str, description: str, content) -> dict:
    """Convert table content to type='table' with structured tableData."""
    try:
        if isinstance(content, str):
            data = json.loads(content)
        elif isinstance(content, dict):
            data = content
        else:
            return {}
    except (json.JSONDecodeError, TypeError):
        # If content can't be parsed as table, treat as text
        print(f'      ↳ Tablo parse başarısız, text\'e dönüştürülüyor', file=sys.stderr)
        return _process_text_content(title, description, str(content))

    headers = data.get('headers', [])
    rows = data.get('rows', [])

    if not headers and not rows:
        return {}

    # Ensure all values are strings
    headers = [str(h) for h in headers]
    rows = [[str(cell) for cell in row] for row in rows]

    # Ensure all rows have same column count as headers
    col_count = len(headers)
    if col_count > 0:
        rows = [
            row[:col_count] + [''] * max(0, col_count - len(row))
            for row in rows
        ]

    result = {
        'type': 'table',
        'tableData': {
            'headers': headers,
            'rows': rows,
        },
    }
    if title:
        result['title'] = title
    if description:
        result['description'] = description
    return result


# ═══════════════════════════════════════════════════════════════════
# CHART (chart → type='svg')
# Only charts generate SVG — text and tables use native HTML render
# ═══════════════════════════════════════════════════════════════════

def _process_chart_content(title: str, description: str, content, module: str) -> dict:
    """Convert chart content to type='svg' with generated SVG markup."""
    svg = _generate_chart_svg(title, content, module)
    if not svg:
        return {}

    result = {'type': 'svg', 'content': svg}
    if title:
        result['title'] = title
    if description:
        result['description'] = description
    return result


def _generate_chart_svg(title: str, content, module: str) -> str:
    """Route chart generation by chart type."""
    try:
        if isinstance(content, str):
            data = json.loads(content)
        else:
            data = content
    except (json.JSONDecodeError, TypeError):
        return ''

    labels = data.get('labels', [])
    values = data.get('values', [])
    unit = data.get('unit', '')
    chart_type = data.get('chartType', 'bar')

    if not labels or not values:
        return ''

    if chart_type == 'pie':
        return _generate_pie_chart_svg(title, labels, values, unit, module)
    elif chart_type == 'line':
        return _generate_line_chart_svg(title, labels, values, unit, module)
    else:  # bar (default)
        return _generate_bar_chart_svg(title, labels, values, unit, module)


# ── Bar Chart ──

def _generate_bar_chart_svg(title, labels, values, unit, module):
    bar_count = len(labels)
    max_val = max(float(v) for v in values) if values else 1
    nice_max = _nice_ceil(max_val)

    if bar_count <= 4:
        width = 460
    elif bar_count <= 6:
        width = 520
    else:
        width = 580

    height = 240
    half_w = width // 2
    chart_left, chart_right = 60, width - 40
    chart_top, chart_bottom = 35, 195
    chart_height = chart_bottom - chart_top

    colors = (
        ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']
        if 'capp' in module else
        ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#06b6d4', '#0891b2', '#818cf8']
    )

    available_width = chart_right - chart_left - 40
    bar_spacing = available_width // bar_count
    bar_width = min(60, bar_spacing - 20)
    title_escaped = _escape_svg(title or 'Grafik')

    el = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">',
        '<defs><style>text{font-family:Arial,sans-serif}</style></defs>',
        f'<rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'<text x="{half_w}" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">{title_escaped}</text>',
        f'<line x1="{chart_left}" y1="{chart_bottom}" x2="{chart_right}" y2="{chart_bottom}" stroke="#94a3b8"/>',
        f'<line x1="{chart_left}" y1="{chart_bottom}" x2="{chart_left}" y2="{chart_top}" stroke="#94a3b8"/>',
    ]

    for i in range(5):
        y = chart_bottom - (chart_height * i / 4)
        val = nice_max * i / 4
        el.append(f'<text x="{chart_left - 5}" y="{y + 4}" text-anchor="end" font-size="9" fill="#64748b">{_format_number(val)}</text>')
        if i > 0:
            el.append(f'<line x1="{chart_left}" y1="{y}" x2="{chart_right}" y2="{y}" stroke="#f1f5f9" stroke-dasharray="3,3"/>')

    for i, (label, value) in enumerate(zip(labels, values)):
        val = float(value)
        bar_h = (val / nice_max) * chart_height if nice_max > 0 else 0
        x = chart_left + 20 + i * bar_spacing
        y = chart_bottom - bar_h
        color = colors[i % len(colors)]
        el.append(f'<rect x="{x}" y="{y:.0f}" width="{bar_width}" height="{bar_h:.0f}" fill="{color}" rx="3"/>')
        el.append(f'<text x="{x + bar_width // 2}" y="{y - 5:.0f}" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e293b">{_format_number(val)}</text>')
        el.append(f'<text x="{x + bar_width // 2}" y="210" text-anchor="middle" font-size="9" fill="#475569">{_escape_svg(str(label))}</text>')

    if unit:
        el.append(f'<text x="{half_w}" y="230" text-anchor="middle" font-size="9" fill="#64748b">({unit})</text>')
    el.append('</svg>')
    return ''.join(el)


# ── Pie Chart ──

def _generate_pie_chart_svg(title, labels, values, unit, module):
    width, height = 400, 300
    cx, cy, r = 200, 140, 90
    total = sum(float(v) for v in values)
    if total == 0:
        return ''

    colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316']
    title_escaped = _escape_svg(title or 'Grafik')

    el = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">',
        '<defs><style>text{font-family:Arial,sans-serif}</style></defs>',
        f'<rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'<text x="{width // 2}" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">{title_escaped}</text>',
    ]

    start_angle = -90
    for i, (label, value) in enumerate(zip(labels, values)):
        val = float(value)
        angle = (val / total) * 360
        end_angle = start_angle + angle
        x1 = cx + r * math.cos(math.radians(start_angle))
        y1 = cy + r * math.sin(math.radians(start_angle))
        x2 = cx + r * math.cos(math.radians(end_angle))
        y2 = cy + r * math.sin(math.radians(end_angle))
        large_arc = 1 if angle > 180 else 0
        color = colors[i % len(colors)]
        d = f'M {cx} {cy} L {x1:.1f} {y1:.1f} A {r} {r} 0 {large_arc} 1 {x2:.1f} {y2:.1f} Z'
        el.append(f'<path d="{d}" fill="{color}"/>')
        start_angle = end_angle

    # Legend
    legend_y = height - 40
    for i, (label, value) in enumerate(zip(labels, values)):
        color = colors[i % len(colors)]
        x = 20 + (i % 3) * 130
        y = legend_y + (i // 3) * 16
        pct = (float(value) / total * 100) if total > 0 else 0
        el.append(f'<rect x="{x}" y="{y - 8}" width="8" height="8" fill="{color}" rx="1"/>')
        el.append(f'<text x="{x + 12}" y="{y}" font-size="9" fill="#475569">{_escape_svg(f"{label}: {pct:.0f}%")}</text>')

    el.append('</svg>')
    return ''.join(el)


# ── Line Chart ──

def _generate_line_chart_svg(title, labels, values, unit, module):
    point_count = len(labels)
    max_val = max(float(v) for v in values) if values else 1
    nice_max = _nice_ceil(max_val)

    width, height = 520, 240
    half_w = width // 2
    chart_left, chart_right = 60, width - 40
    chart_top, chart_bottom = 35, 195
    chart_height = chart_bottom - chart_top
    chart_width = chart_right - chart_left
    title_escaped = _escape_svg(title or 'Grafik')

    el = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">',
        '<defs><style>text{font-family:Arial,sans-serif}</style></defs>',
        f'<rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'<text x="{half_w}" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">{title_escaped}</text>',
        f'<line x1="{chart_left}" y1="{chart_bottom}" x2="{chart_right}" y2="{chart_bottom}" stroke="#94a3b8"/>',
        f'<line x1="{chart_left}" y1="{chart_bottom}" x2="{chart_left}" y2="{chart_top}" stroke="#94a3b8"/>',
    ]

    for i in range(5):
        y = chart_bottom - (chart_height * i / 4)
        val = nice_max * i / 4
        el.append(f'<text x="{chart_left - 5}" y="{y + 4}" text-anchor="end" font-size="9" fill="#64748b">{_format_number(val)}</text>')
        if i > 0:
            el.append(f'<line x1="{chart_left}" y1="{y}" x2="{chart_right}" y2="{y}" stroke="#f1f5f9" stroke-dasharray="3,3"/>')

    points = []
    for i, value in enumerate(values):
        val = float(value)
        x = chart_left + (i / max(1, point_count - 1)) * chart_width if point_count > 1 else chart_left + chart_width / 2
        y = chart_bottom - (val / nice_max) * chart_height if nice_max > 0 else chart_bottom
        points.append((x, y))

    if len(points) > 1:
        path_d = f'M {points[0][0]:.1f} {points[0][1]:.1f}'
        for px, py in points[1:]:
            path_d += f' L {px:.1f} {py:.1f}'
        el.append(f'<path d="{path_d}" fill="none" stroke="#6366f1" stroke-width="2"/>')

    for i, (px, py) in enumerate(points):
        el.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="3" fill="#6366f1"/>')
        el.append(f'<text x="{px:.1f}" y="{py - 8:.1f}" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e293b">{_format_number(float(values[i]))}</text>')
        el.append(f'<text x="{px:.1f}" y="210" text-anchor="middle" font-size="9" fill="#475569">{_escape_svg(str(labels[i]))}</text>')

    if unit:
        el.append(f'<text x="{half_w}" y="230" text-anchor="middle" font-size="9" fill="#64748b">({unit})</text>')
    el.append('</svg>')
    return ''.join(el)


# ═══════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════

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
            return f'{val_int:,}'.replace(',', '.')
        return str(val_int)
    return f'{value:.1f}'
