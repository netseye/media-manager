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
import LoginModal from '@/components/LoginModal'
import UserMenu from '@/components/UserMenu'
import PermissionPrompt from '@/components/PermissionPrompt'
import { ToastManager } from '@/components/Toast'
import { FileStorage } from '@/lib/storage'
import { Album, AlbumStorage } from '@/lib/albums'
import { AuthService, User } from '@/lib/auth'
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
  const [storageRefreshTrigger, setStorageRefreshTrigger] = useState(0)
  // 身份验证状态
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    // 检查登录状态
    const authState = AuthService.getCurrentAuth()
    if (authState.isAuthenticated && authState.user) {
      setCurrentUser(authState.user)
    }

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
    // 检查上传权限
    if (!AuthService.canUpload(currentUser)) {
      addToast('您没有权限上传文件，请先登录', 'error')
      setShowLoginModal(true)
      return
    }

    const processedFiles: MediaFile[] = []
    
    for (const file of newFiles) {
      try {
        const storedFile = await FileStorage.saveFile(file)
        FileStorage.addFile(storedFile)
        const mediaFile = FileStorage.convertToMediaFile(storedFile)
        processedFiles.push(mediaFile)
      } catch (error) {
        console.error('Failed to process file:', file.name, error)
        addToast(`上传文件 ${file.name} 失败`, 'error')
      }
    }
    
    if (processedFiles.length > 0) {
      setFiles(prev => [...processedFiles, ...prev])
      addToast(`成功上传 ${processedFiles.length} 个文件`, 'success')
    }
    // 触发存储信息更新
    setStorageRefreshTrigger(prev => prev + 1)
  }

  const handleFileDelete = (fileId: string) => {
    // 检查删除权限
    if (!AuthService.canDelete(currentUser)) {
      addToast('您没有权限删除文件', 'error')
      return
    }

    FileStorage.deleteFile(fileId)
    setFiles(prev => prev.filter(file => file.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
    addToast('文件已删除', 'success')
    // 触发存储信息更新
    setStorageRefreshTrigger(prev => prev + 1)
  }

  const handleFileSelect = (file: MediaFile) => {
    setSelectedFile(file)
  }

  const handleClearAll = () => {
    // 检查删除权限
    if (!AuthService.canDelete(currentUser)) {
      addToast('您没有权限清空文件', 'error')
      return
    }

    setFiles([])
    setSelectedFile(null)
    addToast('所有文件已清空', 'success')
    // 触发存储信息更新
    setStorageRefreshTrigger(prev => prev + 1)
  }

  // 身份验证处理函数
  const handleLogin = (user: User) => {
    setCurrentUser(user)
    addToast(`欢迎回来，${user.username}！`, 'success')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSelectedFile(null)
    addToast('已退出登录', 'info')
  }

  const handleShowLogin = () => {
    setShowLoginModal(true)
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
        className="mb-8"
      >
        {/* 顶部用户菜单 */}
        <div className="flex justify-end mb-4">
          <UserMenu 
            user={currentUser}
            onLogin={handleShowLogin}
            onLogout={handleLogout}
          />
        </div>

        {/* 标题和描述 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            媒体文件管理器
          </h1>
          <p className="text-gray-600 mb-4">
            上传、管理和预览你的图片、SVG、Lottie动画和视频文件
            {!currentUser && (
              <span className="block text-sm text-amber-600 mt-1">
                ⚠️ 请登录以使用完整功能（上传、删除等）
              </span>
            )}
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
                disabled={!AuthService.canManageAlbums(currentUser)}
              >
                <FolderIcon className="h-4 w-4" />
                <span>图集管理</span>
              </button>
            </div>
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
                  canDelete={AuthService.canDelete(currentUser)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FileUpload 
                  onUpload={handleFileUpload} 
                  canUpload={AuthService.canUpload(currentUser)}
                  onRequestLogin={handleShowLogin}
                />
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
                  canDelete={AuthService.canDelete(currentUser)}
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
              {!AuthService.canManageAlbums(currentUser) ? (
                <PermissionPrompt
                  title="需要登录以管理图集"
                  description="图集管理功能需要用户权限。登录后您可以创建、编辑和删除图集，以及添加文件到图集中。"
                  icon="shield"
                  onLogin={handleShowLogin}
                />
              ) : (
                <AlbumManager
                  albums={albums}
                  files={files}
                  onAlbumsChange={handleAlbumsChange}
                  onAlbumSelect={handleAlbumSelect}
                  selectedAlbum={selectedAlbum}
                  canManage={AuthService.canManageAlbums(currentUser)}
                />
              )}
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
                canManage={AuthService.canManageAlbums(currentUser)}
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
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLogin}
      />
      <ToastManager toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
