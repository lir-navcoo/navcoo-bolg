import axios from 'axios'
import type { Article, ArticleRequest, ApiResponse, LoginRequest, PageData, Statistics, User } from '../types'

const API_BASE = 'http://localhost:8080/api'

// 标签类型
export interface Tag {
  id: number
  name: string
  description?: string
  articleCount: number
  createdAt: string
  updatedAt: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  articleCount: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// 标签请求
export interface TagRequest {
  id?: number
  name: string
  description?: string
}

// 分类请求
export interface CategoryRequest {
  id?: number
  name: string
  slug?: string
  description?: string
  color?: string
  sortOrder?: number
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加Token
api.interceptors.request.use((config) => {
  // 优先从 localStorage 直接读取（兼容直接设置的情况）
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证API
export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
}

// 文章API（公开）
export const articleApi = {
  getList: async (page = 0, size = 10): Promise<ApiResponse<PageData<Article>>> => {
    const response = await api.get('/articles', { params: { page, size } })
    return response.data
  },
  getHot: async (limit = 5): Promise<ApiResponse<Article[]>> => {
    const response = await api.get('/articles/hot', { params: { limit } })
    return response.data
  },
  getDetail: async (id: string): Promise<ApiResponse<Article>> => {
    const response = await api.get(`/articles/${id}`)
    return response.data
  },
  search: async (keyword: string, page = 0, size = 10): Promise<ApiResponse<PageData<Article>>> => {
    const response = await api.get('/articles/search', { params: { keyword, page, size } })
    return response.data
  },
  getBySlug: async (slug: string, page = 0, size = 10): Promise<ApiResponse<PageData<Article>>> => {
    const response = await api.get(`/articles/category/${slug}`, { params: { page, size } })
    return response.data
  },
  getByCategory: async (category: string, page = 0, size = 10): Promise<ApiResponse<PageData<Article>>> => {
    const response = await api.get(`/articles/category/${category}`, { params: { page, size } })
    return response.data
  },
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/categories')
    return response.data
  },
}

// 管理后台API
export const adminApi = {
  getMyArticles: async (page = 0, size = 10): Promise<ApiResponse<PageData<Article>>> => {
    const response = await api.get('/admin/articles', { params: { page, size } })
    return response.data
  },
  getById: async (id: string): Promise<ApiResponse<Article>> => {
    const response = await api.get(`/admin/articles/${id}`)
    return response.data
  },
  create: async (data: ArticleRequest): Promise<ApiResponse<Article>> => {
    const response = await api.post('/admin/articles', data)
    return response.data
  },
  update: async (id: string, data: ArticleRequest): Promise<ApiResponse<Article>> => {
    const response = await api.put(`/admin/articles/${id}`, data)
    return response.data
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/articles/${id}`)
    return response.data
  },
  getStatistics: async (): Promise<ApiResponse<Statistics>> => {
    const response = await api.get('/admin/statistics')
    return response.data
  },
}

// 标签管理API
export const tagApi = {
  getAll: async (): Promise<ApiResponse<Tag[]>> => {
    const response = await api.get('/admin/tags')
    return response.data
  },
  getById: async (id: number): Promise<ApiResponse<Tag>> => {
    const response = await api.get(`/admin/tags/${id}`)
    return response.data
  },
  create: async (data: TagRequest): Promise<ApiResponse<Tag>> => {
    const response = await api.post('/admin/tags', data)
    return response.data
  },
  update: async (id: number, data: TagRequest): Promise<ApiResponse<Tag>> => {
    const response = await api.put(`/admin/tags/${id}`, data)
    return response.data
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/tags/${id}`)
    return response.data
  },
}

// 分类管理API
export const categoryApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/admin/categories')
    return response.data
  },
  getSorted: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/admin/categories/sorted')
    return response.data
  },
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/admin/categories/${id}`)
    return response.data
  },
  create: async (data: CategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await api.post('/admin/categories', data)
    return response.data
  },
  update: async (id: number, data: CategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await api.put(`/admin/categories/${id}`, data)
    return response.data
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/categories/${id}`)
    return response.data
  },
}

// 用户管理API
export interface UserUpdateRequest {
  nickname?: string
  avatar?: string
  bio?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export const userApi = {
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/admin/users/me')
    return response.data
  },
  updateCurrentUser: async (data: UserUpdateRequest): Promise<ApiResponse<User>> => {
    const response = await api.put('/admin/users/me', data)
    return response.data
  },
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    const response = await api.put('/admin/users/password', data)
    return response.data
  },
}

// 媒体管理API
export interface MediaItem {
  id: number
  name: string
  url: string
  type: string
  size: number
  width?: number
  height?: number
  articleId?: string
  uploaderId?: number
  createdAt: string
  updatedAt: string
}

export interface MediaPageData {
  records: MediaItem[]
  total: number
  page: number
  pageSize: number
}

export const mediaApi = {
  // 获取媒体列表（分页）
  getList: async (params: {
    page?: number
    size?: number
    articleId?: string
    keyword?: string
  }): Promise<ApiResponse<MediaPageData>> => {
    const response = await api.get('/admin/media', { params })
    return response.data
  },
  
  // 获取文章的所有媒体
  getByArticle: async (articleId: string): Promise<ApiResponse<MediaItem[]>> => {
    const response = await api.get(`/admin/media/article/${articleId}`)
    return response.data
  },
  
  // 获取公共媒体
  getPublic: async (): Promise<ApiResponse<MediaItem[]>> => {
    const response = await api.get('/admin/media/public')
    return response.data
  },
  
  // 上传单个文件
  upload: async (file: File, articleId?: string): Promise<ApiResponse<MediaItem>> => {
    const formData = new FormData()
    formData.append('file', file)
    if (articleId) {
      formData.append('articleId', articleId)
    }
    const response = await api.post('/admin/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  // 批量上传
  uploadBatch: async (files: File[], articleId?: string): Promise<ApiResponse<{ data: MediaItem[]; errors: string[] }>> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    if (articleId) {
      formData.append('articleId', articleId)
    }
    const response = await api.post('/admin/media/upload/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  // 删除媒体
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/media/${id}`)
    return response.data
  },
  
  // 批量删除
  deleteBatch: async (ids: number[]): Promise<ApiResponse<number>> => {
    const response = await api.delete('/admin/media/batch', { data: ids })
    return response.data
  },
}

// 收藏API
export interface FavoritePageData {
  records: Article[]
  total: number
  page: number
  pageSize: number
}

export const favoriteApi = {
  // 检查是否已收藏
  checkFavorite: async (articleId: string): Promise<ApiResponse<boolean>> => {
    const response = await api.get(`/articles/${articleId}/favorite`)
    return response.data
  },
  
  // 添加收藏
  addFavorite: async (articleId: string): Promise<ApiResponse<boolean>> => {
    const response = await api.post(`/favorites/${articleId}`)
    return response.data
  },
  
  // 取消收藏
  removeFavorite: async (articleId: string): Promise<ApiResponse<boolean>> => {
    const response = await api.delete(`/favorites/${articleId}`)
    return response.data
  },
  
  // 获取我的收藏列表
  getMyFavorites: async (page = 1, size = 10): Promise<ApiResponse<FavoritePageData>> => {
    const response = await api.get('/favorites', { params: { page, size } })
    return response.data
  },
  
  // 获取收藏数量
  getFavoriteCount: async (): Promise<ApiResponse<number>> => {
    const response = await api.get('/favorites/count')
    return response.data
  },
}

export default api
