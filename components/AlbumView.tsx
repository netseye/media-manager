'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  MinusIcon,
  StarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Album, AlbumStorage } from '@/lib/albums'
import { MediaFile } from '@/app/page'
import { formatDate } from '@/lib/utils'

interface AlbumViewProps {
  album: Album
  files: MediaFile[]
  allFiles: MediaFile[]
  onBack: () => void
  onFileSelect: (file: MediaFile) => void
  onAlbumsChange: () => void
  selectedFileId?: string
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void
}

export default function AlbumView({
  album,
  files,
  allFiles,
  onBack,
  onFileSelect,
  onAlbumsChange,
  selectedFileId,
  onToast
}: AlbumViewProps) {
  const [showAddFiles, setShowAddFiles] = useState(false)
  const [isAddingFile, setIsAddingFile] = useState<string | null>(null)
  const [isRemovingFile, setIsRemovingFile] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAllFiles, setShowAllFiles] = useState(false)
  
  // 获取不在当前图集中的文件
  const availableFiles = allFiles.filter(file => 
    !album.fileIds.includes(file.id) && 
    (file.type === 'image' || file.type === 'svg') &&
    (searchTerm === '' || file.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // 限制显示的文件数量
  const displayFiles = showAllFiles ? availableFiles : availableFiles.slice(0, 12)

  const handleAddFile = async (fileId: string) => {
    setIsAddingFile(fileId)
    try {
      const success = AlbumStorage.addFileToAlbum(album.id, fileId)
      if (success) {
        onAlbumsChange()
        onToast?.('文件已添加到图集', 'success')
      } else {
        onToast?.('添加文件失败', 'error')
      }
      // 给用户一些视觉反馈
      setTimeout(() => setIsAddingFile(null), 500)
    } catch (error) {
      console.error('Failed to add file to album:', error)
      onToast?.('添加文件失败', 'error')
      setIsAddingFile(null)
    }
  }

  const handleRemoveFile = async (fileId: string) => {
    setIsRemovingFile(fileId)
    try {
      const success = AlbumStorage.removeFileFromAlbum(album.id, fileId)
      if (success) {
        onAlbumsChange()
        onToast?.('文件已从图集中移除', 'success')
      } else {
        onToast?.('移除文件失败', 'error')
      }
      // 给用户一些视觉反馈
      setTimeout(() => setIsRemovingFile(null), 500)
    } catch (error) {
      console.error('Failed to remove file from album:', error)
      onToast?.('移除文件失败', 'error')
      setIsRemovingFile(null)
    }
  }

  const handleSetCover = (fileId: string) => {
    AlbumStorage.setCoverImage(album.id, fileId)
    onAlbumsChange()
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'svg':
        return <span className="text-xs font-bold">SVG</span>
      default:
        return <PhotoIcon className="h-6 w-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'svg':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-blue-100 text-blue-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{album.name}</h1>
            {album.description && (
              <p className="text-gray-600">{album.description}</p>
            )}
            <p className="text-sm text-gray-500">
              {files.length} 个文件 • 创建于 {formatDate(album.createdAt)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddFiles(!showAddFiles)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span>添加文件</span>
        </button>
      </div>

      {/* 添加文件面板 */}
      {showAddFiles && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800">
              添加文件到图集 ({availableFiles.length} 个可用)
            </h3>
            <button
              onClick={() => setShowAddFiles(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* 搜索框 */}
          {availableFiles.length > 6 && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="搜索文件名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}
          
          {availableFiles.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {searchTerm ? '没有找到匹配的文件' : '没有可添加的文件'}
            </p>
          ) : (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {displayFiles.map((file) => (
                <div
                  key={file.id}
                  className={`
                    relative group bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer 
                    hover:shadow-md transition-all duration-200
                    ${isAddingFile === file.id ? 'opacity-50 pointer-events-none' : ''}
                  `}
                  onClick={() => handleAddFile(file.id)}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {(file.type === 'image' || file.type === 'svg') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className={`p-2 rounded-full ${getTypeColor(file.type)}`}>
                          {getFileIcon(file.type)}
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      {isAddingFile === file.id ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        <PlusIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <p className="text-xs text-gray-700 truncate">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
              
          {/* 显示更多按钮 */}
          {!showAllFiles && availableFiles.length > 12 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllFiles(true)}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
              >
                显示全部 {availableFiles.length} 个文件
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )}

      {/* 图集文件网格 */}
      {files.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">图集为空</p>
          <p className="text-gray-400 text-sm">点击上方按钮添加文件到这个图集</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
                transition-all duration-200 hover:shadow-lg hover:scale-105
                ${selectedFileId === file.id ? 'ring-2 ring-primary-500' : ''}
                ${isRemovingFile === file.id ? 'opacity-50' : ''}
              `}
              onClick={() => onFileSelect(file)}
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
                
                {/* 封面标识 */}
                {album.coverImage === file.id && (
                  <div className="absolute top-2 left-2 p-1 bg-yellow-500 text-white rounded-full">
                    <StarIcon className="h-3 w-3" />
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {album.coverImage !== file.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetCover(file.id)
                      }}
                      className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      title="设为封面"
                    >
                      <StarIcon className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(file.id)
                    }}
                    disabled={isRemovingFile === file.id}
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="从图集移除"
                  >
                    {isRemovingFile === file.id ? (
                      <div className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MinusIcon className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* 文件信息 */}
              <div className="p-3">
                <h3 className="font-medium text-gray-800 truncate mb-1">
                  {file.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {file.type.toUpperCase()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
