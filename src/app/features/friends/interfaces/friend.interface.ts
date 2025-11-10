import { PlayerBasicInfo } from './friendship.interface';

export interface Friend {
  friendshipId: string;
  friend: PlayerBasicInfo;
  friendsSince: Date;
}
