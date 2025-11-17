export enum CampaignStatus {
  Planning = 0,
  Active = 1,
  OnHold = 2,
  Completed = 3,
  Cancelled = 4
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  gameMasterId?: string;
  status: CampaignStatus;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  maxPlayers: number;
  isPublic: boolean;
}

export interface CampaignListItem {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  createdAt: Date;
  participantsCount: number;
  maxPlayers: number;
  myRole: 'creator' | 'gameMaster' | 'player';
  isCreator: boolean;
}

export interface CreateCampaignParticipantInput {
  playerId: string;
  characterId: string;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  maxPlayers: number;
  isPublic: boolean;
  participants: CreateCampaignParticipantInput[];
  storyIntroduction?: string;
}

export interface UpdateCampaignRequest {
  name: string;
  description?: string;
  maxPlayers: number;
  status: CampaignStatus;
}

export interface GenerateCampaignStoryRequest {
  characterIds: string[];
  campaignName: string;
  campaignDescription?: string;
}

export interface GenerateCampaignStoryResponse {
  story: string;
  generatedAt: string;
}
