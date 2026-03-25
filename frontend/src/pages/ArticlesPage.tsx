import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { articleApi } from '@/lib/api'
import { BlogCard } from '@/components/blog/BlogCard'
import type { Article, PageData } from '@/types'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ArticlesPage() {
  const [searchParams] = useSearchParams()
  const params = useParams()
  // 优先使用路径参数 slug，其次使用查询参数 category
  const slug = params.category || searchParams.get('category') || undefined
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    loadArticles()
  }, [slug, currentPage])

  const loadArticles = async () => {
    try {
      setLoading(true)
      let response
      if (slug) {
        // 使用 slug 路由
        response = await articleApi.getBySlug(slug, currentPage, 12)
        // 从响应中提取分类名称（如果后端返回的话）
        if (response.success && response.data?.records?.length > 0) {
          // 显示 slug 作为页面标题（实际项目可以从后端获取完整分类信息）
          setCategoryName(slug)
        }
      } else {
        response = await articleApi.getList(currentPage, 12)
        setCategoryName('')
      }
      if (response.success) {
        setArticles(response.data.records)
        setTotalPages(response.data.pages)
      }
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {categoryName ? decodeURIComponent(categoryName) : '所有文章'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {categoryName
              ? `浏览所有${decodeURIComponent(categoryName)}分类下的文章`
              : '探索最新的技术见解和创作'}
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 rounded-t-xl" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  上一页
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">暂无文章</p>
          </Card>
        )}
      </div>
    </div>
  )
}
