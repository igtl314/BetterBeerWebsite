'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function StoreSearch({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get('q') ?? '';
  const [value, setValue] = useState(initial);

  useEffect(() => { setValue(initial); }, [initial]);

  const push = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set('q', next);
    else params.delete('q');
    params.delete('page');
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`);
  };

  useEffect(() => {
    if (value === initial) return;
    const id = setTimeout(() => push(value), 250);
    return () => clearTimeout(id);
    // push depends on searchParams; intentional that we re-create timeout on each value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const height = size === 'sm' ? 30 : 32;
  const fontSize = size === 'sm' ? 11 : 12;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); push(value); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        border: '1px solid var(--idx-line)',
        background: 'var(--idx-bg)',
        height,
        padding: '0 10px',
        minWidth: size === 'sm' ? 0 : 220,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <circle cx="5.5" cy="5.5" r="4" stroke="var(--idx-fg-dim)" />
        <path d="M9 9 12 12" stroke="var(--idx-fg-dim)" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search beers…"
        aria-label="Search beers in this store"
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--font-geist-mono)',
          fontSize,
          color: 'var(--idx-fg)',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => { setValue(''); push(''); }}
          aria-label="Clear search"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--idx-fg-dim)',
            padding: 0,
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </form>
  );
}
