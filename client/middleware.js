import { NextResponse } from 'next/server'

const protectedRoutes = ['/feed', '/jobs', '/network', '/search', '/organization', '/profile', '/settings'], strictRoutes = ['/profile/edit_info']

export default function middleware(request) {
    if ((strictRoutes.includes(request.nextUrl.pathname) && !request.cookies.has('token1')) || (protectedRoutes.includes(request.nextUrl.pathname) && !request.cookies.has('token2'))) {
        const absoluteURL = new URL("/", request.nextUrl.origin)
        return NextResponse.redirect(absoluteURL.toString())
    }  else if ((request.nextUrl.pathname.includes('/auth/') || request.nextUrl.pathname === '/') && request.cookies.has('token2')) {
        const absoluteURL = new URL("/feed", request.nextUrl.origin)
        return NextResponse.redirect(absoluteURL.toString())
    } else {
        return NextResponse.next()
    }
}