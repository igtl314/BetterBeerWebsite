import { decode } from '@auth/core/jwt';
import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();

const SESSION_COOKIE_NAMES = [
    'authjs.session-token',
    '__Secure-authjs.session-token',
];

type CookieJar = Record<string, { value?: string } | undefined>;

export async function verifySession(cookie: CookieJar) {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        console.warn('[auth] AUTH_SECRET is not set');
        return null;
    }

    const cookieNames = Object.keys(cookie);
    let sawToken = false;
    for (const name of SESSION_COOKIE_NAMES) {
        const token = cookie[name]?.value;
        if (!token) continue;
        sawToken = true;
        try {
            const payload = await decode({ token, secret, salt: name });
            const email = payload?.email;
            if (typeof email !== 'string') {
                console.warn(`[auth] decoded ${name} but payload has no email; keys=${payload ? Object.keys(payload).join(',') : 'null'}`);
                continue;
            }
            const user = await prisma.user.findUnique({ where: { email } });
            if (user) return user;
            console.warn(`[auth] decoded ${name} for ${email} but user not found in DB`);
        } catch (err) {
            console.warn(`[auth] decode failed for ${name}:`, err instanceof Error ? err.message : err);
        }
    }
    if (!sawToken) {
        console.warn(`[auth] no session cookie present; got: ${cookieNames.join(',') || '(none)'}`);
    }
    return null;
}
