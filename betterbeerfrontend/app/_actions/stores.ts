'use server';

import { Store, StoreWithStockInfo } from "@/types/store";

export async function fetchStores(): Promise<Store[]> {
  try {
    const response = await fetch(process.env.BACKEND_URL + '/stores', {
      cache: 'no-store' // Disable caching to always get fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stores');
    }
    
    const data = await response.json();
    console.info('Stores fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw new Error('Failed to fetch stores');
  }
}

export async function fetchStoreById(id: string): Promise<StoreWithStockInfo> {
  const response = await fetch(process.env.BACKEND_URL + `/stores/${id}`);
  if (response.status === 404) throw new Error('store not found 404');
  if (!response.ok) throw new Error(`backend error ${response.status}`);
  const data: StoreWithStockInfo = await response.json();
  data.stockInfo = data.stockInfo.map(item => ({
    ...item,
    product: {
      ...item.product,
      ProductImageURL: item.product.ProductImageURL && item.product.ProductImageURL !== 'no_image.webp'
        ? `/api/images/${item.product.ProductImageURL}`
        : '',
    },
  }));
  return data;
}