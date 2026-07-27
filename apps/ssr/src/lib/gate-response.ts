import siteConfig from '@config'
import en from '@locales/app/en.json'
import zhCn from '@locales/app/zh-CN.json'
import type { NextRequest } from 'next/server'

import { isAuthenticated } from '~/lib/auth'
import { detectLangFromHeader } from '~/lib/detect-lang'
import { generateGateHtml } from '~/lib/gate-html'

export function gateResponseIfNeeded(req: NextRequest): Response | null {
  if (isAuthenticated(req)) {
    return null
  }

  const lang = detectLangFromHeader(req.headers.get('accept-language'))
  const locale = lang === 'zh-CN' ? zhCn : en
  const html = generateGateHtml({
    siteName: siteConfig.name,
    redirectTo: req.nextUrl.pathname + req.nextUrl.search,
    lang,
    t: {
      subtitle: locale['password.subtitle'],
      placeholder: locale['password.placeholder'],
      enter: locale['password.enter'],
      error: locale['password.error'],
      lockout: locale['password.lockout'],
    },
  })
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
