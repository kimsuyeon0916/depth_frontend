export type ContentCreateState = {
  message: string | null
  fieldErrors?: Partial<Record<'category' | 'title' | 'content', string>>
  values?: {
    category: string
    title: string
    content: string
  }
}
export type ContentFormValues = {
  category: string
  title: string
  content: string
}
