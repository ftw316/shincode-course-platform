import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            ログイン
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            ShinCode講座プラットフォームへようこそ
          </p>
        </div>
        
        <div className="space-y-4">
          <GoogleSignInButton />
          
          {params?.message && (
            <div className="text-center text-sm text-red-600 dark:text-red-400">
              {params.message}
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            アカウントをお持ちでない場合、Googleでサインインすると
            <br />
            自動的にアカウントが作成されます
          </p>
        </div>
      </div>
    </div>
  )
}