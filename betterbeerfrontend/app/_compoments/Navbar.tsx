'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlobalSearch from './GlobalSearch';

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
}

const NAV_ITEMS = [
  { label: 'Browse', href: '/' },
  { label: 'Stores', href: '/stores' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Map', href: '/map' },
  { label: 'Compare', href: '/compare' },
];

function initials(name: string): string {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function Navbar({ isLoggedIn = false, userName }: NavbarProps) {
  const pathname = usePathname();

  const active =
    pathname === '/' ? 'Browse' :
    pathname.startsWith('/stores') ? 'Stores' :
    pathname.startsWith('/leaderboard') ? 'Leaderboard' :
    pathname.startsWith('/map') ? 'Map' :
    pathname.startsWith('/compare') ? 'Compare' : '';

  return (
    <header style={{
      borderBottom: '1px solid var(--idx-line)',
      background: 'var(--idx-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Utility row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 56px',
        borderBottom: '1px solid var(--idx-line)',
        fontSize: 11,
        fontFamily: 'var(--font-geist-mono)',
        color: 'var(--idx-fg-dim)',
        letterSpacing: '0.04em',
      }}>
        <span>SE · ENGLISH · SYSTEMBOLAGET DATA</span>
        <span>HJÄLP · FEEDBACK · INSTÄLLNINGAR</span>
      </div>

      {/* Main nav row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 56px',
      }}>
        {/* Left: logo + nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <Link href="/" style={{
              fontWeight: 500,
              letterSpacing: '-0.045em',
              fontSize: 24,
              color: 'var(--idx-fg)',
              textDecoration: 'none',
              fontFeatureSettings: '"ss01","cv11"',
            }}>
              BetterBeer
            </Link>
            <span style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 10,
              color: 'var(--idx-fg-faint)',
              padding: '2px 6px',
              border: '1px solid var(--idx-line)',
            }}>
              BETA
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 4, fontSize: 13 }}>
            {NAV_ITEMS.map(({ label, href }) => {
              const isActive = label === active;
              return (
                <Link key={label} href={href} className="idx-nav-link" style={{
                  padding: '7px 13px',
                  background: isActive ? 'var(--idx-fg)' : 'transparent',
                  color: isActive ? 'var(--idx-bg)' : 'var(--idx-fg-dim)',
                  textDecoration: 'none',
                  display: 'block',
                }}>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: search + account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GlobalSearch variant="box" />

          {isLoggedIn && userName ? (
            <Link href="/profile" style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--idx-fg)',
              color: 'var(--idx-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontFamily: 'var(--font-geist-mono)',
              textDecoration: 'none',
              flexShrink: 0,
            }}>
              {initials(userName)}
            </Link>
          ) : (
            <Link href="/login" style={{
              padding: '8px 16px',
              background: 'var(--idx-fg)',
              color: 'var(--idx-bg)',
              fontSize: 12,
              fontFamily: 'var(--font-geist-mono)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}>
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
