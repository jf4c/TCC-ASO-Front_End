import { Campaign, UserRole } from './campaign.model'

export interface CampaignDetail extends Campaign {
  participants: CampaignParticipant[]
  sessions: CampaignSession[]
  settings: CampaignSettings
  statistics: CampaignStatistics
  world?: CampaignWorld
}

export interface CampaignParticipant {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  role: UserRole
  joinedAt: Date
  status: ParticipantStatus
  characters: CharacterInCampaign[]
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

export interface CampaignWorld {
  lore: LoreEntry[]
  locations: LocationEntry[]
  pantheon: PantheonEntry[]
}

export interface LoreEntry {
  id: string
  title: string
  content: string
  order: number
}

export interface LocationEntry {
  id: string
  title: string
  description: string
  order: number
}

export interface PantheonEntry {
  id: string
  name: string
  title: string
  description: string
  domains?: string[]
  order: number
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
