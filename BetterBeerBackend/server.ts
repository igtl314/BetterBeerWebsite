import { Elysia, t } from 'elysia';
import {
    getAllStores,
    getStoreById,
    upsertStore,
    deleteStore,
    getProductsInStock,
    getProductById,
    getAllProducts,
    searchProducts,
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
import { verifySession } from './auth';
import { fetchSystembolagetStock } from './systembolaget';

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
        // List products — supports ?search=, ?orderBy=, ?direction=, ?limit=
        .get('/', async ({ query }) => {
            try {
                const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 500);
                const orderByWhitelist = ['ProductApk', 'ProductPrice', 'ProductName', 'ProductAlcohol', 'ProductVolume'];
                const orderBy = orderByWhitelist.includes(query.orderBy ?? '') ? query.orderBy! : 'ProductApk';
                const direction = query.direction === 'asc' ? 'asc' : 'desc';

                const products = query.search
                    ? await searchProducts(query.search, limit)
                    : await getAllProducts({ orderBy, orderDirection: direction, limit });

                return new Response(JSON.stringify(products), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error("Error listing products:", error);
                return new Response('Internal server error', { status: 500 });
            }
        }, {
            query: t.Object({
                search: t.Optional(t.String()),
                orderBy: t.Optional(t.String()),
                direction: t.Optional(t.String()),
                limit: t.Optional(t.String()),
            })
        })
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
        // Logged-in user refreshes stock for a single product@store from Systembolaget
        .post('/refresh', async ({ body, cookie }: { body: { StoreId: number; ProductId: number }; cookie: Record<string, { value?: string } | undefined> }) => {
            const user = await verifySession(cookie);
            if (!user) {
                return new Response('Unauthorized', { status: 401 });
            }
            try {
                const fresh = await fetchSystembolagetStock(body.StoreId, body.ProductId);
                const stockInfo = await setProductStock({
                    StoreId: body.StoreId,
                    ProductId: body.ProductId,
                    Stock: fresh.stock,
                    Location: fresh.shelf,
                });
                return new Response(JSON.stringify(stockInfo), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('Manual stock refresh failed:', error);
                return new Response('Failed to refresh stock', { status: 502 });
            }
        }, {
            body: t.Object({
                StoreId: t.Number(),
                ProductId: t.Number(),
            })
        })
    )
    // User routes
    .group('/users', app => app
        // Get the logged-in user (with favorites) from the session cookie
        .get('/me', async ({ cookie }: { cookie: Record<string, { value?: string } | undefined> }) => {
            const sessionUser = await verifySession(cookie);
            if (!sessionUser) {
                return new Response('Unauthorized', { status: 401 });
            }
            try {
                const user = await getUserById(sessionUser.id);
                return new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response('Internal server error', { status: 500 });
            }
        })
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
    // TODO: replace with S3 bucket (AWS) for image storage
    .get('/images/:filename', async ({ params: { filename } }: { params: { filename: string } }) => {
        const file = Bun.file(`/app/images/${filename}`);
        if (!(await file.exists())) {
            return new Response('Image not found', { status: 404 });
        }
        return new Response(file, {
            headers: { 'Content-Type': 'image/webp' }
        });
    }, {
        params: t.Object({ filename: t.String() })
    })
    // Start the server
    .listen(Number(process.env.PORT) || 3000);

console.log(`🦊 Elysia server is running at ${app.server?.hostname}:${app.server?.port}`);

// For TypeScript type safety
export type App = typeof app;
