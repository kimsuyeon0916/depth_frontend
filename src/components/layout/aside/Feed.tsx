'use client'

import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type SortKey = 'popular' | 'latest'
const SORT_PARAM = 'sort'
const DEFAULT_SORT: SortKey = 'latest'

const FEED_ITEMS: Array<{ id: SortKey; label: string; icon: ReactNode }> = [
  { id: 'latest', label: '최신 게시글', icon: <Clock className="size-4" strokeWidth={1.5} /> },
  {
    id: 'popular',
    label: '인기 게시글',
    icon: <TrendingUp className="size-4" strokeWidth={1.5} />,
  },
]

export default function Feed() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawSort = searchParams.get(SORT_PARAM) as SortKey | null
  const activeSort: SortKey = FEED_ITEMS.some((x) => x.id === rawSort)
    ? (rawSort as SortKey)
    : DEFAULT_SORT

  const makeHref = (nextSort: SortKey) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(SORT_PARAM, nextSort)
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <section
      className={clsx(
        'w-full rounded-[10px] border border-[#E5E7EB] bg-white',
        'px-[17px] py-[17px]',
      )}
    >
      <div className="flex flex-col gap-[4px]" role="tablist" aria-label="피드 정렬">
        {FEED_ITEMS.map((item) => {
          const isActive = item.id === activeSort

          return (
            <Link
              key={item.id}
              href={makeHref(item.id)}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'flex h-[40px] items-center gap-[12px] rounded-[10px] pl-[12px]',
                'text-[16px] leading-6 font-normal transition-colors',
                isActive ? 'bg-[#EFF6FF] text-[#155DFC]' : 'text-[#364153] hover:bg-gray-50',
              )}
              scroll={false}
            >
              {/* 아이콘은 16x16에 맞추기 */}
              <span
                className={clsx(
                  'flex size-4 items-center justify-center',
                  isActive ? 'text-[#155DFC]' : 'text-[#364153]',
                )}
                aria-hidden
              >
                {item.icon}
              </span>

              {/* Figma 400 */}
              <span className="font-normal">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
