import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function AdminCourses() {
  const supabase = await createClient()
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      is_published,
      created_at,
      updated_at
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching courses:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">講座の取得中にエラーが発生しました</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">講座管理</h2>
          <p className="mt-1 text-sm text-gray-600">
            全ての講座を管理できます
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          新しい講座を作成
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M28 16a4 4 0 11-8 0 4 4 0 018 0zM22 22a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">講座がありません</h3>
          <p className="mt-1 text-sm text-gray-500">新しい講座を作成して始めましょう</p>
          <div className="mt-6">
            <Link
              href="/admin/courses/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              講座を作成
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => (
              <li key={course.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0 h-16 w-24 bg-gray-200 rounded overflow-hidden relative">
                      {course.thumbnail_url ? (
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="h-16 w-24 bg-gray-100 flex items-center justify-center">
                          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {course.title}
                        </h3>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {course.is_published ? '公開中' : '下書き'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        更新日: {new Date(course.updated_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      詳細
                    </Link>
                    <Link
                      href={`/admin/courses/${course.id}/edit`}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      編集
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}