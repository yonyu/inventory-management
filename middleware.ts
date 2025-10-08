import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/dashboard/user/:path*',
        '/dashboard/admin/:path*',
        '/api/user/:path*',
        '/api/admin/:path*',

        '/profile/:path*',
        '/sales/:path*',
        '/purchases/:path*',
        '/products/:path*',
        '/customers/:path*',
        '/suppliers/:path*',
        '/users/:path*',
        '/settings/:path*',
        '/reports/:path*',
        '/inventory/:path*',
        '/pos/:path*',
    ]
}

export default withAuth(
    async function middleware(req) {
        const url = req.nextUrl.clone();
        const pathname = req.nextUrl.pathname;
        const role = req.nextauth.token?.user?.role; 

        // Check if the user is authenticated
        if (!req.nextauth.token) {
            // If not authenticated, redirect to the login page
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        // Check if the user is trying to access a route that requires a specific role
        if (pathname.startsWith('/dashboard/user') && role !== 'user') {
            // If the user is not a user, redirect to the appropriate dashboard
            url.pathname = '/dashboard/admin';
            return NextResponse.redirect(url);
        } else if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
            // If the user is not an admin, redirect to the appropriate dashboard
            url.pathname = '/dashboard/user';
            return NextResponse.redirect(url);
        }

        // If the user is authenticated and has the correct role, continue to the requested route
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);