import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

interface EditCourseProps {
  params: Promise<{ id: string }>
}

async function updateCourse(courseId: string, formData: FormData) {
  'use server'
  
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const thumbnailUrl = formData.get('thumbnail_url') as string
  const isPublished = formData.get('is_published') === 'on'
  
  if (!title || !description) {
    throw new Error('必須項目が入力されていません')
  }
  
  const { error } = await supabase
    .from('courses')
    .update({
      title,
      description,
      thumbnail_url: thumbnailUrl || null,
      is_published: isPublished,
    })
    .eq('id', courseId)
  
  if (error) {
    console.error('Error updating course:', error)
    throw new Error('講座の更新に失敗しました')
  }
  
  redirect(`/admin/courses/${courseId}`)
}

export default async function EditCourse({ params }: EditCourseProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !course) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">講座を編集</h2>
        <p className="mt-1 text-sm text-gray-600">
          講座の基本情報を更新してください
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form action={updateCourse.bind(null, course.id)} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              講座タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={course.title}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="例: React入門講座"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              講座説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              defaultValue={course.description}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="講座の内容や対象者について説明してください"
            />
          </div>

          <div>
            <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700">
              サムネイル画像URL
            </label>
            <input
              type="url"
              id="thumbnail_url"
              name="thumbnail_url"
              defaultValue={course.thumbnail_url || ''}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              推奨サイズ: 1280x720px
            </p>
            {course.thumbnail_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">現在のサムネイル:</p>
                <div className="relative w-32 h-20">
                  <Image
                    src={course.thumbnail_url}
                    alt="現在のサムネイル"
                    fill
                    className="object-cover rounded border"
                    sizes="128px"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="is_published"
              name="is_published"
              type="checkbox"
              defaultChecked={course.is_published}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
              この講座を公開する
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href={`/admin/courses/${course.id}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              更新を保存
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">講座情報</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>作成日: {new Date(course.created_at).toLocaleDateString('ja-JP')}</p>
          <p>最終更新: {new Date(course.updated_at).toLocaleDateString('ja-JP')}</p>
          <p>
            ステータス: 
            <span className={`ml-1 font-medium ${course.is_published ? 'text-green-600' : 'text-yellow-600'}`}>
              {course.is_published ? '公開中' : '下書き'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}