import { Chapter } from './chapter.interface'

export interface Act {
  id: string
  campaignId: string
  title: string
  order: number
  createdAt: Date
  updatedAt: Date
  chapters: Chapter[]
}

export interface CreateActRequest {
  title: string
}

export interface UpdateActRequest {
  title: string
}

export interface ReorderActRequest {
  actId: string
  newOrder: number
}
