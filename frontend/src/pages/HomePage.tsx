import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { articleApi } from '@/lib/api'
import { BlogCard } from '@/components/blog/BlogCard'
import { useI18n, useLocale } from '@/i18n'
import type { Article } from '@/types'
import { TrendingUp, Clock, ChevronRight, Sparkles } from 'lucide-react'

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [hotArticles, setHotArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()
  const { isZh } = useLocale()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [listRes, hotRes] = await Promise.all([
        articleApi.getList(0, 6),
        articleApi.getHot(5)
      ])
      if (listRes.success) {
        setArticles(listRes.data.records)
      }
      if (hotRes.success) {
        setHotArticles(hotRes.data)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              {isZh ? '欢迎来到我的博客' : 'Welcome to my blog'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {isZh ? '分享技术' : 'Share Tech'}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {isZh ? '，记录生活' : ', Record Life'}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isZh 
                ? '在这里，你可以看到我关于前端开发、后端技术、架构设计等方面的实践与思考。每一篇文章都是一次探索，期待与你共同成长。'
                : 'Here you can see my practices and thoughts on frontend, backend, architecture and more. Every article is an exploration, looking forward to growing together with you.'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-primary" />
                  {isZh ? '最新文章' : 'Latest Articles'}
                </h2>
                <Link to="/articles">
                  <Button variant="ghost" size="sm">
                    {t('viewAll')}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <BlogCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">{t('noData')}</p>
                  <Link to="/login">
                    <Button>{isZh ? '登录后台发布文章' : 'Login to publish articles'}</Button>
                  </Link>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hot Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  {isZh ? '热门文章' : 'Popular'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))
                ) : (
                  hotArticles.map((article, index) => (
                    <Link key={article.id} to={`/article/${article.id}`} className="flex gap-3 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.viewCount} {t('views')}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('categories')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isZh 
                    ? ['技术', '生活', '随笔', '架构', 'DevOps'].map((category) => (
                        <Link
                          key={category}
                          to={`/category/${category}`}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
                        >
                          <span className="text-sm">{category}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))
                    : ['Tech', 'Life', 'Essay', 'Architecture', 'DevOps'].map((category, index) => (
                        <Link
                          key={index}
                          to={`/category/${['技术', '生活', '随笔', '架构', 'DevOps'][index]}`}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
                        >
                          <span className="text-sm">{category}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))
                  }
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{isZh ? '关于我' : 'About Me'}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  {isZh 
                    ? '全栈开发者，热爱技术，喜欢分享。主要关注前端工程化、后端架构、云原生等领域。'
                    : 'Full-stack developer, passionate about technology and sharing. Focus on frontend engineering, backend architecture, and cloud-native technologies.'}
                </p>
                <div className="pt-2">
                  <p className="font-medium text-foreground mb-2">{isZh ? '技能栈' : 'Skills'}</p>
                  <div className="flex flex-wrap gap-1">
                    {['React', 'Vue', 'Node.js', 'Java', 'K8s'].map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-muted rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
