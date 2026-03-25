import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { articleApi } from '@/lib/api'
import { BlogCard } from '@/components/blog/BlogCard'
import type { Article } from '@/types'
import { Search, FileText } from 'lucide-react'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      searchArticles()
    }
  }, [query])

  const searchArticles = async () => {
    try {
      setLoading(true)
      const response = await articleApi.search(query, 0, 20)
      if (response.success) {
        setArticles(response.data.records)
      }
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">搜索结果</h1>
          <p className="text-muted-foreground">
            {query ? (
              <>
                关键词 "<span className="font-medium text-foreground">{query}</span>"
                找到 {articles.length} 篇文章
              </>
            ) : (
              '请输入搜索关键词'
            )}
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 rounded-t-xl" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center max-w-md mx-auto">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">没有找到相关文章</p>
            <p className="text-sm text-muted-foreground">
              尝试使用其他关键词搜索
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
