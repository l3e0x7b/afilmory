export type SupportedLang = 'zh-CN' | 'en'

export function detectLangFromHeader(acceptLanguage: string | null): SupportedLang {
  if (!acceptLanguage) {
    return 'en'
  }
  const firstLang = acceptLanguage.split(',')[0]?.trim().toLowerCase() ?? ''
  if (firstLang.startsWith('zh-cn') || firstLang.startsWith('zh-hans')) {
    return 'zh-CN'
  }
  return 'en'
}
