'use client'

import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CheckSquare,
  CodeSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TiptapEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

interface ToolbarButtonProps {
  icon: React.ElementType
  label: string
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
}

function ToolbarBtn({ icon: Icon, label, onClick, isActive, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 w-8 p-1 rounded hover:bg-accent flex items-center justify-center transition-colors',
        isActive && 'bg-accent text-accent-foreground',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function ToolbarSeparator() {
  return <div className="w-px h-6 bg-border mx-1" />
}

export function TiptapEditor({
  content = '',
  onChange,
  placeholder = '开始写作...',
  className,
  editable = true,
}: TiptapEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState('')
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState('')
  const [popoverOpen, setPopoverOpen] = React.useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-muted rounded p-4 my-2 overflow-x-auto',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const handleSetLink = useCallback(() => {
    if (!linkUrl.trim()) {
      editor?.chain().focus().unsetLink().run()
    } else {
      editor?.chain().focus().setLink({ href: linkUrl }).run()
    }
    setLinkDialogOpen(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const handleInsertImage = useCallback(() => {
    if (!imageUrl.trim()) return
    editor?.chain().focus().setImage({ src: imageUrl }).run()
    setImageDialogOpen(false)
    setImageUrl('')
  }, [editor, imageUrl])

  if (!editor) {
    return null
  }

  return (
    <div className={cn('flex flex-col border rounded-lg overflow-hidden', className)}>
      {/* 工具栏 */}
      <div className="bg-background/80 backdrop-blur-sm border-b px-4 py-2 sticky top-0 z-40">
        <div className="flex items-center gap-1 flex-wrap">

          {/* 撤销/重做 */}
          <ToolbarBtn
            icon={Undo}
            label="撤销 (Ctrl+Z)"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
          <ToolbarBtn
            icon={Redo}
            label="重做 (Ctrl+Shift+Z)"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />

          <ToolbarSeparator />

          {/* 标题 */}
          <ToolbarBtn
            icon={Heading1}
            label="标题 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          />
          <ToolbarBtn
            icon={Heading2}
            label="标题 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          />
          <ToolbarBtn
            icon={Heading3}
            label="标题 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
          />

          <ToolbarSeparator />

          {/* 文本格式 */}
          <ToolbarBtn
            icon={Bold}
            label="粗体 (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          />
          <ToolbarBtn
            icon={Italic}
            label="斜体 (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          />
          <ToolbarBtn
            icon={UnderlineIcon}
            label="下划线 (Ctrl+U)"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          />
          <ToolbarBtn
            icon={Strikethrough}
            label="删除线"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
          />
          <ToolbarBtn
            icon={Code}
            label="行内代码"
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          />

          <ToolbarSeparator />

          {/* 列表 */}
          <ToolbarBtn
            icon={List}
            label="无序列表"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          />
          <ToolbarBtn
            icon={ListOrdered}
            label="有序列表"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          />
          <ToolbarBtn
            icon={CheckSquare}
            label="任务列表"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
          />

          <ToolbarSeparator />

          {/* 引用 & 代码块 */}
          <ToolbarBtn
            icon={Quote}
            label="引用块"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          />
          <ToolbarBtn
            icon={CodeSquare}
            label="代码块"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          />

          <ToolbarSeparator />

          {/* 对齐 */}
          <ToolbarBtn
            icon={AlignLeft}
            label="左对齐"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
          />
          <ToolbarBtn
            icon={AlignCenter}
            label="居中"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
          />
          <ToolbarBtn
            icon={AlignRight}
            label="右对齐"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
          />
          <ToolbarBtn
            icon={AlignJustify}
            label="两端对齐"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
          />

          <ToolbarSeparator />

          {/* 链接 */}
          <button
            type="button"
            onClick={() => setPopoverOpen(popoverOpen === 'link' ? null : 'link')}
            className="h-8 px-2 rounded hover:bg-accent flex items-center gap-1 transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
            <span className="text-sm">链接</span>
          </button>
          {popoverOpen === 'link' && (
            <div className="absolute mt-2 p-3 bg-background border rounded-lg shadow-lg w-80 z-50">
              <h4 className="font-medium mb-2">插入链接</h4>
              <input
                type="text"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetLink()}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setPopoverOpen(null); setLinkUrl(''); }}
                  className="px-3 py-1 border rounded hover:bg-accent"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSetLink}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90"
                >
                  确定
                </button>
              </div>
            </div>
          )}

          {/* 图片 */}
          <button
            type="button"
            onClick={() => setPopoverOpen(popoverOpen === 'image' ? null : 'image')}
            className="h-8 px-2 rounded hover:bg-accent flex items-center gap-1 transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">图片</span>
          </button>
          {popoverOpen === 'image' && (
            <div className="absolute mt-2 p-3 bg-background border rounded-lg shadow-lg w-80 z-50">
              <h4 className="font-medium mb-2">插入图片</h4>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInsertImage()}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setPopoverOpen(null); setImageUrl(''); }}
                  className="px-3 py-1 border rounded hover:bg-accent"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90"
                >
                  插入
                </button>
              </div>
            </div>
          )}

          {/* 分割线 */}
          <ToolbarBtn
            icon={Minus}
            label="分割线"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="flex-1 overflow-auto bg-background">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-8"
        />
      </div>
    </div>
  )
}

export default TiptapEditor
