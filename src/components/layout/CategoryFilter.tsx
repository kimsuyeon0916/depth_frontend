'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

type TabItem = {
  id: string
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
}

export default function CategoryFilter({ TABS }: { TABS: TabItem[] }) {
  const pathname = usePathname()

  return <CategoryFilterInner key={pathname} pathname={pathname} TABS={TABS} />
}

function CategoryFilterInner({ pathname, TABS }: { pathname: string; TABS: TabItem[] }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = (href?: string) => {
    if (!href) return false
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  const dropdownTabs = TABS.filter((t) => !!t.href)

  const activeTab =
    dropdownTabs.find((t) => isActive(t.href)) ?? dropdownTabs.find((t) => t.href === '/')

  const activeLabel = activeTab?.label ?? '전체'
  const activeIcon = activeTab?.icon ?? null

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, { capture: true })
    return () => document.removeEventListener('pointerdown', onPointerDown, { capture: true })
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return
    const first = menuRef.current?.querySelector<HTMLElement>('[data-menuitem]')
    first?.focus()
  }, [open])

  const focusMove = (dir: 1 | -1) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[data-menuitem]') ?? [],
    )
    if (items.length === 0) return
    const activeEl = document.activeElement as HTMLElement | null
    const idx = Math.max(
      0,
      items.findIndex((el) => el === activeEl),
    )
    const next = (idx + dir + items.length) % items.length
    items[next]?.focus()
  }

  const itemBase =
    'flex h-12 w-full items-center justify-start gap-3 pl-4 pr-3 text-[16px] font-normal leading-6 text-[#101828] outline-none transition-colors'
  const itemDefault = 'hover:bg-gray-50 focus-visible:bg-gray-50'
  const iconClass = 'text-[#4A5565]'

  return (
    <div className={clsx('lg:hidden', 'sticky top-(--header-h) z-10', 'bg-white px-5 pt-6 pb-4')}>
      <div ref={rootRef} className="relative inline-block">
        <button
          type="button"
          className={clsx(
            'inline-flex h-[42px] items-center gap-2 rounded-[10px] border border-gray-200 bg-white pr-3 pl-4',
            'text-[16px] leading-6 text-[#101828]',
          )}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="category-filter-menu"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        >
          <span className={clsx('inline-flex size-4 items-center justify-center', iconClass)}>
            {activeIcon}
          </span>

          <span className="font-normal">{activeLabel}</span>
          <ChevronDown className={clsx('size-4 text-[#4A5565]', open && 'rotate-180')} />
        </button>

        {open && (
          <div
            id="category-filter-menu"
            ref={menuRef}
            role="menu"
            className={[
              'absolute left-0 mt-2',
              'flex flex-col items-start',
              'w-[200px] overflow-hidden',
              'rounded-[10px] border border-[#E5E7EB] bg-white',
              'p-px',
              'shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]',
            ].join(' ')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                focusMove(1)
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                focusMove(-1)
              }
              if (e.key === 'Escape') setOpen(false)
            }}
          >
            {dropdownTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href!}
                role="menuitem"
                tabIndex={0}
                data-menuitem
                className={[itemBase, itemDefault].join(' ')}
                onClick={() => setOpen(false)}
              >
                <span className={clsx('inline-flex size-4 items-center justify-center', iconClass)}>
                  {tab.icon ?? null}
                </span>
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
