'use client';

import { useState, useTransition } from 'react';
import { refreshStock } from '@/app/_actions/stock';

type Size = 'sm' | 'md';

export default function RefreshStockButton({
  storeId,
  productId,
  size = 'md',
}: {
  storeId: number;
  productId: number;
  size?: Size;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [justSucceeded, setJustSucceeded] = useState(false);

  const dim = size === 'sm' ? 18 : 22;

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await refreshStock(storeId, productId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setJustSucceeded(true);
      setTimeout(() => setJustSucceeded(false), 1200);
    });
  };

  const label = error
    ? error
    : justSucceeded
    ? 'Stock refreshed'
    : pending
    ? 'Refreshing…'
    : 'Refresh stock from Systembolaget';

  const color = error
    ? 'var(--idx-accent)'
    : justSucceeded
    ? '#3a7d3a'
    : 'var(--idx-fg-dim)';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title={label}
      aria-label={label}
      style={{
        width: dim,
        height: dim,
        padding: 0,
        marginLeft: 6,
        border: '1px solid var(--idx-line)',
        background: 'transparent',
        color,
        cursor: pending ? 'wait' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-geist-mono)',
        fontSize: size === 'sm' ? 10 : 12,
        lineHeight: 1,
        verticalAlign: 'middle',
        transition: 'color 120ms ease',
      }}
    >
      <span style={{
        display: 'inline-block',
        animation: pending ? 'idx-spin 700ms linear infinite' : undefined,
      }}>
        ↻
      </span>
      <style>{`@keyframes idx-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
