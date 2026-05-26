'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Props {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * HtmlContentBoundary — Imperative HTML renderer that prevents
 * React DOM reconciliation and hydration crashes completely.
 *
 * It renders an empty container during SSR / initial hydration, and then
 * updates innerHTML via a ref on the client. This bypasses React's virtual
 * DOM comparison tree entirely, making it 100% immune to:
 *   - Browser extensions (Grammarly, Google Translate, etc.)
 *   - React hydration mismatches
 *   - Next.js Fast Refresh DOM inconsistencies
 */
export function HtmlContentBoundary({ content, className, style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && containerRef.current) {
      containerRef.current.innerHTML = content || '';
    }
  }, [content, mounted]);

  // Safe SSR placeholder to prevent hydration mismatch
  if (!mounted) {
    return <div className={className} style={style} />;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    />
  );
}
