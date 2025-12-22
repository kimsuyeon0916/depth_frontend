'use client'

import { useGoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { isHttpError } from '@/utils/isHttpError'
import { usePendingStore } from '@/store/pendingStore'
import { USER_ERROR_CODE } from '@/constants/error-code/user'
import { SigninErrorTypes } from '@/features/(public)/signin/types/SigninError.types'
import { signinAction } from '@/features/(public)/signin/signinAction'
import { HttpErrorTypes } from '@/types/HttpError.types'

export function useGoogleSignin() {
  const router = useRouter()
  const signinMutation = useMutation({
    mutationFn: async (code: string) => {
      const r = await signinAction(code)
      if (!r.ok) throw new HttpErrorTypes(r.status, r.error?.message, r.error)
      return r
    },
    onSuccess: () => router.push('/'),
    onError: (error) => {
      if (!isHttpError(error)) return

      if ((error.body as SigninErrorTypes).code === USER_ERROR_CODE.USER_NOT_FOUND) {
        const token = (error.body as SigninErrorTypes)?.idToken
        if (token) {
          router.push(`/signup?token=${encodeURIComponent(token)}`)
        } else {
          // todo 나중에 로직 생각 ㄱ
        }
        return
      }

      if ((error.body as SigninErrorTypes).code === USER_ERROR_CODE.INACTIVE_USER) {
        usePendingStore.getState().setPendingCode((error.body as SigninErrorTypes).code)
        const sp = new URLSearchParams({
          title: '승인 대기중 입니다.',
          message: '관리자가 승인을 완료하면 서비스를 이용가능합니다.',
        })

        router.push(`/signin/message?${sp.toString()}`)
      }
    },
  })

  const login = useGoogleLogin({
    flow: 'auth-code',
    scope: 'openid profile email',
    onSuccess: ({ code }) => signinMutation.mutate(code),
    onError: (err) => console.error('Google login failed', err),
  })

  return {
    signWithGoogle: () => login(),
    isLoading: signinMutation.isPending,
  }
}
