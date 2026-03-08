"""Deduplication — Ensure question uniqueness using hash-based tracking."""
import hashlib
import json
from pathlib import Path
from config import HISTORY_DIR


def check_and_update_history(questions: list, module: str) -> int:
    """
    Check questions against history and remove duplicates.
    Updates history file with new questions.

    Returns number of unique questions.
    """
    history_file = HISTORY_DIR / 'generated_hashes.json'

    # Load existing history
    history = _load_history(history_file)

    # Get module history
    module_hashes = set(history.get(module, []))
    initial_count = len(questions)
    unique_questions = []

    for q in questions:
        q_hash = _hash_question(q)
        if q_hash not in module_hashes:
            module_hashes.add(q_hash)
            unique_questions.append(q)

    # Update history
    history[module] = list(module_hashes)
    _save_history(history_file, history)

    # Replace questions list in-place
    questions.clear()
    questions.extend(unique_questions)

    duplicates = initial_count - len(unique_questions)
    if duplicates > 0:
        print(f'   ⚠️  {duplicates} tekrar soru kaldırıldı')

    return len(unique_questions)


def _hash_question(question: dict) -> str:
    """Generate a hash for a question based on its content."""
    # Hash based on question text + correct answer text
    text = question.get('questionText', '')
    options = question.get('options', [])
    correct_idx = question.get('correctAnswer', 0)

    correct_text = ''
    if options and correct_idx < len(options):
        correct_text = options[correct_idx].get('text', '')

    content = f'{text}|{correct_text}'.lower().strip()
    return hashlib.sha256(content.encode('utf-8')).hexdigest()[:16]


def _load_history(filepath: Path) -> dict:
    """Load history from JSON file."""
    if filepath.exists():
        try:
            return json.loads(filepath.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, IOError):
            return {}
    return {}


def _save_history(filepath: Path, history: dict):
    """Save history to JSON file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.write_text(json.dumps(history, indent=2, ensure_ascii=False), encoding='utf-8')


def clear_history(module: str = None):
    """Clear history for a module or all modules."""
    history_file = HISTORY_DIR / 'generated_hashes.json'
    if module:
        history = _load_history(history_file)
        if module in history:
            del history[module]
            _save_history(history_file, history)
            print(f'   ✅ {module} geçmişi temizlendi')
    else:
        if history_file.exists():
            history_file.unlink()
            print('   ✅ Tüm geçmiş temizlendi')
