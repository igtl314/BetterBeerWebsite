const SUB_KEY = 'cfc702aed3094c86b92d6d4ff7a54c84';

const SHARED_HEADERS = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en,en-US;q=0.9,sv-SE;q=0.8,sv;q=0.7,en-GB;q=0.6',
    'Ocp-Apim-Subscription-Key': SUB_KEY,
    'Origin': 'https://www.systembolaget.se',
    'Referer': 'https://www.systembolaget.se/',
};

export async function fetchSystembolagetStock(storeId: number, productId: number) {
    const storeIdPadded = String(storeId).padStart(4, '0');
    const url = `https://api-systembolaget.azure-api.net/sb-api-ecommerce/v1/stockbalance/store/${storeIdPadded}/${productId}`;
    const res = await fetch(url, { headers: SHARED_HEADERS });
    if (!res.ok) {
        throw new Error(`Systembolaget stockbalance ${res.status}`);
    }
    const data = (await res.json()) as { stock?: number; shelf?: string };
    return {
        stock: data.stock ?? 0,
        shelf: (data.shelf ?? '-').slice(0, 5),
    };
}
