export enum FriendshipStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Blocked = 3
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface FriendshipWithPlayer {
  id: string;
  requester?: PlayerBasicInfo;  // Presente em convites recebidos
  addressee?: PlayerBasicInfo;  // Presente em convites enviados
  status: FriendshipStatus;
  createdAt: Date;
}

export interface FriendshipCount {
  totalFriends: number;
  pendingReceived: number;
  pendingSent: number;
}

export interface PlayerBasicInfo {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
}
