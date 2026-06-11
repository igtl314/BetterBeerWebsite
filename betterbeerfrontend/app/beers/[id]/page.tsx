import { fetchProductById } from "@/app/_actions/products";
import IndexFooter from "@/app/_compoments/IndexFooter";
import BottleSvg from "@/app/_compoments/BottleSvg";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import RefreshStockButton from "@/app/_compoments/RefreshStockButton";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BeerWithStores } from "@/types/beer";

export default async function BeerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user;

  let beer: BeerWithStores | null;
  try {
    beer = await fetchProductById(productId);
  } catch {
    return <BackendError />;
  }
  if (!beer) notFound();

  const stock = beer.stockInfo ?? [];
  const totalStock = stock.reduce((s, i) => s + i.Stock, 0);
  const apk = beer.ProductApk ?? 0;
  const krPerLitre = beer.ProductVolume > 0 ? beer.ProductPrice / (beer.ProductVolume / 1000) : 0;

  return (
    <main className="pb-[90px] sm:pb-0">
      <div className="sm:hidden">
        <MobileTopBar back="Browse" backHref="/" />
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
        {' / BEERS / '}
        <span style={{ color: 'var(--idx-fg)' }}>{beer.ProductName.toUpperCase()}</span>
      </div>

      {/* Header */}
      <section
        className="px-5 pt-4 pb-6 sm:px-14 sm:pt-10 sm:pb-10"
        style={{ borderBottom: '1px solid var(--idx-line)' }}
      >
        <div
          className="grid items-center gap-6 sm:gap-12"
          style={{ gridTemplateColumns: 'auto 1fr' }}
        >
          {beer.ProductImageURL ? (
            <div className="w-[56px] h-[160px] sm:w-[80px] sm:h-[230px]" style={{ position: 'relative' }}>
              <Image
                src={beer.ProductImageURL}
                alt={beer.ProductName}
                fill
                sizes="80px"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : (
            <BottleSvg category={beer.ProductCategory} volume={beer.ProductVolume} abv={beer.ProductAlcohol} w={64} h={200} />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
            }}>
              {normalizeCategory(beer.ProductCategory)} · {beer.ProductCountry}
            </div>
            <h1
              className="text-[34px] sm:text-[clamp(40px,4.5vw,68px)]"
              style={{
                fontWeight: 500, letterSpacing: '-0.04em',
                margin: '8px 0 0', lineHeight: 0.98,
                fontFeatureSettings: '"ss01","cv11"',
              }}
            >
              {beer.ProductName}
            </h1>
            {beer.ProductNameThin && (
              <div style={{
                fontFamily: 'var(--font-geist-mono)', fontSize: 13,
                color: 'var(--idx-fg-dim)', marginTop: 8,
              }}>
                {beer.ProductNameThin}
              </div>
            )}
            <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'var(--font-geist-mono)', fontSize: 14, fontWeight: 600,
                padding: '5px 10px',
                background: apk > 0 ? 'var(--idx-accent)' : 'var(--idx-bg3)',
                color: apk > 0 ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
              }}>
                APK {apk > 0 ? apk.toFixed(2) : '—'}
              </span>
              <span style={{
                fontFamily: 'var(--font-geist-mono)', fontSize: 13,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatKr(beer.ProductPrice)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-5"
        style={{ gap: 1, background: 'var(--idx-line)', borderBottom: '1px solid var(--idx-line)' }}
      >
        <StatBox label="APK" value={apk > 0 ? apk.toFixed(2) : '—'} sub="value index" accent />
        <StatBox label="Price" value={formatKr(beer.ProductPrice)} sub="per unit" />
        <StatBox label="ABV" value={`${beer.ProductAlcohol.toFixed(1)}%`} sub="alcohol" />
        <StatBox label="Volume" value={`${beer.ProductVolume} ml`} sub="per unit" />
        <StatBox label="Kr / litre" value={formatKr(krPerLitre)} sub="unit price" />
      </div>

      {/* Where to find it */}
      <section className="px-5 py-6 pb-10 sm:px-14 sm:py-10 sm:pb-16">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            Where to find it
          </div>
          <div style={{
            fontFamily: 'var(--font-geist-mono)', fontSize: 11,
            color: 'var(--idx-fg-dim)', fontVariantNumeric: 'tabular-nums',
          }}>
            {totalStock} in stock · {stock.length} {stock.length === 1 ? 'store' : 'stores'}
          </div>
        </div>

        {stock.length === 0 ? (
          <div style={{
            padding: '48px 20px',
            border: '1px dashed var(--idx-line-strong)',
            textAlign: 'center',
            fontFamily: 'var(--font-geist-mono)', fontSize: 11,
            letterSpacing: '0.1em', color: 'var(--idx-fg-dim)',
          }}>
            NOT TRACKED AT ANY STORE
          </div>
        ) : (
          <div>
            {stock.map(item => (
              <StoreStockRow
                key={item.StoreId}
                item={item}
                productId={beer.ID}
                canRefresh={isLoggedIn}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <Link href={`/compare?a=${beer.ID}`} style={{
            display: 'inline-block', padding: '10px 18px',
            background: 'transparent', color: 'var(--idx-fg)',
            border: '1px solid var(--idx-line-strong)',
            fontFamily: 'var(--font-geist-mono)', fontSize: 12,
            letterSpacing: '0.06em', textDecoration: 'none',
          }}>
            COMPARE WITH ANOTHER BEER →
          </Link>
        </div>
      </section>

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function normalizeCategory(raw: string): string {
  return raw.split(',')[0].trim();
}

function formatKr(v: number): string {
  return `${v.toFixed(2).replace('.', ',')} kr`;
}

function stockBg(stock: number): string {
  if (stock > 50) return '#c7e0c0';
  if (stock > 10) return 'var(--idx-accent-bg)';
  if (stock > 0) return '#f0d6cc';
  return 'var(--idx-bg3)';
}

/* ── Sub-components ──────────────────────────────────────── */

function StoreStockRow({
  item,
  productId,
  canRefresh,
}: {
  item: BeerWithStores['stockInfo'][number];
  productId: number;
  canRefresh: boolean;
}) {
  const shelf = item.Location && item.Location.trim() && item.Location.trim() !== '-'
    ? item.Location.trim()
    : null;
  const updated = item.updatedAt
    ? new Date(item.updatedAt).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  return (
    <div
      className="grid items-center gap-3 sm:gap-6"
      style={{
        gridTemplateColumns: '1fr auto auto',
        padding: '14px 0',
        borderBottom: '1px solid var(--idx-line)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <Link href={`/stores/${item.store.id}`} style={{
          fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em',
          color: 'inherit', textDecoration: 'none',
        }}>
          {item.store.name} <span style={{ color: 'var(--idx-accent)' }}>→</span>
        </Link>
        <div style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 10,
          color: 'var(--idx-fg-faint)', marginTop: 3,
        }}>
          Butik {item.store.id}{updated ? ` · updated ${updated}` : ''}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 18, fontWeight: 600,
          color: shelf ? 'var(--idx-fg)' : 'var(--idx-fg-faint)',
        }}>
          {shelf ?? '—'}
        </div>
        <div style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 9,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--idx-fg-dim)', marginTop: 2,
        }}>
          Shelf
        </div>
      </div>

      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <span style={{
          display: 'inline-block', padding: '4px 10px',
          background: stockBg(item.Stock), color: 'var(--idx-fg)',
          fontSize: 13, fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        }}>
          {item.Stock > 0 ? `${item.Stock} in stock` : 'Out of stock'}
        </span>
        {canRefresh && <RefreshStockButton storeId={item.store.id} productId={productId} />}
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--idx-bg)', padding: 16 }}>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)', marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontWeight: 500, letterSpacing: '-0.04em', fontSize: 22,
        fontFeatureSettings: '"ss01","cv11"', fontVariantNumeric: 'tabular-nums',
        color: accent ? 'var(--idx-accent)' : 'var(--idx-fg)',
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--idx-fg-faint)', marginTop: 4,
      }}>{sub}</div>
    </div>
  );
}

function BackendError() {
  return (
    <main style={{
      minHeight: 'calc(100vh - var(--nav-height))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--idx-fg-dim)', fontFamily: 'var(--font-geist-mono)',
      fontSize: 11, letterSpacing: '0.1em',
    }}>
      BEER UNAVAILABLE · CHECK BACKEND
    </main>
  );
}
