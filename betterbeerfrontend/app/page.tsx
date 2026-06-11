import { Store } from "@/types/store";
import { fetchStores } from "./_actions/stores";
import IndexFooter from "./_compoments/IndexFooter";
import MobileTopBar from "./_compoments/MobileTopBar";
import Link from "next/link";

export default async function Home() {
  let stores: Store[] = [];

  try {
    stores = await fetchStores();
  } catch {
    // show empty state below
  }

  return (
    <main className="pb-[90px] sm:pb-0">
      <div className="sm:hidden"><MobileTopBar /></div>

      {/* Hero — desktop */}
      <section
        className="hidden sm:grid sm:grid-cols-2 sm:gap-16"
        style={{
          padding: '40px 56px 48px',
          borderBottom: '1px solid var(--idx-line)',
        }}
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            SE · Systembolaget · Beer Index
          </div>
          <h1 style={{
            fontWeight: 500,
            letterSpacing: '-0.045em',
            fontSize: 'clamp(56px, 6.5vw, 96px)',
            lineHeight: 0.92,
            margin: '16px 0 0',
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            The index of{' '}
            <span style={{ color: 'var(--idx-accent)' }}>good</span>
            <br />beer in Sweden.
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <p style={{
            fontSize: 18,
            lineHeight: 1.5,
            color: 'var(--idx-fg-dim)',
            maxWidth: 480,
            margin: 0,
          }}>
            Live stock and prices from{' '}
            {stores.length > 0 ? stores.length : '—'} Systembolaget stores, ranked by APK — alkohol per krona — so you find what&apos;s worth the trip.
          </p>
          <div style={{
            display: 'flex',
            gap: 36,
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid var(--idx-line)',
          }}>
            <StatCell value={stores.length > 0 ? String(stores.length) : '—'} label="Stores" />
            <StatCell value="APK" label="Ranked by value" accent />
            <StatCell value="Live" label="Stock data" />
          </div>
        </div>
      </section>

      {/* Hero — mobile */}
      <section
        className="sm:hidden"
        style={{
          padding: '24px 20px 16px',
          borderBottom: '1px solid var(--idx-line)',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--idx-fg-dim)',
        }}>
          SE · SYSTEMBOLAGET · BEER INDEX
        </div>
        <h1 style={{
          fontSize: 40,
          margin: '10px 0 0',
          lineHeight: 0.96,
          fontWeight: 500,
          letterSpacing: '-0.035em',
          fontFeatureSettings: '"ss01","cv11"',
        }}>
          The{' '}
          <span style={{ color: 'var(--idx-accent)' }}>good</span>
          {' '}beer<br />index of Sweden.
        </h1>
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--idx-fg-dim)', lineHeight: 1.5, margin: '12px 0 0' }}>
          {stores.length > 0 ? stores.length : '—'} stores · sorted by APK
        </p>
      </section>

      {/* Mobile stats strip */}
      <div
        className="sm:hidden grid grid-cols-3"
        style={{
          gap: 1,
          background: 'var(--idx-line)',
          borderBottom: '1px solid var(--idx-line)',
        }}
      >
        <MobileStatCell n={stores.length > 0 ? String(stores.length) : '—'} label="stores" />
        <MobileStatCell n="APK" label="ranked by" accent />
        <MobileStatCell n="Live" label="stock data" />
      </div>

      {/* Store directory */}
      <section className="px-5 pt-5 sm:px-14 sm:pt-12 sm:pb-20">
        <div
          className="mb-3 sm:mb-7"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <h2 className="hidden sm:block" style={{
            fontWeight: 500,
            letterSpacing: '-0.045em',
            fontSize: 48,
            margin: 0,
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            Browse by store
          </h2>
          <h2 className="sm:hidden" style={{
            fontSize: 22,
            margin: 0,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            Browse stores
          </h2>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            <span className="hidden sm:inline">{stores.length} stores</span>
            <span className="sm:hidden">{stores.length}</span>
          </div>
        </div>

        {stores.length === 0 ? (
          <div style={{
            padding: '40px 0',
            textAlign: 'center',
            color: 'var(--idx-fg-dim)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
          }}>
            NO STORES · CHECK BACKEND
          </div>
        ) : (
          <>
            <div
              className="hidden sm:grid sm:grid-cols-4"
              style={{
                borderTop: '1px solid var(--idx-line-strong)',
                borderLeft: '1px solid var(--idx-line)',
              }}
            >
              {stores.map(s => <StoreCell key={s.id} store={s} />)}
            </div>
            <div className="sm:hidden">
              {stores.map(s => <MobileStoreRow key={s.id} store={s} />)}
            </div>
          </>
        )}
      </section>

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}

/* ── Desktop sub-components ──────────────────────────────── */

function StatCell({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div>
      <div style={{
        fontWeight: 500,
        letterSpacing: '-0.045em',
        fontSize: 32,
        fontFeatureSettings: '"ss01","cv11"',
        fontFamily: 'var(--font-geist-mono)',
        fontVariantNumeric: 'tabular-nums',
        color: accent ? 'var(--idx-accent)' : 'var(--idx-fg)',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)',
        marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  );
}

function StoreCell({ store }: { store: Store }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="idx-store-cell"
      style={{
        padding: '20px 22px',
        borderBottom: '1px solid var(--idx-line)',
        borderRight: '1px solid var(--idx-line)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background 0.1s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{
          fontWeight: 500,
          letterSpacing: '-0.03em',
          fontSize: 20,
          fontFeatureSettings: '"ss01","cv11"',
        }}>
          {store.name}
        </div>
        <div style={{ fontSize: 18, color: 'var(--idx-accent)', fontWeight: 600 }}>→</div>
      </div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 11,
        color: 'var(--idx-fg-faint)',
        letterSpacing: '0.02em',
      }}>
        Store #{store.id}
      </div>
    </Link>
  );
}

/* ── Mobile sub-components ───────────────────────────────── */

function MobileStatCell({ n, label, accent }: { n: string; label: string; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--idx-bg)', padding: '12px 14px' }}>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 18,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        color: accent ? 'var(--idx-accent)' : 'var(--idx-fg)',
      }}>{n}</div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--idx-fg-dim)',
        marginTop: 3,
      }}>{label}</div>
    </div>
  );
}

function MobileStoreRow({ store }: { store: Store }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '14px 0',
        borderBottom: '1px solid var(--idx-line)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div>
        <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}>{store.name}</div>
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10,
          color: 'var(--idx-fg-faint)',
          marginTop: 3,
        }}>
          Butik {store.id}
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3l5 5-5 5" stroke="var(--idx-fg-dim)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
