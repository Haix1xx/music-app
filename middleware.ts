import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const protectedPaths = ['/explore', '/messages', '/message/[id]', '/profile', '/settings', '/']

  const isPathProtected = protectedPaths?.some((path) => pathname == path || pathname.startsWith(path))
  const res = NextResponse.next()
  let token = 'abc'

  if (isPathProtected) {
    if (!token && pathname !== '/login') {
      const url = new URL(`/login`, req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    } else {
      return NextResponse.next()
    }
  }
  return res
}
