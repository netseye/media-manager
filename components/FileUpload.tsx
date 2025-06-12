'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { MediaFile } from '@/app/page'

interface FileUploadProps {
  onUpload: (files: File[]) => void
  canUpload?: boolean // 新增：是否有上传权限
  onRequestLogin?: () => void // 新增：请求登录回调
}

export default function FileUpload({ onUpload, canUpload = false, onRequestLogin }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!canUpload) {
      onRequestLogin?.()
      return
    }
    onUpload(acceptedFiles)
  }, [onUpload, canUpload, onRequestLogin])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'application/json': ['.json'],
      '.lottie': []
    },
    multiple: true
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${!canUpload 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
          : isDragActive 
            ? 'border-primary-500 bg-primary-50 cursor-pointer' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 cursor-pointer'
        }
      `}
    >
      <input {...getInputProps()} disabled={!canUpload} />
      <CloudArrowUpIcon className={`mx-auto h-12 w-12 mb-4 ${canUpload ? 'text-gray-400' : 'text-gray-300'}`} />
      {!canUpload ? (
        <div>
          <p className="text-lg text-gray-500 mb-2">
            需要登录后才能上传文件
          </p>
          <p className="text-sm text-gray-400">
            请点击右上角登录按钮
          </p>
        </div>
      ) : isDragActive ? (
        <p className="text-lg text-primary-600">释放文件以上传...</p>
      ) : (
        <div>
          <p className="text-lg text-gray-600 mb-2">
            拖放文件到这里，或点击选择文件
          </p>
          <p className="text-sm text-gray-500">
            支持图片 (包括 SVG)、视频 (.mp4) 和 Lottie 动画 (.json)
          </p>
        </div>
      )}
    </div>
  )
}
