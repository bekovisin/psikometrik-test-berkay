"""Content Extractor — Transform raw PDF data into structured content."""
from typing import Optional


def extract_content(raw_content: dict) -> Optional[dict]:
    """
    Transform raw PDF content into structured format.

    Returns:
        {
            'passages': [str],        # Text paragraphs
            'tables': [               # Structured tables
                {
                    'headers': [str],
                    'rows': [[str]],
                    'source': str      # filename + page
                }
            ],
            'summary': str,            # Brief content summary
            'source_files': [str]      # Original filenames
        }
    """
    if not raw_content or not raw_content.get('files'):
        return None

    result = {
        'passages': [],
        'tables': [],
        'summary': '',
        'source_files': []
    }

    for file_data in raw_content['files']:
        filename = file_data['filename']
        result['source_files'].append(filename)

        for page in file_data['pages']:
            page_num = page['page_num']
            source = f'{filename} (sayfa {page_num})'

            # Extract passages (paragraphs with 2+ sentences)
            text = page.get('text', '')
            if text:
                paragraphs = _split_into_paragraphs(text)
                for p in paragraphs:
                    if len(p) > 30:  # Skip very short lines
                        result['passages'].append(p)

            # Extract tables
            for table in page.get('tables', []):
                if len(table) >= 2:  # At least header + 1 data row
                    structured_table = _structure_table(table, source)
                    if structured_table:
                        result['tables'].append(structured_table)

    # Create summary
    total_passages = len(result['passages'])
    total_tables = len(result['tables'])
    result['summary'] = (
        f'{len(result["source_files"])} dosya, '
        f'{total_passages} paragraf, '
        f'{total_tables} tablo'
    )

    return result


def _split_into_paragraphs(text: str) -> list:
    """Split text into meaningful paragraphs."""
    lines = text.split('\n')
    paragraphs = []
    current = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current:
                paragraphs.append(' '.join(current))
                current = []
        else:
            current.append(stripped)

    if current:
        paragraphs.append(' '.join(current))

    return paragraphs


def _structure_table(table: list, source: str) -> Optional[dict]:
    """Convert raw table to structured format with headers and rows."""
    if not table or len(table) < 2:
        return None

    # First row is typically headers
    headers = [str(cell).strip() for cell in table[0]]
    rows = []

    for row in table[1:]:
        cleaned_row = [str(cell).strip() for cell in row]
        # Skip empty rows
        if any(cell for cell in cleaned_row):
            rows.append(cleaned_row)

    if not rows:
        return None

    return {
        'headers': headers,
        'rows': rows,
        'source': source,
        'col_count': len(headers),
        'row_count': len(rows)
    }
