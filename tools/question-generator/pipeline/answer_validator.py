"""Answer Validator — Cross-validation module for question answers.

Uses a second Claude API call to independently solve generated questions
and compare results with the original answers.

4-Layer Verification:
  1. Chain-of-thought (built into generation prompt)
  2. Cross-validation (this module — independent second solve)
  3. Programmatic check (numerical questions — Python verification)
  4. Human review (UI-based — handled by frontend)

Adds to each question:
  _validation: 'verified' | 'needs_review' | 'skipped'
  _validation_detail: explanation string
"""
import json
import re
import sys
import time
from typing import Optional
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL, MAX_RETRIES, RETRY_DELAY


def validate_answers(questions: list, module: str, verbose: bool = False) -> list:
    """
    Validate answers using cross-validation (second Claude API call).

    For each batch of questions, sends them to Claude asking it to solve
    independently. Compares Claude's answer with the original answer.

    Args:
        questions: List of question dicts with correctAnswer field
        module: Module ID for context
        verbose: Print detailed output

    Returns:
        Updated questions list with _validation and _validation_detail fields
    """
    try:
        import anthropic
    except ImportError:
        print('   ❌ anthropic SDK yüklü değil: pip install anthropic')
        for q in questions:
            q['_validation'] = 'skipped'
            q['_validation_detail'] = 'anthropic SDK bulunamadı'
        return questions

    if not ANTHROPIC_API_KEY:
        print('   ⚠️  API key yok, doğrulama atlanıyor')
        for q in questions:
            q['_validation'] = 'skipped'
            q['_validation_detail'] = 'API key bulunamadı'
        return questions

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # ── Katman 3: Programmatic check for numerical questions ──
    _run_programmatic_checks(questions, verbose)

    # ── Katman 2: Cross-validation via Claude API ──
    batch_size = 5
    verified_count = 0
    review_count = 0

    for batch_start in range(0, len(questions), batch_size):
        batch = questions[batch_start:batch_start + batch_size]
        batch_end = min(batch_start + batch_size, len(questions))

        if verbose:
            print(f'   🔍 Doğrulama {batch_start + 1}-{batch_end}/{len(questions)}...', file=sys.stderr)

        prompt = _build_validation_prompt(batch)

        success = False
        for attempt in range(MAX_RETRIES):
            try:
                response = client.messages.create(
                    model=CLAUDE_MODEL,
                    max_tokens=4000,
                    temperature=0,  # Deterministic for validation
                    messages=[{'role': 'user', 'content': prompt}]
                )

                raw_text = ''
                for block in response.content:
                    if hasattr(block, 'text'):
                        raw_text += block.text

                results = _parse_validation_response(raw_text)

                # Apply validation results to questions
                for i, q in enumerate(batch):
                    idx = i + 1  # 1-indexed in the prompt
                    if idx in results:
                        result = results[idx]
                        original_answer = q.get('correctAnswer', -1)
                        validated_answer = result.get('answer', -1)
                        has_inconsistency = result.get('inconsistency', False)

                        if original_answer == validated_answer and not has_inconsistency:
                            # Cross-validation passed
                            if q.get('_validation') != 'needs_review':
                                q['_validation'] = 'verified'
                                q['_validation_detail'] = result.get('explanation', 'Cevap doğrulandı')
                                verified_count += 1
                        else:
                            # Mismatch or inconsistency detected
                            q['_validation'] = 'needs_review'
                            detail_parts = []
                            if original_answer != validated_answer:
                                detail_parts.append(
                                    f'Üretim: {chr(65 + original_answer)}, '
                                    f'Doğrulama: {chr(65 + validated_answer) if validated_answer >= 0 else "?"}'
                                )
                            if has_inconsistency:
                                detail_parts.append(f'Tutarsızlık: {result.get("inconsistency_detail", "")}')
                            detail_parts.append(f'Açıklama: {result.get("explanation", "")}')
                            q['_validation_detail'] = ' | '.join(detail_parts)
                            review_count += 1
                    else:
                        if q.get('_validation') != 'needs_review':
                            q['_validation'] = 'needs_review'
                            q['_validation_detail'] = 'Doğrulama yanıtı alınamadı'
                            review_count += 1

                success = True
                break  # Exit retry loop

            except Exception as e:
                print(f'   ❌ Doğrulama hatası (deneme {attempt + 1}): {e}', file=sys.stderr)
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAY)

        if not success:
            for q in batch:
                if q.get('_validation') != 'needs_review':
                    q['_validation'] = 'needs_review'
                    q['_validation_detail'] = 'API çağrısı başarısız'
                    review_count += 1

        # Rate limit delay between batches
        if batch_end < len(questions):
            time.sleep(1)

    print(f'   ✅ Doğrulandı: {verified_count} | ⚠️ İnceleme gerekli: {review_count}')
    return questions


# ═══════════════════════════════════════════════════════════════════
# KATMAN 3: Programmatic Checks (Numerical Questions)
# ═══════════════════════════════════════════════════════════════════

def _run_programmatic_checks(questions: list, verbose: bool = False):
    """Run programmatic verification for numerical/table questions.

    Checks:
    - Table data consistency (row/column totals)
    - Basic arithmetic verification
    - Percentage calculations
    """
    checked = 0
    for q in questions:
        vc = q.get('visualContent', {})
        if not vc or vc.get('type') != 'table':
            continue

        td = vc.get('tableData', {})
        if not td:
            continue

        # Check if table has numeric data we can verify
        result = _verify_table_math(td, q)
        if result:
            checked += 1
            if result.get('error'):
                q['_validation'] = 'needs_review'
                q['_validation_detail'] = f'Programatik kontrol: {result["error"]}'
            elif verbose:
                print(f'      🔢 Tablo sayısal kontrolü OK: {q.get("id", "")}', file=sys.stderr)

    if checked > 0 and verbose:
        print(f'   🔢 {checked} tablolu soru programatik olarak kontrol edildi', file=sys.stderr)


def _verify_table_math(table_data: dict, question: dict) -> Optional[dict]:
    """Verify mathematical consistency of table data.

    Checks:
    - "Toplam" rows should equal sum of other rows
    - Percentage columns should sum to ~100
    """
    rows = table_data.get('rows', [])
    headers = table_data.get('headers', [])
    if not rows or not headers:
        return None

    # Look for "Toplam" / "Total" row
    for r_idx, row in enumerate(rows):
        if not row:
            continue
        first_cell = str(row[0]).lower().strip()
        if first_cell in ('toplam', 'total', 'genel toplam', 'genel'):
            # Verify sum for numeric columns
            for c_idx in range(1, min(len(row), len(headers))):
                try:
                    total_val = _parse_turkish_number(row[c_idx])
                    if total_val is None:
                        continue

                    col_sum = 0
                    for other_idx in range(len(rows)):
                        if other_idx == r_idx:
                            continue
                        try:
                            cell_val = _parse_turkish_number(rows[other_idx][c_idx])
                            if cell_val is not None:
                                col_sum += cell_val
                        except (IndexError, ValueError):
                            continue

                    # Allow small rounding tolerance
                    if col_sum > 0 and abs(total_val - col_sum) > 0.5:
                        return {
                            'error': f'Toplam satırı hatalı: {headers[c_idx]} sütununda '
                                     f'toplam={total_val}, hesaplanan={col_sum}'
                        }
                except (ValueError, TypeError):
                    continue

            return {'ok': True}  # Toplam row found and verified

    return None  # No verifiable pattern found


def _parse_turkish_number(text: str) -> Optional[float]:
    """Parse a Turkish-formatted number (dots for thousands, comma for decimal)."""
    if not text:
        return None
    text = str(text).strip()
    # Remove common prefixes/suffixes
    text = text.replace('₺', '').replace('TL', '').replace('%', '').replace('M', '').strip()
    if not text:
        return None
    # Turkish format: 1.234,56 → 1234.56
    if ',' in text and '.' in text:
        text = text.replace('.', '').replace(',', '.')
    elif ',' in text:
        text = text.replace(',', '.')
    elif '.' in text:
        # Could be thousands separator or decimal
        parts = text.split('.')
        if len(parts) == 2 and len(parts[1]) == 3:
            text = text.replace('.', '')  # Thousands separator
    try:
        return float(text)
    except ValueError:
        return None


# ═══════════════════════════════════════════════════════════════════
# CROSS-VALIDATION PROMPT
# ═══════════════════════════════════════════════════════════════════

def _build_validation_prompt(questions: list) -> str:
    """Build a prompt to validate a batch of questions."""
    parts = [
        'Aşağıdaki çoktan seçmeli soruları dikkatle ve bağımsız olarak çöz.',
        'Her soru için:',
        '1. Adım adım düşünerek çöz',
        '2. Doğru cevabın index\'ini belirt (0=A, 1=B, 2=C, 3=D, 4=E)',
        '3. Soru metninde veya seçeneklerde tutarsızlık varsa belirt',
        '',
        'Yanıtını SADECE JSON olarak ver:',
        '```json',
        '{',
        '  "validations": [',
        '    {',
        '      "question": 1,',
        '      "answer": 0,',
        '      "explanation": "Çözüm açıklaması...",',
        '      "inconsistency": false,',
        '      "inconsistency_detail": ""',
        '    }',
        '  ]',
        '}',
        '```',
        '',
    ]

    for i, q in enumerate(questions):
        parts.append(f'--- SORU {i + 1} ---')
        parts.append(f'Metin: {q.get("questionText", "")}')

        # Include visual content for context
        vc = q.get('visualContent', {})
        if vc:
            vc_type = vc.get('type', '')
            if vc_type == 'text':
                content = re.sub(r'<[^>]+>', '', vc.get('content', ''))
                if content:
                    parts.append(f'Ek İçerik ({vc.get("title", "Metin")}):')
                    parts.append(content[:800])
            elif vc_type == 'table':
                td = vc.get('tableData', {})
                if td:
                    title = vc.get('title', 'Tablo')
                    parts.append(f'Tablo ({title}):')
                    headers = td.get('headers', [])
                    parts.append(f'Başlıklar: {" | ".join(headers)}')
                    for row in td.get('rows', [])[:15]:
                        parts.append(f'  {" | ".join(row)}')
                    if len(td.get('rows', [])) > 15:
                        parts.append(f'  ... ({len(td["rows"])} satır toplam)')
            elif vc_type == 'svg':
                title = vc.get('title', '')
                if title:
                    parts.append(f'Grafik: {title}')

        parts.append('Seçenekler:')
        for opt in q.get('options', []):
            parts.append(f'  {opt.get("label", "")}) {opt.get("text", "")}')
        parts.append('')

    return '\n'.join(parts)


def _parse_validation_response(raw_text: str) -> dict:
    """Parse validation response into {question_number: {answer, explanation, ...}}."""
    text = raw_text.strip()

    # Remove markdown code fences
    if '```json' in text:
        start = text.index('```json') + 7
        end = text.index('```', start)
        text = text[start:end].strip()
    elif '```' in text:
        start = text.index('```') + 3
        end = text.index('```', start)
        text = text[start:end].strip()

    results = {}
    try:
        data = json.loads(text)
        validations = data.get('validations', [])
        for v in validations:
            q_num = v.get('question', 0)
            results[q_num] = {
                'answer': v.get('answer', -1),
                'explanation': v.get('explanation', ''),
                'inconsistency': v.get('inconsistency', False),
                'inconsistency_detail': v.get('inconsistency_detail', ''),
            }
    except (json.JSONDecodeError, TypeError) as e:
        print(f'      ⚠️ Doğrulama JSON parse hatası: {e}', file=sys.stderr)

    return results
