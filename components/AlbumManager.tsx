'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderPlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Album, AlbumStorage } from '@/lib/albums'
import { MediaFile } from '@/app/page'

interface AlbumManagerProps {
  albums: Album[]
  files: MediaFile[]
  onAlbumsChange: () => void
  onAlbumSelect: (album: Album | null) => void
  selectedAlbum: Album | null
  canManage?: boolean // 新增：是否有管理权限
}

interface AlbumFormData {
  name: string
  description: string
}

export default function AlbumManager({ 
  albums, 
  files, 
  onAlbumsChange, 
  onAlbumSelect,
  selectedAlbum,
  canManage = false
}: AlbumManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [formData, setFormData] = useState<AlbumFormData>({ name: '', description: '' })

  const handleCreateAlbum = () => {
    if (!formData.name.trim()) return
    
    AlbumStorage.createAlbum(formData.name, formData.description)
    setFormData({ name: '', description: '' })
    setShowCreateForm(false)
    onAlbumsChange()
  }

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album)
    setFormData({ name: album.name, description: album.description || '' })
    setShowCreateForm(true)
  }

  const handleUpdateAlbum = () => {
    if (!editingAlbum || !formData.name.trim()) return
    
    AlbumStorage.updateAlbum(editingAlbum.id, {
      name: formData.name,
      description: formData.description
    })
    
    setEditingAlbum(null)
    setFormData({ name: '', description: '' })
    setShowCreateForm(false)
    onAlbumsChange()
  }

  const handleDeleteAlbum = (album: Album) => {
    if (confirm(`确定要删除图集 "${album.name}" 吗？这不会删除其中的文件。`)) {
      AlbumStorage.deleteAlbum(album.id)
      if (selectedAlbum?.id === album.id) {
        onAlbumSelect(null)
      }
      onAlbumsChange()
    }
  }

  const getAlbumCoverImage = (album: Album): string | null => {
    if (album.coverImage) {
      const coverFile = files.find(f => f.id === album.coverImage)
      return coverFile?.url || null
    }
    
    const albumFiles = AlbumStorage.getAlbumFiles(album, files)
    const imageFiles = albumFiles.filter(f => f.type === 'image' || f.type === 'svg')
    return imageFiles.length > 0 ? imageFiles[0].url : null
  }

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setShowCreateForm(false)
    setEditingAlbum(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          图集管理 ({albums.length})
        </h2>
        {canManage && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <FolderPlusIcon className="h-4 w-4" />
            <span>新建图集</span>
          </button>
        )}
      </div>

      {/* 创建/编辑表单 */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border rounded-lg p-4"
          >
            <h3 className="font-medium text-gray-800 mb-3">
              {editingAlbum ? '编辑图集' : '创建新图集'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  图集名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="输入图集名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述 (可选)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入图集描述"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}
                  disabled={!formData.name.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {editingAlbum ? '更新' : '创建'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图集列表 */}
      {albums.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FolderPlusIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>还没有创建任何图集</p>
          <p className="text-sm">点击上方按钮创建你的第一个图集</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album, index) => {
            const coverImage = getAlbumCoverImage(album)
            const fileCount = album.fileIds.length
            const isSelected = selectedAlbum?.id === album.id

            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
                  transition-all duration-200 hover:shadow-lg hover:scale-105
                  ${isSelected ? 'ring-2 ring-primary-500' : ''}
                `}
                onClick={() => onAlbumSelect(isSelected ? null : album)}
              >
                {/* 封面图片 */}
                <div className="aspect-video bg-gray-100 relative">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* 文件数量标签 */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    {fileCount} 个文件
                  </div>

                  {/* 操作按钮 - 只在有权限时显示 */}
                  {canManage && (
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditAlbum(album)
                        }}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="编辑图集"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteAlbum(album)
                        }}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        title="删除图集"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 图集信息 */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate mb-1">
                    {album.name}
                  </h3>
                  {album.description && (
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {album.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    创建于 {new Date(album.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
