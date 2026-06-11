'use server';

import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type RefreshStockResult =
  | { ok: true }
  | { ok: false; error: string };

export async function refreshStock(
  storeId: number,
  productId: number,
): Promise<RefreshStockResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: 'Not signed in' };
  }

  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  let res: Response;
  try {
    res = await fetch(`${process.env.BACKEND_URL}/stock/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ StoreId: storeId, ProductId: productId }),
      cache: 'no-store',
    });
  } catch {
    return { ok: false, error: 'Backend unreachable' };
  }

  if (!res.ok) {
    return { ok: false, error: `Backend error ${res.status}` };
  }

  revalidatePath(`/stores/${storeId}`);
  revalidatePath(`/beers/${productId}`);
  return { ok: true };
}
