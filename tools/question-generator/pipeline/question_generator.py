"""Question Generator — Claude API integration for question generation."""
import json
import sys
import time
from typing import Optional
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL, MAX_RETRIES, RETRY_DELAY


def generate_questions(prompt: str, difficulty: str, count: int,
                       module: str, category: str, options_count: int,
                       id_prefix: str, start_index: int,
                       verbose: bool = False) -> list:
    """
    Generate questions using Claude API.

    Returns list of question dicts with all required fields.
    """
    try:
        import anthropic
    except ImportError:
        print('   ❌ anthropic SDK yüklü değil: pip install anthropic')
        return []

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    for attempt in range(MAX_RETRIES):
        try:
            if verbose:
                print(f'   🔄 API çağrısı (deneme {attempt + 1}/{MAX_RETRIES})...')

            response = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=16000,
                temperature=0.9,  # Variety for unique questions
                messages=[
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ]
            )

            # Extract text content
            raw_text = ''
            for block in response.content:
                if hasattr(block, 'text'):
                    raw_text += block.text

            if verbose:
                print(f'   📝 Yanıt: {len(raw_text)} karakter')

            # Parse JSON
            questions = _parse_response(raw_text, verbose)

            if not questions:
                print(f'   ⚠️  JSON parse başarısız, tekrar deneniyor...')
                time.sleep(RETRY_DELAY)
                continue

            # Validate and enrich questions
            enriched = _enrich_questions(
                questions=questions,
                difficulty=difficulty,
                module=module,
                category=category,
                options_count=options_count,
                id_prefix=id_prefix,
                start_index=start_index
            )

            if len(enriched) < count:
                print(f'   ⚠️  {count} soru istendi, {len(enriched)} üretildi')

            return enriched

        except Exception as e:
            print(f'   ❌ API hatası: {e}')
            if attempt < MAX_RETRIES - 1:
                print(f'   ⏳ {RETRY_DELAY}s bekleniyor...')
                time.sleep(RETRY_DELAY)

    print(f'   ❌ {MAX_RETRIES} deneme başarısız!')
    return []


def _parse_response(raw_text: str, verbose: bool = False) -> list:
    """Parse Claude's JSON response into a list of questions."""
    # Try to find JSON in the response
    text = raw_text.strip()

    # Remove markdown code fences if present
    if '```json' in text:
        start = text.index('```json') + 7
        end = text.index('```', start)
        text = text[start:end].strip()
    elif '```' in text:
        start = text.index('```') + 3
        end = text.index('```', start)
        text = text[start:end].strip()

    try:
        data = json.loads(text)
        if isinstance(data, dict) and 'questions' in data:
            return data['questions']
        elif isinstance(data, list):
            return data
        else:
            if verbose:
                print(f'   ⚠️  Beklenmeyen JSON yapısı: {type(data)}')
            return []
    except json.JSONDecodeError as e:
        if verbose:
            print(f'   ⚠️  JSON parse hatası: {e}')
            print(f'   İlk 500 karakter: {text[:500]}')

        # Try to salvage partial JSON
        return _try_partial_parse(text)


def _try_partial_parse(text: str) -> list:
    """Try to parse partial/malformed JSON."""
    # Look for individual question objects
    questions = []
    depth = 0
    start = None

    for i, c in enumerate(text):
        if c == '{':
            if depth == 0:
                start = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and start is not None:
                try:
                    obj = json.loads(text[start:i+1])
                    if 'questionText' in obj or 'options' in obj:
                        questions.append(obj)
                except json.JSONDecodeError:
                    pass
                start = None

    return questions


def _enrich_questions(questions: list, difficulty: str, module: str,
                      category: str, options_count: int,
                      id_prefix: str, start_index: int) -> list:
    """Add required fields to questions and validate."""
    timestamp = '2025-02-01T00:00:00.000Z'
    enriched = []

    for i, q in enumerate(questions):
        # Validate required fields
        if not q.get('questionText') or not q.get('options'):
            continue

        # Validate options count
        opts = q.get('options', [])
        if len(opts) < options_count:
            continue

        # Trim to correct option count
        opts = opts[:options_count]

        # Validate correctAnswer range
        correct = q.get('correctAnswer', 0)
        if not isinstance(correct, int) or correct < 0 or correct >= options_count:
            correct = 0

        # Solution is mandatory — skip if empty
        solution = q.get('solution', '').strip()
        if not solution:
            print(f'   ⚠️  Soru {i+1} çözüm içermiyor, atlanıyor')
            continue

        # Preserve visualContent as-is (visual_generator will process later)
        visual_content = q.get('visualContent', {})
        # Handle case where Claude returns visualContent as string
        if isinstance(visual_content, str):
            try:
                visual_content = json.loads(visual_content)
            except (json.JSONDecodeError, TypeError):
                visual_content = {}

        question = {
            'id': f'{id_prefix}-{start_index + i}',
            'categoryId': category,
            'subModuleId': module,
            'difficulty': difficulty,
            'questionText': q['questionText'],
            'visualContent': visual_content,
            'options': [
                {
                    'label': chr(65 + j),
                    'text': opt.get('text', opt) if isinstance(opt, dict) else str(opt)
                }
                for j, opt in enumerate(opts)
            ],
            'correctAnswer': correct,
            'solution': solution,
            'tags': q.get('tags', [module]),
            'createdAt': timestamp,
            'updatedAt': timestamp,
        }

        enriched.append(question)

    return enriched
