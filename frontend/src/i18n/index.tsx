import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { zh } from './zh'
import { en } from './en'

export type Locale = 'zh' | 'en'
export type Translations = typeof zh

const translations: Record<Locale, Translations> = { zh, en }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof Translations) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale')
    if (saved === 'zh' || saved === 'en') return saved
    const browserLang = navigator.language.toLowerCase()
    return browserLang.startsWith('zh') ? 'zh' : 'en'
  })

  useEffect(() => {
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
  }

  const t = (key: keyof Translations): string => {
    return translations[locale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

export function useLocale() {
  const { locale, setLocale } = useI18n()
  return { locale, setLocale, isZh: locale === 'zh', isEn: locale === 'en' }
}
