'use client'

import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // 如果总数少于等于每页数量，不显示分页
  if (totalPages <= 1) {
    return null
  }

  const getVisiblePages = () => {
    const delta = 2 // 当前页前后显示的页数
    const range = []
    const rangeWithDots = []

    // 计算显示的页码范围
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    // 添加第一页
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    // 添加中间页码
    rangeWithDots.push(...range)

    // 添加最后一页
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* 信息显示 */}
      <div className="text-sm text-gray-600">
        显示 {startItem} - {endItem} 条，共 {totalItems} 条
      </div>

      {/* 分页控件 */}
      <div className="flex items-center space-x-1">
        {/* 首页按钮 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="首页"
        >
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        </button>

        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="上一页"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {/* 页码按钮 */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="下一页"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        {/* 末页按钮 */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="末页"
        >
          <ChevronDoubleRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* 快速跳转 */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-600">跳转到</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt((e.target as HTMLInputElement).value)
              if (page >= 1 && page <= totalPages) {
                onPageChange(page)
                ;(e.target as HTMLInputElement).value = ''
              }
            }
          }}
          placeholder={currentPage.toString()}
        />
        <span className="text-gray-600">页</span>
      </div>
    </div>
  )
}
