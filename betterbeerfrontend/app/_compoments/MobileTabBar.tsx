'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function HomeIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 9l7-6 7 6v8h-5v-5H8v5H3V9z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function StoresIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="3" stroke={color} strokeWidth="1.5" />
      <path d="M3 6h14l-1 11H4L3 6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 6v4M13 6v4" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function APKIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 16h3V8H3v8zm5 0h3V4H8v12zm5 0h3v-5h-3v5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function MapIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5l5-2 4 2 5-2v12l-5 2-4-2-5 2V5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 3v14M12 5v14" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function MeIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M4 17c0-3 3-5 6-5s6 2 6 5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

const TABS = [
  { id: 'home',   label: 'Home',   href: '/',        Icon: HomeIcon },
  { id: 'stores', label: 'Stores', href: '/stores',   Icon: StoresIcon },
  { id: 'apk',    label: 'APK',    href: '/leaderboard', Icon: APKIcon },
  { id: 'map',    label: 'Map',    href: '/map',      Icon: MapIcon },
  { id: 'me',     label: 'Me',     href: '/profile',  Icon: MeIcon },
] as const;

export default function MobileTabBar() {
  const pathname = usePathname();

  const active =
    pathname === '/' ? 'home' :
    pathname.startsWith('/stores') ? 'stores' :
    pathname.startsWith('/leaderboard') ? 'apk' :
    pathname.startsWith('/map') ? 'map' :
    (pathname.startsWith('/profile') || pathname.startsWith('/login')) ? 'me' : '';

  return (
    <div
      className="sm:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--idx-bg)',
        borderTop: '1px solid var(--idx-line)',
        paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '6px 0' }}>
        {TABS.map(({ id, label, href, Icon }) => {
          const on = id === active;
          const color = on ? 'var(--idx-fg)' : 'var(--idx-fg-faint)';
          return (
            <Link
              key={id}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 0',
                textDecoration: 'none',
                position: 'relative',
              }}
            >
              {on && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  width: 24,
                  height: 2,
                  background: 'var(--idx-accent)',
                }} />
              )}
              <Icon color={color} />
              <span style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 9,
                color,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
