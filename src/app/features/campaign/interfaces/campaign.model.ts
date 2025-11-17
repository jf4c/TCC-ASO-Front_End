export interface Campaign {
  id: string
  name: string
  title: string
  description: string
  image?: string
  status: CampaignStatus
  masterName: string
  playersCount: number
  maxPlayers: number
  userRole: UserRole
  worldId?: string
  worldName?: string
  createdAt: Date
  lastActivity: Date
}

export enum CampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  FINISHED = 'finished',
}

export enum UserRole {
  MASTER = 'master',
  PLAYER = 'player',
}

export interface GetCampaignsRequest {
  page?: number
  pageSize?: number
  role?: UserRole
  status?: CampaignStatus
  search?: string
}

export interface GetCampaignsResponse {
  campaigns: Campaign[]
  totalCount: number
  currentPage: number
  pageSize: number
}
