import Link from 'next/link';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="idx-footer-link" style={{ color: 'inherit', textDecoration: 'none' }}>
      {children}
    </Link>
  );
}

export default function IndexFooter() {
  return (
    <footer style={{
      padding: '32px 56px 56px',
      borderTop: '1px solid var(--idx-line)',
      fontSize: 12,
      color: 'var(--idx-fg-dim)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: 32,
    }}>
      <div>
        <div style={{
          fontWeight: 500,
          letterSpacing: '-0.045em',
          fontSize: 18,
          color: 'var(--idx-fg)',
          marginBottom: 12,
          fontFeatureSettings: '"ss01","cv11"',
        }}>
          BetterBeer
        </div>
        <div style={{ lineHeight: 1.6 }}>
          The independent index of every beer at every Systembolaget. Not affiliated with Systembolaget AB.
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--idx-fg-dim)',
          marginBottom: 12,
        }}>
          Browse
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.6 }}>
          <FooterLink href="/stores">All stores</FooterLink>
          <FooterLink href="/leaderboard">APK Index</FooterLink>
          <FooterLink href="/map">Store map</FooterLink>
          <FooterLink href="/compare">Compare beers</FooterLink>
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--idx-fg-dim)',
          marginBottom: 12,
        }}>
          About
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.6 }}>
          <FooterLink href="/about#apk">How APK works</FooterLink>
          <FooterLink href="/about#data">Where data comes from</FooterLink>
        </div>
      </div>

      <div style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 11,
        color: 'var(--idx-fg-faint)',
        textAlign: 'right',
        alignSelf: 'end',
      }}>
        BetterBeer · BETA
      </div>
    </footer>
  );
}
