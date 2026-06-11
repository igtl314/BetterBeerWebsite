import { fetchTopProducts } from "@/app/_actions/products";
import IndexFooter from "@/app/_compoments/IndexFooter";
import BottleSvg from "@/app/_compoments/BottleSvg";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import Link from "next/link";
import Image from "next/image";
import { Beer } from "@/types/beer";

export const metadata = {
  title: "APK Leaderboard — BetterBeer",
  description: "The highest alcohol-per-krona beers at Systembolaget, ranked.",
};

const TOP_N = 100;

export default async function LeaderboardPage() {
  let beers: Beer[] = [];
  try {
    beers = await fetchTopProducts(TOP_N);
  } catch {
    return <BackendError />;
  }

  const apkValues = beers.map(b => b.ProductApk).filter(v => v > 0);
  const topApk = apkValues.length > 0 ? Math.max(...apkValues) : 0;
  const avgApk = apkValues.length > 0 ? apkValues.reduce((s, v) => s + v, 0) / apkValues.length : 0;

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
        <span style={{ color: 'var(--idx-fg)' }}>LEADERBOARD</span>
      </div>

      {/* Header — desktop */}
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
            Alkohol per krona · All stores
          </div>
          <h1 style={{
            fontWeight: 500, letterSpacing: '-0.045em',
            fontSize: 'clamp(48px, 5.5vw, 84px)', margin: '12px 0 0', lineHeight: 0.94,
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            APK <span style={{ color: 'var(--idx-accent)' }}>leaderboard</span>
          </h1>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1, background: 'var(--idx-line)', border: '1px solid var(--idx-line)',
        }}>
          <StatBox label="Ranked" value={String(beers.length)} sub="beers" />
          <StatBox label="Top APK" value={topApk > 0 ? topApk.toFixed(2) : '—'} sub="best value" />
          <StatBox label="Avg APK" value={avgApk > 0 ? avgApk.toFixed(2) : '—'} sub={`of top ${beers.length}`} />
        </div>
      </section>

      {/* Header — mobile */}
      <section
        className="sm:hidden"
        style={{ padding: '8px 20px 18px', borderBottom: '1px solid var(--idx-line)' }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        }}>
          ALKOHOL PER KRONA · ALL STORES
        </div>
        <h1 style={{
          fontSize: 40, margin: '8px 0 0', lineHeight: 0.96,
          fontWeight: 500, letterSpacing: '-0.03em',
          fontFeatureSettings: '"ss01","cv11"',
        }}>
          APK <span style={{ color: 'var(--idx-accent)' }}>leaderboard</span>
        </h1>
      </section>

      {/* Mobile stats */}
      <div
        className="sm:hidden grid grid-cols-3"
        style={{ gap: 1, background: 'var(--idx-line)', borderBottom: '1px solid var(--idx-line)' }}
      >
        <MobileStat label="Ranked" value={String(beers.length)} />
        <MobileStat label="Top APK" value={topApk > 0 ? topApk.toFixed(2) : '—'} accent />
        <MobileStat label="Avg APK" value={avgApk > 0 ? avgApk.toFixed(2) : '—'} />
      </div>

      {/* Table */}
      <section className="px-0 pb-6 sm:px-14 sm:pb-12">
        {beers.length === 0 ? (
          <div style={{
            padding: '80px 0', textAlign: 'center', color: 'var(--idx-fg-dim)',
            fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
          }}>
            NO PRODUCTS YET · CHECK BACK AFTER THE NEXT COLLECTION RUN
          </div>
        ) : (
          <>
            <table className="hidden sm:table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <colgroup>
                <col style={{ width: 64 }} /><col style={{ width: 56 }} /><col />
                <col style={{ width: 140 }} /><col style={{ width: 110 }} />
                <col style={{ width: 80 }} /><col style={{ width: 72 }} />
                <col style={{ width: 100 }} /><col style={{ width: 100 }} />
              </colgroup>
              <thead>
                <tr>
                  <Th>Rank</Th>
                  <Th />
                  <Th>Beer / Brewer</Th>
                  <Th align="center">Category</Th>
                  <Th align="left">Country</Th>
                  <Th align="right">Vol</Th>
                  <Th align="right">ABV</Th>
                  <Th align="right">Price</Th>
                  <Th align="right">APK</Th>
                </tr>
              </thead>
              <tbody>
                {beers.map((beer, i) => <LeaderboardRow key={beer.ID} beer={beer} rank={i + 1} />)}
              </tbody>
            </table>
            <div className="sm:hidden">
              {beers.map((beer, i) => <MobileLeaderboardRow key={beer.ID} beer={beer} rank={i + 1} />)}
            </div>
          </>
        )}
      </section>

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function normalizeCategory(raw: string): string {
  return raw.split(',')[0].trim();
}

function formatPrice(price: number): string {
  return `${price.toFixed(2).replace('.', ',')} kr`;
}

/* ── Desktop sub-components ──────────────────────────────── */

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

function RankBadge({ rank }: { rank: number }) {
  const podium = rank <= 3;
  return (
    <span style={{
      display: 'inline-block', minWidth: 34, padding: '3px 6px', textAlign: 'center',
      fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
      fontSize: 13, fontWeight: podium ? 600 : 400,
      background: podium ? 'var(--idx-fg)' : 'transparent',
      color: podium ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
      border: podium ? 'none' : '1px solid var(--idx-line)',
    }}>
      {rank}
    </span>
  );
}

function LeaderboardRow({ beer, rank }: { beer: Beer; rank: number }) {
  const apk = beer.ProductApk ?? 0;
  const hasImage = !!beer.ProductImageURL;
  const tdBase: React.CSSProperties = { borderBottom: '1px solid var(--idx-line)' };

  return (
    <tr className="idx-row">
      <td style={{ ...tdBase, padding: '14px 0' }}>
        <RankBadge rank={rank} />
      </td>
      <td style={{ ...tdBase, padding: '6px 0', verticalAlign: 'middle' }}>
        {hasImage ? (
          <div style={{ width: 26, height: 80, position: 'relative' }}>
            <Image
              src={beer.ProductImageURL}
              alt={beer.ProductName}
              fill
              sizes="26px"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <BottleSvg category={beer.ProductCategory} volume={beer.ProductVolume} abv={beer.ProductAlcohol} w={26} h={80} />
        )}
      </td>
      <td style={{ ...tdBase, padding: '14px 0' }}>
        <Link href={`/beers/${beer.ID}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>{beer.ProductName}</div>
          <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--idx-fg-dim)', marginTop: 3 }}>
            {beer.ProductNameThin ? `${beer.ProductNameThin} · ` : ''}{beer.ProductCountry}
          </div>
        </Link>
      </td>
      <td style={{ ...tdBase, padding: '14px 4px', textAlign: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 11, padding: '4px 8px',
          background: 'var(--idx-bg2)', color: 'var(--idx-fg)',
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>
          {normalizeCategory(beer.ProductCategory)}
        </span>
      </td>
      <td style={{ ...tdBase, padding: '14px 0', fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--idx-fg-dim)' }}>
        {beer.ProductCountry}
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: 'var(--idx-fg-dim)' }}>
        {beer.ProductVolume} ml
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: 'var(--idx-fg-dim)' }}>
        {beer.ProductAlcohol.toFixed(1)}%
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
        {formatPrice(beer.ProductPrice)}
      </td>
      <td style={{ ...tdBase, padding: '14px 0', textAlign: 'right', color: apk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)', fontWeight: 600, fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 15 }}>
        {apk > 0 ? apk.toFixed(2) : '—'}
      </td>
    </tr>
  );
}

/* ── Mobile row ──────────────────────────────────────────── */

function MobileLeaderboardRow({ beer, rank }: { beer: Beer; rank: number }) {
  const apk = beer.ProductApk ?? 0;
  const hasImage = !!beer.ProductImageURL;

  return (
    <Link href={`/beers/${beer.ID}`} style={{
      padding: '12px 20px',
      borderBottom: '1px solid var(--idx-line)',
      display: 'grid',
      gridTemplateColumns: '34px 44px 1fr 72px',
      gap: 12,
      alignItems: 'center',
      color: 'inherit',
      textDecoration: 'none',
    }}>
      <RankBadge rank={rank} />
      {hasImage ? (
        <div style={{ width: 26, height: 64, position: 'relative', justifySelf: 'center' }}>
          <Image
            src={beer.ProductImageURL}
            alt={beer.ProductName}
            fill
            sizes="26px"
            style={{ objectFit: 'contain' }}
          />
        </div>
      ) : (
        <div style={{ justifySelf: 'center' }}>
          <BottleSvg category={beer.ProductCategory} volume={beer.ProductVolume} abv={beer.ProductAlcohol} w={26} h={64} />
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {beer.ProductName}
        </div>
        <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--idx-fg-dim)', marginTop: 3 }}>
          {beer.ProductVolume} ml · {beer.ProductAlcohol.toFixed(1)}% · {formatPrice(beer.ProductPrice)}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
          fontSize: 16, fontWeight: 600, color: apk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
        }}>
          {apk > 0 ? apk.toFixed(2) : '—'}
        </div>
        <div style={{
          fontFamily: 'var(--font-geist-mono)', fontSize: 9,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)', marginTop: 2,
        }}>
          APK
        </div>
      </div>
    </Link>
  );
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

function MobileStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--idx-bg)', padding: '12px 14px' }}>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 18, fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        color: accent ? 'var(--idx-accent)' : 'var(--idx-fg)',
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 9,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)', marginTop: 3,
      }}>{label}</div>
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
      LEADERBOARD UNAVAILABLE · CHECK BACKEND
    </main>
  );
}
