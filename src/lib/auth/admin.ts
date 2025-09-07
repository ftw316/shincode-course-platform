import { createClient } from '@/lib/supabase/server'
import { createClient as createClientClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * サーバーサイドで管理者権限をチェック
 */
export async function checkAdminRole(userId?: string): Promise<boolean> {
  const supabase = await createClient()
  
  // ユーザーIDが提供されていない場合は現在のユーザーを取得
  let currentUserId = userId
  if (!currentUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    currentUserId = user.id
  }
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', currentUserId)
    .single()
  
  return profile?.role === 'admin'
}

/**
 * クライアントサイドで管理者権限をチェック
 */
export async function checkAdminRoleClient(): Promise<boolean> {
  const supabase = createClientClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  return profile?.role === 'admin'
}

/**
 * ユーザープロフィールを作成または取得
 */
export async function ensureUserProfile(userId: string, email?: string, displayName?: string): Promise<void> {
  const supabase = await createClient()
  
  // 既存のプロフィールを確認
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  // プロフィールが存在しない場合のみ作成
  if (!existingProfile) {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        display_name: displayName || email?.split('@')[0] || 'ユーザー',
        avatar_url: null,
        role: 'user' // デフォルトは一般ユーザー
      })
    
    if (error) {
      console.error('Error creating user profile:', error)
    }
  }
}

/**
 * 管理者権限が必要なページでのアクセス制御
 */
export async function requireAdmin(): Promise<{ isAdmin: boolean; user: User | null }> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { isAdmin: false, user: null }
  }
  
  // ユーザープロフィールが存在することを確認
  await ensureUserProfile(user.id, user.email, user.user_metadata?.full_name)
  
  const isAdmin = await checkAdminRole(user.id)
  
  return { isAdmin, user }
}