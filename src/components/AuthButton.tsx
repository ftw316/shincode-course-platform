'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const supabase = createClient()

  // 管理者状態をローカルストレージから復元
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedAdminStatus = localStorage.getItem('isAdmin')
      if (cachedAdminStatus === 'true') {
        setIsAdmin(true)
      }
    }
  }, [])

  // ユーザープロフィールの確認・作成
  const checkAndEnsureUserProfile = useCallback(async (user: User) => {
    try {
      // タイムアウト付きでデータベースクエリを実行
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 3000)
      )
      
      const queryPromise = supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      const result = await Promise.race([
        queryPromise,
        timeoutPromise
      ])
      
      const { data: existingProfile, error: selectError } = result as { 
        data: { id: string } | null; 
        error: { code?: string } | null 
      }
      
      // プロフィールが存在しない場合のみ作成
      if (!existingProfile && selectError?.code === 'PGRST116') {
        await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'ユーザー',
            avatar_url: user.user_metadata?.avatar_url || null,
            role: 'user'
          })
      }
    } catch (error) {
      // タイムアウトエラーは無視して続行
      console.log('Profile check timeout:', error)
    }
  }, [supabase])

  // 管理者権限をチェック
  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      // タイムアウト付きでデータベースクエリを実行
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin check timeout')), 3000)
      )
      
      const queryPromise = supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single()
      
      const result = await Promise.race([
        queryPromise,
        timeoutPromise
      ])
      
      const { data: profile, error } = result as { 
        data: { role: string } | null; 
        error: Error | null 
      }
      
      if (!error && profile) {
        const adminStatus = profile.role === 'admin'
        setIsAdmin(adminStatus)
        // 管理者状態をローカルストレージに保存
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAdmin', adminStatus.toString())
          localStorage.setItem('adminCheckTime', Date.now().toString())
        }
      } else {
        // エラーが発生してもキャッシュがあれば維持
        const cachedAdminStatus = typeof window !== 'undefined' 
          ? localStorage.getItem('isAdmin') === 'true' 
          : false
        setIsAdmin(cachedAdminStatus)
      }
    } catch (error) {
      // タイムアウト等のエラーでもキャッシュがあれば維持
      const cachedAdminStatus = typeof window !== 'undefined' 
        ? localStorage.getItem('isAdmin') === 'true' 
        : false
      setIsAdmin(cachedAdminStatus)
      console.log('Admin check timeout:', error)
    }
  }, [supabase])

  useEffect(() => {
    setIsMounted(true)
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // ユーザーがいる場合は管理者権限をチェック
      if (user) {
        try {
          await checkAndEnsureUserProfile(user)
          await checkAdminRole(user.id)
        } catch (profileError) {
          console.error('Profile check error:', profileError)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null
        setUser(user)
        
        if (user) {
          try {
            await checkAndEnsureUserProfile(user)
            await checkAdminRole(user.id)
          } catch (profileError) {
            console.error('Auth error:', profileError)
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(false)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, checkAndEnsureUserProfile, checkAdminRole])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    // ユーザーにフィードバックを与えるために少し待機
    await new Promise(resolve => setTimeout(resolve, 800))
    
    try {
      await supabase.auth.signOut()
      setIsAdmin(false)
      // ログアウト時にキャッシュをクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('adminCheckTime')
      }
    } catch (error) {
      console.error('ログアウトエラー:', error)
    } finally {
      // ログアウト処理完了のフィードバックを表示
      setTimeout(() => setIsSigningOut(false), 300)
    }
  }

  // 本格運用モード - 必要最小限のログのみ
  if (process.env.NODE_ENV === 'development') {
    console.log('AuthButton:', { 
      loading, 
      userEmail: user?.email, 
      isAdmin 
    })
  }

  // Show consistent loading state during hydration
  if (!isMounted || loading) {
    return (
      <div className="flex items-center gap-4" suppressHydrationWarning>
        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return user ? (
    <div className="flex items-center gap-2 sm:gap-3" suppressHydrationWarning>
      {/* 管理者メニュー */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden sm:inline">管理画面</span>
        </Link>
      )}
      
      <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 px-2 sm:px-3 py-2 rounded">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">
            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
          </span>
        </div>
        <span className="text-gray-900 text-sm font-medium hidden md:block truncate">
          {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}さん
        </span>
      </div>
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={`inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md border ${
          isSigningOut
            ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:text-white hover:bg-red-600 hover:border-red-600 shadow-sm'
        }`}
      >
        {isSigningOut ? (
          <>
            <svg className="w-4 h-4 sm:mr-2 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-medium hidden sm:inline">ログアウト中...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">ログアウト</span>
          </>
        )}
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-4" suppressHydrationWarning>
      <Link
        href="/login"
        className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
      >
        ログイン
      </Link>
      <Link
        href="/login"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
      >
        新規登録
      </Link>
    </div>
  )
}