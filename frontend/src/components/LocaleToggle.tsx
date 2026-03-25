'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n, useLocale } from '@/i18n'
import { Globe } from 'lucide-react'

export function LocaleToggle() {
  const { t, setLocale } = useI18n()
  const { locale, isZh } = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLocale('zh')} 
          className={locale === 'zh' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇨🇳</span>
          {t('chinese')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLocale('en')} 
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇺🇸</span>
          {t('english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
