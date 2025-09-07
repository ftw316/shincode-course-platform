import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function AdminVideos() {
  const supabase = await createClient()
  
  const { data: videos, error } = await supabase
    .from('videos')
    .select(`
      id,
      title,
      description,
      youtube_url,
      youtube_video_id,
      order_index,
      is_preview,
      created_at,
      sections!inner (
        title,
        courses!inner (
          id,
          title
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">動画の取得中にエラーが発生しました</p>
      </div>
    )
  }

  function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">動画管理</h2>
          <p className="mt-1 text-sm text-gray-600">
            全ての動画を一覧で確認できます
          </p>
        </div>
      </div>

      {!videos || videos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">動画がありません</h3>
          <p className="mt-1 text-sm text-gray-500">講座管理画面から動画を追加してください</p>
          <div className="mt-6">
            <Link
              href="/admin/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              講座管理へ
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {videos.map((video) => (
              <li key={video.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0 h-16 w-28 bg-gray-200 rounded overflow-hidden relative">
                      {video.youtube_video_id && (
                        <Image
                          src={getYouTubeThumbnail(video.youtube_video_id)}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      )}
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
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
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          講座: {/* @ts-expect-error Supabase relationship type */}
                          {video.sections.courses.title} &gt; {video.sections.title}
                        </p>
                        <p className="truncate">
                          説明: {video.description || '説明なし'}
                        </p>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>順序: {video.order_index}</span>
                        <span className="mx-2">•</span>
                        <span>作成日: {new Date(video.created_at).toLocaleDateString('ja-JP')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    {video.youtube_url && (
                      <a
                        href={video.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        YouTube
                      </a>
                    )}
                    <Link
                      href={`/courses/${/* @ts-expect-error Supabase relationship type */ video.sections.courses.id}/videos/${video.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      視聴
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">動画管理について</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• 動画の作成・編集は各講座の管理画面から行います</p>
          <p>• YouTubeのサムネイルが自動で表示されます</p>
          <p>• プレビュー動画は未認証ユーザーでも視聴可能です</p>
        </div>
      </div>
    </div>
  )
}