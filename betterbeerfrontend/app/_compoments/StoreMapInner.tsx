'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { StoreLocation } from '@/types/store';

const markerIcon = L.divIcon({
  className: 'idx-marker',
  html: '<div style="width:16px;height:16px;background:#c14a2c;border:2px solid #f6f4ef;box-shadow:0 0 0 1px rgba(22,20,14,0.25)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function StoreMapInner({ stores }: { stores: StoreLocation[] }) {
  const center: [number, number] = stores.length > 0
    ? [
        stores.reduce((s, st) => s + st.latitude, 0) / stores.length,
        stores.reduce((s, st) => s + st.longitude, 0) / stores.length,
      ]
    : [62.0, 15.0]; // middle of Sweden

  const bounds = stores.length > 1
    ? L.latLngBounds(stores.map(s => [s.latitude, s.longitude] as [number, number])).pad(0.25)
    : undefined;

  return (
    <MapContainer
      {...(bounds ? { bounds } : { center, zoom: stores.length === 1 ? 13 : 5 })}
      style={{ width: '100%', height: '100%', background: 'var(--idx-bg2)' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {stores.map(store => (
        <Marker key={store.id} position={[store.latitude, store.longitude]} icon={markerIcon}>
          <Popup>
            <div style={{ fontFamily: 'var(--font-geist-sans)', minWidth: 180 }}>
              <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.02em' }}>
                {store.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-geist-mono)', fontSize: 10,
                color: 'var(--idx-fg-dim)', marginTop: 4, lineHeight: 1.5,
              }}>
                {store.address ? `${store.address} · ` : ''}{store.city ?? ''}
                {store.openToday && <><br />Open today {store.openToday}</>}
              </div>
              <Link href={`/stores/${store.id}`} style={{
                display: 'inline-block', marginTop: 8, padding: '5px 10px',
                background: 'var(--idx-fg)', color: 'var(--idx-bg)',
                fontFamily: 'var(--font-geist-mono)', fontSize: 10,
                letterSpacing: '0.08em', textDecoration: 'none',
              }}>
                VIEW CATALOGUE →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
