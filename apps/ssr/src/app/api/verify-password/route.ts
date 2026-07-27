/* eslint-disable node/prefer-global/process */

import { Buffer } from 'node:buffer'
import { createHmac, timingSafeEqual } from 'node:crypto'

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { AUTH_COOKIE, COOKIE_OPTIONS } from '~/lib/auth'

const ACCESS_SECRET = process.env.ACCESS_PASSWORD ?? ''

const LOCKOUT_COOKIE = 'afilmory-lockout'
const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15
const LOCKOUT_MS = LOCKOUT_MINUTES * 60 * 1000

function isSafeRedirect(path: string): boolean {
  if (!path.startsWith('/')) {
    return false
  }
  try {
    const url = new URL(path, 'http://localhost')
    const decodedPathname = decodeURIComponent(url.pathname)
    return url.origin === 'http://localhost' && url.pathname === decodedPathname
  }
  catch {
    return false
  }
}

function signLockout(value: string): string {
  const hmac = createHmac('sha256', ACCESS_SECRET)
  hmac.update(value)
  return `${value}.${hmac.digest('hex')}`
}

function parseLockout(cookie: string): { firstTs: number, count: number } | null {
  const dot = cookie.lastIndexOf('.')
  if (dot === -1) {
    return null
  }
  const value = cookie.slice(0, dot)
  const sig = cookie.slice(dot + 1)
  const hmac = createHmac('sha256', ACCESS_SECRET)
  hmac.update(value)
  if (sig !== hmac.digest('hex')) {
    return null
  }
  const [firstTs, count] = value.split('_').map(Number)
  if (!Number.isFinite(firstTs) || !Number.isFinite(count)) {
    return null
  }
  return { firstTs, count }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const rawPassword = formData.get('password')?.toString() ?? ''
  const rawRedirect = formData.get('redirect')?.toString() || '/'
  const redirectTo = isSafeRedirect(rawRedirect) ? rawRedirect : '/'

  const accessPassword = process.env.ACCESS_PASSWORD
  if (!accessPassword) {
    return NextResponse.json({ redirectTo })
  }

  const lockoutCookieVal = request.cookies.get(LOCKOUT_COOKIE)?.value ?? null
  let lockoutData: ReturnType<typeof parseLockout> | null = null
  if (lockoutCookieVal) {
    lockoutData = parseLockout(lockoutCookieVal)
  }

  if (lockoutData) {
    const elapsed = Date.now() - lockoutData.firstTs
    if (lockoutData.count >= MAX_ATTEMPTS && elapsed < LOCKOUT_MS) {
      return NextResponse.json({ error: true, lockout: true })
    }
    else if (elapsed >= LOCKOUT_MS) {
      lockoutData = null
    }
  }

  const pwBuf = Buffer.from(rawPassword)
  const apBuf = Buffer.from(accessPassword)
  if (pwBuf.length !== apBuf.length || !timingSafeEqual(pwBuf, apBuf)) {
    const now = Date.now()
    const res = NextResponse.json({ error: true })
    if (lockoutData && now - lockoutData.firstTs < LOCKOUT_MS) {
      res.cookies.set(LOCKOUT_COOKIE, signLockout(`${lockoutData.firstTs}_${lockoutData.count + 1}`), COOKIE_OPTIONS)
    }
    else {
      res.cookies.set(LOCKOUT_COOKIE, signLockout(`${now}_1`), COOKIE_OPTIONS)
    }
    return res
  }

  const res = NextResponse.json({ redirectTo })
  if (lockoutCookieVal) {
    res.cookies.set(LOCKOUT_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 })
  }
  res.cookies.set(AUTH_COOKIE, String(Date.now()), COOKIE_OPTIONS)
  return res
}
