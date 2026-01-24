'use client'

import { forwardRef, useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import type { MentionUser } from '@/hooks/useMentionUsers'
import clsx from 'clsx'

export const MentionBox = forwardRef<
  HTMLDivElement,
  {
    members: MentionUser[]
    activeIndex: number
    onActiveIndexChange: (idx: number) => void
    onSelect: (user: MentionUser) => void
  }
>(({ members, activeIndex, onActiveIndexChange, onSelect }, ref) => {
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (members.length === 0) return
    const list = listRef.current
    if (!list) return
    const active = list.querySelector<HTMLElement>('[data-active="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, members.length])

  if (members.length === 0) return null

  return (
    <div
      ref={ref}
      id="Mention"
      className="absolute -top-50 left-0 z-50 h-48 w-70 rounded-lg border border-gray-300 bg-white"
      role="listbox"
      aria-activedescendant={
        members[activeIndex]?.userId ? `mention-${members[activeIndex].userId}` : undefined
      }
    >
      <p className="flex h-8 w-full items-center rounded-tl-lg rounded-tr-lg border-b border-gray-300 bg-gray-100 px-2.5 text-xs text-gray-700">
        멤버 멘션하기
      </p>

      <div
        ref={listRef}
        className="h-[calc(100%-2rem)] overflow-y-auto rounded-br-lg rounded-bl-lg"
      >
        {members.map((m, i) => {
          const active = i === activeIndex
          return (
            <button
              key={m.userId}
              id={`mention-${m.userId}`}
              type="button"
              role="option"
              aria-selected={active}
              data-active={active ? 'true' : 'false'}
              className={clsx('w-full py-2 text-left', active ? 'bg-blue-500' : '')}
              onMouseEnter={() => onActiveIndexChange(i)}
              onClick={() => onSelect(m)}
            >
              <div className="flex items-center gap-2 px-2.5">
                <Avatar
                  size="xs"
                  alt={`${m.name} 프로필`}
                  src={m.profileImageUrl}
                  className={clsx(active ? 'text-white' : '')}
                />
                <span className={clsx('text-sm text-gray-800', active ? 'text-white' : '')}>
                  {m.name}
                </span>
                <span className={clsx('text-[10px] text-gray-400', active ? 'text-white' : '')}>
                  @{m.userId}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
})

MentionBox.displayName = 'MentionBox'
