"""PDF Reader — Extract text, tables and images from PDF files."""
import os
from pathlib import Path
from typing import Optional


def read_pdfs_from_folder(folder: Path, specific_file: str = None) -> dict:
    """
    Read all PDFs from a folder (or a specific file) and return raw content.

    Returns:
        {
            'files': [
                {
                    'filename': str,
                    'pages': [
                        {
                            'page_num': int,
                            'text': str,
                            'tables': list[list[list[str]]],
                            'images': list[dict]
                        }
                    ]
                }
            ]
        }
    """
    try:
        import pdfplumber
    except ImportError:
        print('   ⚠️  pdfplumber yüklü değil: pip install pdfplumber')
        return {'files': []}

    result = {'files': []}

    if specific_file:
        pdf_files = [folder / specific_file]
    else:
        pdf_files = sorted(folder.glob('*.pdf'))

    if not pdf_files:
        print(f'   ⚠️  PDF bulunamadı: {folder}')
        return result

    for pdf_path in pdf_files:
        print(f'   📄 {pdf_path.name}')
        file_data = {'filename': pdf_path.name, 'pages': []}

        try:
            with pdfplumber.open(str(pdf_path)) as pdf:
                for i, page in enumerate(pdf.pages):
                    page_data = {
                        'page_num': i + 1,
                        'text': page.extract_text() or '',
                        'tables': [],
                        'images': []
                    }

                    # Extract tables
                    tables = page.extract_tables()
                    if tables:
                        for table in tables:
                            # Clean None values
                            cleaned = []
                            for row in table:
                                cleaned.append([cell or '' for cell in row])
                            page_data['tables'].append(cleaned)

                    # Extract images metadata
                    if page.images:
                        for img in page.images:
                            page_data['images'].append({
                                'x0': img.get('x0', 0),
                                'y0': img.get('top', 0),
                                'width': img.get('width', 0),
                                'height': img.get('height', 0),
                            })

                    file_data['pages'].append(page_data)

        except Exception as e:
            print(f'   ❌ Hata ({pdf_path.name}): {e}')
            continue

        result['files'].append(file_data)
        print(f'      {len(file_data["pages"])} sayfa okundu')

    return result
