import { auth } from "@/auth";
import { fetchCurrentUser } from "@/app/_actions/user";
import IndexFooter from "@/app/_compoments/IndexFooter";
import BottleSvg from "@/app/_compoments/BottleSvg";
import MobileTopBar from "@/app/_compoments/MobileTopBar";
import SignOutButton from "@/app/_compoments/SignOutButton";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Beer } from "@/types/beer";

export const metadata = {
  title: "Profile — BetterBeer",
};

function initials(name: string): string {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const displayName = session.user.name ?? session.user.email ?? 'You';
  const backendUser = await fetchCurrentUser();
  const favorites = backendUser?.favorites ?? [];
  const memberSince = backendUser?.createdAt
    ? new Date(backendUser.createdAt).toLocaleDateString('sv-SE')
    : null;

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
        <span style={{ color: 'var(--idx-fg)' }}>PROFILE</span>
      </div>

      {/* Header */}
      <section
        className="px-5 pt-4 pb-6 sm:px-14 sm:pt-10 sm:pb-8"
        style={{ borderBottom: '1px solid var(--idx-line)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 64, height: 64, flexShrink: 0,
            background: 'var(--idx-fg)', color: 'var(--idx-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontFamily: 'var(--font-geist-mono)',
          }}>
            {initials(displayName)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
            }}>
              Account
            </div>
            <h1
              className="text-[32px] sm:text-[48px]"
              style={{
                fontWeight: 500, letterSpacing: '-0.04em',
                margin: '4px 0 0', lineHeight: 1,
                fontFeatureSettings: '"ss01","cv11"',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </h1>
          </div>
        </div>
      </section>

      {/* Account details */}
      <section className="px-5 py-6 sm:px-14 sm:py-8" style={{ borderBottom: '1px solid var(--idx-line)' }}>
        <SectionLabel>Details</SectionLabel>
        <div style={{ maxWidth: 560 }}>
          <DetailRow label="Name" value={session.user.name ?? '—'} />
          <DetailRow label="Email" value={session.user.email ?? '—'} />
          <DetailRow label="Member since" value={memberSince ?? '—'} />
          <DetailRow label="Favorites" value={String(favorites.length)} />
        </div>
        <div style={{ marginTop: 24 }}>
          <SignOutButton />
        </div>
      </section>

      {/* Favorites */}
      <section className="px-5 py-6 pb-10 sm:px-14 sm:py-8 sm:pb-16">
        <SectionLabel>Favorites</SectionLabel>
        {favorites.length === 0 ? (
          <div style={{
            padding: '32px 20px',
            border: '1px dashed var(--idx-line-strong)',
            textAlign: 'center',
            fontFamily: 'var(--font-geist-mono)', fontSize: 11,
            letterSpacing: '0.08em', color: 'var(--idx-fg-dim)', lineHeight: 2,
          }}>
            NO FAVORITES YET
            <br />
            <Link href="/leaderboard" style={{ color: 'var(--idx-accent)', textDecoration: 'none' }}>
              BROWSE THE APK LEADERBOARD →
            </Link>
          </div>
        ) : (
          <div>
            {favorites.map(beer => <FavoriteRow key={beer.ID} beer={beer} />)}
          </div>
        )}
      </section>

      <div className="hidden sm:block"><IndexFooter /></div>
    </main>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-geist-mono)',
      fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--idx-fg-dim)', marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 16,
      padding: '12px 0', borderBottom: '1px solid var(--idx-line)',
    }}>
      <span style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 11,
        letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--idx-fg-dim)',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 14,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
    </div>
  );
}

function FavoriteRow({ beer }: { beer: Beer }) {
  const apk = beer.ProductApk ?? 0;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '44px 1fr 72px',
      gap: 12, alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid var(--idx-line)',
    }}>
      {beer.ProductImageURL ? (
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
          {beer.ProductVolume} ml · {beer.ProductAlcohol.toFixed(1)}% · {beer.ProductPrice.toFixed(2).replace('.', ',')} kr
        </div>
      </div>
      <div style={{
        textAlign: 'right',
        fontFamily: 'var(--font-geist-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 15, fontWeight: 600,
        color: apk > 0 ? 'var(--idx-accent)' : 'var(--idx-fg-faint)',
      }}>
        {apk > 0 ? apk.toFixed(2) : '—'}
      </div>
    </div>
  );
}
