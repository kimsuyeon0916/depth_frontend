import { DEFAULT_POSTS_PAGE_SIZE } from '@/features/(authenticated)/post/queries/postQueryOption'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getMyCommentsInfiniteQueryOption } from '@/features/(authenticated)/mypage/queries/getMyCommentsQueryOption'

export function useGetMyCommentsQuery(size: number = DEFAULT_POSTS_PAGE_SIZE) {
  return useInfiniteQuery(getMyCommentsInfiniteQueryOption({ size }))
}
