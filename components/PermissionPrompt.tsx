'use client'

import { motion } from 'framer-motion'
import { 
  ShieldExclamationIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

interface PermissionPromptProps {
  title: string
  description: string
  icon?: 'user' | 'shield' | 'lock'
  onLogin: () => void
}

export default function PermissionPrompt({ 
  title, 
  description, 
  icon = 'user',
  onLogin 
}: PermissionPromptProps) {
  const getIcon = () => {
    switch (icon) {
      case 'shield':
        return <ShieldExclamationIcon className="mx-auto h-16 w-16 text-amber-400 mb-4" />
      case 'lock':
        return <LockClosedIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      default:
        return <UserIcon className="mx-auto h-16 w-16 text-blue-400 mb-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
    >
      {getIcon()}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      <button
        onClick={onLogin}
        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
      >
        <UserIcon className="h-5 w-5 mr-2" />
        立即登录
      </button>
      
      {/* 权限说明 */}
      <div className="mt-8 bg-white rounded-lg p-4 mx-auto max-w-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-800 mb-2">权限说明</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center justify-between">
            <span>查看文件</span>
            <span className="text-green-600">✓ 所有人</span>
          </div>
          <div className="flex items-center justify-between">
            <span>上传文件</span>
            <span className="text-blue-600">✓ 用户/管理员</span>
          </div>
          <div className="flex items-center justify-between">
            <span>管理图集</span>
            <span className="text-blue-600">✓ 用户/管理员</span>
          </div>
          <div className="flex items-center justify-between">
            <span>删除文件</span>
            <span className="text-red-600">✓ 仅管理员</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
