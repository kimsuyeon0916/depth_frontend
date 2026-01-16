import React from 'react'
import PageTitle from '@/components/ui/PageTitle'
import { nqc } from '@/lib/query-client/queryClient'
import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { PostInfiniteList } from '@/features/(authenticated)/post/components/PostInfiniteList'
import { getPostsInfiniteQueryOption } from '@/features/(authenticated)/post/queries/postQueryOption'

export const metadata: Metadata = {
  title: '내가 쓴 글 | 마이페이지 | Wanted Ground PotenUp',
  description: '내가 쓴 글을 확인합니다.',
}

export default async function MyPage() {
  const qc = nqc()

  await qc.prefetchInfiniteQuery(getPostsInfiniteQueryOption({ topic: 'MY-POST' }))

  return (
    <div className="">
      <PageTitle title="내가 쓴 글" subTitle="커뮤니티에 작성한 글을 보여줍니다." />
      <section className="flex flex-col gap-0 lg:gap-4">
        <HydrationBoundary
          state={dehydrate(qc, {
            shouldDehydrateQuery: (q) => q.state.status === 'success',
          })}
        >
          <PostInfiniteList topic="MY-POST" />
        </HydrationBoundary>
      </section>
    </div>
  )
}
