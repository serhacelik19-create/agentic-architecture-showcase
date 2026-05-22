
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            console.log('[AUTH DEBUG] Path:', nextUrl.pathname);
            console.log('[AUTH DEBUG] isLoggedIn:', isLoggedIn);
            console.log('[AUTH DEBUG] isOnAdmin:', isOnAdmin);

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                console.log('[AUTH DEBUG] Access Denied. Redirecting...');
                return Response.redirect(new URL('/login', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
