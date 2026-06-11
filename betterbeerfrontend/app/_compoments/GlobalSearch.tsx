'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchProducts } from '@/app/_actions/products';
import { Beer } from '@/types/beer';

export default function GlobalSearch({ variant = 'box' }: { variant?: 'box' | 'icon' }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Beer[]>([]);
  const [highlighted, setHighlighted] = useState(0);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setHighlighted(0);
    setSearched(false);
  }, []);

  // ⌘K / Ctrl+K opens, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Debounced search
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const found = await searchProducts(term);
        setResults(found);
        setHighlighted(0);
        setSearched(true);
      } catch {
        setResults([]);
        setSearched(true);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  const choose = (beer: Beer) => {
    close();
    router.push(`/beers/${beer.ID}`);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && results[highlighted]) {
      e.preventDefault();
      choose(results[highlighted]);
    }
  };

  return (
    <>
      {variant === 'box' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search beers"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 14px',
            border: '1px solid var(--idx-line)',
            fontSize: 13,
            color: 'var(--idx-fg-dim)',
            width: 260,
            background: 'var(--idx-bg)',
            cursor: 'pointer',
            fontFamily: 'var(--font-geist-sans)',
            textAlign: 'left',
          }}
        >
          <SearchIcon />
          <span style={{ flex: 1 }}>Search beers…</span>
          <span style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            padding: '1px 5px',
            background: 'var(--idx-bg3)',
            color: 'var(--idx-fg)',
          }}>⌘K</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search beers"
          style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--idx-fg-dim)',
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <SearchIcon />
        </button>
      )}

      {open && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(22,20,14,0.35)',
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            padding: '12vh 20px 20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 560,
              background: 'var(--idx-bg)',
              border: '1px solid var(--idx-line-strong)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px',
              borderBottom: searched || results.length > 0 ? '1px solid var(--idx-line)' : 'none',
            }}>
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search every beer at Systembolaget…"
                aria-label="Search beers"
                style={{
                  flex: 1, minWidth: 0,
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-geist-mono)', fontSize: 14,
                  color: 'var(--idx-fg)',
                }}
              />
              <span style={{
                fontFamily: 'var(--font-geist-mono)', fontSize: 10,
                padding: '1px 5px', background: 'var(--idx-bg3)', color: 'var(--idx-fg-dim)',
              }}>ESC</span>
            </div>

            {results.length > 0 && (
              <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                {results.map((beer, i) => (
                  <button
                    key={beer.ID}
                    type="button"
                    onClick={() => choose(beer)}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      width: '100%', gap: 12, padding: '12px 16px',
                      background: i === highlighted ? 'var(--idx-bg2)' : 'transparent',
                      border: 'none', borderBottom: '1px solid var(--idx-line)',
                      cursor: 'pointer', textAlign: 'left', color: 'var(--idx-fg)',
                    }}
                  >
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 500 }}>
                        {beer.ProductName}
                      </span>
                      <span style={{
                        display: 'block', fontFamily: 'var(--font-geist-mono)',
                        fontSize: 10, color: 'var(--idx-fg-dim)', marginTop: 2,
                      }}>
                        {beer.ProductNameThin ? `${beer.ProductNameThin} · ` : ''}
                        {beer.ProductVolume} ml · {beer.ProductAlcohol.toFixed(1)}% · {beer.ProductPrice.toFixed(2).replace('.', ',')} kr
                      </span>
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-geist-mono)', fontSize: 13, fontWeight: 600,
                      color: beer.ProductApk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
                      flexShrink: 0,
                    }}>
                      {beer.ProductApk > 0 ? beer.ProductApk.toFixed(2) : '—'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {searched && results.length === 0 && query.trim() && (
              <div style={{
                padding: '24px 16px', textAlign: 'center',
                fontFamily: 'var(--font-geist-mono)', fontSize: 11,
                letterSpacing: '0.1em', color: 'var(--idx-fg-dim)',
              }}>
                NO BEERS MATCH “{query.trim().toUpperCase()}”
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" />
      <path d="M9 9 12 12" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
