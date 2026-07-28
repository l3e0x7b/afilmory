/* eslint-disable node/prefer-global/process */

import type { NextRequest } from 'next/server'

export const AUTH_COOKIE = 'afilmory-auth'
export const LOCKOUT_COOKIE = 'afilmory-lockout'

const AUTH_TIMEOUT_HOURS = Number(process.env.ACCESS_TIMEOUT_HOURS) || 4

export const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: AUTH_TIMEOUT_HOURS * 3600,
}

export function isAuthenticated(request: NextRequest): boolean {
  const password = process.env.ACCESS_PASSWORD
  if (!password) {
    return true
  }

  const authCookie = request.cookies.get(AUTH_COOKIE)
  if (!authCookie?.value) {
    return false
  }

  const timestamp = Number(authCookie.value)
  if (!Number.isFinite(timestamp)) {
    return false
  }

  return Date.now() - timestamp <= AUTH_TIMEOUT_HOURS * 3600 * 1000
}
