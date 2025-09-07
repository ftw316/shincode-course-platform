import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function createCourse(formData: FormData) {
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
    .insert({
      title,
      description,
      thumbnail_url: thumbnailUrl || null,
      is_published: isPublished,
    })
  
  if (error) {
    console.error('Error creating course:', error)
    throw new Error('講座の作成に失敗しました')
  }
  
  redirect('/admin/courses')
}

export default function NewCourse() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">新しい講座を作成</h2>
        <p className="mt-1 text-sm text-gray-600">
          講座の基本情報を入力してください
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form action={createCourse} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              講座タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              推奨サイズ: 1280x720px
            </p>
          </div>

          <div className="flex items-center">
            <input
              id="is_published"
              name="is_published"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
              作成と同時に公開する
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/courses"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              講座を作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}