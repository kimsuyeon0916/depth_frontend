'use client'

import React, { useActionState, useState } from 'react'
import Input from '@/components/ui/Input'
import MarkdownEditor from '@/components/markdown/MarkdownEditor'
import { createContentAction } from '@/features/(authenticated)/content/create/actions'
import Form from 'next/form'
import { ContentCreateState } from '@/features/(authenticated)/content/create/formTypes'
import ErrorMessage from '@/components/ui/ErrorMessage'
import MarkdownViewer from '@/components/markdown/MarkdownViewer'

const initialContentCreateState: ContentCreateState = {
  message: null,
  fieldErrors: {},
  values: {
    category: '',
    title: '',
    content: '',
  },
}

export default function ContentCreateForm() {
  const [state, formAction, isPending] = useActionState(
    createContentAction,
    initialContentCreateState,
  )

  const [previewContent, setPreviewContent] = useState<string>(state.values?.content ?? '')

  return (
    <Form action={formAction} className="mx-auto flex h-[50rem] w-full max-w-7xl gap-4 p-5">
      {/* 왼쪽: 작성 폼 */}
      <section className="h-full w-2/3 space-y-6 rounded-md border border-gray-300 bg-white p-[33px]">
        {/* 카테고리 */}
        <div className="space-y-1">
          <h3 className="text-xs">카테고리</h3>
          <select
            name="category"
            defaultValue={state.values?.category ?? ''}
            className="h-10 w-full rounded-md bg-gray-200 px-3 focus:ring-1 focus:ring-gray-300"
          >
            <option value="">선택하세요</option>
            <option value="job-tips">취업 팁</option>
            <option value="notice">공지사항</option>
            <option value="qna">Q&amp;A</option>
          </select>
          {state.fieldErrors?.category && <ErrorMessage message={state.fieldErrors.category} />}
        </div>

        {/* 제목 */}
        <div className="space-y-1">
          <Input
            name="title"
            placeholder="제목을 입력하세요."
            defaultValue={state.values?.title ?? ''}
          />
          {state.fieldErrors?.title && <ErrorMessage message={state.fieldErrors.title} />}
        </div>

        {/* 내용 (Markdown) */}
        <div className="h-[calc(100%-147px)] space-y-1">
          <MarkdownEditor
            name="content"
            defaultValue={state.values?.content ?? ''}
            onChange={setPreviewContent}
          />
          {state.fieldErrors?.content && <ErrorMessage message={state.fieldErrors.content} />}
        </div>

        {state.message && <ErrorMessage message={state.message} />}
      </section>

      {/* 오른쪽: 미리보기 */}
      <section className="w-1/3 space-y-3 rounded-md border border-gray-300 bg-white p-[33px]">
        <h3 className="text-xs">미리보기</h3>
        <div className="overflow-y-auto bg-white">
          {previewContent ? (
            <MarkdownViewer content={previewContent} />
          ) : (
            <p className="text-sm text-gray-400">
              왼쪽 에디터에 내용을 입력하면 여기에서 미리 보기가 표시됩니다.
            </p>
          )}
        </div>
      </section>
    </Form>
  )
}
