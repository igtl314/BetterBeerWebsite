# Plan: Auth.js SSO Login (Google + GitHub)

## Context
The app has a User model and a Navbar that's already UI-ready for auth (accepts `isLoggedIn` and `userProfile` props) but hardcodes `isLoggedIn = false`. No auth system exists. The user wants Google and GitHub SSO via Auth.js v5.

The Prisma DB lives in the backend (Elysia/Bun), not the frontend, so we can't use the Prisma adapter from the frontend. Instead we use **JWT sessions** in Auth.js and call the backend API to upsert users on first login.

---

## Files to modify / create

### Backend — `BetterBeerBackend/`
- **`server.ts`** — add `POST /users/upsert` route
- **`storehandler.ts`** — add `upsertUser()` function using Prisma upsert

### Frontend — `betterbeerfrontend/`
- **`auth.ts`** *(new)* — Auth.js config (providers + signIn callback that calls backend upsert)
- **`app/api/auth/[...nextauth]/route.ts`** *(new)* — Auth.js route handler
- **`app/providers.jsx`** — wrap with `SessionProvider` from `next-auth/react`
- **`app/_compoments/NavbarWrapper.tsx`** — replace TODO with real `auth()` session call
- **`app/login/page.tsx`** *(new)* — custom sign-in page with Google + GitHub buttons
- **`.env.local`** *(new, not committed)* — auth secrets and OAuth credentials

---

## Implementation steps

### 1. Backend: upsert endpoint
Add to `storehandler.ts`:
```ts
export async function upsertUser(email: string, name: string | null) {
  return prisma.user.upsert({
    where: { email },
    update: { name: name ?? undefined },
    create: { email, name },
  });
}
```

Add to `server.ts` under the `/users` group:
```ts
.post('/upsert', async ({ body }) => upsertUser(body.email, body.name ?? null), {
  body: t.Object({ email: t.String(), name: t.Optional(t.String()) })
})
```

### 2. Frontend: install Auth.js
```bash
pnpm add next-auth@beta
```

### 3. `auth.ts` (frontend root)
```ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  callbacks: {
    async signIn({ user }) {
      await fetch(`${process.env.BACKEND_URL}/users/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name: user.name }),
      });
      return true;
    },
  },
});
```

### 4. Route handler — `app/api/auth/[...nextauth]/route.ts`
```ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### 5. `providers.jsx` — add SessionProvider
```jsx
import { SessionProvider } from "next-auth/react"

export function Providers({ children }) {
  return (
    <SessionProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </SessionProvider>
  )
}
```

### 6. `NavbarWrapper.tsx` — connect real session
Replace the two TODO hardcodes with:
```ts
const session = await auth();
const isLoggedIn = !!session?.user;
const userProfile = session?.user
  ? { name: session.user.name ?? "", email: session.user.email ?? "" }
  : undefined;
```

### 7. `app/login/page.tsx` — sign-in page
A simple client page with "Sign in with Google" and "Sign in with GitHub" buttons calling `signIn("google")` / `signIn("github")` from `next-auth/react`. Navbar already links here.

### 8. `.env.local`
```
AUTH_SECRET=<generate with: npx auth secret>
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
BACKEND_URL=http://localhost:3005
```
User needs to create:
- Google OAuth app at console.cloud.google.com (redirect URI: `http://localhost:3000/api/auth/callback/google`)
- GitHub OAuth app at github.com/settings/developers (callback: `http://localhost:3000/api/auth/callback/github`)

---

## Verification
1. `pnpm dev` in `betterbeerfrontend/`, backend running via `bun run server.ts`
2. Visit `/login` — should show Google + GitHub sign-in buttons
3. Sign in with Google — should redirect back, Navbar should show user avatar/name
4. Check backend DB: `SELECT * FROM User;` should have a row with the Google email
5. Sign out — Navbar should revert to "Sign In" button
