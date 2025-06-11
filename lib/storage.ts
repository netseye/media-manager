import { MediaFile } from '@/app/page'

const STORAGE_KEY = 'media-manager-files'
const FILE_DATA_KEY = 'media-manager-file-data'

export interface StoredFile {
  id: string
  name: string
  type: 'image' | 'lottie' | 'video' | 'svg'
  size: number
  uploadDate: string
  data: string // Base64 encoded file data
}

export class FileStorage {
  static async saveFile(file: File): Promise<StoredFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = () => {
        const data = reader.result as string
        let type: 'image' | 'lottie' | 'video' | 'svg'
        
        if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
          type = 'svg'
        } else if (file.type.startsWith('image/')) {
          type = 'image'
        } else if (file.type.startsWith('video/')) {
          type = 'video'
        } else if (file.name.endsWith('.json') || file.name.endsWith('.lottie')) {
          type = 'lottie'
        } else {
          type = 'image'
        }

        const storedFile: StoredFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          data
        }

        resolve(storedFile)
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  static saveFiles(files: StoredFile[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
    } catch (error) {
      console.error('Failed to save files to localStorage:', error)
    }
  }

  static loadFiles(): StoredFile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load files from localStorage:', error)
      return []
    }
  }

  static deleteFile(fileId: string): void {
    const files = this.loadFiles()
    const updatedFiles = files.filter(f => f.id !== fileId)
    this.saveFiles(updatedFiles)
  }

  static addFile(file: StoredFile): void {
    const files = this.loadFiles()
    files.push(file)
    this.saveFiles(files)
  }

  static convertToMediaFile(storedFile: StoredFile): MediaFile {
    return {
      id: storedFile.id,
      name: storedFile.name,
      type: storedFile.type,
      url: storedFile.data,
      size: storedFile.size,
      uploadDate: storedFile.uploadDate
    }
  }

  static convertToMediaFiles(storedFiles: StoredFile[]): MediaFile[] {
    return storedFiles.map(this.convertToMediaFile)
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  static getStorageSize(): number {
    const files = this.loadFiles()
    return files.reduce((total, file) => total + file.data.length, 0)
  }

  static formatStorageSize(): string {
    const size = this.getStorageSize()
    const units = ['B', 'KB', 'MB', 'GB']
    let index = 0
    let convertedSize = size

    while (convertedSize >= 1024 && index < units.length - 1) {
      convertedSize /= 1024
      index++
    }

    return `${convertedSize.toFixed(2)} ${units[index]}`
  }
}
