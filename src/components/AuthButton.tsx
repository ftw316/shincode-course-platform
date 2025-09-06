'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="py-2 px-4 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        読み込み中...
      </div>
    )
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 dark:text-gray-300">
        こんにちは、{user.user_metadata?.full_name || user.email}さん
      </span>
      <button
        onClick={handleSignOut}
        className="py-2 px-4 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
      >
        ログアウト
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
    >
      ログイン
    </Link>
  )
}