import { Store } from "@/types/store";
import { fetchStores } from "@/app/_actions/stores";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import IndexFooter from "@/app/_compoments/IndexFooter";
import Link from "next/link";

export default async function StoresPage() {
  let stores: Store[] = [];
  try {
    stores = await fetchStores();
  } catch {
    /* empty state below */
  }

  return (
    <main>
      {/* ── Desktop layout ──────────────────────────────── */}
      <div className="desk-only">
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
          {' / STORES'}
        </div>

        {/* Hero */}
        <section style={{ padding: '40px 56px 32px', borderBottom: '1px solid var(--idx-line)' }}>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
          }}>
            SYSTEMBOLAGET · DIRECTORY
          </div>
          <h1 style={{
            fontWeight: 500, letterSpacing: '-0.045em',
            fontSize: 'clamp(48px, 5.5vw, 84px)', margin: '12px 0 0', lineHeight: 0.94,
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            All <span style={{ color: 'var(--idx-accent)' }}>{stores.length}</span> stores.
          </h1>
        </section>

        {/* Store grid */}
        <section style={{ padding: '48px 56px 80px' }}>
          {stores.length === 0 ? (
            <div style={{
              padding: '80px 0', textAlign: 'center', color: 'var(--idx-fg-dim)',
              fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
              borderTop: '1px solid var(--idx-line)',
            }}>
              NO STORES AVAILABLE · CHECK BACKEND CONNECTION
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              borderTop: '1px solid var(--idx-line-strong)', borderLeft: '1px solid var(--idx-line)',
            }}>
              {stores.map(s => <DesktopStoreCell key={s.id} store={s} />)}
            </div>
          )}
        </section>

        <IndexFooter />
      </div>

      {/* ── Mobile layout ───────────────────────────────── */}
      <div className="mob-only mob-page">
        <MobileTopBar />

        {/* Title */}
        <section style={{ padding: '8px 20px 16px', borderBottom: '1px solid var(--idx-line)' }}>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
          }}>SYSTEMBOLAGET · DIRECTORY</div>
          <h1 style={{
            fontSize: 38, margin: '8px 0 0', lineHeight: 0.96,
            fontWeight: 500, letterSpacing: '-0.03em',
            fontFeatureSettings: '"ss01","cv11"',
          }}>
            All{' '}
            <span style={{ color: 'var(--idx-accent)' }}>{stores.length || '—'}</span>
            <br />stores.
          </h1>
        </section>

        {/* Search (visual) */}
        <section style={{ padding: '14px 20px', borderBottom: '1px solid var(--idx-line)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            border: '1px solid var(--idx-line)',
            fontSize: 13, color: 'var(--idx-fg-dim)',
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" />
              <path d="M9 9 12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
            </svg>
            <span style={{ flex: 1, fontFamily: 'var(--font-geist-mono)', fontSize: 12, letterSpacing: '0.02em' }}>
              Search stores…
            </span>
          </div>
        </section>

        {/* Store rows */}
        <section style={{ padding: '0 20px' }}>
          {stores.length === 0 ? (
            <div style={{
              padding: '48px 0', textAlign: 'center',
              fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--idx-fg-dim)',
            }}>NO STORES · CHECK BACKEND</div>
          ) : (
            stores.map((s, i) => (
              <Link
                key={s.id}
                href={`/stores/${s.id}`}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 70px',
                  gap: 14, alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i < stores.length - 1 ? '1px solid var(--idx-line)' : 'none',
                  textDecoration: 'none', color: 'inherit',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{s.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 10, color: 'var(--idx-fg-faint)', marginTop: 3,
                  }}>Butik {s.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="var(--idx-fg-dim)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function DesktopStoreCell({ store }: { store: Store }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="idx-store-cell"
      style={{
        padding: '20px 22px',
        borderBottom: '1px solid var(--idx-line)',
        borderRight: '1px solid var(--idx-line)',
        display: 'flex', flexDirection: 'column', gap: 8,
        textDecoration: 'none', color: 'inherit', transition: 'background 0.1s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{
          fontWeight: 500, letterSpacing: '-0.03em', fontSize: 20,
          fontFeatureSettings: '"ss01","cv11"',
        }}>{store.name}</div>
        <div style={{ fontSize: 18, color: 'var(--idx-accent)', fontWeight: 600 }}>→</div>
      </div>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 11,
        color: 'var(--idx-fg-faint)', letterSpacing: '0.02em',
      }}>
        Store #{store.id}
      </div>
    </Link>
  );
}
