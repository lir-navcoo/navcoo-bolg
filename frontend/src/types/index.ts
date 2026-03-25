export interface User {
  id: number
  username: string
  nickname?: string
  avatar?: string
  bio?: string
}

export interface Article {
  id: string
  title: string
  summary?: string
  content: string
  coverImage?: string
  category?: string
  categorySlug?: string  // 分类别名，用于路由
  tags?: string
  published: boolean
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  author?: User
}

export interface ArticleRequest {
  id?: string
  title: string
  summary?: string
  content: string
  coverImage?: string
  category?: string
  tags?: string[]
  published?: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface ApiResponse<T> {
  success?: boolean
  code: number
  message: string
  data: T
}

// 后端分页格式（与 Spring Data JPA IPage 一致）
export interface PageData<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface Statistics {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  categoryStats: Array<{ category: string; count: number }>
}
