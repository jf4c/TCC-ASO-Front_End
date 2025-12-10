export interface Chapter {
  id: string
  actId: string
  title: string
  content: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateChapterRequest {
  title: string
  content: string
}

export interface UpdateChapterRequest {
  title: string
  content: string
}

export interface ReorderChapterRequest {
  chapterId: string
  newOrder: number
}
