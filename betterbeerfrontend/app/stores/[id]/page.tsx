import { fetchStoreById } from "@/app/_actions/stores";
import { StockInfoWithProduct } from "@/types/store";
import IndexFooter from "@/app/_compoments/IndexFooter";
import BottleSvg from "@/app/_compoments/BottleSvg";
import StoreFilterBar from "@/app/_compoments/StoreFilterBar";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import RefreshStockButton from "@/app/_compoments/RefreshStockButton";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";

const PER_PAGE = 30;

type SortKey = 'apk' | 'price' | 'abv' | 'name' | 'category' | 'vol' | 'stock' | 'location';
type SortDir = 'asc' | 'desc';

const SORT_KEYS: readonly SortKey[] = ['apk', 'price', 'abv', 'name', 'category', 'vol', 'stock', 'location'];
const DEFAULT_DIR: Record<SortKey, SortDir> = {
  apk: 'desc', price: 'asc', abv: 'desc', name: 'asc',
  category: 'asc', vol: 'desc', stock: 'desc', location: 'asc',
};

type SearchParams = Promise<{
  cat?: string;
  sort?: string;
  dir?: string;
  q?: string;
  instock?: string;
  page?: string;
}>;

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const raw = await searchParams;
  const cat = raw.cat;
  const instock = raw.instock;
  const page = raw.page ?? '1';
  const q = (raw.q ?? '').trim();
  const sort: SortKey = SORT_KEYS.includes(raw.sort as SortKey) ? (raw.sort as SortKey) : 'apk';
  const dir: SortDir = raw.dir === 'asc' || raw.dir === 'desc' ? raw.dir : DEFAULT_DIR[sort];

  const session = await auth();
  const isLoggedIn = !!session?.user;

  let store;
  try {
    store = await fetchStoreById(id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('not found') || msg.includes('404')) notFound();
    return <BackendError storeId={id} />;
  }

  if (!store) notFound();

  const all: StockInfoWithProduct[] = store.stockInfo ?? [];

  // Category counts (all items)
  const catMap = new Map<string, number>();
  for (const item of all) {
    const c = normalizeCategory(item.product.ProductCategory);
    catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, count]) => ({ label, count }));

  // APK stats
  const apkValues = all.map(i => i.product.ProductApk).filter(v => v > 0);
  const avgApk = apkValues.length > 0 ? apkValues.reduce((s, v) => s + v, 0) / apkValues.length : 0;
  const topApk = apkValues.length > 0 ? Math.max(...apkValues) : 0;

  // Filter + sort
  let filtered = instock === '1' ? all.filter(i => i.Stock > 0) : all;
  if (cat) filtered = filtered.filter(i => normalizeCategory(i.product.ProductCategory) === cat);
  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(i =>
      i.product.ProductName.toLowerCase().includes(needle) ||
      (i.product.ProductNameThin ?? '').toLowerCase().includes(needle) ||
      (i.product.ProductCountry ?? '').toLowerCase().includes(needle)
    );
  }

  const sorted = sortItems(filtered, sort, dir);

  // Pagination (used by both desktop table and mobile cards)
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const sortLabel = `${SORT_LABEL[sort]} ${dir === 'asc' ? '↑' : '↓'}`;
  const currentNav = { cat, sort, dir, instock, q };

  const showingSub = q
    ? `matches "${q}"`
    : cat
      ? `filtered by ${cat}`
      : `sorted ${sortLabel}`;

  return (
    <main className="pb-[90px] sm:pb-0">
      <div className="sm:hidden">
        <MobileTopBar back="Stores" backHref="/stores" />
      </div>

      {/* Breadcrumb — desktop */}
      <div
        className="hidden sm:block"
        style={{
          padding: '20px 56px',
          borderBottom: '1px solid var(--idx-line)',
          fontSize: 12, color: 'var(--idx-fg-dim)',
          fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.08em',
        }}
      >
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>BROWSE</Link>
        {' / STORES / '}
        <span style={{ color: 'var(--idx-fg)' }}>{store.name.toUpperCase()}</span>
      </div>

      {/* Store header — desktop (title + inline stats grid) */}
      <section
        className="hidden sm:grid"
        style={{
          padding: '40px 56px 32px',
          borderBottom: '1px solid var(--idx-line)',
          gridTemplateColumns: '1fr 540px', gap: 64, alignItems: 'end',
        }}
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
          }}>
            Butik {store.id} · Systembolaget
          </div>
          <h1 style={{
            fontWeight: 500, letterSpacing: '-0.045em',
            fontSize: 'clamp(48px, 5.5vw, 84px)', margin: '12px 0 0', lineHeight: 0.94,
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            {store.name}
          </h1>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, background: 'var(--idx-line)', border: '1px solid var(--idx-line)',
        }}>
          <StatBox label="Beers" value={String(all.length)} sub="in catalogue" />
          <StatBox label="Avg APK" value={avgApk > 0 ? avgApk.toFixed(2) : '—'} sub="value index" />
          <StatBox label="Top APK" value={topApk > 0 ? topApk.toFixed(2) : '—'} sub="best in store" />
          <StatBox label="Showing" value={String(sorted.length)} sub={showingSub} />
        </div>
      </section>

      {/* Store header — mobile (title only; stats grid below) */}
      <section
        className="sm:hidden"
        style={{ padding: '8px 20px 18px', borderBottom: '1px solid var(--idx-line)' }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        }}>
          BUTIK {store.id} · SYSTEMBOLAGET
        </div>
        <h1 style={{
          fontSize: 44, margin: '8px 0 0', lineHeight: 0.96,
          fontWeight: 500, letterSpacing: '-0.03em',
          fontFeatureSettings: '"ss01","cv11"',
        }}>
          {store.name}
        </h1>
      </section>

      {/* Mobile stats grid */}
      <div
        className="sm:hidden grid grid-cols-2"
        style={{
          gap: 1, background: 'var(--idx-line)', borderBottom: '1px solid var(--idx-line)',
        }}
      >
        <MobileStat label="Beers" value={String(all.length)} sub="in catalogue" />
        <MobileStat label="Avg APK" value={avgApk > 0 ? avgApk.toFixed(2) : '—'} sub="value index" />
        <MobileStat label="Top APK" value={topApk > 0 ? topApk.toFixed(2) : '—'} sub="best in store" />
        <MobileStat label="Showing" value={String(sorted.length)} sub={showingSub} />
      </div>

      <Suspense fallback={<FilterBarSkeleton count={all.length} />}>
        <StoreFilterBar
          categories={categories}
          totalCount={all.length}
          activeCategory={cat ?? ''}
          inStockOnly={instock === '1'}
        />
      </Suspense>

      {/* Mobile sort chip row */}
      <div
        className="mob-chips sm:hidden"
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--idx-line)',
          background: 'var(--idx-bg)',
        }}
      >
        {SORT_KEYS.map(key => (
          <SortChip
            key={key}
            label={SORT_LABEL[key]}
            sortKey={key}
            sort={sort}
            dir={dir}
            storeId={id}
            current={currentNav}
          />
        ))}
      </div>

      {/* Showing X–Y of N */}
      <div
        className="flex justify-between items-center px-5 py-2 sm:px-14 sm:py-3"
        style={{ borderBottom: '1px solid var(--idx-line)' }}
      >
        <span style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        }}>
          {sorted.length === 0
            ? 'NO RESULTS'
            : `Showing ${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, sorted.length)} of ${sorted.length}`}
        </span>
        <span style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--idx-fg-dim)',
        }}>
          {SORT_LABEL[sort]} {dir === 'asc' ? '↑' : '↓'}
        </span>
      </div>

      {/* Product list — table on desktop, cards on mobile (both fed by `paginated`) */}
      <section className="px-0 pb-6 sm:px-14 sm:pb-12">
        {sorted.length === 0 ? (
          <div style={{
            padding: '80px 0', textAlign: 'center', color: 'var(--idx-fg-dim)',
            fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
          }}>
            NO PRODUCTS MATCH THIS FILTER
          </div>
        ) : (
          <>
            <table className="hidden sm:table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <colgroup>
                <col style={{ width: 56 }} /><col /><col style={{ width: 130 }} />
                <col style={{ width: 76 }} /><col style={{ width: 72 }} />
                <col style={{ width: 100 }} /><col style={{ width: 100 }} />
                <col style={{ width: 84 }} /><col style={{ width: 72 }} />
              </colgroup>
              <thead>
                <tr>
                  <Th />
                  <SortableTh label="Beer / Brewer" sortKey="name" sort={sort} dir={dir} storeId={id} current={currentNav} align="left" />
                  <SortableTh label="Category" sortKey="category" sort={sort} dir={dir} storeId={id} current={currentNav} align="center" />
                  <SortableTh label="Vol" sortKey="vol" sort={sort} dir={dir} storeId={id} current={currentNav} align="right" />
                  <SortableTh label="ABV" sortKey="abv" sort={sort} dir={dir} storeId={id} current={currentNav} align="right" />
                  <SortableTh label="Price" sortKey="price" sort={sort} dir={dir} storeId={id} current={currentNav} align="right" />
                  <SortableTh label="APK" sortKey="apk" sort={sort} dir={dir} storeId={id} current={currentNav} align="right" />
                  <SortableTh label="Location" sortKey="location" sort={sort} dir={dir} storeId={id} current={currentNav} align="center" />
                  <SortableTh label="Stock" sortKey="stock" sort={sort} dir={dir} storeId={id} current={currentNav} align="right" />
                </tr>
              </thead>
              <tbody>
                {paginated.map(item => <BeerRow key={item.ProductId} item={item} storeId={store.id} canRefresh={isLoggedIn} />)}
              </tbody>
            </table>
            <div className="sm:hidden">
              {paginated.map(item => <MobileBeerRow key={item.ProductId} item={item} storeId={store.id} canRefresh={isLoggedIn} />)}
            </div>
          </>
        )}
      </section>

      {/* Pagination — shown on both breakpoints */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 px-5 pb-10 sm:flex-row sm:justify-between sm:items-center sm:px-14 sm:pb-20">
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
          }}>
            Page {currentPage} of {totalPages}
          </div>
          <PageControls
            id={id}
            currentPage={currentPage}
            totalPages={totalPages}
            cat={cat}
            sort={sort}
            dir={dir}
            instock={instock}
            q={q}
          />
        </div>
      )}

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}

/* ── Shared helpers ──────────────────────────────────────── */

function normalizeCategory(raw: string): string {
  return raw.split(',')[0].trim();
}

const SORT_LABEL: Record<SortKey, string> = {
  apk: 'APK', price: 'Price', abv: 'ABV', name: 'Name',
  category: 'Category', vol: 'Vol', stock: 'Stock', location: 'Location',
};

function sortItems(items: StockInfoWithProduct[], key: SortKey, dir: SortDir): StockInfoWithProduct[] {
  const m = dir === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    switch (key) {
      case 'price':    return (a.product.ProductPrice - b.product.ProductPrice) * m;
      case 'abv':      return (a.product.ProductAlcohol - b.product.ProductAlcohol) * m;
      case 'name':     return a.product.ProductName.localeCompare(b.product.ProductName) * m;
      case 'category': return normalizeCategory(a.product.ProductCategory).localeCompare(normalizeCategory(b.product.ProductCategory)) * m;
      case 'vol':      return (a.product.ProductVolume - b.product.ProductVolume) * m;
      case 'stock':    return (a.Stock - b.Stock) * m;
      case 'location': return (a.Location ?? '').localeCompare(b.Location ?? '') * m;
      default:         return ((a.product.ProductApk ?? 0) - (b.product.ProductApk ?? 0)) * m;
    }
  });
}

type CurrentNav = { cat?: string; sort: SortKey; dir: SortDir; instock?: string; q: string };

function buildStoreUrl(
  storeId: string,
  current: CurrentNav,
  updates: { sort?: SortKey; dir?: SortDir },
): string {
  const merged = { ...current, ...updates };
  const p = new URLSearchParams();
  if (merged.cat) p.set('cat', merged.cat);
  if (merged.sort !== 'apk') p.set('sort', merged.sort);
  if (merged.dir !== DEFAULT_DIR[merged.sort]) p.set('dir', merged.dir);
  if (merged.instock) p.set('instock', merged.instock);
  if (merged.q) p.set('q', merged.q);
  // intentionally drop page on sort change
  const qs = p.toString();
  return `/stores/${storeId}${qs ? `?${qs}` : ''}`;
}

/* ── Stat boxes ──────────────────────────────────────────── */

function StatBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: 'var(--idx-bg)', padding: 16 }}>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)', marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontWeight: 500, letterSpacing: '-0.04em', fontSize: 24,
        fontFeatureSettings: '"ss01","cv11"', fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--idx-fg-faint)', marginTop: 4,
      }}>{sub}</div>
    </div>
  );
}

function MobileStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: 'var(--idx-bg)', padding: '12px 16px' }}>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontWeight: 500, letterSpacing: '-0.04em', fontSize: 22,
        fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"ss01","cv11"',
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 10,
        color: 'var(--idx-fg-faint)', marginTop: 3,
      }}>{sub}</div>
    </div>
  );
}

/* ── Sort chips (mobile) ─────────────────────────────────── */

function SortChip({
  label, sortKey, sort, dir, storeId, current,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortKey;
  dir: SortDir;
  storeId: string;
  current: CurrentNav;
}) {
  const active = sort === sortKey;
  const nextDir: SortDir = active
    ? (dir === 'asc' ? 'desc' : 'asc')
    : DEFAULT_DIR[sortKey];
  const arrow = active ? (dir === 'asc' ? ' ↑' : ' ↓') : '';
  const href = buildStoreUrl(storeId, current, { sort: sortKey, dir: nextDir });
  return (
    <Link
      href={href}
      style={{
        padding: '6px 12px', fontSize: 11,
        fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.04em',
        whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0,
        background: active ? 'var(--idx-fg)' : 'transparent',
        color: active ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
        border: active ? 'none' : '1px solid var(--idx-line)',
      }}
    >
      {label}{arrow}
    </Link>
  );
}

/* ── Desktop table sub-components ────────────────────────── */

const thBase: React.CSSProperties = {
  padding: '12px 0',
  borderBottom: '1px solid var(--idx-line-strong)',
  fontFamily: 'var(--font-geist-mono)',
  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'var(--idx-fg-dim)', fontWeight: 400,
};

function Th({ children, align }: { children?: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th style={{ ...thBase, textAlign: align ?? 'left' }}>{children}</th>;
}

function SortableTh({
  label, sortKey, sort, dir, storeId, current, align,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortKey;
  dir: SortDir;
  storeId: string;
  current: CurrentNav;
  align?: 'left' | 'right' | 'center';
}) {
  const active = sort === sortKey;
  const nextDir: SortDir = active
    ? (dir === 'asc' ? 'desc' : 'asc')
    : DEFAULT_DIR[sortKey];
  const arrow = active ? (dir === 'asc' ? ' ↑' : ' ↓') : '';
  const href = buildStoreUrl(storeId, current, { sort: sortKey, dir: nextDir });
  return (
    <th style={{ ...thBase, textAlign: align ?? 'left' }}>
      <Link
        href={href}
        style={{
          color: active ? 'var(--idx-fg)' : 'inherit',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        {label}{arrow}
      </Link>
    </th>
  );
}

function stockBg(stock: number): string {
  if (stock > 50) return '#c7e0c0';
  if (stock > 10) return 'var(--idx-accent-bg)';
  if (stock > 0) return '#f0d6cc';
  return 'var(--idx-bg3)';
}

function BeerRow({ item, storeId, canRefresh }: { item: StockInfoWithProduct; storeId: number; canRefresh: boolean }) {
  const { product, Stock, Location } = item;
  const apk = product.ProductApk ?? 0;
  const hasImage = !!product.ProductImageURL;
  const tdBase: React.CSSProperties = { borderBottom: '1px solid var(--idx-line)' };

  return (
    <tr className="idx-row">
      <td style={{ ...tdBase, padding: '6px 0', verticalAlign: 'middle' }}>
        {hasImage ? (
          <div style={{ width: 26, height: 80, position: 'relative' }}>
            <Image
              src={product.ProductImageURL}
              alt={product.ProductName}
              fill
              sizes="26px"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <BottleSvg category={product.ProductCategory} volume={product.ProductVolume} abv={product.ProductAlcohol} w={26} h={80} />
        )}
      </td>
      <td style={{ ...tdBase, padding: '14px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{product.ProductName}</div>
        <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--idx-fg-dim)', marginTop: 3 }}>
          {product.ProductNameThin ? `${product.ProductNameThin} · ` : ''}{product.ProductCountry}
        </div>
      </td>
      <td style={{ ...tdBase, padding: '14px 4px', textAlign: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 11, padding: '4px 8px',
          background: 'var(--idx-bg2)', color: 'var(--idx-fg)',
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>
          {normalizeCategory(product.ProductCategory)}
        </span>
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: 'var(--idx-fg-dim)' }}>
        {product.ProductVolume} ml
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: 'var(--idx-fg-dim)' }}>
        {product.ProductAlcohol.toFixed(1)}%
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
        {product.ProductPrice.toFixed(2).replace('.', ',')} kr
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', color: apk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)', fontWeight: 600, fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 15 }}>
        {apk > 0 ? apk.toFixed(2) : '—'}
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'center', fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: Location && Location.trim() && Location.trim() !== '-' ? 'var(--idx-fg)' : 'var(--idx-fg-faint)' }}>
        {Location && Location.trim() && Location.trim() !== '-' ? Location.trim() : '—'}
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', whiteSpace: 'nowrap' }}>
        <span style={{
          display: 'inline-block', padding: '3px 8px',
          background: stockBg(Stock), color: 'var(--idx-fg)',
          fontSize: 12, fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        }}>
          {Stock > 0 ? Stock : 'Out'}
        </span>
        {canRefresh && <RefreshStockButton storeId={storeId} productId={product.ID} />}
      </td>
    </tr>
  );
}

function FilterBarSkeleton({ count }: { count: number }) {
  return (
    <div
      className="p-[12px_20px] sm:p-[16px_56px] flex items-center gap-1"
      style={{
        borderBottom: '1px solid var(--idx-line)',
        background: 'var(--idx-bg)',
      }}
    >
      <span style={{
        padding: '7px 12px', fontSize: 12, fontFamily: 'var(--font-geist-mono)',
        background: 'var(--idx-fg)', color: 'var(--idx-bg)', letterSpacing: '0.04em',
      }}>
        All · {count}
      </span>
    </div>
  );
}

/* ── Mobile beer card ───────────────────────────────────── */

function MobileBeerRow({ item, storeId, canRefresh }: { item: StockInfoWithProduct; storeId: number; canRefresh: boolean }) {
  const { product, Stock, Location } = item;
  const shelf = Location && Location.trim() && Location.trim() !== '-' ? Location.trim() : null;
  const apk = product.ProductApk ?? 0;
  const hasImage = !!product.ProductImageURL;

  return (
    <div style={{
      padding: '12px 20px',
      borderBottom: '1px solid var(--idx-line)',
      display: 'grid',
      gridTemplateColumns: '44px 1fr 72px',
      gap: 12,
      alignItems: 'center',
    }}>
      {hasImage ? (
        <div style={{ width: 44, height: 84, position: 'relative', flexShrink: 0 }}>
          <Image
            src={product.ProductImageURL}
            alt={product.ProductName}
            fill
            sizes="44px"
            style={{ objectFit: 'contain' }}
          />
        </div>
      ) : (
        <BottleSvg category={product.ProductCategory} volume={product.ProductVolume} abv={product.ProductAlcohol} w={36} h={84} />
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.ProductName}
        </div>
        <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--idx-fg-dim)', marginTop: 3 }}>
          {normalizeCategory(product.ProductCategory)} · {product.ProductCountry}
        </div>
        <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--idx-fg-faint)', marginTop: 2 }}>
          {product.ProductVolume}ml · {product.ProductAlcohol.toFixed(1)}% · {product.ProductPrice.toFixed(2).replace('.', ',')} kr{shelf ? ` · ${shelf}` : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 18,
          color: apk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
          fontWeight: 600, fontVariantNumeric: 'tabular-nums',
        }}>
          {apk > 0 ? apk.toFixed(2) : '—'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 }}>
          <span style={{
            display: 'inline-block', padding: '2px 7px',
            fontSize: 10, fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
            background: stockBg(Stock),
          }}>
            {Stock > 0 ? `${Stock}u` : 'Out'}
          </span>
          {canRefresh && <RefreshStockButton storeId={storeId} productId={product.ID} size="sm" />}
        </div>
      </div>
    </div>
  );
}

/* ── Error state ─────────────────────────────────────────── */

function BackendError({ storeId }: { storeId: string }) {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 56px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)', marginBottom: 12 }}>
          Store #{storeId}
        </div>
        <h1 style={{ fontWeight: 500, letterSpacing: '-0.045em', fontSize: 36, fontFeatureSettings: '"ss01","cv11"', marginBottom: 16 }}>
          Backend unavailable
        </h1>
        <p style={{ fontSize: 14, color: 'var(--idx-fg-dim)', lineHeight: 1.6, maxWidth: 400 }}>
          Could not reach the backend. Make sure it is running on{' '}
          <code style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, background: 'var(--idx-bg3)', padding: '1px 5px' }}>
            {process.env.BACKEND_URL ?? 'BACKEND_URL not set'}
          </code>.
        </p>
        <Link href="/" style={{
          display: 'inline-block', marginTop: 24, padding: '10px 20px',
          background: 'var(--idx-fg)', color: 'var(--idx-bg)',
          textDecoration: 'none', fontSize: 13,
          fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.06em',
        }}>
          ← BACK TO STORES
        </Link>
      </div>
    </main>
  );
}

/* ── Pagination ──────────────────────────────────────────── */

function pageUrl(id: string, page: number, opts: { cat?: string; sort?: SortKey; dir?: SortDir; instock?: string; q?: string }) {
  const p = new URLSearchParams();
  if (opts.cat) p.set('cat', opts.cat);
  if (opts.sort && opts.sort !== 'apk') p.set('sort', opts.sort);
  if (opts.dir && opts.sort && opts.dir !== DEFAULT_DIR[opts.sort]) p.set('dir', opts.dir);
  if (opts.instock) p.set('instock', opts.instock);
  if (opts.q) p.set('q', opts.q);
  if (page > 1) p.set('page', String(page));
  const qs = p.toString();
  return `/stores/${id}${qs ? `?${qs}` : ''}`;
}

function PageControls({ id, currentPage, totalPages, cat, sort, dir, instock, q }: {
  id: string; currentPage: number; totalPages: number;
  cat?: string; sort?: SortKey; dir?: SortDir; instock?: string; q?: string;
}) {
  const opts = { cat, sort, dir, instock, q };
  const pages: (number | '…')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    width: 32, height: 32,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontFamily: 'var(--font-geist-mono)',
    textDecoration: 'none', color: 'var(--idx-fg-dim)', border: '1px solid var(--idx-line)',
  };

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} style={{ ...btnBase, border: 'none', color: 'var(--idx-fg-faint)' }}>…</span>
        ) : (
          <Link key={p} href={pageUrl(id, p as number, opts)} style={{
            ...btnBase,
            background: p === currentPage ? 'var(--idx-fg)' : 'transparent',
            color: p === currentPage ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
            border: p === currentPage ? 'none' : '1px solid var(--idx-line)',
          }}>
            {p}
          </Link>
        )
      )}
    </div>
  );
}
