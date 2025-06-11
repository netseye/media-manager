import { MediaFile } from '@/app/page'

export interface Album {
  id: string
  name: string
  description?: string
  coverImage?: string
  fileIds: string[]
  createdAt: string
  updatedAt: string
}

const ALBUMS_STORAGE_KEY = 'media-manager-albums'

export class AlbumStorage {
  static saveAlbums(albums: Album[]): void {
    try {
      localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(albums))
    } catch (error) {
      console.error('Failed to save albums to localStorage:', error)
    }
  }

  static loadAlbums(): Album[] {
    try {
      const stored = localStorage.getItem(ALBUMS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load albums from localStorage:', error)
      return []
    }
  }

  static createAlbum(name: string, description?: string): Album {
    const album: Album = {
      id: `album-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      fileIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const albums = this.loadAlbums()
    albums.push(album)
    this.saveAlbums(albums)
    
    return album
  }

  static updateAlbum(albumId: string, updates: Partial<Album>): Album | null {
    const albums = this.loadAlbums()
    const index = albums.findIndex(a => a.id === albumId)
    
    if (index === -1) return null
    
    albums[index] = {
      ...albums[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.saveAlbums(albums)
    return albums[index]
  }

  static deleteAlbum(albumId: string): void {
    const albums = this.loadAlbums()
    const filtered = albums.filter(a => a.id !== albumId)
    this.saveAlbums(filtered)
  }

  static addFileToAlbum(albumId: string, fileId: string): boolean {
    const albums = this.loadAlbums()
    const album = albums.find(a => a.id === albumId)
    
    if (!album || album.fileIds.includes(fileId)) return false
    
    album.fileIds.push(fileId)
    album.updatedAt = new Date().toISOString()
    
    this.saveAlbums(albums)
    return true
  }

  static removeFileFromAlbum(albumId: string, fileId: string): boolean {
    const albums = this.loadAlbums()
    const album = albums.find(a => a.id === albumId)
    
    if (!album) return false
    
    album.fileIds = album.fileIds.filter(id => id !== fileId)
    album.updatedAt = new Date().toISOString()
    
    this.saveAlbums(albums)
    return true
  }

  static getAlbumFiles(album: Album, allFiles: MediaFile[]): MediaFile[] {
    return allFiles.filter(file => album.fileIds.includes(file.id))
  }

  static getFileAlbums(fileId: string): Album[] {
    const albums = this.loadAlbums()
    return albums.filter(album => album.fileIds.includes(fileId))
  }

  static setCoverImage(albumId: string, fileId: string): boolean {
    const albums = this.loadAlbums()
    const album = albums.find(a => a.id === albumId)
    
    if (!album || !album.fileIds.includes(fileId)) return false
    
    album.coverImage = fileId
    album.updatedAt = new Date().toISOString()
    
    this.saveAlbums(albums)
    return true
  }

  static clearAll(): void {
    localStorage.removeItem(ALBUMS_STORAGE_KEY)
  }
}
