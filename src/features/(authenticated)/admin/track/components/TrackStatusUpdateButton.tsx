'use client'

import React, { useState, useTransition } from 'react'
import { SquarePen } from 'lucide-react'
import Button from '@/components/ui/button/Button'
import { updateTrackAction } from '@/features/(authenticated)/admin/track/actions/updateTrack'
import { useRouter } from 'next/navigation'
import Select from '@/components/ui/Select'

export default function TrackStatusUpdateButton({
  trackStatus,
  trackId,
}: {
  trackStatus: TrackStatus
  trackId: number
}) {
  const router = useRouter()
  const [isUpdate, setIsUpdate] = useState(false)
  const [status, setStatus] = useState<TrackStatus>(trackStatus)
  const [isPending, startTransition] = useTransition()

  const open = () => {
    setStatus(trackStatus) // 열 때 현재 값으로 초기화
    setIsUpdate(true)
  }

  const onCancel = () => {
    setStatus(trackStatus)
    setIsUpdate(false)
  }

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await updateTrackAction({ trackId, trackStatus: status })
        setIsUpdate(false)
        router.refresh()
      } catch (e) {
        alert(e instanceof Error ? e.message : '수정 실패')
      }
    })
  }

  const unchanged = status === trackStatus

  return (
    <div className="">
      <button
        type="button"
        onClick={open}
        className="rounded-full p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-gray-200"
        aria-label="update"
      >
        <SquarePen size={16} />
      </button>

      {isUpdate && (
        <div className="absolute inset-0 z-10 flex items-center gap-2 rounded-md bg-white px-4">
          <Select
            name="trackStatus"
            id={`trackStatus-${trackId}`}
            required
            value={status}
            onChange={(e) => setStatus((e.target as HTMLSelectElement).value as TrackStatus)}
            className="h-9 text-sm"
            options={[
              { label: 'ENROLLED', value: 'ENROLLED' },
              { label: 'GRADUATED', value: 'GRADUATED' },
            ]}
          />

          <div className="ml-auto flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="h-9 rounded-md border border-gray-300 px-3 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>

            <Button
              variant="add"
              type="button"
              className="h-9 px-3 text-sm"
              onClick={onSubmit}
              disabled={isPending || unchanged}
            >
              {isPending ? '수정중...' : '수정'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
