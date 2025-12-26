import { FileText } from 'lucide-react'

export function EmptyPost() {
  return (
    <div className="flex min-h-[calc(100dvh-var(--header-h)-var(--page-pb)-88px)] flex-col pb-6">
      <div className="flex flex-1">
        <div className="flex w-full max-w-[1045px] flex-1 flex-col items-center justify-center gap-4 rounded-[10px] border border-[#E5E7EB] bg-white">
          <FileText className="h-14 w-14 text-[#AEB0B6]" strokeWidth={2} />
          <p className="text-[14px] leading-[24px] text-[#6A7282]">아직 게시물이 없습니다</p>
        </div>
      </div>
    </div>
  )
}
