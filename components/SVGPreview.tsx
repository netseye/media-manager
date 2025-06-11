'use client'

import { useState, useEffect } from 'react'

interface SVGPreviewProps {
  url: string
  name: string
  className?: string
}

export default function SVGPreview({ url, name, className = '' }: SVGPreviewProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSVG = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setSvgContent(null) // 重置内容
        
        // 如果是 data URL，直接使用
        if (url.startsWith('data:')) {
          const response = await fetch(url)
          const svgText = await response.text()
          setSvgContent(svgText)
        } else {
          // 如果是普通 URL，获取内容
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error('Failed to load SVG')
          }
          const svgText = await response.text()
          setSvgContent(svgText)
        }
      } catch (err) {
        setError('Failed to load SVG file')
        console.error('SVG loading error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSVG()
  }, [url, name]) // 添加 name 到依赖项，确保切换文件时重新加载

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <div className="text-sm text-gray-500">正在加载 SVG...</div>
        </div>
      </div>
    )
  }

  if (error || !svgContent) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-sm text-red-500 mb-2">SVG 加载失败</div>
          <div className="text-xs text-gray-400">{error || '未知错误'}</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`flex items-center justify-center bg-white ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
