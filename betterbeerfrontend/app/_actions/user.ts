'use server';

import { cookies } from 'next/headers';
import { Beer } from '@/types/beer';

export type CurrentUser = {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  favorites: Beer[];
};

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const user: CurrentUser = await res.json();
    return {
      ...user,
      favorites: (user.favorites ?? []).map(beer => ({
        ...beer,
        ProductImageURL: beer.ProductImageURL && beer.ProductImageURL !== 'no_image.webp'
          ? `/api/images/${beer.ProductImageURL}`
          : '',
      })),
    };
  } catch {
    return null;
  }
}
