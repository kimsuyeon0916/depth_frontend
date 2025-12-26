'use server'

import { server } from '@/lib/api/server'
import { revalidatePath } from 'next/cache'

export async function updateTrackAction({
  trackName,
  trackStatus,
  trackId,
  startDate,
  endDate,
}: {
  trackId: number
  trackName?: string
  trackStatus?: TrackStatus
  startDate?: Date | string
  endDate?: Date | string
}): Promise<void> {
  const payload = { trackName, startDate, endDate, trackStatus }

  await server(`/api/v1/admin/tracks/${trackId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  revalidatePath('/admin/track')
  revalidatePath('/admin/[id]')
}
