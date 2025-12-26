'use client'
import React, { useTransition } from 'react'
import { Loader2, X } from 'lucide-react'
import { deleteTrack } from '@/features/(authenticated)/admin/track/actions/deleteTrack'

export default function TrackDeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    const ok = window.confirm('삭제할까요?')
    if (!ok) return

    startTransition(async () => {
      try {
        await deleteTrack(id)
      } catch (e) {
        alert(e instanceof Error ? e.message : '삭제 실패')
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-full p-2 transition-colors duration-150 hover:bg-gray-200"
    >
      {isPending ? <Loader2 className="animate-spin" /> : <X size={16} />}
    </button>
  )
}
