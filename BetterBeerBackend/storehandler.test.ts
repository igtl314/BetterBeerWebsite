import { type Product, type Store, type StockInfo } from './types';

import { upsertProduct, upsertStore, setProductStock, getAllProducts } from './storehandler';
import { expect, test } from "bun:test"

const testProduct: Product = {
    id: 1,
    productName: "Test Product",
    productNameThin: "Test Product Thin",
    productCountry: "Test Country",
    productCategory: "Test Category",
    productInfo: "Test Info",
    productImageURL: "http://example.com/test.jpg",
    productVolume: 750,
    productPrice: 19.99,
    productAlcohol: 12,
    productApk: 0.5,
};
const testStore: Store = {
    id: 1,
    name: "Test Store",
};
const testStockInfo: StockInfo = {
    productId: 1,
    storeId: 1,
    stock: 100,
    location: "Test Location",
};


test("upsertStore", async () => {
    const store = await upsertStore(testStore);
    expect(store).toBeDefined();
    expect(store.name).toBe(testStore.name);
});

test("upsertProduct", async () => {
    const product = await upsertProduct(testProduct);
    expect(product).toBeDefined();
    expect(product.productName).toBe(testProduct.productName);
});

test("setProductStock", async () => {
    const stockInfo = await setProductStock(testStockInfo);
    expect(stockInfo).toBeDefined();
    expect(stockInfo.stock).toBe(testStockInfo.stock);
});
test("getAllProducts", async () => {
    const products = await getAllProducts();
    expect(products).toBeDefined();
    expect(products[0]?.productName).toBe(testProduct.productName);
});
