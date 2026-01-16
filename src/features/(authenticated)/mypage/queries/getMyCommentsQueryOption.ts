import { getMyComments } from '@/features/(authenticated)/mypage/apis/getMyComment'

export const DEFAULT_POSTS_PAGE_SIZE = 20
export type Cursor = number | null

export const myCommentKeys = {
  all: ['my-comment'] as const,
  listBase: () => [...myCommentKeys.all, 'list'] as const,
  list: (params: { size?: number } = {}) =>
    [...myCommentKeys.listBase(), params.size ?? DEFAULT_POSTS_PAGE_SIZE] as const,
}

export function getMyCommentsInfiniteQueryOption(params: { size?: number } = {}) {
  const { size = DEFAULT_POSTS_PAGE_SIZE } = params

  return {
    queryKey: myCommentKeys.list({ size }),
    initialPageParam: 1,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return getMyComments({
        page: pageParam,
        size,
      })
    },
    getNextPageParam: (lastPage: any): Cursor => {
      if (!lastPage.hasNext) return null
      return lastPage.nextPage
    },
  }
}
