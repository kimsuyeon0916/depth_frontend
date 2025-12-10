'use client'
import React from 'react'
import Input from '@/components/ui/Input'
import Link from 'next/link'
import Button from '@/components/ui/button/Button'
import AvatarButton from '@/components/layout/header/AvatarButton'
import { usePathname } from 'next/navigation'

export default function HeaderElement() {
  const pathname = usePathname()

  const isContentCreatePage = pathname === '/content/create'
  const isHome = pathname === '/'

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <Input icon="😊" />
      <div className="flex items-center gap-3">
        {isHome && (
          <>
            <Link href="/content/create">
              <Button icon="df">글쓰기</Button>
            </Link>
            <AvatarButton />
          </>
        )}
        {isContentCreatePage && (
          <>
            <Link href="/">
              <Button variant="cancel">취소</Button>
            </Link>
            <Button variant="add">발행하기</Button>
          </>
        )}
      </div>
    </div>
  )
}
