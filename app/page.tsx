'use client'
import { motion } from 'framer-motion'
import { InformationCircleIcon, FolderIcon } from '@heroicons/react/24/outline'
import FileUpload from '@/components/FileUpload'
import MediaGrid from '@/components/MediaGrid'
import MediaPreview from '@/components/MediaPreview'
import StorageManager from '@/components/StorageManager'
import DemoModal from '@/components/DemoModal'
import AlbumManager from '@/components/AlbumManager'
import AlbumView from '@/components/AlbumView'
import { ToastManager } from '@/components/Toast'
import { FileStorage } from '@/lib/storage'
import { Album, AlbumStorage } from '@/lib/albums'
import { useEffect, useState } from 'react'

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'lottie' | 'video' | 'svg'
  url: string
  size: number
  uploadDate: string
}

export default function Home() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDemo, setShowDemo] = useState(false)
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [currentView, setCurrentView] = useState<'files' | 'albums' | 'album-detail'>('files')
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>>([])
  const [storageRefreshTrigger, setStorageRefreshTrigger] = useState(0) // 添加存储刷新触发器

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    // 从 localStorage 加载已保存的文件
    const storedFiles = FileStorage.loadFiles()
    const mediaFiles = FileStorage.convertToMediaFiles(storedFiles)
    // 按上传时间倒序排列（最新的文件在前面）
    const sortedFiles = mediaFiles.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    setFiles(sortedFiles)
    
    // 加载图集
    const storedAlbums = AlbumStorage.loadAlbums()
    setAlbums(storedAlbums)
    
    setIsLoading(false)
  }, [])

  const handleFileUpload = async (newFiles: File[]) => {
    const processedFiles: MediaFile[] = []
    
    for (const file of newFiles) {
      try {
        const storedFile = await FileStorage.saveFile(file)
        FileStorage.addFile(storedFile)
        const mediaFile = FileStorage.convertToMediaFile(storedFile)
        processedFiles.push(mediaFile)
      } catch (error) {
        console.error('Failed to process file:', file.name, error)
      }
    }
    
    setFiles(prev => [...processedFiles, ...prev])
    // 触发存储信息更新
    setStorageRefreshTrigger(prev => prev + 1)
  }

  const handleFileDelete = (fileId: string) => {
    FileStorage.deleteFile(fileId)
    setFiles(prev => prev.filter(file => file.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
    // 触发存储信息更新
    setStorageRefreshTrigger(prev => prev + 1)
  }

  const handleFileSelect = (file: MediaFile) => {
    setSelectedFile(file)
  }

  const handleClearAll = () => {
    setFiles([])
    setSelectedFile(null)
    // 触发存储信息更新
    setStorageRefreshTrigger(prev => prev + 1)
  }

  const handleAlbumsChange = () => {
    const storedAlbums = AlbumStorage.loadAlbums()
    setAlbums(storedAlbums)
    // 如果当前正在查看图集详情，需要更新选中的图集数据
    if (selectedAlbum) {
      const updatedAlbum = storedAlbums.find(a => a.id === selectedAlbum.id)
      if (updatedAlbum) {
        setSelectedAlbum(updatedAlbum)
      } else {
        // 如果图集被删除了，返回图集列表
        setSelectedAlbum(null)
        setCurrentView('albums')
      }
    }
  }

  const handleAlbumSelect = (album: Album | null) => {
    setSelectedAlbum(album)
    if (album) {
      setCurrentView('album-detail')
    }
  }

  const handleBackToAlbums = () => {
    setSelectedAlbum(null)
    setCurrentView('albums')
  }

  const getCurrentAlbumFiles = (): MediaFile[] => {
    if (!selectedAlbum) return []
    return AlbumStorage.getAlbumFiles(selectedAlbum, files)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          媒体文件管理器
        </h1>
        <p className="text-gray-600 mb-4">
          上传、管理和预览你的图片、SVG、Lottie动画和视频文件
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setShowDemo(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
          >
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            查看功能介绍
          </button>
          
          {/* 视图切换按钮 */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('files')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                currentView === 'files' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              文件管理
            </button>
            <button
              onClick={() => setCurrentView('albums')}
              className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center space-x-1 ${
                currentView === 'albums' || currentView === 'album-detail'
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FolderIcon className="h-4 w-4" />
              <span>图集管理</span>
            </button>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 文件管理视图 */}
          {currentView === 'files' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StorageManager 
                  onClearAll={handleClearAll} 
                  refreshTrigger={storageRefreshTrigger}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FileUpload onUpload={handleFileUpload} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <MediaGrid 
                  files={files} 
                  onFileSelect={handleFileSelect}
                  onFileDelete={handleFileDelete}
                  selectedFileId={selectedFile?.id}
                />
              </motion.div>
            </>
          )}

          {/* 图集管理视图 */}
          {currentView === 'albums' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AlbumManager
                albums={albums}
                files={files}
                onAlbumsChange={handleAlbumsChange}
                onAlbumSelect={handleAlbumSelect}
                selectedAlbum={selectedAlbum}
              />
            </motion.div>
          )}

          {/* 图集详情视图 */}
          {currentView === 'album-detail' && selectedAlbum && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AlbumView
                album={selectedAlbum}
                files={getCurrentAlbumFiles()}
                allFiles={files}
                onBack={handleBackToAlbums}
                onFileSelect={handleFileSelect}
                onAlbumsChange={handleAlbumsChange}
                selectedFileId={selectedFile?.id}
                onToast={addToast}
              />
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MediaPreview 
              file={selectedFile} 
              onClose={() => setSelectedFile(null)}
            />
          </motion.div>
        </div>
      </div>

      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
      <ToastManager toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
