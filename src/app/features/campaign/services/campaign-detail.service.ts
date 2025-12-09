import { Injectable } from '@angular/core'
import { Observable, of, delay } from 'rxjs'
import {
  CampaignDetail,
  ParticipantStatus,
  CharacterStatus,
  UserRole,
  CampaignStatus,
} from '../interfaces/campaign-detail.model'

@Injectable({
  providedIn: 'root',
})
export class CampaignDetailService {
  private mockCampaignDetails: Record<string, CampaignDetail> = {
    '1': {
      id: '1',
      title: 'The Lost Mine of Phandelver',
      description:
        'A classic adventure to save the town of Phandalin from threats both above and below ground. A group of adventurers is hired to escort a wagon of supplies...',
      image: '/assets/d20.jpg',
      status: CampaignStatus.ACTIVE,
      masterName: 'Gandalf the Grey',
      playersCount: 3,
      maxPlayers: 4,
      userRole: UserRole.MASTER,
      createdAt: new Date('2024-01-15'),
      lastActivity: new Date('2024-08-20'),
      participants: [
        {
          id: 'p1',
          userId: 'u1',
          userName: 'Gandalf the Grey',
          userAvatar: '/assets/Character/mage1.png',
          role: UserRole.MASTER,
          joinedAt: new Date('2024-01-15'),
          status: ParticipantStatus.ACTIVE,
          characters: [],
        },
        {
          id: 'p2',
          userId: 'u2',
          userName: 'Aragorn Filho de Arathorn',
          userAvatar: '/assets/Character/warrior1.png',
          role: UserRole.PLAYER,
          joinedAt: new Date('2024-01-20'),
          status: ParticipantStatus.ACTIVE,
          characters: [
            {
              id: 'c1',
              name: 'Thorin Escudo de Carvalho',
              class: 'Guerreiro',
              race: 'Anão',
              ancestry: 'Anão',
              level: 5,
              description:
                'Um guerreiro anão experiente, conhecido por sua bravura em batalha e lealdade inabalável.',
              image: '/assets/Character/warrior2.png',
              status: CharacterStatus.APPROVED,
              isActive: true,
            },
            {
              id: 'c2',
              name: 'Gimli',
              class: 'Bárbaro',
              race: 'Anão',
              ancestry: 'Anão',
              level: 3,
              description:
                'Um jovem bárbaro anão com sede de aventura e glória nas batalhas.',
              image: '/assets/Character/warrior3.png',
              status: CharacterStatus.PENDING,
              isActive: false,
            },
          ],
        },
        {
          id: 'p3',
          userId: 'u3',
          userName: 'Legolas Verdefolia',
          userAvatar: '/assets/Character/assassin1.png',
          role: UserRole.PLAYER,
          joinedAt: new Date('2024-01-25'),
          status: ParticipantStatus.ACTIVE,
          characters: [
            {
              id: 'c3',
              name: 'Elrond Meio-elfo',
              class: 'Ranger',
              race: 'Elfo',
              ancestry: 'Elfo',
              level: 4,
              description:
                'Um ranger élfico habilidoso, protetor das florestas e expert em rastreamento.',
              image: '/assets/Character/assassin2.png',
              status: CharacterStatus.APPROVED,
              isActive: true,
            },
          ],
        },
        {
          id: 'p4',
          userId: 'u4',
          userName: 'Frodo Bolseiro',
          userAvatar: '/assets/Character/rogue1.png',
          role: UserRole.PLAYER,
          joinedAt: new Date('2024-02-01'),
          status: ParticipantStatus.PENDING,
          characters: [
            {
              id: 'c4',
              name: 'Bilbo Bolseiro',
              class: 'Ladino',
              race: 'Halfling',
              ancestry: 'Halfling',
              level: 1,
              description:
                'Um halfling ladino jovem e curioso, sempre em busca de aventuras e tesouros.',
              image: '/assets/Character/rogue1.png',
              status: CharacterStatus.PENDING,
              isActive: false,
            },
          ],
        },
      ],
      sessions: [
        {
          id: 's1',
          title: 'Chegada a Phandalin',
          date: new Date('2024-08-10'),
          duration: 240,
          notes: 'Primeira sessão da campanha',
        },
        {
          id: 's2',
          title: 'A Mina Perdida',
          date: new Date('2024-08-17'),
          duration: 300,
          notes: 'Exploração da mina abandonada',
        },
      ],
      settings: {
        isPublic: false,
        allowCharacterCreation: true,
        maxPlayers: 4,
        system: 'D&D 5e',
      },
      statistics: {
        totalSessions: 2,
        totalPlaytime: 540,
        averageSessionLength: 270,
        lastSessionDate: new Date('2024-08-17'),
      },
      world: {
        lore: [
          {
            id: 'lore1',
            title: 'A Mina Perdida de Phandelver',
            content:
              'Uma antiga e rica mina do Pacto de Phandelver entre anões e gnomos, perdida há séculos após uma invasão de orcs. Diz-se que contém uma poderosa forja mágica.',
            order: 1,
          },
          {
            id: 'lore2',
            title: 'O Aranha Negra',
            content:
              'Uma figura misteriosa que manipula os eventos nas sombras. Ninguém conhece sua verdadeira identidade ou seus objetivos finais, mas suas teias se espalham por toda a região.',
            order: 2,
          },
        ],
        locations: [
          {
            id: 'loc1',
            title: 'Phandalin',
            description:
              'Uma pequena cidade fronteiriça que está crescendo novamente após anos de abandono. Centro comercial da região e ponto de partida para muitas aventuras.',
            order: 1,
          },
          {
            id: 'loc2',
            title: 'Castelo Cragmaw',
            description:
              'Uma fortaleza em ruínas ocupada por goblins, hobgoblins e seus aliados. Serve como quartel-general para ataques na região.',
            order: 2,
          },
          {
            id: 'loc3',
            title: 'Caverna do Eco da Onda',
            description:
              'Uma caverna costeira que serve de esconderijo para piratas e contrabandistas. Repleta de perigos naturais e artificiais.',
            order: 3,
          },
        ],
        pantheon: [
          {
            id: 'deity1',
            name: 'Torm',
            title: 'O Deus da Coragem e do Auto-Sacrifício',
            description:
              'Torm é o patrono dos paladinos e um campeão da justiça. Ele ensina que a maior glória vem do auto-sacrifício pelos necessitados.',
            domains: ['Guerra', 'Proteção', 'Justiça'],
            order: 1,
          },
          {
            id: 'deity2',
            name: 'Oghma',
            title: 'O Senhor do Conhecimento',
            description:
              'Oghma é o deus do conhecimento, inspiração e invenção. Bardos, sábios e inventores o veneram, buscando inspiração em suas obras.',
            domains: ['Conhecimento', 'Inspiração', 'Invenção'],
            order: 2,
          },
          {
            id: 'deity3',
            name: 'Moradin',
            title: 'O Forjador de Almas',
            description:
              'Principal divindade dos anões, Moradin é o deus da criação, proteção e forja. Ele criou os anões em sua forja divina.',
            domains: ['Forja', 'Proteção', 'Criação'],
            order: 3,
          },
        ],
      },
    },
    '2': {
      id: '2',
      title: 'Curse of Strahd',
      description:
        'A gothic horror campaign set in the misty land of Barovia, ruled by the vampire lord Strahd von Zarovich. Unwillingly drawn into this bleak domain...',
      image: '/assets/d20.jpg',
      status: CampaignStatus.ACTIVE,
      masterName: 'Elminster Aumar',
      playersCount: 5,
      maxPlayers: 6,
      userRole: UserRole.PLAYER,
      createdAt: new Date('2024-03-10'),
      lastActivity: new Date('2024-08-15'),
      participants: [
        {
          id: 'p5',
          userId: 'u5',
          userName: 'Elminster Aumar',
          userAvatar: '/assets/Character/mage2.png',
          role: UserRole.MASTER,
          joinedAt: new Date('2024-03-10'),
          status: ParticipantStatus.ACTIVE,
          characters: [],
        },
        {
          id: 'p6',
          userId: 'u6',
          userName: 'Legolas Greenleaf',
          userAvatar: '/assets/Character/rogue1.png',
          role: UserRole.PLAYER,
          joinedAt: new Date('2024-03-12'),
          status: ParticipantStatus.ACTIVE,
          characters: [
            {
              id: 'c5',
              name: 'Legolas',
              race: 'Elfo',
              ancestry: 'Elfo das Florestas',
              class: 'Ranger',
              level: 8,
              description: 'Um ranger élfico especialista em arco e flecha.',
              image: '/assets/Character/rogue1.png',
              status: CharacterStatus.APPROVED,
              isActive: true,
            },
          ],
        },
        {
          id: 'p7',
          userId: 'u7',
          userName: 'Gimli Filho de Glóin',
          userAvatar: '/assets/Character/warrior2.png',
          role: UserRole.PLAYER,
          joinedAt: new Date('2024-03-15'),
          status: ParticipantStatus.ACTIVE,
          characters: [
            {
              id: 'c6',
              name: 'Gimli',
              race: 'Anão',
              ancestry: 'Anão da Montanha',
              class: 'Guerreiro',
              level: 7,
              description: 'Um guerreiro anão especialista em machados.',
              image: '/assets/Character/warrior2.png',
              status: CharacterStatus.APPROVED,
              isActive: true,
            },
          ],
        },
      ],
      sessions: [
        {
          id: 's3',
          title: 'Chegada a Barovia',
          date: new Date('2024-08-10'),
          duration: 240,
          notes: 'Os heróis chegam ao sombrio vale de Barovia...',
        },
      ],
      settings: {
        isPublic: true,
        allowCharacterCreation: false,
        maxPlayers: 6,
        system: 'D&D 5e',
      },
      statistics: {
        totalSessions: 8,
        totalPlaytime: 1920,
        averageSessionLength: 240,
        lastSessionDate: new Date('2024-08-10'),
      },
    },
    '3': {
      id: '3',
      title: 'Tomb of Annihilation',
      description:
        'A deadly adventure in the jungles of Chult, where the heroes must find the cause of a death curse that plagues the land. They will face dinosaurs, undead...',
      image: '/assets/d20.jpg',
      status: CampaignStatus.PAUSED,
      masterName: 'Mordenkainen',
      playersCount: 3,
      maxPlayers: 5,
      userRole: UserRole.PLAYER,
      createdAt: new Date('2024-02-05'),
      lastActivity: new Date('2024-07-20'),
      participants: [
        {
          id: 'p8',
          userId: 'u8',
          userName: 'Mordenkainen',
          userAvatar: '/assets/Character/mage3.png',
          role: UserRole.MASTER,
          joinedAt: new Date('2024-02-05'),
          status: ParticipantStatus.ACTIVE,
          characters: [],
        },
        {
          id: 'p9',
          userId: 'u9',
          userName: 'Tasha a Bruxa',
          userAvatar: '/assets/Character/mage4.png',
          role: UserRole.PLAYER,
          joinedAt: new Date('2024-02-08'),
          status: ParticipantStatus.ACTIVE,
          characters: [
            {
              id: 'c7',
              name: 'Tasha',
              race: 'Humana',
              ancestry: 'Humana Variante',
              class: 'Feiticeira',
              level: 12,
              description:
                'Uma poderosa feiticeira especialista em magias caóticas.',
              image: '/assets/Character/mage4.png',
              status: CharacterStatus.APPROVED,
              isActive: true,
            },
          ],
        },
        {
          id: 'p10',
          userId: 'u10',
          userName: "Drizzt Do'Urden",
          userAvatar: '/assets/Character/rogue1.png',
          role: UserRole.PLAYER,
          joinedAt: new Date('2024-02-10'),
          status: ParticipantStatus.ACTIVE,
          characters: [
            {
              id: 'c8',
              name: 'Drizzt',
              race: 'Drow',
              ancestry: 'Drow',
              class: 'Ranger',
              level: 15,
              description:
                'Um ranger drow exilado que luta contra sua natureza sombria.',
              image: '/assets/Character/rogue1.png',
              status: CharacterStatus.APPROVED,
              isActive: true,
            },
          ],
        },
      ],
      sessions: [
        {
          id: 's4',
          title: 'Nas Selvas de Chult',
          date: new Date('2024-07-15'),
          duration: 300,
          notes: 'Explorando as perigosas selvas em busca da tumba...',
        },
      ],
      settings: {
        isPublic: false,
        allowCharacterCreation: true,
        maxPlayers: 5,
        system: 'D&D 5e',
      },
      statistics: {
        totalSessions: 12,
        totalPlaytime: 3240,
        averageSessionLength: 270,
        lastSessionDate: new Date('2024-07-15'),
      },
    },
  }

  getCampaignDetail(id: string): Observable<CampaignDetail | null> {
    const campaign = this.mockCampaignDetails[id] || null
    return of(campaign).pipe(delay(500))
  }

  approveCharacter(
    campaignId: string,
    characterId: string,
  ): Observable<boolean> {
    // Mock implementation
      'Aprovando personagem:',
      characterId,
      'na campanha:',
      campaignId,
    )
    return of(true).pipe(delay(300))
  }

  rejectCharacter(
    campaignId: string,
    characterId: string,
  ): Observable<boolean> {
    // Mock implementation
      'Rejeitando personagem:',
      characterId,
      'na campanha:',
      campaignId,
    )
    return of(true).pipe(delay(300))
  }

  invitePlayer(campaignId: string, email: string): Observable<boolean> {
    // Mock implementation
    return of(true).pipe(delay(500))
  }

  leaveCampaign(campaignId: string): Observable<boolean> {
    // Mock implementation
    return of(true).pipe(delay(300))
  }
}
