import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/.*|og/.*|share/.*).*)'],
}
