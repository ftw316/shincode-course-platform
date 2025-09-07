"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import dynamic from "next/dynamic"
import type { User } from "@supabase/supabase-js"

// AuthButtonを動的インポートで遅延読み込み
const AuthButton = dynamic(() => import("@/components/AuthButton"), {
  loading: () => (
    <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
  ),
})

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const supabase = createClient()
    
    // 初期認証状態を取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // マウント前は何も表示しない（Hydrationエラー回避）
  if (!mounted) {
    return null
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="text-2xl font-bold text-purple-600">
              ShinCode
            </div>
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <div className="relative">
                <button className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-1">
                  カテゴリー
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <button className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                講師になる
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="講座を検索..."
                  className="w-64 lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <AuthButton />
            
            {user && (
              <button className="md:hidden text-gray-700 hover:text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}