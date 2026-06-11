'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import StoreSearch from './StoreSearch';

interface StoreFilterBarProps {
  categories: { label: string; count: number }[];
  totalCount: number;
  activeCategory: string;
  inStockOnly: boolean;
}

export default function StoreFilterBar({
  categories,
  totalCount,
  activeCategory,
  inStockOnly,
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
    <div
      className="p-[12px_20px] flex flex-col gap-3 sm:p-[16px_56px] sm:flex-row sm:justify-between sm:items-center sm:gap-4"
      style={{
        borderBottom: '1px solid var(--idx-line)',
        background: 'var(--idx-bg)',
      }}
    >
      {/* Category chips — horizontally scrollable on mobile, wrap on desktop */}
      <div className="mob-chips sm:flex-wrap sm:!overflow-visible">
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
      <div
        className="flex items-center justify-between gap-4 sm:justify-end sm:flex-shrink-0"
      >
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

        {/* Search */}
        <StoreSearch />
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
