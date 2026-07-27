/* eslint-disable node/prefer-global/process */

import { DOMParser } from 'linkedom'
import type { NextRequest } from 'next/server'

import { gateResponseIfNeeded } from '~/lib/gate-response'
import { injectConfigToDocument } from '~/lib/injectable'

export const GET = async (req: NextRequest) => {
  if (process.env.NODE_ENV === 'development') {
    return import('./[...all]/dev').then(m => m.handler(req))
  }

  const gate = gateResponseIfNeeded(req)
  if (gate) {
    return gate
  }

  const indexHtml = await import('../index.html').then(m => m.default)
  const document = new DOMParser().parseFromString(indexHtml, 'text/html')
  injectConfigToDocument(document)
  return new Response(document.documentElement.outerHTML, {
    headers: {
      'Content-Type': 'text/html',
      'X-SSR': '1',
      'Cache-Control': 'no-store',
    },
  })
}
