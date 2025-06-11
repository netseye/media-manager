'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import Lottie from 'lottie-react'
import { MediaFile } from '@/app/page'
import { formatFileSize, formatDate } from '@/lib/utils'
import SVGPreview from '@/components/SVGPreview'

interface MediaPreviewProps {
  file: MediaFile | null
  onClose: () => void
}

export default function MediaPreview({ file, onClose }: MediaPreviewProps) {
  const [lottieData, setLottieData] = useState(null)
  const [isLottieLoading, setIsLottieLoading] = useState(false)

  const loadLottieData = async (url: string) => {
    setIsLottieLoading(true)
    try {
      const response = await fetch(url)
      const data = await response.json()
      setLottieData(data)
    } catch (error) {
      console.error('Failed to load Lottie animation:', error)
    } finally {
      setIsLottieLoading(false)
    }
  }

  const handleDownload = () => {
    if (!file) return
    
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!file) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600">选择一个文件进行预览</p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-8"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-800 truncate mr-2">
            {file.name}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="下载文件"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="关闭预览"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 预览内容 */}
        <div className="p-4">
          <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden">
            {file.type === 'image' && (
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-auto max-h-96 object-contain"
              />
            )}

            {file.type === 'svg' && (
              <SVGPreview
                url={file.url}
                name={file.name}
                className="w-full h-96"
              />
            )}

            {file.type === 'video' && (
              <video
                src={file.url}
                controls
                className="w-full h-auto max-h-96"
              >
                您的浏览器不支持视频播放。
              </video>
            )}

            {file.type === 'lottie' && (
              <div className="flex flex-col items-center justify-center p-8">
                {!lottieData && !isLottieLoading && (
                  <button
                    onClick={() => loadLottieData(file.url)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    加载 Lottie 动画
                  </button>
                )}

                {isLottieLoading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">加载中...</p>
                  </div>
                )}

                {lottieData && (
                  <div className="w-full max-w-xs">
                    <Lottie
                      animationData={lottieData}
                      loop={true}
                      autoplay={true}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 文件信息 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">类型：</span>
              <span className="font-medium">{file.type.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">大小：</span>
              <span className="font-medium">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">上传时间：</span>
              <span className="font-medium">{formatDate(file.uploadDate)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
