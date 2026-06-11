'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchProducts } from '@/app/_actions/products';
import { Beer } from '@/types/beer';

export default function CompareSearch({ slot, selected }: { slot: 'a' | 'b'; selected: Beer | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Beer[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setOpen(false);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const found = await searchProducts(term);
        setResults(found);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  const choose = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) params.delete(slot);
    else params.set(slot, String(id));
    const qs = params.toString();
    router.push(`/compare${qs ? `?${qs}` : ''}`);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        border: '1px solid var(--idx-line-strong)',
        background: 'var(--idx-bg)', padding: '0 12px', height: 42,
      }}>
        <span style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 10,
          letterSpacing: '0.12em', color: 'var(--idx-bg)',
          background: 'var(--idx-fg)', padding: '2px 6px', flexShrink: 0,
        }}>
          {slot.toUpperCase()}
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder={selected ? `Replace ${selected.ProductName}…` : 'Search a beer…'}
          aria-label={`Search beer ${slot.toUpperCase()}`}
          style={{
            flex: 1, minWidth: 0, background: 'transparent',
            border: 'none', outline: 'none',
            fontFamily: 'var(--font-geist-mono)', fontSize: 12,
            color: 'var(--idx-fg)',
          }}
        />
        {selected && (
          <button
            type="button"
            onClick={() => choose(null)}
            aria-label={`Clear beer ${slot.toUpperCase()}`}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--idx-fg-dim)', padding: 0, fontSize: 18, lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 40,
          background: 'var(--idx-bg)', border: '1px solid var(--idx-line-strong)',
          borderTop: 'none', maxHeight: 320, overflowY: 'auto',
        }}>
          {results.map(beer => (
            <button
              key={beer.ID}
              type="button"
              onClick={() => choose(beer.ID)}
              className="idx-store-cell"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                width: '100%', gap: 12, padding: '10px 12px',
                background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--idx-line)',
                cursor: 'pointer', textAlign: 'left', color: 'var(--idx-fg)',
              }}
            >
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 500 }}>
                  {beer.ProductName}
                </span>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-geist-mono)',
                  fontSize: 10, color: 'var(--idx-fg-dim)', marginTop: 2,
                }}>
                  {beer.ProductNameThin ? `${beer.ProductNameThin} · ` : ''}
                  {beer.ProductVolume} ml · {beer.ProductAlcohol.toFixed(1)}%
                </span>
              </span>
              <span style={{
                fontFamily: 'var(--font-geist-mono)', fontSize: 12, fontWeight: 600,
                color: beer.ProductApk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
                flexShrink: 0,
              }}>
                {beer.ProductApk > 0 ? beer.ProductApk.toFixed(2) : '—'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
