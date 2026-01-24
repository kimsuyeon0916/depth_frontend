'use client'

import { useRouter } from 'next/navigation'
import { List } from 'lucide-react'

export function BackToListButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-4 rounded-lg border border-gray-300 px-3 py-1.5"
    >
      <List size={16} className="text-gray-700" />
      <span>목록으로 돌아가기</span>
    </button>
  )
}
