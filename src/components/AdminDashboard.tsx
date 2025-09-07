'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 管理画面の重いコンポーネントを動的インポート
const CourseManagement = dynamic(() => import('@/app/admin/courses/page'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  ),
})

const VideoManagement = dynamic(() => import('@/app/admin/videos/page'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  ),
})

interface AdminDashboardProps {
  activeTab: 'courses' | 'videos'
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded"></div>}>
        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'videos' && <VideoManagement />}
      </Suspense>
    </div>
  )
}