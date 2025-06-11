'use client'

import { useState, useEffect } from 'react'
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
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 当文件变化时重置所有状态
  useEffect(() => {
    setLottieData(null)
    setIsLottieLoading(false)
    setImageLoading(false)
    setImageError(false)
    
    // 如果是Lottie文件，自动加载
    if (file && file.type === 'lottie') {
      loadLottieData(file.url)
    }
  }, [file?.id])

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
              <div className="relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <div className="text-sm text-gray-500">正在加载图片...</div>
                    </div>
                  </div>
                )}
                {imageError ? (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <div className="text-sm text-red-500 mb-2">图片加载失败</div>
                      <div className="text-xs text-gray-400">无法显示该图片文件</div>
                    </div>
                  </div>
                ) : (
                  <img
                    key={file.id}
                    src={file.url}
                    alt={file.name}
                    className="w-full h-auto max-h-96 object-contain"
                    onLoadStart={() => setImageLoading(true)}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false)
                      setImageError(true)
                    }}
                  />
                )}
              </div>
            )}

            {file.type === 'svg' && (
              <SVGPreview
                key={file.id} // 添加key确保组件在文件切换时重新挂载
                url={file.url}
                name={file.name}
                className="w-full h-96"
              />
            )}

            {file.type === 'video' && (
              <video
                key={file.id}
                src={file.url}
                controls
                preload="metadata" // 自动预加载视频元数据
                className="w-full h-auto max-h-96"
              >
                您的浏览器不支持视频播放。
              </video>
            )}

            {file.type === 'lottie' && (
              <div className="flex flex-col items-center justify-center p-8">
                {isLottieLoading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">正在加载 Lottie 动画...</p>
                  </div>
                )}

                {lottieData && !isLottieLoading && (
                  <div className="w-full max-w-xs">
                    <Lottie
                      animationData={lottieData}
                      loop={true}
                      autoplay={true}
                    />
                  </div>
                )}

                {!lottieData && !isLottieLoading && (
                  <div className="text-center text-gray-500">
                    <p>Lottie 动画加载失败</p>
                    <button
                      onClick={() => loadLottieData(file.url)}
                      className="mt-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      重新加载
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 文件信息 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">类型：</span>
              <span className="font-medium text-gray-900">{file.type.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">大小：</span>
              <span className="font-medium text-gray-900">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">上传时间：</span>
              <span className="font-medium text-gray-900">{formatDate(file.uploadDate)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
