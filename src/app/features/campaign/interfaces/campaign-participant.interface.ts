export enum ParticipantRole {
  Player = 0,
  GameMaster = 1
}

export interface CampaignParticipant {
  id: string;
  playerId: string;
  characterId?: string;
  role: ParticipantRole;
  joinedAt: Date;
  isActive: boolean;
}

export interface ParticipantWithDetails {
  id: string;
  player: {
    id: string;
    nickName: string;
    firstName: string;
    lastName: string;
  };
  character?: {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
  };
  role: ParticipantRole;
  joinedAt: Date;
}

export interface AddParticipantRequest {
  playerId: string;
  role: ParticipantRole;
  characterId?: string;
}

export interface AvailableFriend {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
  charactersCount: number;
}

export interface AvailableCharacter {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  isInCampaign: boolean;
  image?: string | null;
  health?: number;
  mana?: number;
}
