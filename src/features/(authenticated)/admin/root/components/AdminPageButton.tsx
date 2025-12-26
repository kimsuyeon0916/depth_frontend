import React from 'react'
import PageButton from '@/components/layout/PageButton'
import { getTrackList } from '@/features/(authenticated)/admin/track/services/getTrackList'

export default async function AdminPageButton() {
  const trackData = await getTrackList()
  const TABS = [
    {
      id: 'track-create',
      label: '트랙 생성',
      href: '/admin/track',
    },
    // TODO: 백엔드와 상의 필요
    {
      id: 'operator',
      label: '운영자',
      href: '/admin/0',
    },
    ...(trackData?.content?.length > 0
      ? trackData.content.map((track) => ({
          id: String(track.trackId),
          label: track.trackName,
          href: `/admin/${track.trackId}`,
        }))
      : []),
  ]

  return <PageButton TABS={TABS}></PageButton>
}
