'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { useI18n } from '@/i18n'
import { articleApi } from '@/lib/api'
import type { Article } from '@/types'
import { Search, FileText, Clock, ArrowRight } from 'lucide-react'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setSearched(false)
    }
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch()
      } else {
        setResults([])
        setSearched(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async () => {
    try {
      setLoading(true)
      setSearched(true)
      const response = await articleApi.search(query, 0, 10)
      if (response.success) {
        setResults(response.data.records || response.data || [])
      }
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (articleId: string | number) => {
    onOpenChange(false)
    navigate(`/article/${articleId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              autoFocus
              placeholder={t('searchPlaceholder')}
              className="pl-10 text-lg border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-4">
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t('searchPlaceholder')}</p>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && searched && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t('noData')}</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                {results.length} {t('articles').toLowerCase()}
              </p>
              {results.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleResultClick(article.id)}
                >
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{article.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {article.category && (
                          <span className="text-primary">{article.category}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.viewCount} {t('views')}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
