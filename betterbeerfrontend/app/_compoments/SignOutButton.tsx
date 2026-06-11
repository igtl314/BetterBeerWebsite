'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      style={{
        padding: '10px 18px',
        background: 'transparent',
        color: 'var(--idx-accent)',
        border: '1px solid var(--idx-accent)',
        fontSize: 12,
        fontFamily: 'var(--font-geist-mono)',
        letterSpacing: '0.06em',
        cursor: 'pointer',
      }}
    >
      SIGN OUT
    </button>
  );
}
