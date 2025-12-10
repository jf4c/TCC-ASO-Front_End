export interface MasterNote {
  id: string
  campaignId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateMasterNoteRequest {
  content: string
}

export interface UpdateMasterNoteRequest {
  content: string
}
