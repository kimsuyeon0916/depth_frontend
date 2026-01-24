import React, { TextareaHTMLAttributes, useMemo, useRef, useState } from 'react'
import { MentionBox } from '@/components/ui/MentionBox'
import { MentionUser, useMentionUsers } from '@/hooks/useMentionUsers'
import clsx from 'clsx'

type MentionEntity = { userId: string | number; name: string; start: number; end: number }
type MentionTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onMentionsChange?: (mentions: MentionEntity[]) => void
}
export function MentionTextarea({
  id,
  value,
  onChange,
  maxLength,
  className,
  onScroll,
  placeholder,
  ...rest
}: MentionTextareaProps) {
  const [mentionOpen, setMentionOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentions, setMentionsState] = useState<MentionEntity[]>([])

  const mentionsRef = useRef<MentionEntity[]>([])
  const boxRef = useRef<HTMLDivElement | null>(null)
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const hlRef = useRef<HTMLDivElement | null>(null)
  const caretRef = useRef(0)

  const textValue = (value ?? '').toString()

  const { data } = useMentionUsers(20, mentionOpen)
  const members = useMemo(() => data?.pages.flatMap((p) => p) ?? [], [data])

  const filteredMembers = useMemo(() => {
    if (!mentionOpen) return []
    const q = mentionQuery.trim()
    if (!q) return members
    return members.filter((m) => m.name.startsWith(q))
  }, [members, mentionOpen, mentionQuery])

  const safeActiveIndex = Math.min(activeIndex, Math.max(filteredMembers.length - 1, 0))

  const closeMention = () => {
    setMentionOpen(false)
    setMentionQuery('')
    setActiveIndex(0)
  }
  const prevTextRef = useRef(textValue)

  const setMentions = (next: MentionEntity[]) => {
    mentionsRef.current = next
    setMentionsState(next)
    rest.onMentionsChange?.(next)
  }

  const onSelect = (user: MentionUser) => {
    const caret = caretRef.current
    const replaced = replaceMentionToken({
      text: textValue,
      caret,
      pickedName: user.name,
    })

    if (!replaced) return

    onChange?.({
      target: { value: replaced.nextText },
      currentTarget: { value: replaced.nextText },
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>)

    // 멘션 메타는 별도로 저장
    setMentions([
      ...mentionsRef.current,
      {
        userId: user.userId,
        name: user.name,
        start: replaced.mentionStart,
        end: replaced.mentionEnd,
      },
    ])

    closeMention()
    requestAnimationFrame(() => {
      taRef.current?.focus({ preventScroll: true })
      taRef.current?.setSelectionRange(replaced.nextCaret, replaced.nextCaret)
    })
  }

  return (
    <div className="relative w-full">
      <div
        ref={hlRef}
        aria-hidden
        className={clsx(
          className ?? '',
          'pointer-events-none absolute inset-0 z-0 overflow-hidden break-words whitespace-pre-wrap',
        )}
      >
        {textValue.length > 0 ? (
          renderHighlightedText(textValue, mentions)
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        {'\u200b'}
      </div>

      {mentionOpen && (
        <MentionBox
          ref={boxRef}
          members={filteredMembers}
          activeIndex={safeActiveIndex}
          onActiveIndexChange={setActiveIndex}
          onSelect={onSelect}
        />
      )}

      <textarea
        {...rest}
        ref={taRef}
        id={id}
        value={value}
        onChange={(e) => {
          onChange?.(e)
          const nextText = e.currentTarget.value
          const prevText = prevTextRef.current

          const nextMentions = shiftMentions(prevText, nextText, mentionsRef.current)
          setMentions(nextMentions)
          prevTextRef.current = nextText

          // 기존 멘션 검색 로직
          const caret = e.currentTarget.selectionStart ?? nextText.length
          caretRef.current = caret

          const q = getMentionQuery(nextText, caret)
          if (q === null) {
            closeMention()
            return
          }

          setMentionOpen(true)
          setMentionQuery(q)
          setActiveIndex(0)
        }}
        onScroll={(e) => {
          onScroll?.(e)
          const ta = e.currentTarget
          if (hlRef.current) {
            hlRef.current.scrollTop = ta.scrollTop
            hlRef.current.scrollLeft = ta.scrollLeft
          }
        }}
        onKeyDown={(e) => {
          if (!mentionOpen) return

          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation?.()
            closeMention()
            requestAnimationFrame(() => taRef.current?.focus({ preventScroll: true }))
            return
          }

          if (filteredMembers.length === 0) return

          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => (i + 1) % filteredMembers.length)
            return
          }

          if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => (i - 1 + filteredMembers.length) % filteredMembers.length)
            return
          }

          if (e.key === 'Enter') {
            e.preventDefault()
            const picked = filteredMembers[safeActiveIndex]
            if (picked) onSelect(picked)
            return
          }
        }}
        maxLength={maxLength}
        className={clsx(className ?? '', 'relative caret-slate-900 selection:bg-blue-200')}
        placeholder={placeholder}
      />
    </div>
  )
}

function computeDiff(oldText: string, newText: string) {
  let start = 0
  while (start < oldText.length && start < newText.length && oldText[start] === newText[start])
    start++

  let oldEnd = oldText.length
  let newEnd = newText.length
  while (oldEnd > start && newEnd > start && oldText[oldEnd - 1] === newText[newEnd - 1]) {
    oldEnd--
    newEnd--
  }

  const delta = newEnd - start - (oldEnd - start) // 변경 길이 차이
  return { start, oldEnd, newEnd, delta }
}

function shiftMentions(oldText: string, newText: string, mentions: MentionEntity[]) {
  const { start, oldEnd, delta } = computeDiff(oldText, newText)

  const next = mentions
    .map((m) => {
      // 변경 구간 이전이면 그대로
      if (m.end <= start) return m
      // 변경 구간 이후면 shift
      if (m.start >= oldEnd) return { ...m, start: m.start + delta, end: m.end + delta }
      // 변경 구간과 겹치면 멘션 무효(사용자가 편집한 것)
      return null
    })
    .filter(Boolean) as MentionEntity[]

  // 안전검증: 실제 텍스트가 @name이 아니면 무효
  return next.filter((m) => newText.slice(m.start, m.end) === `@${m.name}`)
}

function replaceMentionToken(params: { text: string; caret: number; pickedName: string }) {
  const { text, caret, pickedName } = params
  const upto = text.slice(0, caret)
  const at = upto.lastIndexOf('@')
  if (at === -1) return null

  if (at !== 0) {
    const prev = upto[at - 1]
    if (prev !== ' ' && prev !== '\n' && prev !== '\t') return null
  }

  const before = text.slice(0, at)
  const after = text.slice(caret)

  const visible = `@${pickedName}`
  const insert = `${visible} ` // 뒤에 공백
  const nextText = before + insert + after

  const mentionStart = before.length
  const mentionEnd = mentionStart + visible.length
  const nextCaret = mentionStart + insert.length

  return { nextText, nextCaret, mentionStart, mentionEnd }
}

function getMentionQuery(text: string, caret: number) {
  const upto = text.slice(0, caret)
  const at = upto.lastIndexOf('@')
  if (at === -1) return null

  // 선택된 토큰('@[')이면 멘션 입력으로 취급 안 함
  if (upto[at + 1] === '[') return null

  if (at !== 0) {
    const prev = upto[at - 1]
    if (prev !== ' ' && prev !== '\n' && prev !== '\t') return null
  }

  const after = upto.slice(at + 1)
  if (after.length === 0) return ''
  if (/\s/.test(after)) return null
  return after
}

function renderHighlightedText(text: string, mentions: MentionEntity[]) {
  const sorted = [...mentions].sort((a, b) => a.start - b.start)

  const nodes: React.ReactNode[] = []
  let cursor = 0

  for (const m of sorted) {
    // userId 없는 멘션은 하이라이트 금지
    if (!m.userId) continue

    // 범위가 깨졌거나 텍스트가 바뀌면 무효 처리
    const expected = `@${m.name}`
    if (text.slice(m.start, m.end) !== expected) continue

    if (m.start > cursor) nodes.push(text.slice(cursor, m.start))

    nodes.push(
      <span
        key={`${m.start}-${m.userId}`}
        className="rounded bg-blue-300/40 font-semibold text-blue-500"
        data-user-id={m.userId}
      >
        {expected}
      </span>,
    )

    cursor = m.end
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}
