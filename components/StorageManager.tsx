'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { FileStorage } from '@/lib/storage'

interface StorageManagerProps {
  onClearAll: () => void
  refreshTrigger?: number // 添加一个触发刷新的prop
}

export default function StorageManager({ onClearAll, refreshTrigger }: StorageManagerProps) {
  const [storageSize, setStorageSize] = useState('0 B')
  const [fileCount, setFileCount] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    updateStorageInfo()
  }, [refreshTrigger]) // 当refreshTrigger变化时重新加载

  const updateStorageInfo = () => {
    const files = FileStorage.loadFiles()
    setFileCount(files.length)
    setStorageSize(FileStorage.formatStorageSize())
  }

  const handleClearAll = () => {
    FileStorage.clearAll()
    onClearAll()
    updateStorageInfo()
    setShowConfirm(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">存储信息</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>文件数量: <span className="font-medium">{fileCount}</span></p>
            <p>存储大小: <span className="font-medium">{storageSize}</span></p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              文件数据保存在浏览器本地存储中。清除浏览器数据会删除所有上传的文件。
            </div>
          </div>
          
          {fileCount > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm"
            >
              <TrashIcon className="h-4 w-4" />
              <span>清空所有</span>
            </button>
          )}
        </div>
      </div>

      {/* 确认对话框 */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-2">确认清空</h4>
            <p className="text-gray-600 mb-4">
              此操作将删除所有上传的文件，无法恢复。确定要继续吗？
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
