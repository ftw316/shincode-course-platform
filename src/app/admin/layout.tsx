import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 管理者権限チェック
  const { isAdmin, user } = await requireAdmin()
  
  // ユーザーがログインしていない場合はログインページへ
  if (!user) {
    redirect('/login')
  }
  
  // ログインしているが管理者権限がない場合はホームページへ
  if (!isAdmin) {
    redirect('/?error=access_denied')
  }
  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <nav className="bg-white shadow-sm border-b" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">管理画面</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                トップページ
              </Link>
              <a
                href="/auth/signout"
                className="text-sm text-red-600 hover:text-red-800"
              >
                ログアウト
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 -mb-px">
            <Link
              href="/admin"
              className="py-3 px-1 border-b-2 border-blue-500 text-blue-600 text-sm font-medium"
            >
              ダッシュボード
            </Link>
            <Link
              href="/admin/courses"
              className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium"
            >
              講座管理
            </Link>
            <Link
              href="/admin/videos"
              className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium"
            >
              動画一覧
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}