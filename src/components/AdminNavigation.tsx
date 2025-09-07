'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// 管理画面のナビゲーション用の重いアイコンを動的読み込み
const Icons = dynamic(() => import('react-icons/md').then(mod => ({
  default: {
    MdDashboard: mod.MdDashboard,
    MdVideoLibrary: mod.MdVideoLibrary,
    MdBook: mod.MdBook,
    MdSettings: mod.MdSettings,
  }
})), {
  loading: () => <div className="w-5 h-5 bg-gray-300 animate-pulse rounded"></div>,
})

interface AdminNavigationProps {
  className?: string
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/admin', label: 'ダッシュボード', icon: 'MdDashboard' },
    { href: '/admin/courses', label: '講座管理', icon: 'MdBook' },
    { href: '/admin/videos', label: '動画管理', icon: 'MdVideoLibrary' },
    { href: '/admin/settings', label: '設定', icon: 'MdSettings' },
  ]

  return (
    <nav className={`space-y-1 ${className}`}>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="mr-3">
              <Icons />
            </div>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}