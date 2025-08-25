import { Injectable } from '@angular/core'
import { Observable, of, delay } from 'rxjs'
import {
  Campaign,
  CampaignStatus,
  UserRole,
  GetCampaignsRequest,
  GetCampaignsResponse,
} from '../interfaces/campaign.model'

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private mockCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'The Lost Mine of Phandelver',
      description:
        'A classic adventure to save the town of Phandalin from threats both above and below ground. A group of adventurers is hired to escort a wagon of supplies...',
      image: '/assets/campaigns/lost-mine.jpg',
      status: CampaignStatus.ACTIVE,
      masterName: 'Gandalf the Grey',
      playersCount: 2,
      maxPlayers: 4,
      userRole: UserRole.MASTER,
      createdAt: new Date('2024-01-15'),
      lastActivity: new Date('2024-08-20'),
    },
    {
      id: '2',
      title: 'Curse of Strahd',
      description:
        'A gothic horror campaign set in the misty land of Barovia, ruled by the vampire lord Strahd von Zarovich. Unwillingly drawn into this bleak domain...',
      image: '/assets/campaigns/curse-strahd.jpg',
      status: CampaignStatus.ACTIVE,
      masterName: 'Elminster Aumar',
      playersCount: 5,
      maxPlayers: 6,
      userRole: UserRole.PLAYER,
      createdAt: new Date('2024-03-10'),
      lastActivity: new Date('2024-08-15'),
    },
    {
      id: '3',
      title: 'Tomb of Annihilation',
      description:
        'A deadly adventure in the jungles of Chult, where the heroes must find the cause of a death curse that plagues the land. They will face dinosaurs, undead...',
      image: '/assets/campaigns/tomb-annihilation.jpg',
      status: CampaignStatus.PAUSED,
      masterName: 'Mordenkainen',
      playersCount: 3,
      maxPlayers: 5,
      userRole: UserRole.PLAYER,
      createdAt: new Date('2023-12-05'),
      lastActivity: new Date('2024-07-30'),
    },
    {
      id: '4',
      title: 'Waterdeep: Dragon Heist',
      description:
        'A treasure hunt in the most cosmopolitan city of the Sword Coast. Political intrigue, urban adventures, and a missing fortune await...',
      image: '/assets/campaigns/dragon-heist.jpg',
      status: CampaignStatus.FINISHED,
      masterName: 'Volo Geddarm',
      playersCount: 4,
      maxPlayers: 4,
      userRole: UserRole.MASTER,
      createdAt: new Date('2023-08-20'),
      lastActivity: new Date('2024-02-14'),
    },
    {
      id: '5',
      title: 'Out of the Abyss',
      description:
        'Escape from the Underdark in this adventure where madness and chaos reign. The demon lords have been summoned and reality itself is at stake...',
      image: '/assets/campaigns/out-abyss.jpg',
      status: CampaignStatus.ACTIVE,
      masterName: 'Drizzt DoUrden',
      playersCount: 3,
      maxPlayers: 6,
      userRole: UserRole.PLAYER,
      createdAt: new Date('2024-05-01'),
      lastActivity: new Date('2024-08-22'),
    },
    {
      id: '6',
      title: 'Storm King Thunder',
      description:
        'Giants have emerged from their strongholds to threaten civilization as never before. Hill giants are stealing all the grain and livestock...',
      image: '/assets/campaigns/storm-king.jpg',
      status: CampaignStatus.ACTIVE,
      masterName: 'Tasha Hidora',
      playersCount: 1,
      maxPlayers: 4,
      userRole: UserRole.MASTER,
      createdAt: new Date('2024-06-12'),
      lastActivity: new Date('2024-08-24'),
    },
  ]

  getCampaigns(
    request: GetCampaignsRequest = {},
  ): Observable<GetCampaignsResponse> {
    const { page = 1, pageSize = 9, role, status, search } = request

    let filteredCampaigns = [...this.mockCampaigns]

    // Filtrar por role
    if (role) {
      filteredCampaigns = filteredCampaigns.filter(
        (campaign) => campaign.userRole === role,
      )
    }

    // Filtrar por status
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(
        (campaign) => campaign.status === status,
      )
    }

    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCampaigns = filteredCampaigns.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchLower) ||
          campaign.description.toLowerCase().includes(searchLower),
      )
    }

    // Paginação
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex)

    const response: GetCampaignsResponse = {
      campaigns: paginatedCampaigns,
      totalCount: filteredCampaigns.length,
      currentPage: page,
      pageSize,
    }

    // Simular delay da API
    return of(response).pipe(delay(500))
  }
}
