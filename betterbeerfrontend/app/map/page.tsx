import { fetchStoreLocations } from "@/app/_actions/storeLocations";
import IndexFooter from "@/app/_compoments/IndexFooter";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import StoreMap from "@/app/_compoments/StoreMap";
import Link from "next/link";
import { StoreLocation } from "@/types/store";

export const metadata = {
  title: "Store map — BetterBeer",
  description: "Every indexed Systembolaget store on the map.",
};

export default async function MapPage() {
  let stores: StoreLocation[] = [];
  try {
    stores = await fetchStoreLocations();
  } catch {
    // show empty state below
  }

  const cities = new Set(stores.map(s => s.city).filter(Boolean));

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
        <span style={{ color: 'var(--idx-fg)' }}>MAP</span>
      </div>

      {/* Header — desktop */}
      <section
        className="hidden sm:grid"
        style={{
          padding: '40px 56px 32px',
          borderBottom: '1px solid var(--idx-line)',
          gridTemplateColumns: '1fr 400px', gap: 64, alignItems: 'end',
        }}
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
          }}>
            Systembolaget · Indexed stores
          </div>
          <h1 style={{
            fontWeight: 500, letterSpacing: '-0.045em',
            fontSize: 'clamp(48px, 5.5vw, 84px)', margin: '12px 0 0', lineHeight: 0.94,
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            Store <span style={{ color: 'var(--idx-accent)' }}>map</span>
          </h1>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1, background: 'var(--idx-line)', border: '1px solid var(--idx-line)',
        }}>
          <StatBox label="Stores" value={String(stores.length)} sub="on the map" />
          <StatBox label="Cities" value={String(cities.size)} sub="covered" />
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
          SYSTEMBOLAGET · INDEXED STORES
        </div>
        <h1 style={{
          fontSize: 40, margin: '8px 0 0', lineHeight: 0.96,
          fontWeight: 500, letterSpacing: '-0.03em',
          fontFeatureSettings: '"ss01","cv11"',
        }}>
          Store <span style={{ color: 'var(--idx-accent)' }}>map</span>
        </h1>
      </section>

      {stores.length === 0 ? (
        <div style={{
          padding: '120px 20px', textAlign: 'center', color: 'var(--idx-fg-dim)',
          fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
        }}>
          NO STORE LOCATIONS AVAILABLE · CHECK BACKEND
        </div>
      ) : (
        <>
          {/* Desktop: list panel + map side by side */}
          <section
            className="hidden sm:grid"
            style={{
              gridTemplateColumns: '380px 1fr',
              borderBottom: '1px solid var(--idx-line)',
              height: 'min(640px, 70vh)',
            }}
          >
            <div style={{ overflowY: 'auto', borderRight: '1px solid var(--idx-line)' }}>
              {stores.map(store => <StoreListRow key={store.id} store={store} />)}
            </div>
            <div style={{ position: 'relative' }}>
              <StoreMap stores={stores} />
            </div>
          </section>

          {/* Mobile: map on top, list below */}
          <section className="sm:hidden">
            <div style={{ height: '45vh', borderBottom: '1px solid var(--idx-line)' }}>
              <StoreMap stores={stores} />
            </div>
            <div>
              {stores.map(store => <StoreListRow key={store.id} store={store} />)}
            </div>
          </section>
        </>
      )}

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function StoreListRow({ store }: { store: StoreLocation }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="idx-store-cell"
      style={{
        display: 'block',
        padding: '16px 20px',
        borderBottom: '1px solid var(--idx-line)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' }}>
          {store.name}
        </div>
        <div style={{ fontSize: 14, color: 'var(--idx-accent)', fontWeight: 600 }}>→</div>
      </div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 10,
        color: 'var(--idx-fg-dim)', marginTop: 4, lineHeight: 1.5,
      }}>
        {store.address ? `${store.address} · ` : ''}{store.city ?? `Butik ${store.id}`}
      </div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 10,
        color: store.openToday ? 'var(--idx-fg-faint)' : 'var(--idx-accent)', marginTop: 2,
      }}>
        {store.openToday ? `Open today ${store.openToday}` : 'Closed today'}
      </div>
    </Link>
  );
}

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
