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

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  maxPlayers: number;
  isPublic: boolean;
}

export interface UpdateCampaignRequest {
  name: string;
  description?: string;
  maxPlayers: number;
  status: CampaignStatus;
}
