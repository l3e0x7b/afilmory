import { NextResponse } from 'next/server'

import { AUTH_COOKIE, COOKIE_OPTIONS, LOCKOUT_COOKIE } from '~/lib/auth'

export async function POST() {
  const response = NextResponse.json({ locked: true })

  response.cookies.set(AUTH_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })

  response.cookies.set(LOCKOUT_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })

  return response
}
