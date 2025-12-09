import { Campaign, UserRole } from './campaign.model'

export interface CampaignDetail extends Campaign {
  gameMasterId: string
  participants: CampaignParticipant[]
  sessions: CampaignSession[]
  settings: CampaignSettings
  statistics: CampaignStatistics
  worldId?: string
  worldName?: string
  storyIntroduction?: string
}

export interface CampaignParticipant {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  role: UserRole
  joinedAt: Date
  status: ParticipantStatus
  character?: CharacterInCampaign
}

export interface CharacterInCampaign {
  id: string
  name: string
  class: string
  race: string
  ancestry: string
  level: number
  description?: string
  image?: string
  status: CharacterStatus
  isActive: boolean
}

export interface CampaignSession {
  id: string
  title: string
  date: Date
  duration: number
  notes?: string
}

export interface CampaignSettings {
  isPublic: boolean
  allowCharacterCreation: boolean
  maxPlayers: number
  system: string
}

export interface CampaignStatistics {
  totalSessions: number
  totalPlaytime: number
  averageSessionLength: number
  lastSessionDate?: Date
}

export enum ParticipantStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export enum CharacterStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

// Re-export das interfaces existentes
export type {
  Campaign,
  GetCampaignsRequest,
  GetCampaignsResponse,
} from './campaign.model'

// Re-export dos enums (precisam ser exportados como valores)
export { CampaignStatus, UserRole } from './campaign.model'
