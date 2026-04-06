import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken, COOKIE_NAME } from './lib/auth';

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ['/login', '/logout'];

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Permitir rutas públicas y assets estáticos
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/workbox-') ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/sw.js' ||
    pathname === '/favicon.ico'
  ) {
    return next();
  }

  const sessionCookie = context.cookies.get(COOKIE_NAME);

  if (!sessionCookie || !verifySessionToken(sessionCookie.value)) {
    // API routes devuelven 401 en lugar de redirect
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return next();
});
