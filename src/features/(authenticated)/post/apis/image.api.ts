'use server'

import { server, safeJson } from '@/lib/api/server'
import type { UploadImageRequest, UploadImageResponse } from '../types/Image.types'

export async function uploadImage(input: UploadImageRequest) {
  const { file, draftId } = input

  const formData = new FormData()
  formData.append('file', file)
  formData.append('draftId', draftId)

  const res = await server('/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const text = await res.clone().text()
    console.error('[uploadImage] failed', res.status, text)
  }
  return await safeJson<UploadImageResponse>(res)
}
