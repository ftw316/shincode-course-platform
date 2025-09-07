import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface CourseDetailProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetail({ params }: CourseDetailProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      is_published,
      created_at,
      updated_at,
      sections (
        id,
        title,
        description,
        order_index,
        videos (
          id,
          title,
          description,
          youtube_url,
          youtube_video_id,
          order_index,
          is_preview
        )
      )
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !course) {
    notFound()
  }

  // セクションと動画を順序でソート
  course.sections?.sort((a, b) => a.order_index - b.order_index)
  course.sections?.forEach(section => {
    section.videos?.sort((a, b) => a.order_index - b.order_index)
  })

  const totalVideos = course.sections?.reduce((sum, section) => sum + (section.videos?.length || 0), 0) || 0
  const previewVideos = course.sections?.reduce((sum, section) => 
    sum + (section.videos?.filter(video => video.is_preview).length || 0), 0) || 0

  function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                course.is_published
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {course.is_published ? '公開中' : '下書き'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            作成日: {new Date(course.created_at).toLocaleDateString('ja-JP')} | 
            更新日: {new Date(course.updated_at).toLocaleDateString('ja-JP')}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={`/admin/courses/${course.id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            編集
          </Link>
          <Link
            href={`/courses/${course.id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            プレビュー
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 講座情報 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">講座情報</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">説明</h3>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {course.description}
                </p>
              </div>
              {course.thumbnail_url && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">サムネイル</h3>
                  <div className="mt-1 relative w-48 h-32">
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover rounded border"
                      sizes="192px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* セクションと動画 */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">コンテンツ</h2>
              <Link
                href={`/admin/courses/${course.id}/sections`}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                セクション管理
              </Link>
            </div>
            
            {!course.sections || course.sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>セクションが作成されていません</p>
                <Link
                  href={`/admin/courses/${course.id}/sections`}
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm"
                >
                  最初のセクションを作成
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {course.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">
                        {sectionIndex + 1}. {section.title}
                      </h3>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/courses/${course.id}/sections/${section.id}/videos`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          動画管理
                        </Link>
                      </div>
                    </div>
                    
                    {section.description && (
                      <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                    )}
                    
                    {!section.videos || section.videos.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">動画がありません</p>
                    ) : (
                      <div className="space-y-2">
                        {section.videos.map((video, videoIndex) => (
                          <div key={video.id} className="flex items-center p-2 bg-gray-50 rounded">
                            <div className="flex-shrink-0 w-16 h-10 bg-gray-200 rounded overflow-hidden relative">
                              {video.youtube_video_id && (
                                <Image
                                  src={getYouTubeThumbnail(video.youtube_video_id)}
                                  alt={video.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              )}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {sectionIndex + 1}.{videoIndex + 1} {video.title}
                                </p>
                                {video.is_preview && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                    プレビュー
                                  </span>
                                )}
                              </div>
                              {video.description && (
                                <p className="text-xs text-gray-600 truncate">{video.description}</p>
                              )}
                            </div>
                            <div className="ml-2 flex space-x-1">
                              <button className="text-xs text-gray-600 hover:text-gray-800">
                                編集
                              </button>
                              <Link
                                href={`/courses/${course.id}/videos/${video.id}`}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                視聴
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* サイドバー統計 */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">統計情報</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">セクション数</span>
                <span className="text-sm font-medium">{course.sections?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">動画数</span>
                <span className="text-sm font-medium">{totalVideos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">プレビュー動画</span>
                <span className="text-sm font-medium">{previewVideos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ステータス</span>
                <span
                  className={`text-sm font-medium ${
                    course.is_published ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {course.is_published ? '公開中' : '下書き'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
                セクションを追加
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
                順序を変更
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded">
                講座を複製
              </button>
              <hr />
              <button
                className={`w-full px-4 py-2 text-left text-sm rounded ${
                  course.is_published
                    ? 'text-yellow-700 hover:bg-yellow-50'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                {course.is_published ? '公開を停止' : '公開する'}
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 rounded">
                講座を削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}