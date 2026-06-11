'use server';

import { StoreLocation } from "@/types/store";
import { fetchStores } from "./stores";

// Same public subscription key the Go collector and backend use against Systembolaget.
const SUB_KEY = 'cfc702aed3094c86b92d6d4ff7a54c84';

const SB_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Ocp-Apim-Subscription-Key': SUB_KEY,
  'Origin': 'https://www.systembolaget.se',
  'Referer': 'https://www.systembolaget.se/',
};

type SiteSearchStore = {
  siteId: string;
  alias: string | null;
  displayName: string | null;
  streetAddress: string | null;
  city: string | null;
  position: { latitude: number; longitude: number } | null;
  openingHours: { date: string; openFrom: string | null; openTo: string | null }[] | null;
};

function todayHours(hours: SiteSearchStore['openingHours']): string | null {
  if (!hours || hours.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  const entry = hours.find(h => h.date.slice(0, 10) === today) ?? hours[0];
  if (!entry.openFrom || !entry.openTo) return null;
  return `${entry.openFrom.slice(0, 5)}–${entry.openTo.slice(0, 5)}`;
}

async function lookupStore(id: number, name: string): Promise<StoreLocation | null> {
  try {
    const url = `https://api-extern.systembolaget.se/sb-api-ecommerce/v1/sitesearch/store?q=${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      headers: SB_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { storeSearchResults?: SiteSearchStore[] };
    const results = data.storeSearchResults ?? [];
    const padded = String(id).padStart(4, '0');
    const match = results.find(r => r.siteId === padded) ?? results[0];
    if (!match?.position) return null;
    return {
      id,
      name,
      address: match.streetAddress,
      city: match.city,
      latitude: match.position.latitude,
      longitude: match.position.longitude,
      openToday: todayHours(match.openingHours),
    };
  } catch {
    return null;
  }
}

export async function fetchStoreLocations(): Promise<StoreLocation[]> {
  const stores = await fetchStores();
  const located = await Promise.all(stores.map(s => lookupStore(s.id, s.name)));
  return located.filter((s): s is StoreLocation => s !== null);
}
