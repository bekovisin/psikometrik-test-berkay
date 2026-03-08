"""Apostrophe Fixer — Fix Turkish apostrophes (ASCII ' → Unicode \u2019)."""
import re

# Right single quotation mark (Unicode U+2019)
RIGHT_QUOTE = '\u2019'


def fix_apostrophes(questions: list) -> list:
    """
    Fix Turkish apostrophes in question texts, options, and solutions.

    Two-pass regex approach:
    - Pass 1: digit + ' + letter (50'yi, 14'e, 7'den) — 100% safe
    - Pass 2: letter + ' + lowercase letter (Türkiye'nin, şirket'in)
    """
    for q in questions:
        # Fix questionText
        if 'questionText' in q:
            q['questionText'] = _fix_text(q['questionText'])

        # Fix options
        for opt in q.get('options', []):
            if 'text' in opt:
                opt['text'] = _fix_text(opt['text'])

        # Fix solution
        if 'solution' in q:
            q['solution'] = _fix_text(q['solution'])

        # Fix SVG content (if present as string)
        if 'svg' in q and isinstance(q['svg'], str):
            q['svg'] = _fix_svg(q['svg'])

    return questions


def _fix_text(text: str) -> str:
    """Fix apostrophes in regular text content."""
    if not text:
        return text

    # Pass 1: digit + ' + letter (100% safe)
    text = re.sub(
        r"(\d)'([a-z\u011f\u00fc\u015f\u00f6\u00e7\u0131A-Z\u0130\u011e\u00dc\u015e\u00d6\u00c7])",
        r'\1' + RIGHT_QUOTE + r'\2', text
    )

    # Pass 2: letter + ' + lowercase letter
    text = re.sub(
        r"([a-zA-Z\u011f\u00fc\u015f\u00f6\u00e7\u0131\u0130\u011e\u00dc\u015e\u00d6\u00c7\u00e2\u00ee\u00fb\u00ea])'([a-z\u011f\u00fc\u015f\u00f6\u00e7\u0131\u00e2\u00ee\u00fb\u00ea])",
        r'\1' + RIGHT_QUOTE + r'\2', text
    )

    return text


def _fix_svg(svg: str) -> str:
    """Fix apostrophes in SVG content (safe because SVGs use backtick strings in TS)."""
    if not svg:
        return svg

    # More aggressive: any word char + ' + word char
    svg = re.sub(
        r"([\w\u011f\u00fc\u015f\u00f6\u00e7\u0131\u0130\u011e\u00dc\u015e\u00d6\u00c7])'([\w\u011f\u00fc\u015f\u00f6\u00e7\u0131\u0130\u011e\u00dc\u015e\u00d6\u00c7])",
        r'\1' + RIGHT_QUOTE + r'\2', svg
    )
    svg = re.sub(
        r"([\w\u011f\u00fc\u015f\u00f6\u00e7\u0131\u0130\u011e\u00dc\u015e\u00d6\u00c7])'([\s,\.])",
        r'\1' + RIGHT_QUOTE + r'\2', svg
    )

    return svg
