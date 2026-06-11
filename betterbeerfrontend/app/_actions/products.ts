'use server';

import { Beer, BeerWithStores } from "@/types/beer";

function proxyImage(product: Beer): Beer {
  return {
    ...product,
    ProductImageURL: product.ProductImageURL && product.ProductImageURL !== 'no_image.webp'
      ? `/api/images/${product.ProductImageURL}`
      : '',
  };
}

export async function fetchTopProducts(limit = 100): Promise<Beer[]> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/products?orderBy=ProductApk&direction=desc&limit=${limit}`,
    { cache: 'no-store' },
  );
  if (!response.ok) throw new Error(`backend error ${response.status}`);
  const data: Beer[] = await response.json();
  return data.map(proxyImage);
}

export async function searchProducts(term: string): Promise<Beer[]> {
  const trimmed = term.trim();
  if (!trimmed) return [];
  const response = await fetch(
    `${process.env.BACKEND_URL}/products?search=${encodeURIComponent(trimmed)}&limit=12`,
    { cache: 'no-store' },
  );
  if (!response.ok) throw new Error(`backend error ${response.status}`);
  const data: Beer[] = await response.json();
  return data.map(proxyImage);
}

export async function fetchProductById(id: number): Promise<BeerWithStores | null> {
  const response = await fetch(`${process.env.BACKEND_URL}/products/${id}`, {
    cache: 'no-store',
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`backend error ${response.status}`);
  const data: BeerWithStores = await response.json();
  return { ...data, ...proxyImage(data) };
}
