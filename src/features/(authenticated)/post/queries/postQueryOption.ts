import { getPosts } from '../apis/post.api'
import type { GetPostsResponse } from '../types/Post.types'
import type { TopicMyType } from '@/types/Topic.types'
import { getMyPosts } from '@/features/(authenticated)/mypage/apis/getMyPosts'
import { getMyLikes } from '@/features/(authenticated)/mypage/apis/getMyLike'

export const DEFAULT_POSTS_PAGE_SIZE = 20
export type Cursor = number | null

export const postKeys = {
  all: ['post'] as const,
  listBase: () => [...postKeys.all, 'list'] as const,
  list: (params: { topic?: TopicMyType; size?: number } = {}) =>
    [
      ...postKeys.listBase(),
      params.topic ?? 'ALL',
      params.size ?? DEFAULT_POSTS_PAGE_SIZE,
    ] as const,
  detail: (postId: number) => [...postKeys.all, 'detail', postId] as const,
}

export function getPostsInfiniteQueryOption(params: { topic?: TopicMyType; size?: number } = {}) {
  const { topic, size = DEFAULT_POSTS_PAGE_SIZE } = params

  return {
    queryKey: postKeys.list({ topic, size }),
    initialPageParam: 1,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      // 내 글 목록
      if (topic === 'MY-POST') {
        return getMyPosts({ page: pageParam, size })
      } else if (topic === 'MY-POST-LIKED') {
        return getMyLikes({ page: pageParam, size })
      }
      // 토픽 글 목록
      return getPosts({
        topic,
        page: pageParam,
        size,
      })
    },
    getNextPageParam: (lastPage: GetPostsResponse): Cursor => {
      if (!lastPage.hasNext) return null
      return lastPage.nextPage
    },
  }
}
