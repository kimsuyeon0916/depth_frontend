import 'server-only'
import { cookies } from 'next/headers'

type CookieSetOptions = Parameters<Awaited<ReturnType<typeof cookies>>['set']>[2]

function parseSetCookie(
  sc: string,
): { name: string; value: string; options: CookieSetOptions } | null {
  const parts = sc.split(';').map((s) => s.trim())
  const [nameValue, ...attrs] = parts

  const eq = nameValue.indexOf('=')
  if (eq < 0) return null

  const name = nameValue.slice(0, eq)
  const value = nameValue.slice(eq + 1)

  const options: CookieSetOptions = {}

  for (const a of attrs) {
    const [kRaw, vRaw] = a.split('=')
    const k = kRaw.toLowerCase()
    const v = vRaw

    if (k === 'path') options.path = v ?? '/'
    else if (k === 'max-age') options.maxAge = Number(v)
    else if (k === 'expires') options.expires = new Date(v!)
    else if (k === 'httponly') options.httpOnly = true
    else if (k === 'secure') options.secure = true
    else if (k === 'samesite') {
      const vv = (v ?? '').toLowerCase()
      options.sameSite = vv === 'lax' ? 'lax' : vv === 'strict' ? 'strict' : 'none'
    }
  }

  return { name, value, options }
}

export async function applySetCookies(setCookies: string[]) {
  if (!setCookies.length) return

  const cookieStore = await cookies()

  for (const sc of setCookies) {
    const parsed = parseSetCookie(sc)
    if (!parsed) continue
    cookieStore.set(parsed.name, parsed.value, parsed.options)
  }
}
