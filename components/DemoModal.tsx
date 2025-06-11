'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  if (!isOpen) return null

  const features = [
    {
      title: "📷 图片支持",
      description: "支持 JPEG、PNG、GIF、WebP 等常见图片格式"
    },
    {
      title: "🎨 SVG 矢量图",
      description: "完整支持 SVG 文件，包括动画和交互效果"
    },
    {
      title: "🎬 视频播放",
      description: "支持 MP4、WebM、OGG 格式的视频文件"
    },
    {
      title: "✨ Lottie 动画",
      description: "支持 JSON 和 .lottie 格式的动画文件"
    },
    {
      title: "📁 图集管理",
      description: "创建图集，整理和分类你的图片文件"
    },
    {
      title: "💾 持久化存储",
      description: "文件数据和图集信息保存在浏览器本地"
    },
    {
      title: "📱 响应式设计",
      description: "完美适配手机、平板和桌面设备"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">功能演示</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🚀 快速开始</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. 切换到"文件管理"上传你的媒体文件</li>
                <li>2. 切换到"图集管理"创建和整理图集</li>
                <li>3. 点击文件缩略图查看详细预览</li>
                <li>4. 文件和图集会自动保存，下次访问时恢复</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 图集功能</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 创建图集来整理相关的图片文件</li>
                <li>• 设置图集封面和描述信息</li>
                <li>• 将文件添加到多个图集中</li>
                <li>• 快速浏览图集中的所有文件</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              开始使用
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
