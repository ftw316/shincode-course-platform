export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  section_id: string
  title: string
  description: string | null
  youtube_url: string
  youtube_video_id: string
  order_index: number
  is_preview: boolean
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  video_id: string
  is_completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string | null // ユーザーが編集可能な表示名
  avatar_url: string | null   // プロフィール画像URL
  created_at: string
  updated_at: string
}

// auth.userから取得する情報の型定義
export interface AuthUserInfo {
  email: string
  full_name?: string // user_metadata.full_name
  avatar_url?: string // user_metadata.avatar_url
}