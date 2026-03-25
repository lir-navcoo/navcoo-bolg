import { useI18n } from '@/i18n'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useI18n()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <p className="text-sm text-muted-foreground text-center">
          © {currentYear} {t('copyright')}. {t('allRightsReserved')}
        </p>
      </div>
    </footer>
  )
}
