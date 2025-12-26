'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { SquarePen } from 'lucide-react'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/Input'
import { updateTrackAction } from '@/features/(authenticated)/admin/track/actions/updateTrack'
import { useRouter } from 'next/navigation'

export default function TrackNameUpdateButton({
  trackName,
  trackId,
}: {
  trackName: string
  trackId: number
}) {
  const router = useRouter()
  const [isUpdate, setIsUpdate] = useState(false)
  const [name, setName] = useState(trackName)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setName(trackName)
  }, [trackName])

  const open = () => {
    setName(trackName)
    setIsUpdate(true)
  }

  const cancel = () => {
    setName(trackName)
    setIsUpdate(false)
  }

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await updateTrackAction({ trackId, trackName: name })
        setIsUpdate(false)
        router.refresh()
      } catch (e) {
        alert(e instanceof Error ? e.message : '수정 실패')
      }
    })
  }

  const unchanged = name === trackName

  return (
    <div>
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
          <Input
            name="trackName"
            id={`trackName-${trackId}`}
            required
            placeholder="트랙명 (FE, BE, AI 등)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="ml-auto flex justify-end gap-2">
            <button
              type="button"
              onClick={cancel}
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
              disabled={isPending || unchanged || name.trim() === ''}
            >
              {isPending ? '수정중...' : '수정'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
