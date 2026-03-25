'use client'

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { AiEditor as AiEditorCore } from 'aieditor'
import 'aieditor/dist/style.css'

export interface AiEditorRef {
  getHtml: () => string
  getText: () => string
  getMarkdown: () => string
  setContent: (content: string) => void
  focus: () => void
}

interface AiEditorComponentProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  height?: string
  theme?: 'light' | 'dark'
  className?: string
}

const AiEditorComponent = forwardRef<AiEditorRef, AiEditorComponentProps>(({
  value = '',
  onChange,
  placeholder = '开始输入内容...',
  height = '500px',
  theme = 'light',
  className,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<AiEditorCore | null>(null)

  useImperativeHandle(ref, () => ({
    getHtml: () => editorRef.current?.getHtml() || '',
    getText: () => editorRef.current?.getText() || '',
    getMarkdown: () => editorRef.current?.getMarkdown() || '',
    setContent: (content: string) => {
      editorRef.current?.setContent(content)
    },
    focus: () => editorRef.current?.focus(),
  }))

  useEffect(() => {
    if (!containerRef.current) return

    // 配置工具栏（纯编辑功能，无AI）
    const toolbarKeys = [
      'undo', 'redo',
      '|',
      'bold', 'italic', 'underline', 'strikeThrough', 'code',
      '|',
      'heading', 'paragraph', 'quote', 'codeBlock', 'highlight',
      '|',
      'font-size',
      '|',
      'bulletList', 'orderedList', 'taskList',
      '|',
      'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
      '|',
      'indent', 'outdent',
      '|',
      'link', 'unlink',
      '|',
      'image', 'video', 'attachment',
      '|',
      'table',
      '|',
      'fullscreen', 'preview', 'export'
    ]

    const editor = new AiEditorCore({
      element: containerRef.current,
      placeholder,
      theme,
      toolbarKeys,
      content: value || '',
      onChange: (instance) => {
        const html = instance.getHtml()
        onChange?.(html)
      },
    })

    editorRef.current = editor

    return () => {
      editor.destroy()
    }
  }, [])

  // 更新内容
  useEffect(() => {
    if (editorRef.current && value) {
      const currentHtml = editorRef.current.getHtml()
      if (value !== currentHtml) {
        editorRef.current.setContent(value)
      }
    }
  }, [value])

  return (
    <div 
      ref={containerRef} 
      className={`${className || ''} aie-wrapper`}
      style={{ height, minHeight: height }}
    />
  )
})

AiEditorComponent.displayName = 'AiEditorComponent'

export default AiEditorComponent
