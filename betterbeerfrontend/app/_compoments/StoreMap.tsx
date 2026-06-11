'use client';

import dynamic from 'next/dynamic';
import { StoreLocation } from '@/types/store';

// Leaflet touches `window` at import time, so it can only load client-side.
const StoreMapInner = dynamic(() => import('./StoreMapInner'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--idx-bg2)',
      fontFamily: 'var(--font-geist-mono)', fontSize: 11,
      letterSpacing: '0.1em', color: 'var(--idx-fg-dim)',
    }}>
      LOADING MAP…
    </div>
  ),
});

export default function StoreMap({ stores }: { stores: StoreLocation[] }) {
  return <StoreMapInner stores={stores} />;
}
