'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon, PlayIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { MediaFile } from '@/app/page'
import { formatFileSize, formatDate } from '@/lib/utils'
import Pagination from '@/components/Pagination'

interface MediaGridProps {
  files: MediaFile[]
  onFileSelect: (file: MediaFile) => void
  onFileDelete: (fileId: string) => void
  selectedFileId?: string
  autoPreview?: boolean // 新增：是否启用鼠标悬停自动预览
}

const ITEMS_PER_PAGE = 20

export default function MediaGrid({ 
  files, 
  onFileSelect, 
  onFileDelete, 
  selectedFileId,
  autoPreview = true // 默认启用自动预览
}: MediaGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // 当文件列表变化时重置到第一页
  useEffect(() => {
    setCurrentPage(1)
  }, [files.length])

  // 计算分页数据
  const totalItems = files.length
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentFiles = files.slice(startIndex, endIndex)

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 处理鼠标悬停自动预览
  const handleMouseEnter = (file: MediaFile) => {
    if (!autoPreview) return
    
    // 清除之前的延迟
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId)
    }
    
    // 设置延迟500ms后自动选择文件
    const timeoutId = setTimeout(() => {
      onFileSelect(file)
    }, 500)
    
    setHoverTimeoutId(timeoutId)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId)
      setHoverTimeoutId(null)
    }
  }
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <PhotoIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">还没有上传任何文件</p>
        <p className="text-gray-500 text-sm">开始上传一些图片、视频或 Lottie 动画吧！</p>
      </div>
    )
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-6 w-6" />
      case 'lottie':
        return <span className="text-xs font-bold">LT</span>
      case 'svg':
        return <span className="text-xs font-bold">SVG</span>
      default:
        return <PhotoIcon className="h-6 w-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-600'
      case 'lottie':
        return 'bg-purple-100 text-purple-600'
      case 'svg':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-blue-100 text-blue-600'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        媒体文件 ({files.length})
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentFiles.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
              transition-all duration-200 hover:shadow-lg hover:scale-105
              ${selectedFileId === file.id ? 'ring-2 ring-primary-500' : ''}
            `}
            onClick={() => onFileSelect(file)}
            onMouseEnter={() => handleMouseEnter(file)}
            onMouseLeave={handleMouseLeave}
          >
            {/* 文件预览 */}
            <div className="aspect-square bg-gray-100 relative">
              {(file.type === 'image' || file.type === 'svg') ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className={`p-4 rounded-full ${getTypeColor(file.type)}`}>
                    {getFileIcon(file.type)}
                  </div>
                </div>
              )}
              
              {/* 文件类型标签 */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(file.type)}`}>
                {file.type.toUpperCase()}
              </div>

              {/* 删除按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFileDelete(file.id)
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            {/* 文件信息 */}
            <div className="p-3">
              <h3 className="font-medium text-gray-800 truncate mb-1">
                {file.name}
              </h3>
              <p className="text-xs text-gray-600">
                {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 分页组件 */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
