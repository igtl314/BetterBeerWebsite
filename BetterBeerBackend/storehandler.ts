
import { PrismaClient } from './generated/prisma/client';
import { type Product, type Store, type StockInfo, type User } from './types';

const prisma = new PrismaClient();

// Product-related functions
/**
 * Get all products with optional filtering
 */
export async function getAllProducts({
    orderBy = 'productName',
    orderDirection = 'asc',
    country = '',
    minAlcohol = 0,
    maxAlcohol = 100,
}: {
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    country?: string;
    minAlcohol?: number;
    maxAlcohol?: number;
} = {}) {
    return prisma.product.findMany({
        where: {
            ...(country && { ProductCountry: country }),
            ...(minAlcohol && { ProductAlcohol: { gte: minAlcohol } }),
            ...(maxAlcohol && { ProductAlcohol: { lte: maxAlcohol } }),
        },
        orderBy: {
            [orderBy]: orderDirection,
        },
    });
}

/**
 * Get a single product by ID with stock information
 */
export async function getProductById(id: number) {
    return prisma.product.findUnique({
        where: { ID: id },
        include: {
            stockInfo: {
                include: {
                    store: true,
                },
            },
        },
    });
}


export async function upsertProduct(productData: Product) {
    return prisma.product.upsert({
        where: {
            ID: productData.ID
        },
        update: productData,
        create: productData,
    });
}

/**
 * Delete a product
 */
export async function deleteProduct(id: number) {
    return prisma.product.delete({
        where: { ID: id },
    });
}

/**
 * Search products by name
 */
export async function searchProducts(searchTerm: string) {
    return prisma.product.findMany({
        where: {
            OR: [
                { ProductName: { contains: searchTerm } },
                { ProductNameThin: { contains: searchTerm } },
            ],
        },
    });
}

// Store-related functions
/**
 * Get all stores with optional filtering
 */
export async function getAllStores({
    orderBy = 'name',
    orderDirection = 'asc',
} = {}) {
    return prisma.store.findMany({
        orderBy: {
            [orderBy]: orderDirection,
        },
    });
}

/**
 * Get a single store by ID with all of its products
 */
export async function getStoreById(id: number) {
    return prisma.store.findUnique({
        where: { id },
        include: {
            stockInfo: {
                include: {
                    product: true,
                },
            },
        },
    });
}

export async function upsertStore(storeData: Store) {
    return prisma.store.upsert({
        where: {
            id: storeData.id
        },
        update: storeData,
        create: storeData,
    });
}
/**
 * Delete a store
 */
export async function deleteStore(id: number) {
    return prisma.store.delete({
        where: { id },
    });
}

// StockInfo-related functions
/**
 * Add or update stock information for a product in a store
 */
export async function setProductStock(stockInfo: StockInfo) {
    return prisma.stockInfo.upsert({
        where: {
            StoreId_ProductId: {  // Using the unique constraint
                ProductId: stockInfo.ProductId,
                StoreId: stockInfo.StoreId,
            }
        },
        update: {
            Stock: stockInfo.Stock,
            Location: stockInfo.Location, // Assuming the property is correctly spelled in the actual data
        },
        create: {
            ProductId: stockInfo.ProductId,
            StoreId: stockInfo.StoreId,
            Stock: stockInfo.Stock,
            Location: stockInfo.Location,
        },
    });
}

/**
 * Get all products available in a specific store
 */
export async function getProductsByStore(storeId: number) {
    return prisma.stockInfo.findMany({
        where: {
            StoreId: storeId,
        },
        include: {
            product: true,
        },
    });
}

/**
 * Get all stores that have a specific product
 */
export async function getStoresByProduct(productId: number) {
    return prisma.stockInfo.findMany({
        where: {
            ProductId: productId,
        },
        include: {
            store: true,
        },
    });
}

/**
 * Find products that are in stock at a store
 */
export async function getProductsInStock(storeId: number) {
    return prisma.stockInfo.findMany({
        where: {
            StoreId: storeId,
            Stock: { gt: 0 },
        },
        include: {
            product: true,
        },
    });
}

// User-related functions
/**
 * Get user by ID with favorite products
 */
export async function getUserById(id: number) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            favorites: true,
        },
    });
}

/**
 * Create a new user
 */
export async function createUser(userData: User) {
    return prisma.user.create({
        data: userData,
    });
}

/**
 * Add a product to user's favorites
 */
export async function addToFavorites(userId: number, productId: number) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            favorites: {
                connect: { ID: productId },
            },
        },
    });
}

/**
 * Remove a product from user's favorites
 */
export async function removeFromFavorites(userId: number, productId: number) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            favorites: {
                disconnect: { ID: productId },
            },
        },
    });
}

/**
 * Get all favorite products for a user
 */
export async function getUserFavorites(userId: number) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            favorites: true,
        },
    });
}