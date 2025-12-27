import MarkdownViewer from '@/components/markdown/MarkdownViewer'
import { Avatar } from '@/components/ui/Avatar'
import { Reaction } from '@/features/(authenticated)/post/components/Reaction'
import { CommentSection } from '@/features/(authenticated)/post/components/CommentSection'
import { toRelativeTimeLabel } from '@/utils/toRelativeTimeLabel'
import { Pencil, Trash2 } from 'lucide-react'
import { TOPIC_LABEL } from '@/types/Topic.types'
import { getUser } from '@/features/(authenticated)/users/apis/user.api'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { getPostDetail, deletePost } from '@/features/(authenticated)/post/apis/post.api'
import type { ReactionType } from '@/features/(authenticated)/post/types/Post.types'
import { getPostDetailReaction } from '@/features/(authenticated)/post/apis/reaction.api'
import { toggleReactionAction } from '@/features/(authenticated)/post/actions/toggleReactionAction'

export default async function PostDetailPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params

  const post = await getPostDetail(id)
  const user = await getUser()

  const isOwner = post && user?.userId === post.writerId

  const reactionSummary = await getPostDetailReaction(id)
  const reactions = (
    Object.entries(reactionSummary?.summaries ?? {}) as Array<
      [ReactionType, { count: number; reactedByMe: boolean }]
    >
  ).map(([reactionType, v]) => ({
    reactionType,
    count: v?.count ?? 0,
    reactedByMe: v?.reactedByMe ?? false,
  }))

  async function deletePostAction() {
    'use server'
    await deletePost(id)
    revalidatePath('/')
    redirect('/')
  }

  async function handleToggleReaction(reactionType: ReactionType, reactedByMe: boolean) {
    'use server'
    await toggleReactionAction({
      targetType: 'POST',
      targetId: id,
      reactionType,
      reactedByMe,
      revalidatePathname: `/post/${id}`,
    })
  }

  return (
    post && (
      <section
        className="mx-auto w-full max-w-[1377px] rounded-lg bg-white p-8"
        aria-labelledby="post-title"
      >
        <div className="flex flex-col gap-8">
          <header className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2" aria-label="게시글 메타 정보">
              <Avatar size="sm" />
              <span className="text-[16px] leading-[24px] font-medium text-[#171719]">
                {post?.writerName}
              </span>
              <span aria-hidden className="text-[16px] leading-[24px] text-[rgba(55,56,60,0.61)]">
                ·
              </span>
              <time
                className="text-[14px] leading-[20px] text-[rgba(55,56,60,0.61)]"
                dateTime={post?.wroteAt}
              >
                {toRelativeTimeLabel(post?.wroteAt)}
              </time>
              <span className="inline-flex h-[22px] items-center justify-center rounded-lg bg-[#ECEEF2] px-2 text-[12px] leading-[16px] font-medium text-black">
                {TOPIC_LABEL[post?.topic]}
              </span>
            </div>
            {isOwner && (
              <div className="flex h-7 w-[72px] items-center gap-4">
                <Link
                  href={`/post/${id}/edit`}
                  aria-label="수정"
                  className="h-7 w-7 rounded-md px-1 pt-1 pb-0 focus:ring-1 focus:ring-[#155DFC]/30 focus:outline-none"
                >
                  <Pencil size={20} stroke="rgba(55,56,60,0.61)" aria-hidden />
                </Link>

                <form action={deletePostAction}>
                  <button
                    type="submit"
                    aria-label="삭제"
                    className="h-7 w-7 rounded-md px-1 pt-1 pb-0 focus:ring-1 focus:ring-[#155DFC]/30 focus:outline-none"
                  >
                    <Trash2 size={20} stroke="rgba(55,56,60,0.61)" aria-hidden />
                  </button>
                </form>
              </div>
            )}
          </header>
          <h1 id="post-title" className="text-[36px] leading-[54px] font-medium text-black">
            {post.title}
          </h1>
          <ul className="flex flex-wrap gap-3" aria-label="태그">
            {post?.tags?.map((t) => (
              <li key={t} className="text-[16px] leading-[24px] text-[rgba(46,47,51,0.88)]">
                #{t}
              </li>
            ))}
          </ul>
          <MarkdownViewer content={post?.content} />
          <Reaction reactions={reactions} onToggle={handleToggleReaction} />

          <CommentSection postId={id} userId={user.userId} />
        </div>
      </section>
    )
  )
}
