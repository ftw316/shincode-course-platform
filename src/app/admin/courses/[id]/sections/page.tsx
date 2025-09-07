import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface SectionManagementProps {
  params: Promise<{ id: string }>
}

async function createSection(courseId: string, formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  
  if (!title) {
    throw new Error('セクションタイトルは必須です')
  }
  
  // 現在のセクション数を取得して order_index を設定
  const { count } = await supabase
    .from('sections')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId)
  
  const { error } = await supabase
    .from('sections')
    .insert({
      course_id: courseId,
      title,
      description: description || null,
      order_index: (count || 0) + 1,
    })
  
  if (error) {
    console.error('Error creating section:', error)
    throw new Error('セクションの作成に失敗しました')
  }
}

async function deleteSection(sectionId: string) {
  'use server'
  
  const supabase = await createClient()
  
  // まず関連する動画を削除
  await supabase
    .from('videos')
    .delete()
    .eq('section_id', sectionId)
  
  // セクションを削除
  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', sectionId)
  
  if (error) {
    console.error('Error deleting section:', error)
    throw new Error('セクションの削除に失敗しました')
  }
}

export default async function SectionManagement({ params }: SectionManagementProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      sections (
        id,
        title,
        description,
        order_index,
        videos (
          id,
          title,
          youtube_video_id
        )
      )
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (courseError || !course) {
    notFound()
  }

  // セクションを順序でソート
  course.sections?.sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/admin/courses" className="hover:text-gray-700">講座管理</Link>
            <span>/</span>
            <Link href={`/admin/courses/${course.id}`} className="hover:text-gray-700">{course.title}</Link>
            <span>/</span>
            <span className="text-gray-900">セクション管理</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">セクション管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            講座「{course.title}」のセクションを管理します
          </p>
        </div>
        
        <Link
          href={`/admin/courses/${course.id}`}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          講座詳細に戻る
        </Link>
      </div>

      {/* セクション作成フォーム */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">新しいセクションを作成</h2>
        <form action={createSection.bind(null, course.id)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              セクションタイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="例: 基礎知識"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              セクション説明
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="セクションの内容について説明してください（任意）"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              セクションを作成
            </button>
          </div>
        </form>
      </div>

      {/* セクション一覧 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">現在のセクション</h2>
        </div>
        
        {!course.sections || course.sections.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>セクションがありません</p>
            <p className="text-sm">上のフォームから最初のセクションを作成してください</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {course.sections.map((section, index) => (
              <div key={section.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-3">
                        {index + 1}.
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    {section.description && (
                      <p className="mt-1 text-sm text-gray-600 ml-6">
                        {section.description}
                      </p>
                    )}
                    <div className="mt-2 ml-6 text-sm text-gray-500">
                      動画数: {section.videos?.length || 0}本
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 ml-4">
                    <Link
                      href={`/admin/courses/${course.id}/sections/${section.id}/videos`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      動画管理
                    </Link>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      編集
                    </button>
                    <form 
                      action={deleteSection.bind(null, section.id)} 
                      className="inline"
                      onSubmit={(e) => {
                        if (!confirm('このセクションとその中の全ての動画を削除しますか？')) {
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
                
                {section.videos && section.videos.length > 0 && (
                  <div className="mt-4 ml-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">動画一覧:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {section.videos.map((video) => (
                        <div key={video.id} className="flex items-center p-2 bg-gray-50 rounded">
                          {video.youtube_video_id && (
                            <div className="w-12 h-8 relative rounded mr-2 overflow-hidden">
                              <Image
                                src={`https://img.youtube.com/vi/${video.youtube_video_id}/mqdefault.jpg`}
                                alt={video.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          )}
                          <span className="text-sm text-gray-700 truncate">
                            {video.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}