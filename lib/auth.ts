// 身份验证和权限管理
export interface User {
  id: string
  username: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

// 权限定义
export const Permissions = {
  UPLOAD_FILES: 'upload_files',
  DELETE_FILES: 'delete_files',
  MANAGE_ALBUMS: 'manage_albums',
  VIEW_FILES: 'view_files',
} as const

type Permission = typeof Permissions[keyof typeof Permissions]

// 角色权限映射
const RolePermissions: Record<User['role'], Permission[]> = {
  admin: [
    Permissions.UPLOAD_FILES,
    Permissions.DELETE_FILES,
    Permissions.MANAGE_ALBUMS,
    Permissions.VIEW_FILES,
  ],
  user: [
    Permissions.UPLOAD_FILES,
    Permissions.MANAGE_ALBUMS,
    Permissions.VIEW_FILES,
  ],
  guest: [
    Permissions.VIEW_FILES,
  ],
}

// 默认用户配置
const DEFAULT_USERS = [
  {
    id: 'admin',
    username: 'admin',
    password: 'admin123', // 在实际应用中应该使用哈希
    role: 'admin' as const,
  },
  {
    id: 'user',
    username: 'user',
    password: 'user123',
    role: 'user' as const,
  },
]

const AUTH_STORAGE_KEY = 'media-manager-auth'
const USERS_STORAGE_KEY = 'media-manager-users'

export class AuthService {
  // 初始化默认用户
  static initializeDefaultUsers(): void {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY)
    if (!existingUsers) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS))
    }
  }

  // 登录
  static async login(username: string, password: string): Promise<AuthState | null> {
    try {
      this.initializeDefaultUsers()
      const usersData = localStorage.getItem(USERS_STORAGE_KEY)
      const users = usersData ? JSON.parse(usersData) : []
      
      const user = users.find((u: any) => u.username === username && u.password === password)
      
      if (user) {
        const authUser: User = {
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: new Date().toISOString(),
        }
        
        const token = this.generateToken(authUser)
        const authState: AuthState = {
          isAuthenticated: true,
          user: authUser,
          token,
        }
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
        return authState
      }
      
      return null
    } catch (error) {
      console.error('Login failed:', error)
      return null
    }
  }

  // 退出登录
  static logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  // 获取当前认证状态
  static getCurrentAuth(): AuthState {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)
      if (authData) {
        const authState = JSON.parse(authData) as AuthState
        // 简单的token验证（在实际应用中应该更严格）
        if (authState.token && authState.user) {
          return authState
        }
      }
    } catch (error) {
      console.error('Failed to get auth state:', error)
    }
    
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    }
  }

  // 检查权限
  static hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false
    return RolePermissions[user.role].includes(permission)
  }

  // 检查是否可以上传
  static canUpload(user: User | null): boolean {
    return this.hasPermission(user, Permissions.UPLOAD_FILES)
  }

  // 检查是否可以删除
  static canDelete(user: User | null): boolean {
    return this.hasPermission(user, Permissions.DELETE_FILES)
  }

  // 检查是否可以管理相册
  static canManageAlbums(user: User | null): boolean {
    return this.hasPermission(user, Permissions.MANAGE_ALBUMS)
  }

  // 生成简单的token（在实际应用中应该使用JWT等）
  private static generateToken(user: User): string {
    return btoa(JSON.stringify({
      userId: user.id,
      timestamp: Date.now(),
    }))
  }

  // 获取用户角色显示名称
  static getRoleDisplayName(role: User['role']): string {
    switch (role) {
      case 'admin':
        return '管理员'
      case 'user':
        return '用户'
      case 'guest':
        return '访客'
      default:
        return '未知'
    }
  }

  // 获取用户权限列表
  static getUserPermissions(user: User | null): Permission[] {
    if (!user) return []
    return RolePermissions[user.role]
  }
}
