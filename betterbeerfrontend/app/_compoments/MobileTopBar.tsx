import Link from 'next/link';
import { ReactNode } from 'react';
import GlobalSearch from './GlobalSearch';

interface MobileTopBarProps {
  back?: string;
  backHref?: string;
  right?: ReactNode;
}

export default function MobileTopBar({ back, backHref = '/', right }: MobileTopBarProps) {
  return (
    <div style={{
      paddingTop: 54,
      background: 'var(--idx-bg)',
      borderBottom: '1px solid var(--idx-line)',
    }}>
      <div style={{
        padding: '10px 16px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {back ? (
          <Link href={backHref} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'var(--idx-fg)', textDecoration: 'none',
          }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M10 2 2 10l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 11, letterSpacing: '0.08em',
              color: 'var(--idx-fg-dim)', textTransform: 'uppercase',
            }}>{back}</span>
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Link href="/" style={{
              fontWeight: 500, fontSize: 18, letterSpacing: '-0.025em',
              color: 'var(--idx-fg)', textDecoration: 'none',
            }}>BetterBeer</Link>
            <span style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 9, color: 'var(--idx-fg-faint)',
              padding: '1px 5px', border: '1px solid var(--idx-line)',
            }}>BETA</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {right ?? (
            <>
              <GlobalSearch variant="icon" />
              <Link href="/profile" style={{
                width: 32, height: 32,
                background: 'var(--idx-fg)', color: 'var(--idx-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontFamily: 'var(--font-geist-mono)',
                textDecoration: 'none',
              }}>ME</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
