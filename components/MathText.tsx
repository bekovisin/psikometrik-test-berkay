'use client';

import { useMemo } from 'react';
import { renderMath } from '@/lib/math';

interface MathTextProps {
  /** Text or HTML content that may contain $...$ or $$...$$ math expressions */
  children: string;
  /** Additional CSS classes */
  className?: string;
  /** HTML tag to use (default: span for inline, div for block-level) */
  as?: 'span' | 'div' | 'p' | 'h3';
}

/**
 * Renders text/HTML with KaTeX math expressions.
 *
 * Usage:
 *   <MathText>Bir daire alanı $A = \pi r^2$ formülüyle hesaplanır.</MathText>
 *   <MathText as="div">$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$</MathText>
 */
export default function MathText({ children, className, as: Tag = 'span' }: MathTextProps) {
  const rendered = useMemo(() => renderMath(children), [children]);

  // If content didn't change (no math), render as-is for non-HTML content
  if (rendered === children && !/<[a-z][\s\S]*>/i.test(children)) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
