import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/causes',
  '/education',
  '/about',
  '/contact',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify-request',
  '/search',
  '/help',
  '/privacy',
  '/terms',
  '/accessibility',
  '/api/auth',
  '/api/causes', // GET requests are public
]

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/my-causes',
  '/causes/create',
  '/causes/edit',
  '/settings',
  '/messages',
  '/notifications',
]

// Define admin-only routes
const adminRoutes = [
  '/admin',
]

// Define API routes that require authentication
const protectedApiRoutes = [
  '/api/causes', // POST, PUT, DELETE require auth
  '/api/users',
  '/api/admin',
  '/api/notifications',
  '/api/upload',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request })

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if route is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if it's a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Allow public API routes
    if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/health')) {
      return NextResponse.next()
    }

    // Handle GET requests to /api/causes (public)
    if (pathname.startsWith('/api/causes') && request.method === 'GET') {
      return NextResponse.next()
    }

    // Check authentication for protected API routes
    if (isProtectedApiRoute) {
      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        )
      }

      // Check email verification for write operations
      if (['POST', 'PUT', 'DELETE'].includes(request.method || '') && !token.isVerified) {
        return NextResponse.json(
          { success: false, message: 'Email verification required' },
          { status: 403 }
        )
      }

      // Check admin access for admin API routes
      if (pathname.startsWith('/api/admin') && !token.isAdmin) {
        return NextResponse.json(
          { success: false, message: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    return NextResponse.next()
  }

  // Handle authentication redirects for web routes
  if (isProtectedRoute || isAdminRoute) {
    if (!token) {
      // Redirect to sign in with callback URL
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check email verification
    if (!token.isVerified) {
      const verifyUrl = new URL('/auth/verify-email', request.url)
      return NextResponse.redirect(verifyUrl)
    }

    // Check admin access
    if (isAdminRoute && !token.isAdmin) {
      const unauthorizedUrl = new URL('/unauthorized', request.url)
      return NextResponse.redirect(unauthorizedUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (token && pathname.startsWith('/auth/')) {
    if (pathname === '/auth/verify-email' && !token.isVerified) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Security headers
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Add CSP header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.openrouter.ai https://api.imagekit.io https://www.google-analytics.com",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Add cache headers for static content
  if (pathname.startsWith('/static/') || pathname.includes('.')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public|static).*)',
  ],
}