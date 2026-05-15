'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface StoreFilterBarProps {
  categories: { label: string; count: number }[];
  totalCount: number;
  activeCategory: string;
  activeSort: string;
  inStockOnly: boolean;
  storeId: string;
}

const SORT_OPTIONS = [
  { value: 'apk', label: 'APK ↓' },
  { value: 'price', label: 'Price ↑' },
  { value: 'abv', label: 'ABV ↓' },
  { value: 'name', label: 'Name' },
];

export default function StoreFilterBar({
  categories,
  totalCount,
  activeCategory,
  activeSort,
  inStockOnly,
  storeId,
}: StoreFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') params.delete(k);
      else params.set(k, v);
    }
    params.delete('page'); // reset page on any filter change
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ''}`;
  }, [pathname, searchParams]);

  return (
    <div style={{
      padding: '16px 56px',
      borderBottom: '1px solid var(--idx-line)',
      background: 'var(--idx-bg)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
    }}>
      {/* Category chips */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {/* All chip */}
        <ChipLink
          label={`All · ${totalCount}`}
          active={!activeCategory}
          href={buildUrl({ cat: null })}
          router={router}
        />
        {categories.map(({ label, count }) => (
          <ChipLink
            key={label}
            label={`${label} · ${count}`}
            active={activeCategory === label}
            href={buildUrl({ cat: label })}
            router={router}
          />
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        {/* In stock toggle */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          userSelect: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            In stock only
          </span>
          <button
            onClick={() => router.push(buildUrl({ instock: inStockOnly ? null : '1' }))}
            style={{
              width: 34,
              height: 20,
              borderRadius: 10,
              background: inStockOnly ? 'var(--idx-fg)' : 'var(--idx-bg3)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.15s',
              padding: 0,
            }}
          >
            <span style={{
              position: 'absolute',
              top: 3,
              left: inStockOnly ? 'calc(100% - 17px)' : 3,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: inStockOnly ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
              transition: 'left 0.15s',
            }} />
          </button>
        </label>

        {/* Sort */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            Sort:
          </span>
          <select
            value={activeSort}
            onChange={e => router.push(buildUrl({ sort: e.target.value }))}
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 12,
              padding: '5px 10px',
              background: 'transparent',
              border: '1px solid var(--idx-line)',
              color: 'var(--idx-fg)',
              cursor: 'pointer',
              appearance: 'none',
              paddingRight: 24,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235b574d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function ChipLink({
  label,
  active,
  href,
  router,
}: {
  label: string;
  active: boolean;
  href: string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <button
      onClick={() => router.push(href)}
      style={{
        padding: '7px 12px',
        fontSize: 12,
        fontFamily: 'var(--font-geist-mono)',
        letterSpacing: '0.04em',
        background: active ? 'var(--idx-fg)' : 'transparent',
        color: active ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
        border: active ? '1px solid var(--idx-fg)' : '1px solid var(--idx-line)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
