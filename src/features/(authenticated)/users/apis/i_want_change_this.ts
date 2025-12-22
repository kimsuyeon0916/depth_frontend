'use server'

import { server, safeJson } from '@/lib/api/server'
import type { GetUserResponse } from '../types/User.type'

// 일단 이걸로 변경 하는 거 어떨까요? 보고 판단 ㄱ
export async function i_want_change_this(): Promise<GetUserResponse | null> {
  try {
    const res = await server('/api/v1/users/myInfo', { method: 'GET' })

    if (res.status === 401 || res.status === 403) return null
    if (res.status === 204) return null

    if (!res.ok) return null

    const data = await safeJson<GetUserResponse>(res)
    return data ?? null
  } catch {
    return null
  }
}
