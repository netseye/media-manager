'use client'

import { motion } from 'framer-motion'
import { 
  UserIcon, 
  ShieldCheckIcon, 
  ArrowRightOnRectangleIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { User, AuthService } from '@/lib/auth'

interface UserMenuProps {
  user: User | null
  onLogin: () => void
  onLogout: () => void
}

export default function UserMenu({ user, onLogin, onLogout }: UserMenuProps) {
  const handleLogout = () => {
    AuthService.logout()
    onLogout()
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={onLogin}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <UserIcon className="h-4 w-4" />
          <span>登录</span>
        </button>
      </div>
    )
  }

  const permissions = AuthService.getUserPermissions(user)
  const roleDisplay = AuthService.getRoleDisplayName(user.role)

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-3"
    >
      {/* 用户信息 */}
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border px-3 py-2">
        <div className="flex items-center space-x-2">
          <div className={`
            p-1 rounded-full
            ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 
              user.role === 'user' ? 'bg-blue-100 text-blue-600' : 
              'bg-gray-100 text-gray-600'}
          `}>
            {user.role === 'admin' ? (
              <ShieldCheckIcon className="h-4 w-4" />
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-800">{user.username}</div>
            <div className="text-xs text-gray-500">{roleDisplay}</div>
          </div>
        </div>
      </div>

      {/* 权限指示器 */}
      <div className="flex items-center space-x-1">
        {AuthService.canUpload(user) && (
          <div 
            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
            title="可以上传文件"
          >
            上传
          </div>
        )}
        {AuthService.canDelete(user) && (
          <div 
            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
            title="可以删除文件"
          >
            删除
          </div>
        )}
        {AuthService.canManageAlbums(user) && (
          <div 
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
            title="可以管理相册"
          >
            相册
          </div>
        )}
      </div>

      {/* 退出登录按钮 */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
        title="退出登录"
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        <span>退出</span>
      </button>
    </motion.div>
  )
}
