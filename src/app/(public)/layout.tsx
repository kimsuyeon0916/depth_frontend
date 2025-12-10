import React from 'react'
import Background from '@/components/Background'
import Footer from '@/components/layout/Footer'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full overflow-hidden">
      <Background />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="fixed inset-x-0 flex h-20 max-h-20 min-h-20 items-center bg-transparent">
          <div className="mx-auto flex size-full max-w-7xl items-center gap-4 px-5">
            {/* 로고 자리 */}
            <div className="mr-5 flex shrink-0 items-center">
              <p className="text-2xl font-bold">Depth</p>
            </div>
            <div className="flex flex-1 items-center justify-end">
              <button>로그인</button>
            </div>
          </div>
        </header>
        <main className="h-full pt-20">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
