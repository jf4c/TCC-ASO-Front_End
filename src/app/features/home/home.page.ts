import { Component, OnInit, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { FeatureCardComponent } from './components/feature-card/feature-card.component'
import { CampaignService } from '@features/campaign/services/campaign.service'
import { CharacterService } from '@features/character/services/character.service'
import { CampaignStatus } from '@features/campaign/interfaces/campaign.interface'
import { UploadService } from '@shared/services/upload.service'

interface FavoriteCharacter {
  id: string
  name: string
  ancestry: string
  class: {
    id: string
    name: string
    initialHp: number
    hpPerLevel: number
    initialMp: number
    mpPerLevel: number
  }
  level: number
  modifiers: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  image?: string | null
}

interface RecentCampaign {
  id: string
  name: string
  description?: string
  bannerImage?: string
  status: CampaignStatus
  participantsCount: number
  maxPlayers: number
  lastAccess: Date
}

@Component({
  selector: 'aso-home',
  imports: [CommonModule, RouterModule, FeatureCardComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  private readonly campaignService = inject(CampaignService)
  private readonly characterService = inject(CharacterService)
  private readonly router = inject(Router)
  private readonly uploadService = inject(UploadService)

  favoriteCharacters = signal<FavoriteCharacter[]>([])
  recentCampaigns = signal<RecentCampaign[]>([])

  ngOnInit(): void {
    this.loadFavoriteCharacters()
    this.loadRecentCampaigns()
  }

  /**
   * Carrega personagens favoritos (primeiros 3)
   */
  private loadFavoriteCharacters(): void {
    this.characterService.getPaginatedCharacter({ pageSize: 3 }).subscribe({
      next: (response) => {
        const characters = response.results.map((c) => ({
          id: c.id,
          name: c.name,
          ancestry: c.ancestry,
          class: c.class,
          level: c.level,
          modifiers: c.modifiers,
          image: c.image,
        }))
        this.favoriteCharacters.set(characters)
      },
      error: (error) => {
        console.error('Erro ao carregar personagens:', error)
        this.favoriteCharacters.set([])
      },
    })
  }

  /**
   * Carrega campanhas recentemente acessadas
   */
  private loadRecentCampaigns(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        // Pega as 3 últimas acessadas (mock de lastAccess por enquanto)
        const recent = campaigns
          .map((c) => ({
            ...c,
            lastAccess: new Date(),
          }))
          .slice(0, 3)
        this.recentCampaigns.set(recent)
      },
      error: () => {
        // Mock em caso de erro
        this.recentCampaigns.set([
          {
            id: '1',
            name: 'As Sombras de Eldoria',
            description: 'Uma aventura épica nas terras sombrias.',
            status: CampaignStatus.Active,
            participantsCount: 4,
            maxPlayers: 6,
            lastAccess: new Date(),
          },
        ])
      },
    })
  }

  getCampaignImage(campaign: RecentCampaign): string {
    if (campaign.bannerImage) {
      return this.uploadService.getImageUrl(campaign.bannerImage) || 'assets/d20.jpg'
    }
    return 'assets/d20.jpg'
  }

  /**
   * Navega para detalhes do personagem
   */
  onViewCharacter(characterId: string): void {
    this.router.navigate(['/personagens', characterId])
  }

  /**
   * Navega para detalhes da campanha
   */
  onViewCampaign(campaignId: string): void {
    this.router.navigate(['/campanhas', campaignId])
  }

  /**
   * Retorna texto do status da campanha
   */
  getStatusText(status: CampaignStatus): string {
    switch (status) {
      case CampaignStatus.Planning:
        return 'Planejamento'
      case CampaignStatus.Active:
        return 'Ativa'
      case CampaignStatus.OnHold:
        return 'Pausada'
      case CampaignStatus.Completed:
        return 'Finalizada'
      default:
        return 'Ativa'
    }
  }

  /**
   * Retorna tempo relativo (ex: "há 2 horas")
   */
  getRelativeTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`
    return 'agora'
  }
}
