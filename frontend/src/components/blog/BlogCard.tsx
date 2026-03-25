import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/types'

interface BlogCardProps {
  article: Article
  featured?: boolean
}

export function BlogCard({ article, featured = false }: BlogCardProps) {
  return (
    <Card className={`group overflow-hidden ${featured ? 'md:flex' : ''}`}>
      {/* Cover Image */}
      {article.coverImage && (
        <div className={`relative overflow-hidden ${featured ? 'md:w-1/3' : 'h-48'}`}>
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Content */}
      <CardContent className={`p-5 flex flex-col ${featured ? 'md:w-2/3 md:p-6' : 'flex-1'}`}>
        {/* Category Badge */}
        {article.category && (
          <Badge variant="secondary" className="w-fit mb-3 text-xs">
            <Link 
              to={article.categorySlug ? `/category/${article.categorySlug}` : `/category/${article.category}`}
              className="hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {article.category}
            </Link>
          </Badge>
        )}

        {/* Title */}
        <Link to={`/article/${article.id}`}>
          <h3 className={`font-bold group-hover:text-primary transition-colors line-clamp-2 ${featured ? 'text-2xl mb-3' : 'text-lg mb-2'}`}>
            {article.title}
          </h3>
        </Link>

        {/* Summary */}
        {article.summary && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {article.summary}
          </p>
        )}

        {/* Tags */}
        {article.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.split(',').slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {article.author && (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={article.author.avatar} />
                  <AvatarFallback>{article.author.nickname?.[0] || article.author.username?.[0]}</AvatarFallback>
                </Avatar>
                <span>{article.author.nickname || article.author.username}</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {article.viewCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
