import { Store } from "@/types/store";
import { fetchStores } from "./_actions/stores";
import IndexFooter from "./_compoments/IndexFooter";
import Link from "next/link";

export default async function Home() {
  let stores: Store[] = [];

  try {
    stores = await fetchStores();
  } catch {
    // show empty state below
  }

  // Group by city if available (our Store type only has id + name for now)
  // Show stores in a flat grid
  return (
    <main>
      {/* Hero */}
      <section style={{
        padding: '40px 56px 48px',
        borderBottom: '1px solid var(--idx-line)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
      }}>
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

      {/* Store directory */}
      <section style={{ padding: '48px 56px 80px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 28,
        }}>
          <h2 style={{
            fontWeight: 500,
            letterSpacing: '-0.045em',
            fontSize: 48,
            margin: 0,
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            Browse by store
          </h2>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--idx-fg-dim)',
          }}>
            {stores.length} stores
          </div>
        </div>

        {stores.length === 0 ? (
          <div style={{
            padding: '80px 0',
            textAlign: 'center',
            color: 'var(--idx-fg-dim)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            borderTop: '1px solid var(--idx-line)',
          }}>
            NO STORES AVAILABLE · CHECK BACKEND CONNECTION
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '1px solid var(--idx-line-strong)',
            borderLeft: '1px solid var(--idx-line)',
          }}>
            {stores.map(s => (
              <StoreCell key={s.id} store={s} />
            ))}
          </div>
        )}
      </section>

      <IndexFooter />
    </main>
  );
}

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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}>
        <div style={{
          fontWeight: 500,
          letterSpacing: '-0.03em',
          fontSize: 20,
          fontFeatureSettings: '"ss01","cv11"',
        }}>
          {store.name}
        </div>
        <div style={{
          fontSize: 18,
          color: 'var(--idx-accent)',
          fontWeight: 600,
        }}>
          →
        </div>
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
