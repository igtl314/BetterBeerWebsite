import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { PrismaClient } from "./generated/prisma/client";
import {
    addToFavorites,
    createUser,
    deleteProduct,
    deleteStore,
    getProductById,
    getStoreById,
    getUserFavorites,
    removeFromFavorites,
    setProductStock,
    upsertProduct,
    upsertStore,
    upsertUser,
} from "./storehandler";
import type { Product, StockInfo, Store } from "./types";

const prisma = new PrismaClient();

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
    ID: 1,
    ProductName: "Test Beer",
    ProductNameThin: "Test Thin",
    ProductCountry: "Sweden",
    ProductCategory: "Öl",
    ProductInfo: "Info",
    ProductImageURL: "http://example.com/1.webp",
    ProductVolume: 330,
    ProductPrice: 25,
    ProductAlcohol: 5.2,
    ProductApk: 0.69,
    ...overrides,
});

const makeStore = (overrides: Partial<Store> = {}): Store => ({
    id: 525,
    name: "Bromma",
    ...overrides,
});

const makeStock = (overrides: Partial<StockInfo> = {}): StockInfo => ({
    StoreId: 525,
    ProductId: 1,
    Stock: 10,
    Location: "A1",
    ...overrides,
});

beforeEach(async () => {
    await prisma.stockInfo.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.store.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("upsertStore", () => {
    test("creates a new store", async () => {
        const store = await upsertStore(makeStore());
        expect(store.id).toBe(525);
        expect(store.name).toBe("Bromma");
    });

    test("updates an existing store's name", async () => {
        await upsertStore(makeStore({ name: "Old" }));
        const updated = await upsertStore(makeStore({ name: "New" }));
        expect(updated.id).toBe(525);
        expect(updated.name).toBe("New");
    });
});

describe("deleteStore", () => {
    test("removes the store", async () => {
        await upsertStore(makeStore());
        await deleteStore(525);
        expect(await getStoreById(525)).toBeNull();
    });
});

describe("upsertProduct", () => {
    test("creates a new product", async () => {
        const product = await upsertProduct(makeProduct());
        expect(product.ID).toBe(1);
        expect(product.ProductName).toBe("Test Beer");
        expect(product.ProductPrice).toBe(25);
    });

    test("updates an existing product's fields", async () => {
        await upsertProduct(makeProduct({ ProductPrice: 25 }));
        const updated = await upsertProduct(
            makeProduct({ ProductPrice: 30, ProductApk: 0.83 })
        );
        expect(updated.ProductPrice).toBe(30);
        expect(updated.ProductApk).toBe(0.83);
    });
});

describe("deleteProduct", () => {
    test("removes the product", async () => {
        await upsertProduct(makeProduct());
        await deleteProduct(1);
        expect(await getProductById(1)).toBeNull();
    });

    test("cascades to dependent stock rows", async () => {
        await upsertStore(makeStore());
        await upsertProduct(makeProduct());
        await setProductStock(makeStock());
        await deleteProduct(1);
        const stockRows = await prisma.stockInfo.findMany({ where: { ProductId: 1 } });
        expect(stockRows).toHaveLength(0);
    });
});

describe("setProductStock", () => {
    test("creates a new stock row", async () => {
        await upsertStore(makeStore());
        await upsertProduct(makeProduct());
        const stock = await setProductStock(makeStock());
        expect(stock.Stock).toBe(10);
        expect(stock.Location).toBe("A1");
    });

    test("updates Stock and Location for an existing (Store, Product) pair", async () => {
        await upsertStore(makeStore());
        await upsertProduct(makeProduct());
        await setProductStock(makeStock({ Stock: 10, Location: "A1" }));
        const updated = await setProductStock(makeStock({ Stock: 50, Location: "B2" }));
        expect(updated.Stock).toBe(50);
        expect(updated.Location).toBe("B2");

        const rows = await prisma.stockInfo.findMany({
            where: { StoreId: 525, ProductId: 1 },
        });
        expect(rows).toHaveLength(1);
    });
});

describe("createUser", () => {
    test("creates a user with the given email and name", async () => {
        const user = await createUser({ email: "alice@example.com", name: "Alice" });
        expect(user.email).toBe("alice@example.com");
        expect(user.name).toBe("Alice");
        expect(user.id).toBeGreaterThan(0);
    });
});

describe("upsertUser", () => {
    test("creates a user when the email is new", async () => {
        const user = await upsertUser("new@example.com", "New");
        expect(user.email).toBe("new@example.com");
        expect(user.name).toBe("New");
    });

    test("updates the name when the email already exists", async () => {
        await createUser({ email: "x@example.com", name: "Old" });
        const updated = await upsertUser("x@example.com", "Renamed");
        expect(updated.name).toBe("Renamed");

        const all = await prisma.user.findMany({ where: { email: "x@example.com" } });
        expect(all).toHaveLength(1);
    });
});

describe("addToFavorites", () => {
    test("links a product to the user's favorites", async () => {
        const user = await createUser({ email: "fav@example.com", name: "Fav" });
        await upsertProduct(makeProduct());
        await addToFavorites(user.id, 1);

        const favs = await getUserFavorites(user.id);
        expect(favs?.favorites).toHaveLength(1);
        expect(favs?.favorites[0]?.ID).toBe(1);
    });
});

describe("removeFromFavorites", () => {
    test("unlinks a product from the user's favorites", async () => {
        const user = await createUser({ email: "fav@example.com", name: "Fav" });
        await upsertProduct(makeProduct());
        await addToFavorites(user.id, 1);
        await removeFromFavorites(user.id, 1);

        const favs = await getUserFavorites(user.id);
        expect(favs?.favorites).toHaveLength(0);
    });
});
