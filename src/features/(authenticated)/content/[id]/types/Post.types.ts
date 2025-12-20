import { TopicType } from '../../create/types/Topic.types'

export type Post = {
  writerId: number // TODO: 필드 추가 요청
  postId: number
  writerName: string
  title: string
  topic: TopicType
  wroteAt: string
  content: string
  commentsCount: number
  tags?: string[] // TODO: 필요 여부 검토
}

export type HighlightType = 'BY_ADMIN' | 'BY_REACTION' | 'BY_VIEW' | 'NONE'

export type GetPostDetailResponse = Post

export type GetPostsResponse = {
  contents: Post[]
}

export type CreatePostRequest = {
  topic: TopicType
  title: string
  content: string
  highlightType: HighlightType
}

export type UpdatePostRequest = CreatePostRequest & { postId: number }
