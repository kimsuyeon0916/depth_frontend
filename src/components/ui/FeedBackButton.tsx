'use client'

import React from 'react'
import { X } from 'lucide-react'

export default function FeedBackButton() {
  const [state, setState] = React.useState(true)

  if (!state) return null
  return (
    <div className="fixed inset-x-0 bottom-8 z-50 mx-auto flex w-102 justify-center gap-2 rounded-full border border-gray-100 bg-white px-1.5 py-3 shadow-md">
      <p className="text-gray-700">성장을 위한 목소리, 소중한 의견을 돕습니다.</p>
      <a
        className="text-[#155DFC]"
        href="https://forms.gle/JehM1Whu6bHRrm2x9"
        target="_blank"
        rel="noopener noreferrer"
      >
        작성하기
      </a>{' '}
      <div className="flex items-center justify-center">
        <X className="size-4 text-gray-500" onClick={() => setState(false)} />
      </div>
    </div>
  )
}
