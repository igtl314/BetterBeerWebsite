import IndexFooter from "@/app/_compoments/IndexFooter";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import Link from "next/link";

export const metadata = {
  title: "About — BetterBeer",
  description: "How APK is calculated and where BetterBeer's data comes from.",
};

export default function AboutPage() {
  return (
    <main className="pb-[90px] sm:pb-0">
      <div className="sm:hidden"><MobileTopBar back="Home" backHref="/" /></div>

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
        <span style={{ color: 'var(--idx-fg)' }}>ABOUT</span>
      </div>

      {/* Header */}
      <section
        className="px-5 pt-4 pb-6 sm:px-14 sm:pt-10 sm:pb-10"
        style={{ borderBottom: '1px solid var(--idx-line)' }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        }}>
          BetterBeer · Independent project
        </div>
        <h1
          className="text-[40px] sm:text-[clamp(48px,5.5vw,84px)]"
          style={{
            fontWeight: 500, letterSpacing: '-0.045em',
            margin: '10px 0 0', lineHeight: 0.94,
            fontFeatureSettings: '"ss01","cv11"',
          }}
        >
          About the <span style={{ color: 'var(--idx-accent)' }}>index</span>
        </h1>
      </section>

      {/* How APK works */}
      <section
        id="apk"
        className="grid grid-cols-1 sm:grid-cols-[280px_1fr] px-5 py-8 gap-6 sm:px-14 sm:py-14 sm:gap-16"
        style={{ borderBottom: '1px solid var(--idx-line)', scrollMarginTop: 'var(--nav-height)' }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        }}>
          01 · How APK works
        </div>
        <div style={{ maxWidth: 640 }}>
          <h2 style={{
            fontWeight: 500, letterSpacing: '-0.03em', fontSize: 28,
            margin: 0, fontFeatureSettings: '"ss01","cv11"',
          }}>
            Alkohol per krona
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--idx-fg-dim)', marginTop: 14 }}>
            APK measures how much pure alcohol each krona buys. It is the only number on this
            site that lets a 3.5% folköl and a 12% imperial stout compete on equal terms.
          </p>
          <div style={{
            marginTop: 20, padding: '18px 20px',
            background: 'var(--idx-bg2)', border: '1px solid var(--idx-line)',
            fontFamily: 'var(--font-geist-mono)', fontSize: 13, lineHeight: 1.8,
          }}>
            APK = (alcohol % ÷ 100 × volume ml) ÷ price kr
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--idx-fg-dim)', marginTop: 18 }}>
            Example: a 500 ml can at 10.5% for 29,90 kr gives{' '}
            <span style={{ fontFamily: 'var(--font-geist-mono)', color: 'var(--idx-fg)' }}>
              (0.105 × 500) ÷ 29.90 = 1.76
            </span>
            {' '}ml of pure alcohol per krona. Higher is better value. Every list on BetterBeer
            can be sorted by it, and the{' '}
            <Link href="/leaderboard" style={{ color: 'var(--idx-accent)', textDecoration: 'none' }}>
              leaderboard
            </Link>{' '}
            ranks the entire catalogue by it.
          </p>
        </div>
      </section>

      {/* Where data comes from */}
      <section
        id="data"
        className="grid grid-cols-1 sm:grid-cols-[280px_1fr] px-5 py-8 gap-6 sm:px-14 sm:py-14 sm:gap-16"
        style={{ borderBottom: '1px solid var(--idx-line)', scrollMarginTop: 'var(--nav-height)' }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        }}>
          02 · Where data comes from
        </div>
        <div style={{ maxWidth: 640 }}>
          <h2 style={{
            fontWeight: 500, letterSpacing: '-0.03em', fontSize: 28,
            margin: 0, fontFeatureSettings: '"ss01","cv11"',
          }}>
            Straight from Systembolaget
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--idx-fg-dim)', marginTop: 14 }}>
            A collector fetches the beer catalogue — prices, alcohol content, volumes, and live
            shelf stock — from Systembolaget&apos;s public API every 12 hours, computes APK for every
            product, and stores it all in BetterBeer&apos;s own database. Signed-in users can also
            refresh the stock of a single beer on demand from any store page.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--idx-fg-dim)', marginTop: 14 }}>
            Prices and stock can change between collection runs, so treat numbers as a strong
            hint rather than a promise. Check the{' '}
            <Link href="/map" style={{ color: 'var(--idx-accent)', textDecoration: 'none' }}>
              store map
            </Link>{' '}
            for opening hours before you go.
          </p>
          <p style={{
            fontFamily: 'var(--font-geist-mono)', fontSize: 11, lineHeight: 1.7,
            color: 'var(--idx-fg-faint)', marginTop: 20,
          }}>
            BetterBeer is an independent project and is not affiliated with, endorsed by, or
            connected to Systembolaget AB. Drink responsibly.
          </p>
        </div>
      </section>

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}
