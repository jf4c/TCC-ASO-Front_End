import { Class } from '@features/character/interface/class.model'
import { Attributes } from '@features/character/interface/attribute.model'
import { Ancestry } from '@features/character/interface/ancestry.model'

export interface Character {
  name: string
  class: string
  ancestry: string
  level: number
  health: number
  mana: number
  image?: string | null
}

export interface CharacterForm {
  name: string
  attribute: Attributes
  ancestry: Ancestry
  charClass: Class
  campaign: string | null
}
