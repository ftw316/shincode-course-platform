import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import Link from 'next/link'

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams;
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              ShinCode
            </Link>
            <p className="text-gray-600 text-sm hidden sm:block">
              すでにアカウントをお持ちですか？
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              ShinCode にログイン
            </h2>
            <p className="mt-2 text-gray-600">
              学習を続けるためにログインしてください
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <div className="space-y-6">
              <GoogleSignInButton />
              
              {params?.message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{params.message}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 text-center leading-relaxed">
                続行することで、ShinCodeの
                <a href="#" className="text-purple-600 underline hover:text-purple-500">利用規約</a>
                および
                <a href="#" className="text-purple-600 underline hover:text-purple-500">プライバシーポリシー</a>
                に同意したことになります。
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ShinCode が初めてですか？
              <Link href="/" className="font-medium text-purple-600 hover:text-purple-500 ml-1">
                サイトを探索する
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}