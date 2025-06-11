'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { MediaFile } from '@/app/page'

interface FileUploadProps {
  onUpload: (files: File[]) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles)
  }, [onUpload])

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
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      {isDragActive ? (
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
