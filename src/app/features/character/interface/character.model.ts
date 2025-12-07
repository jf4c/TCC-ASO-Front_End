import { Class } from '@features/character/interface/class.model'
import { Attributes } from '@features/character/interface/attribute.model'
import { Ancestry } from '@features/character/interface/ancestry.model'

export interface Character {
  id: string
  name: string
  class: string
  ancestry: string
  level: number
  health: number
  mana: number
  image?: string | null
}

export interface CharacterDetail {
  id: string
  name: string
  level: number
  backstory?: string
  image?: string | null
  ancestry: {
    id: string
    name: string
  }
  class: {
    id: string
    name: string
  }
  attributes: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  skills: Skill[]
  playerId: string
  campaignId?: string | null
  createdAt: string
  updatedAt: string
}

// Computed properties para compatibilidade
export interface CharacterDetailViewModel extends CharacterDetail {
  ancestryId: string
  ancestryName: string
  classId: string
  className: string
  health: number
  mana: number
  modifiers: Modifiers
  campaignId?: string | null
  campaignName?: string | null
  isInCampaign: boolean
}

export interface Skill {
  id: string
  name: string
  description?: string
}

export interface UpdateCharacterRequest {
  name?: string
  level?: number
  health?: number
  mana?: number
  backstory?: string
  image?: string | null
  imageId?: string | null
  ancestryId?: string
  classId?: string
  skillsIds?: string[]
  modifiers?: Modifiers
}

export interface LevelUpRequest {
  newLevel: number
}

export interface LevelUpResponse {
  id: string
  name: string
  newLevel: number
  updatedAt: string
}

export interface CharacterForm {
  name: string
  attribute: Attributes
  ancestry: Ancestry
  charClass: Class
  campaign: string | null
}

export interface Modifiers {
  modStrength: number
  modDexterity: number
  modConstitution: number
  modIntelligence: number
  modWisdom: number
  modCharisma: number
}

export interface CreateCharacterRequest {
  name: string
  ancestryId: string
  classId: string
  skillsIds: string[]
  attributes: Attributes
  modifiers: Modifiers
  backstory?: string
  campaignId?: string | null
  imageId?: string | null
}

export interface GetPaginatedCharacterRequest {
  playerId?: string
  name?: string
  ancestryId?: string
  classId?: string
  campaignId?: string
  page?: number
  pageSize?: number
}

export interface GetPaginatedCharacterResponse {
  results: Character[]
  currentPage: number
  pageCount: number
  pageSize: number
  rowCount: number
  firstRowOnPage: number
  lastRowOnPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
