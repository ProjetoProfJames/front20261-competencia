import { NextResponse } from 'next/server';

const TOKEN_KEY = 'meu_framework_token';

export function middleware(request) {
    
  const token = request.cookies.get(TOKEN_KEY)?.value;
  
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/menu') && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/login') && token) {
    const menuUrl = new URL('/menu', request.url);
    return NextResponse.redirect(menuUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/menu/:path*', '/login'],
};