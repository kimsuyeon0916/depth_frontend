'use client'

import { useEffect, useState } from 'react'
import { toRelativeTimeLabel } from '@/utils/toRelativeTimeLabel'

type RelativeTimeProps = {
  dateTime: string
  /** 서버에서 미리 계산한 라벨(초기 하이드레이션 mismatch 방지) */
  initialLabel?: string
  className?: string
  /** 기본 1분마다 갱신 */
  intervalMs?: number
}

export function RelativeTime({
  dateTime,
  initialLabel = '',
  className,
  intervalMs = 60_000,
}: RelativeTimeProps) {
  const [label, setLabel] = useState(initialLabel)

  useEffect(() => {
    if (!dateTime) return

    const update = () => setLabel(toRelativeTimeLabel(dateTime))
    update()

    const id = window.setInterval(update, intervalMs)
    return () => window.clearInterval(id)
  }, [dateTime, intervalMs])

  return (
    <time dateTime={dateTime} className={className} suppressHydrationWarning>
      {label}
    </time>
  )
}
