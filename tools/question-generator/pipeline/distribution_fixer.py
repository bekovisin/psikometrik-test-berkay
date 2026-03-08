"""Distribution Fixer — Balance answer distribution across difficulty levels."""
from config import DEFAULT_DIFFICULTIES


def fix_distribution(questions: list, options_count: int = 5) -> list:
    """
    Ensure balanced answer distribution per difficulty level.
    Target: Each answer (A-E) appears exactly count/options_count times per level.

    Works by swapping option texts and correctAnswer values.
    """
    # Group questions by difficulty
    groups = {}
    for q in questions:
        diff = q.get('difficulty', 'orta')
        if diff not in groups:
            groups[diff] = []
        groups[diff].append(q)

    for diff, qs in groups.items():
        count = len(qs)
        target = count // options_count  # e.g., 20 questions / 5 options = 4

        if target == 0:
            continue

        # Count current distribution
        counts = [0] * options_count
        for q in qs:
            ca = q.get('correctAnswer', 0)
            if 0 <= ca < options_count:
                counts[ca] += 1

        # Check if already balanced
        if all(c == target for c in counts):
            continue

        # Build over/under lists
        over_list = []
        under_list = []
        for a in range(options_count):
            for _ in range(counts[a] - target):
                over_list.append(a)
            for _ in range(target - counts[a]):
                under_list.append(a)

        # Perform swaps
        used = set()
        for from_answer, to_answer in zip(over_list, under_list):
            for i, q in enumerate(qs):
                if i in used:
                    continue
                if q.get('correctAnswer') == from_answer:
                    _swap_options(q, from_answer, to_answer)
                    used.add(i)
                    break

        # Verify
        final_counts = [0] * options_count
        for q in qs:
            ca = q.get('correctAnswer', 0)
            if 0 <= ca < options_count:
                final_counts[ca] += 1

        labels = [chr(65 + i) for i in range(options_count)]
        dist_str = ' '.join([f'{labels[i]}={final_counts[i]}' for i in range(options_count)])
        balanced = all(c == target for c in final_counts)
        status = '✅' if balanced else '⚠️'
        print(f'   {diff}: {dist_str} {status}')

    return questions


def _swap_options(question: dict, idx_a: int, idx_b: int):
    """Swap two options in a question and update correctAnswer."""
    options = question.get('options', [])
    if idx_a >= len(options) or idx_b >= len(options):
        return

    # Swap option texts (keep labels)
    text_a = options[idx_a]['text']
    text_b = options[idx_b]['text']
    options[idx_a]['text'] = text_b
    options[idx_b]['text'] = text_a

    # Update correctAnswer
    ca = question['correctAnswer']
    if ca == idx_a:
        question['correctAnswer'] = idx_b
    elif ca == idx_b:
        question['correctAnswer'] = idx_a
