import { fetchStoreById } from "@/app/_actions/stores";
import { StockInfoWithProduct } from "@/types/store";
import IndexFooter from "@/app/_compoments/IndexFooter";
import BottleSvg from "@/app/_compoments/BottleSvg";
import StoreFilterBar from "@/app/_compoments/StoreFilterBar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const PER_PAGE = 30;

type SearchParams = Promise<{
  cat?: string;
  sort?: string;
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
  const { cat, sort = 'apk', instock, page = '1' } = await searchParams;

  let store;
  try {
    store = await fetchStoreById(id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('not found') || msg.includes('404')) notFound();
    // Backend unreachable — show an error instead of 404
    return <BackendError storeId={id} />;
  }

  if (!store) notFound();

  const all: StockInfoWithProduct[] = store.stockInfo ?? [];

  // Build category counts from all items (before any filter)
  const catMap = new Map<string, number>();
  for (const item of all) {
    const c = normalizeCategory(item.product.ProductCategory);
    catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, count]) => ({ label, count }));

  // APK stats (always over all items)
  const apkValues = all.map(i => i.product.ProductApk).filter(v => v > 0);
  const avgApk = apkValues.length > 0 ? apkValues.reduce((s, v) => s + v, 0) / apkValues.length : 0;
  const topApk = apkValues.length > 0 ? Math.max(...apkValues) : 0;

  // Filter
  let filtered = instock === '1' ? all.filter(i => i.Stock > 0) : all;
  if (cat) {
    filtered = filtered.filter(i => normalizeCategory(i.product.ProductCategory) === cat);
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price': return a.product.ProductPrice - b.product.ProductPrice;
      case 'abv':   return b.product.ProductAlcohol - a.product.ProductAlcohol;
      case 'name':  return a.product.ProductName.localeCompare(b.product.ProductName);
      default:      return (b.product.ProductApk ?? 0) - (a.product.ProductApk ?? 0);
    }
  });

  // Paginate
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const sortLabel = sort === 'price' ? 'Price ↑' : sort === 'abv' ? 'ABV ↓' : sort === 'name' ? 'Name' : 'APK ↓';

  return (
    <main>
      {/* Breadcrumb */}
      <div style={{
        padding: '20px 56px',
        borderBottom: '1px solid var(--idx-line)',
        fontSize: 12,
        color: 'var(--idx-fg-dim)',
        fontFamily: 'var(--font-geist-mono)',
        letterSpacing: '0.08em',
      }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>BROWSE</Link>
        {' / STORES / '}
        <span style={{ color: 'var(--idx-fg)' }}>{store.name.toUpperCase()}</span>
      </div>

      {/* Store header */}
      <section style={{
        padding: '40px 56px 32px',
        borderBottom: '1px solid var(--idx-line)',
        display: 'grid',
        gridTemplateColumns: '1fr 540px',
        gap: 64,
        alignItems: 'end',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            Butik {store.id} · Systembolaget
          </div>
          <h1 style={{
            fontWeight: 500,
            letterSpacing: '-0.045em',
            fontSize: 'clamp(48px, 5.5vw, 84px)',
            margin: '12px 0 0',
            lineHeight: 0.94,
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            {store.name}
          </h1>
        </div>

        {/* Stat boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'var(--idx-line)',
          border: '1px solid var(--idx-line)',
        }}>
          <StatBox label="Beers" value={String(all.length)} sub="in catalogue" />
          <StatBox label="Avg APK" value={avgApk > 0 ? avgApk.toFixed(2) : '—'} sub="value index" />
          <StatBox label="Top APK" value={topApk > 0 ? topApk.toFixed(2) : '—'} sub="best in store" />
          <StatBox label="Showing" value={String(sorted.length)} sub={`sorted ${sortLabel}`} />
        </div>
      </section>

      {/* Interactive filter + sort bar — Suspense required for useSearchParams */}
      <Suspense fallback={<FilterBarSkeleton count={all.length} />}>
        <StoreFilterBar
          categories={categories}
          totalCount={all.length}
          activeCategory={cat ?? ''}
          activeSort={sort}
          inStockOnly={instock === '1'}
          storeId={id}
        />
      </Suspense>

      {/* Product table */}
      <section style={{ padding: '0 56px 48px' }}>
        {sorted.length === 0 ? (
          <div style={{
            padding: '80px 0',
            textAlign: 'center',
            color: 'var(--idx-fg-dim)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
          }}>
            NO PRODUCTS MATCH THIS FILTER
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <colgroup>
              <col style={{ width: 56 }} />
              <col />
              <col style={{ width: 130 }} />
              <col style={{ width: 76 }} />
              <col style={{ width: 72 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 72 }} />
            </colgroup>
            <thead>
              <tr>
                <Th />
                <Th align="left">Beer / Brewer</Th>
                <Th align="center">Category</Th>
                <Th align="right">Vol</Th>
                <Th align="right">ABV</Th>
                <Th align="right">Price</Th>
                <Th align="right">APK{sort === 'apk' ? ' ↓' : ''}</Th>
                <Th align="right">Stock</Th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <BeerRow key={item.ProductId} item={item} />
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: '0 56px 80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, sorted.length)} of {sorted.length}
          </div>
          <PageControls
            id={id}
            currentPage={currentPage}
            totalPages={totalPages}
            cat={cat}
            sort={sort}
            instock={instock}
          />
        </div>
      )}

      <IndexFooter />
    </main>
  );
}

function normalizeCategory(raw: string): string {
  return raw.split(',')[0].trim();
}

function StatBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: 'var(--idx-bg)', padding: 16 }}>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 9,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontWeight: 500,
        letterSpacing: '-0.04em',
        fontSize: 24,
        fontFeatureSettings: '"ss01","cv11"',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 10,
        color: 'var(--idx-fg-faint)',
        marginTop: 4,
      }}>
        {sub}
      </div>
    </div>
  );
}

const thBase: React.CSSProperties = {
  padding: '12px 0',
  borderBottom: '1px solid var(--idx-line-strong)',
  fontFamily: 'var(--font-geist-mono)',
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--idx-fg-dim)',
  fontWeight: 400,
};

function Th({ children, align }: { children?: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th style={{ ...thBase, textAlign: align ?? 'left' }}>{children}</th>;
}

function stockBg(stock: number): string {
  if (stock > 50) return '#c7e0c0';
  if (stock > 10) return 'var(--idx-accent-bg)';
  if (stock > 0) return '#f0d6cc';
  return 'var(--idx-bg3)';
}

function BeerRow({ item }: { item: StockInfoWithProduct }) {
  const { product, Stock } = item;
  const apk = product.ProductApk ?? 0;
  const tdBase: React.CSSProperties = { borderBottom: '1px solid var(--idx-line)' };

  return (
    <tr className="idx-row">
      <td style={{ ...tdBase, padding: '6px 0', verticalAlign: 'middle' }}>
        <BottleSvg
          category={product.ProductCategory}
          volume={product.ProductVolume}
          abv={product.ProductAlcohol}
          w={26}
          h={80}
        />
      </td>
      <td style={{ ...tdBase, padding: '14px 0 14px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{product.ProductName}</div>
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 11,
          color: 'var(--idx-fg-dim)',
          marginTop: 3,
        }}>
          {product.ProductNameThin ? `${product.ProductNameThin} · ` : ''}{product.ProductCountry}
        </div>
      </td>
      <td style={{ ...tdBase, padding: '14px 4px', textAlign: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 11,
          padding: '4px 8px',
          background: 'var(--idx-bg2)',
          color: 'var(--idx-fg)',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}>
          {normalizeCategory(product.ProductCategory)}
        </span>
      </td>
      <td style={{
        ...tdBase, padding: '14px 0', textAlign: 'right',
        fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 13, color: 'var(--idx-fg-dim)',
      }}>
        {product.ProductVolume} ml
      </td>
      <td style={{
        ...tdBase, padding: '14px 0', textAlign: 'right',
        fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 13, color: 'var(--idx-fg-dim)',
      }}>
        {product.ProductAlcohol.toFixed(1)}%
      </td>
      <td style={{
        ...tdBase, padding: '14px 0', textAlign: 'right',
        fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 13,
      }}>
        {product.ProductPrice.toFixed(2).replace('.', ',')} kr
      </td>
      <td style={{
        ...tdBase, padding: '14px 0', textAlign: 'right',
        color: apk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
        fontWeight: 600,
        fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 15,
      }}>
        {apk > 0 ? apk.toFixed(2) : '—'}
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right' }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          background: stockBg(Stock),
          color: 'var(--idx-fg)',
          fontSize: 12,
          fontFamily: 'var(--font-geist-mono)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {Stock > 0 ? Stock : 'Out'}
        </span>
      </td>
    </tr>
  );
}

function FilterBarSkeleton({ count }: { count: number }) {
  return (
    <div style={{
      padding: '16px 56px',
      borderBottom: '1px solid var(--idx-line)',
      background: 'var(--idx-bg)',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    }}>
      <span style={{
        padding: '7px 12px',
        fontSize: 12,
        fontFamily: 'var(--font-geist-mono)',
        background: 'var(--idx-fg)',
        color: 'var(--idx-bg)',
        letterSpacing: '0.04em',
      }}>
        All · {count}
      </span>
    </div>
  );
}

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
          Could not reach the backend. Make sure the backend is running on{' '}
          <code style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, background: 'var(--idx-bg3)', padding: '1px 5px' }}>
            {process.env.BACKEND_URL ?? 'BACKEND_URL not set'}
          </code>.
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          marginTop: 24,
          padding: '10px 20px',
          background: 'var(--idx-fg)',
          color: 'var(--idx-bg)',
          textDecoration: 'none',
          fontSize: 13,
          fontFamily: 'var(--font-geist-mono)',
          letterSpacing: '0.06em',
        }}>
          ← BACK TO STORES
        </Link>
      </div>
    </main>
  );
}

function pageUrl(
  id: string,
  page: number,
  opts: { cat?: string; sort?: string; instock?: string }
) {
  const p = new URLSearchParams();
  if (opts.cat) p.set('cat', opts.cat);
  if (opts.sort && opts.sort !== 'apk') p.set('sort', opts.sort);
  if (opts.instock) p.set('instock', opts.instock);
  if (page > 1) p.set('page', String(page));
  const qs = p.toString();
  return `/stores/${id}${qs ? `?${qs}` : ''}`;
}

function PageControls({
  id, currentPage, totalPages, cat, sort, instock,
}: {
  id: string; currentPage: number; totalPages: number;
  cat?: string; sort?: string; instock?: string;
}) {
  const opts = { cat, sort, instock };
  const pages: (number | '…')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    width: 32,
    height: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontFamily: 'var(--font-geist-mono)',
    textDecoration: 'none',
    color: 'var(--idx-fg-dim)',
    border: '1px solid var(--idx-line)',
  };

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} style={{ ...btnBase, border: 'none', color: 'var(--idx-fg-faint)' }}>…</span>
        ) : (
          <Link
            key={p}
            href={pageUrl(id, p as number, opts)}
            style={{
              ...btnBase,
              background: p === currentPage ? 'var(--idx-fg)' : 'transparent',
              color: p === currentPage ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
              border: p === currentPage ? 'none' : '1px solid var(--idx-line)',
            }}
          >
            {p}
          </Link>
        )
      )}
    </div>
  );
}
