import { Difficulty, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types';

export default function DifficultyBadge({ difficulty, size = 'sm' }: { difficulty: Difficulty; size?: 'sm' | 'md' }) {
  const { bg, text } = DIFFICULTY_COLORS[difficulty];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${bg} ${text} ${sizeClass}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
