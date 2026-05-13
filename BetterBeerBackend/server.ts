import { Elysia, t } from 'elysia';
import {
    getAllStores,
    getStoreById,
    upsertStore,
    deleteStore,
    getProductsInStock,
    getProductById,
    upsertProduct,
    deleteProduct,
    setProductStock,
    createUser,
    getUserById,
    getUserFavorites,
    addToFavorites,
    removeFromFavorites,
    upsertUser
} from './storehandler';

import { type Product, type StockInfo } from './types';

// Initialize Prisma client

// Create Elysia app
const app = new Elysia()
    .get('/', () => {
        return new Response('Welcome to the Product API', { status: 200 });
    })

    .group('/stores', app => app
        // Get all stores
        .get('/', async () => {
            try {
                const stores = await getAllStores();
                return new Response(JSON.stringify(stores), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Internal server error', { status: 500 });
            }
        })
        // Get a specific store with its products
        .get('/:storeId', async ({ params: { storeId } }: { params: { storeId: string } }) => {
            try {
                const store = await getStoreById(Number(storeId));
                if (!store) {
                    return new Response('Store not found', { status: 404 });
                }
                return new Response(JSON.stringify(store), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Internal server error', { status: 500 });
            }
        }, {
            params: t.Object({
                storeId: t.String()
            })
        })
        // Create or update a store
        .post('/', async ({ body }) => {
            try {
                const store = await upsertStore(body);
                return new Response(JSON.stringify(store), { 
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error("Error upserting store:", error);
                return new Response('Failed to create/update store', { status: 400 });
            }
        }, {
            body: t.Object({
                id: t.Number(),
                name: t.String(),

                // Add other store fields as needed
            })
        })

        // Delete a store
        .delete('/:storeId', async ({ params: { storeId } }: { params: { storeId: string } }) => {
            try {
                const result = await deleteStore(Number(storeId));
                return new Response(JSON.stringify(result), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Failed to delete store', { status: 500 });
            }
        }, {
            params: t.Object({
                storeId: t.String()
            })
        })

        // Get products in stock at a specific store
        .get('/:storeId/products/in-stock', async ({ params: { storeId } }: { params: { storeId: string } }) => {
            try {
                const products = await getProductsInStock(Number(storeId));
                return new Response(JSON.stringify(products), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Internal server error', { status: 500 });
            }
        }, {
            params: t.Object({
                storeId: t.String()
            })
        })
    )

    // Product routes
    .group('/products', app => app
        // Get all products by category
        // Get specific product by ID with stock information
        .get('/:id', async ({ params }) => {
            try {
                const product = await getProductById(Number(params.id));
                if (!product) {
                    return new Response('Product not found', { status: 404 });
                }
                return new Response(JSON.stringify(product), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Internal server error', { status: 500 });
            }
        }, {
            params: t.Object({
                id: t.String()
            })
        })

        // Create or update a product
        .post('/', async ({ body }: { body: Product }) => {
            try {
                const product = await upsertProduct(body);
                return new Response(JSON.stringify(product), { 
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error("Error upserting product:", error);
                return new Response('Failed to create/update product', { status: 400 });
            }
        }, {
            body: t.Object({
                ID: t.Number(),
                ProductName: t.String(),
                ProductNameThin: t.Optional(t.String()),
                ProductCountry: t.String(),
                ProductCategory: t.String(),
                ProductInfo: t.String(),
                ProductImageURL: t.String(),
                ProductVolume: t.Number(),
                ProductPrice: t.Number(),
                ProductAlcohol: t.Number(),
                ProductApk: t.Optional(t.Number()),


                // Add other product fields as needed
            })
        })

        // Delete a product
        .delete('/:id', async ({ params }) => {
            try {
                const result = await deleteProduct(Number(params.id));
                return new Response(JSON.stringify(result), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Failed to delete product', { status: 500 });
            }
        }, {
            params: t.Object({
                id: t.String()
            })
        })
    )
    .group('/stock', app => app
        // Upsert stock for a product in a store
        .post('/', async ({ body }: { body: StockInfo }) => {
            try {
                const stockInfo = await setProductStock(body);
                return new Response(JSON.stringify(stockInfo), { 
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Failed to update stock information', { status: 400 });
            }
        }, {
            body: t.Object({
                StoreId: t.Number(),
                ProductId: t.Number(),
                Stock: t.Number(),
                Location: t.Optional(t.String())
            })
        })
    )
    // User routes
    .group('/users', app => app
        // Get user by ID
        .get('/:id', async ({ params }) => {
            try {
                const user = await getUserById(Number(params.id));
                if (!user) {
                    return new Response('User not found', { status: 404 });
                }
                return new Response(JSON.stringify(user), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Internal server error', { status: 500 });
            }
        }, {
            params: t.Object({
                id: t.String()
            })
        })

        // Create a new user
        .post('/', async ({ body }) => {
            try {
                const user = await createUser(body);
                return new Response(JSON.stringify(user), { 
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Failed to create user', { status: 400 });
            }
        }, {
            body: t.Object({
                name: t.String(),
                email: t.String(),
                // Add other user fields as needed
            })
        })

        // Get user's favorite products
        .get('/:id/favorites', async ({ params }) => {
            try {
                const favorites = await getUserFavorites(Number(params.id));
                if (!favorites) {
                    return new Response('User not found', { status: 404 });
                }
                return new Response(JSON.stringify(favorites), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Internal server error', { status: 500 });
            }
        }, {
            params: t.Object({
                id: t.String()
            })
        })

        // Add product to favorites
        .post('/:userId/favorites/:productId', async ({ params }) => {
            try {
                const result = await addToFavorites(Number(params.userId), Number(params.productId));
                return new Response(JSON.stringify(result), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Failed to add to favorites', { status: 400 });
            }
        }, {
            params: t.Object({
                userId: t.String(),
                productId: t.String()
            })
        })

        // Upsert user by email (used by Auth.js on SSO login)
        .post('/upsert', async ({ body }) => {
            try {
                const user = await upsertUser(body.email, body.name ?? null);
                return new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Failed to upsert user', { status: 400 });
            }
        }, {
            body: t.Object({
                email: t.String(),
                name: t.Optional(t.String())
            })
        })

        // Remove product from favorites
        .delete('/:userId/favorites/:productId', async ({ params }) => {
            try {
                const result = await removeFromFavorites(Number(params.userId), Number(params.productId));
                return new Response(JSON.stringify(result), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Failed to remove from favorites', { status: 400 });
            }
        }, {
            params: t.Object({
                userId: t.String(),
                productId: t.String()
            })
        })
    )
    // Start the server
    .listen(3000);

console.log(`🦊 Elysia server is running at ${app.server?.hostname}:${app.server?.port}`);

// For TypeScript type safety
export type App = typeof app;
