import { fetchProductById } from "@/app/_actions/products";
import CompareSearch from "@/app/_compoments/CompareSearch";
import IndexFooter from "@/app/_compoments/IndexFooter";
import BottleSvg from "@/app/_compoments/BottleSvg";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { BeerWithStores } from "@/types/beer";

export const metadata = {
  title: "Compare beers — BetterBeer",
  description: "Put two Systembolaget beers head to head on APK, price, and strength.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;

  const [beerA, beerB] = await Promise.all([
    loadBeer(a),
    loadBeer(b),
  ]);

  return (
    <main className="pb-[90px] sm:pb-0">
      <div className="sm:hidden"><MobileTopBar /></div>

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
        {' / '}
        <span style={{ color: 'var(--idx-fg)' }}>COMPARE</span>
      </div>

      {/* Header */}
      <section
        className="px-5 pt-2 pb-5 sm:px-14 sm:pt-10 sm:pb-8"
        style={{ borderBottom: '1px solid var(--idx-line)' }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        }}>
          Head to head · Two beers
        </div>
        <h1
          className="text-[40px] sm:text-[clamp(48px,5.5vw,84px)]"
          style={{
            fontWeight: 500, letterSpacing: '-0.045em',
            margin: '10px 0 0', lineHeight: 0.94,
            fontFeatureSettings: '"ss01","cv11"',
          }}
        >
          Compare <span style={{ color: 'var(--idx-accent)' }}>beers</span>
        </h1>
      </section>

      {/* Pickers + beer cards */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 px-5 py-5 gap-5 sm:px-14 sm:py-8 sm:gap-8"
        style={{ borderBottom: '1px solid var(--idx-line)' }}
      >
        <div>
          <Suspense fallback={null}>
            <CompareSearch slot="a" selected={beerA} />
          </Suspense>
          <BeerCard beer={beerA} />
        </div>
        <div>
          <Suspense fallback={null}>
            <CompareSearch slot="b" selected={beerB} />
          </Suspense>
          <BeerCard beer={beerB} />
        </div>
      </section>

      {/* Stats */}
      {beerA && beerB ? (
        <>
          <section className="px-5 py-5 sm:px-14 sm:py-8">
            <SectionLabel>The numbers</SectionLabel>
            <StatRow label="APK" a={beerA.ProductApk} b={beerB.ProductApk} format={v => v.toFixed(2)} better="high" />
            <StatRow label="Price" a={beerA.ProductPrice} b={beerB.ProductPrice} format={formatKr} better="low" />
            <StatRow label="Kr / litre" a={krPerLitre(beerA)} b={krPerLitre(beerB)} format={formatKr} better="low" />
            <StatRow label="ABV" a={beerA.ProductAlcohol} b={beerB.ProductAlcohol} format={v => `${v.toFixed(1)}%`} />
            <StatRow label="Volume" a={beerA.ProductVolume} b={beerB.ProductVolume} format={v => `${v} ml`} />
          </section>

          <section
            className="px-5 pb-8 sm:px-14 sm:pb-12"
          >
            <SectionLabel>Verdict</SectionLabel>
            <Verdict a={beerA} b={beerB} />
          </section>
        </>
      ) : (
        <div style={{
          padding: '80px 20px', textAlign: 'center', color: 'var(--idx-fg-dim)',
          fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
        }}>
          PICK TWO BEERS TO COMPARE
        </div>
      )}

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}

/* ── Data helpers ────────────────────────────────────────── */

async function loadBeer(raw: string | undefined): Promise<BeerWithStores | null> {
  const id = Number(raw);
  if (!raw || !Number.isInteger(id) || id <= 0) return null;
  try {
    return await fetchProductById(id);
  } catch {
    return null;
  }
}

function krPerLitre(beer: BeerWithStores): number {
  return beer.ProductVolume > 0 ? beer.ProductPrice / (beer.ProductVolume / 1000) : 0;
}

function formatKr(v: number): string {
  return `${v.toFixed(2).replace('.', ',')} kr`;
}

function normalizeCategory(raw: string): string {
  return raw.split(',')[0].trim();
}

/* ── Sub-components ──────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-geist-mono)',
      fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--idx-fg-dim)', marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function BeerCard({ beer }: { beer: BeerWithStores | null }) {
  if (!beer) {
    return (
      <div style={{
        marginTop: 12, padding: '40px 20px',
        border: '1px dashed var(--idx-line-strong)',
        textAlign: 'center', color: 'var(--idx-fg-faint)',
        fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
      }}>
        NO BEER SELECTED
      </div>
    );
  }

  const inStockStores = beer.stockInfo?.filter(s => s.Stock > 0) ?? [];

  return (
    <div style={{ marginTop: 12, border: '1px solid var(--idx-line)', padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 16, alignItems: 'center' }}>
        {beer.ProductImageURL ? (
          <div style={{ width: 32, height: 96, position: 'relative', justifySelf: 'center' }}>
            <Image
              src={beer.ProductImageURL}
              alt={beer.ProductName}
              fill
              sizes="32px"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div style={{ justifySelf: 'center' }}>
            <BottleSvg category={beer.ProductCategory} volume={beer.ProductVolume} abv={beer.ProductAlcohol} w={32} h={96} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em' }}>
            {beer.ProductName}
          </div>
          <div style={{
            fontFamily: 'var(--font-geist-mono)', fontSize: 11,
            color: 'var(--idx-fg-dim)', marginTop: 4,
          }}>
            {beer.ProductNameThin ? `${beer.ProductNameThin} · ` : ''}{beer.ProductCountry}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-geist-mono)', fontSize: 11, padding: '4px 8px',
              background: 'var(--idx-bg2)', letterSpacing: '0.04em',
            }}>
              {normalizeCategory(beer.ProductCategory)}
            </span>
            <span style={{
              fontFamily: 'var(--font-geist-mono)', fontSize: 12, fontWeight: 600,
              color: beer.ProductApk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
            }}>
              APK {beer.ProductApk > 0 ? beer.ProductApk.toFixed(2) : '—'}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--idx-line)',
        fontFamily: 'var(--font-geist-mono)', fontSize: 10,
        color: 'var(--idx-fg-dim)', lineHeight: 1.7,
      }}>
        {inStockStores.length === 0
          ? 'OUT OF STOCK EVERYWHERE'
          : inStockStores.map(s => (
              <div key={s.StoreId} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <Link href={`/stores/${s.store.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {s.store.name.toUpperCase()} →
                </Link>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.Stock} in stock</span>
              </div>
            ))}
      </div>
    </div>
  );
}

function StatRow({
  label, a, b, format, better,
}: {
  label: string;
  a: number;
  b: number;
  format: (v: number) => string;
  better?: 'high' | 'low';
}) {
  const max = Math.max(a, b);
  const aWins = better === 'high' ? a > b : better === 'low' ? a < b : false;
  const bWins = better === 'high' ? b > a : better === 'low' ? b < a : false;

  return (
    <div
      className="grid items-center gap-3 sm:gap-6"
      style={{
        gridTemplateColumns: '1fr 96px 1fr',
        padding: '12px 0',
        borderBottom: '1px solid var(--idx-line)',
      }}
    >
      <StatSide value={a} max={max} format={format} wins={aWins} align="right" />
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 10,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)', textAlign: 'center',
      }}>
        {label}
      </div>
      <StatSide value={b} max={max} format={format} wins={bWins} align="left" />
    </div>
  );
}

function StatSide({
  value, max, format, wins, align,
}: {
  value: number;
  max: number;
  format: (v: number) => string;
  wins: boolean;
  align: 'left' | 'right';
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, 2) : 0;
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 15, fontWeight: wins ? 600 : 400,
        color: wins ? 'var(--idx-accent)' : 'var(--idx-fg)',
        textAlign: align,
      }}>
        {format(value)}
      </div>
      <div style={{
        marginTop: 6, height: 6, background: 'var(--idx-bg2)',
        display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: wins ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
        }} />
      </div>
    </div>
  );
}

function Verdict({ a, b }: { a: BeerWithStores; b: BeerWithStores }) {
  if (a.ProductApk === b.ProductApk) {
    return (
      <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0, maxWidth: 560 }}>
        Dead heat — both land at APK {a.ProductApk.toFixed(2)}. Go with taste.
      </p>
    );
  }
  const winner = a.ProductApk > b.ProductApk ? a : b;
  const loser = winner === a ? b : a;
  const diff = loser.ProductApk > 0
    ? ((winner.ProductApk - loser.ProductApk) / loser.ProductApk) * 100
    : 100;
  return (
    <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0, maxWidth: 560 }}>
      <span style={{ fontWeight: 600 }}>{winner.ProductName}</span> wins on value —{' '}
      <span style={{ color: 'var(--idx-accent)', fontWeight: 600 }}>
        {diff.toFixed(0)}% more alcohol per krona
      </span>{' '}
      than {loser.ProductName}.
    </p>
  );
}
