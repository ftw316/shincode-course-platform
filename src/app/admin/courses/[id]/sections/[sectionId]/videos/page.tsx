import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SectionWithCourse } from '@/lib/supabase/types'

interface VideoManagementProps {
  params: Promise<{ id: string; sectionId: string }>
}

// YouTube動画IDを抽出する関数
function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// YouTube URLを検証する関数
function validateYouTubeUrl(url: string): { isValid: boolean; videoId?: string; error?: string } {
  try {
    const videoId = getYouTubeVideoId(url)
    if (!videoId) {
      return { isValid: false, error: '有効なYouTube URLを入力してください' }
    }
    return { isValid: true, videoId }
  } catch {
    return { isValid: false, error: 'URLの形式が正しくありません' }
  }
}

async function createVideo(sectionId: string, formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const youtubeUrl = formData.get('youtube_url') as string
  const isPreview = formData.get('is_preview') === 'on'
  
  if (!title || !youtubeUrl) {
    throw new Error('タイトルとYouTube URLは必須です')
  }
  
  // YouTube URL検証
  const validation = validateYouTubeUrl(youtubeUrl)
  if (!validation.isValid) {
    throw new Error(validation.error || 'YouTube URLが無効です')
  }
  
  // 現在の動画数を取得して order_index を設定
  const { count } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true })
    .eq('section_id', sectionId)
  
  const { error } = await supabase
    .from('videos')
    .insert({
      section_id: sectionId,
      title,
      description: description || null,
      youtube_url: youtubeUrl,
      youtube_video_id: validation.videoId,
      order_index: (count || 0) + 1,
      is_preview: isPreview,
    })
  
  if (error) {
    console.error('Error creating video:', error)
    throw new Error('動画の作成に失敗しました')
  }
}

async function deleteVideo(videoId: string) {
  'use server'
  
  const supabase = await createClient()
  
  // まず関連する進捗データを削除
  await supabase
    .from('user_progress')
    .delete()
    .eq('video_id', videoId)
  
  // 動画を削除
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)
  
  if (error) {
    console.error('Error deleting video:', error)
    throw new Error('動画の削除に失敗しました')
  }
}

export default async function VideoManagement({ params }: VideoManagementProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: section, error: sectionError } = await supabase
    .from('sections')
    .select(`
      id,
      title,
      description,
      order_index,
      courses!inner (
        id,
        title
      ),
      videos (
        id,
        title,
        description,
        youtube_url,
        youtube_video_id,
        order_index,
        is_preview,
        created_at
      )
    `)
    .eq('id', resolvedParams.sectionId)
    .eq('courses.id', resolvedParams.id)
    .single()

  if (sectionError || !section) {
    notFound()
  }

  // 動画を順序でソート
  section.videos?.sort((a, b) => a.order_index - b.order_index)

  function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/admin/courses" className="hover:text-gray-700">講座管理</Link>
            <span>/</span>
            <Link href={`/admin/courses/${resolvedParams.id}`} className="hover:text-gray-700">
              {(() => {
                const sectionWithCourse = section as SectionWithCourse
                return Array.isArray(sectionWithCourse.courses) 
                  ? sectionWithCourse.courses[0]?.title 
                  : sectionWithCourse.courses?.title || '講座'
              })()}
            </Link>
            <span>/</span>
            <Link href={`/admin/courses/${resolvedParams.id}/sections`} className="hover:text-gray-700">
              セクション管理
            </Link>
            <span>/</span>
            <span className="text-gray-900">{section.title}</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">動画管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            セクション「{section.title}」の動画を管理します
          </p>
        </div>
        
        <Link
          href={`/admin/courses/${resolvedParams.id}/sections`}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          セクション管理に戻る
        </Link>
      </div>

      {/* 動画作成フォーム */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">新しい動画を追加</h2>
        <form action={createVideo.bind(null, section.id)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              動画タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="例: はじめに"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              動画説明
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="動画の内容について説明してください（任意）"
            />
          </div>

          <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="youtube_url"
              name="youtube_url"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-500">
              YouTube動画のURLを入力してください（watch?v=、youtu.be/、embed/ 形式に対応）
            </p>
          </div>

          <div className="flex items-center">
            <input
              id="is_preview"
              name="is_preview"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_preview" className="ml-2 block text-sm text-gray-900">
              プレビュー動画として設定（未ログインユーザーでも視聴可能）
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              動画を追加
            </button>
          </div>
        </form>
      </div>

      {/* 動画一覧 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">現在の動画</h2>
        </div>
        
        {!section.videos || section.videos.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>動画がありません</p>
            <p className="text-sm">上のフォームから最初の動画を追加してください</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {section.videos.map((video, index) => (
              <div key={video.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-gray-500">
                      {index + 1}.
                    </span>
                  </div>
                  
                  <div className="flex-shrink-0 w-40 h-24 bg-gray-200 rounded overflow-hidden relative">
                    {video.youtube_video_id && (
                      <Image
                        src={getYouTubeThumbnail(video.youtube_video_id)}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {video.title}
                      </h3>
                      {video.is_preview && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          プレビュー
                        </span>
                      )}
                    </div>
                    {video.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>作成日: {new Date(video.created_at).toLocaleDateString('ja-JP')}</span>
                      <span className="mx-2">•</span>
                      <a
                        href={video.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800"
                      >
                        YouTube で見る
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex flex-col space-y-2">
                    <Link
                      href={`/courses/${resolvedParams.id}/videos/${video.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      視聴ページ
                    </Link>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      編集
                    </button>
                    <form 
                      action={deleteVideo.bind(null, video.id)} 
                      className="inline"
                      onSubmit={(e) => {
                        if (!confirm('この動画を削除しますか？関連する進捗データも削除されます。')) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        削除
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}