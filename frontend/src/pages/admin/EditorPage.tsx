'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { adminApi, articleApi, categoryApi, tagApi } from '@/lib/api'
import { toast } from 'sonner'
import AiEditorComponent from '@/components/editor/AiEditorComponent'
import { MediaSelector } from '@/components/media/MediaSelector'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Save,
  Send,
  ArrowLeft,
  Loader2,
  X,
  Plus,
  Sparkles,
  Image as ImageIcon,
  Check,
} from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
}

export function EditorPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('<p>在这里开始写作...</p>')
  const [coverImage, setCoverImage] = useState('')
  const [category, setCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false)

  // 是否为编辑模式
  const isEditing = !!id

  // 加载分类和标签
  useEffect(() => {
    loadMeta()
    if (id) {
      loadArticle()
    }
  }, [id])

  const loadMeta = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        categoryApi.getAll(),
        tagApi.getAll()
      ])
      if (catRes.success) {
        setCategories(catRes.data)
      }
      if (tagRes.success) {
        setAllTags(tagRes.data)
      }
    } catch (error) {
      console.error('加载元数据失败:', error)
    }
  }

  const loadArticle = async () => {
    if (!id) return
    try {
      setLoading(true)
      // 使用管理员API获取文章详情（不检查发布状态）
      const response = await adminApi.getById(id)
      if (response.success) {
        const article = response.data
        setTitle(article.title)
        setSummary(article.summary || '')
        
        // 解析内容 - 支持 HTML 和 JSON 格式
        try {
          const parsed = JSON.parse(article.content)
          // 如果是 JSON 格式的数组，转换为 HTML
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContent(jsonToHtml(parsed))
          } else {
            setContent(article.content || '<p></p>')
          }
        } catch {
          // JSON 解析失败，可能是 HTML 格式，直接使用
          setContent(article.content || '<p></p>')
        }
        
        setCoverImage(article.coverImage || '')
        setCategory(article.category || '')
        setSelectedTags(article.tags ? article.tags.split(',').map((t: string) => t.trim()) : [])
        setPublished(article.published)
      }
    } catch (error) {
      console.error('加载文章失败:', error)
      toast.error('加载文章失败')
    } finally {
      setLoading(false)
    }
  }

  // PlateJS JSON 转 HTML
  const jsonToHtml = (blocks: any[]): string => {
    const renderNode = (node: any): string => {
      if (node.text !== undefined) {
        let text = node.text || ''
        // 处理标记
        if (node.bold) text = `<strong>${text}</strong>`
        if (node.italic) text = `<em>${text}</em>`
        if (node.underline) text = `<u>${text}</u>`
        if (node.strikethrough) text = `<s>${text}</s>`
        if (node.code) text = `<code>${text}</code>`
        return text
      }

      const children = node.children?.map(renderNode).join('') || ''
      
      switch (node.type) {
        case 'h1': return `<h1>${children}</h1>`
        case 'h2': return `<h2>${children}</h2>`
        case 'h3': return `<h3>${children}</h3>`
        case 'p': return `<p>${children || '<br>'}</p>`
        case 'ul': return `<ul>${children}</ul>`
        case 'ol': return `<ol>${children}</ol>`
        case 'li': return `<li>${children}</li>`
        case 'blockquote': return `<blockquote>${children}</blockquote>`
        case 'pre': return `<pre><code>${children}</code></pre>`
        case 'hr': return '<hr>'
        case 'img': return `<img src="${node.url}" alt="" />`
        case 'a': return `<a href="${node.url}">${children}</a>`
        default: return `<p>${children || ''}</p>`
      }
    }

    return blocks.map(renderNode).join('')
  }

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  const handleSave = async (publish?: boolean) => {
    if (!title.trim()) {
      toast.error('请输入文章标题')
      return
    }

    try {
      setSaving(true)
      
      // 将内容作为 HTML 保存
      const contentToSave = content

      const articleData = {
        title,
        summary,
        content: contentToSave,
        coverImage,
        category,
        tags: selectedTags,
        published: publish !== undefined ? publish : published,
      }

      let response
      if (id) {
        response = await adminApi.update(id, articleData)
      } else {
        response = await adminApi.create(articleData)
      }

      if (response.success) {
        if (publish !== undefined) {
          setPublished(publish)
        }
        toast.success(publish ? '发布成功！' : '保存成功！')
        navigate('/admin/articles')
      }
    } catch (error) {
      toast.error('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = (tagName: string) => {
    if (tagName.trim() && !selectedTags.includes(tagName.trim())) {
      setSelectedTags([...selectedTags, tagName.trim()])
    }
    setNewTag('')
  }

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagName))
  }

  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  // 处理媒体库选择（接收相对路径）
  const handleMediaSelect = (url: string) => {
    // url 已经是相对路径，如 /uploads/common/xxx.jpg
    setCoverImage(url)
    setMediaSelectorOpen(false)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/articles')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {id ? '编辑文章' : '写文章'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {id ? '修改并更新您的文章' : '开始创作您的下一篇文章'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave()}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            保存草稿
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {published ? '更新发布' : '发布'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 主编辑器区域 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 标题输入 */}
          <div className="border-b pb-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="text-4xl font-bold border focus-visible:ring-1 px-3 py-2 h-auto placeholder:text-muted-foreground/50"
            />
          </div>
          
          {/* 摘要输入 */}
          <Input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="简短描述（可选，用于文章列表展示）..."
            className="text-muted-foreground"
          />

          {/* 编辑器 */}
          <AiEditorComponent
            value={content}
            onChange={handleContentChange}
            placeholder="开始写作..."
            height="500"
            theme="light"
          />
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 发布设置 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                发布设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">发布状态</span>
                <Badge variant={published ? "default" : "secondary"}>
                  {published ? '已发布' : '草稿'}
                </Badge>
              </div>
              
              {/* 分类 */}
              <div className="space-y-2">
                <Label className="text-sm">分类</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 标签 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">标签</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 已选标签 */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* 快速选择 */}
              <div className="space-y-2">
                <Label className="text-sm">快速添加</Label>
                <ScrollArea className="h-[120px]">
                  <div className="flex flex-wrap gap-1">
                    {allTags
                      .filter(t => !selectedTags.includes(t.name))
                      .map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => handleTagSelect(tag.name)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {tag.name}
                        </Badge>
                      ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* 自定义标签 */}
              <div className="space-y-2">
                <Label className="text-sm">自定义标签</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新标签"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag(newTag)
                      }
                    }}
                  />
                  <Button size="sm" variant="outline" onClick={() => handleAddTag(newTag)}>
                    添加
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 封面图片 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">封面图片</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coverImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={coverImage.startsWith('http') ? coverImage : `http://localhost:8080${coverImage}`}
                    alt="封面"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMediaSelectorOpen(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {coverImage ? '更换封面' : '选择封面'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 媒体库选择器 */}
      <MediaSelector
        open={mediaSelectorOpen}
        onOpenChange={setMediaSelectorOpen}
        onSelect={handleMediaSelect}
      />
    </div>
  )
}

export default EditorPage
