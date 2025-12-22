'use server'

import 'server-only'
import { safeJson, server } from '@/lib/api/server'
import { exchangeGoogleAuthCode } from '@/lib/o-auth/google'
import { USER_ERROR_CODE, UserErrorCode } from '@/constants/error-code/user'

export async function signinAction(code: string) {
  const tokenJson = await exchangeGoogleAuthCode(code)
  const idToken = tokenJson.id_token

  if (!idToken) {
    return {
      ok: false,
      status: 400,
      error: { code: USER_ERROR_CODE.AUTHENTICATION_NOT_FOUND, message: 'id_token is required' },
    }
  }

  const res = await server(`/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ idToken }),
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    const payload = (await safeJson<{ code: UserErrorCode; message: string }>(res)) ?? {
      code: USER_ERROR_CODE.USER_NOT_FOUND,
      message: `HTTP ${res.status}`,
    }

    return {
      ok: false,
      status: res.status,
      error: { ...payload, idToken },
    }
  }

  return { ok: true }
}
