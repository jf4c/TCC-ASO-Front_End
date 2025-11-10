import { CampaignStatus } from './campaign.interface';
import { ParticipantWithDetails } from './campaign-participant.interface';

export interface CampaignDetail {
  id: string;
  name: string;
  description?: string;
  creator: PlayerBasicInfo;
  gameMaster?: PlayerBasicInfo;
  status: CampaignStatus;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  maxPlayers: number;
  isPublic: boolean;
  participants: ParticipantWithDetails[];
  canEdit: boolean;
  canManageParticipants: boolean;
}

export interface PlayerBasicInfo {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
}
