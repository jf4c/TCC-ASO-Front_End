import { Component, input, effect, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AccordionModule } from 'primeng/accordion'
import { CampaignWorld } from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-campaign-world',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './campaign-world.component.html',
  styleUrl: './campaign-world.component.scss',
})
export class CampaignWorldComponent {
  world = input<CampaignWorld | null>(null)

  // Mock de dados de Tormenta 20
  mockWorld = computed<CampaignWorld>(() => ({
    lore: [
      {
        id: '1',
        title: 'Arton - O Mundo',
        content: 'Arton é um mundo de espada e magia, onde deuses caminham entre mortais e a Tormenta ameaça devorar toda a realidade. É um lugar de heróis e vilões, onde cada escolha pode mudar o destino do mundo.',
        order: 1
      },
      {
        id: '2',
        title: 'A Tormenta',
        content: 'A Tormenta é uma tempestade de energia mágica caótica que devora reinos e corrompe tudo que toca. Surgida há séculos, ela transformou partes de Arton em terras distorcidas conhecidas como Cicatrizes da Tormenta, habitadas por criaturas aberrantes.',
        order: 2
      },
      {
        id: '3',
        title: 'Os Reinos',
        content: 'Arton é dividido em diversos reinos e nações, cada um com sua cultura e história. O Reinado, formado pela união de vários reinos, é a maior potência político-militar, lutando contra a Tormenta e seus servos.',
        order: 3
      },
      {
        id: '4',
        title: 'Magia e Tecnologia',
        content: 'A magia permeia Arton, desde simples truques até rituais que podem alterar a realidade. A tecnomagia, união de engenharia e feitiçaria, é praticada principalmente por goblins e anões, criando artefatos e construções impressionantes.',
        order: 4
      }
    ],
    locations: [
      {
        id: '1',
        title: 'Valkaria',
        description: 'Capital do Reinado e maior cidade de Arton. Conhecida por sua imponente fortaleza, academias de magia e o Grande Templo dos Vinte Deuses. É o centro político, militar e religioso do continente.',
        order: 1
      },
      {
        id: '2',
        title: 'Vectora',
        description: 'Cidade portuária e centro comercial, famosa por seus mercados que vendem mercadorias de todo Arton. Lar da Guilda dos Mercadores e ponto de encontro de aventureiros e comerciantes.',
        order: 2
      },
      {
        id: '3',
        title: 'Hogul',
        description: 'Fortaleza nas Montanhas Uivantes, lar dos meio-orcs. Reconhecida por sua metalurgia superior e guerreiros formidáveis. Protege o Reinado de invasões vindas das terras selvagens.',
        order: 3
      },
      {
        id: '4',
        title: 'Cidade Livre de Valkaria',
        description: 'Bairro independente dentro de Valkaria, conhecido por sua neutralidade política e como refúgio de mercenários, aventureiros e aqueles que buscam começar uma nova vida.',
        order: 4
      },
      {
        id: '5',
        title: 'Deserto da Perdição',
        description: 'Vasta extensão árida repleta de ruínas antigas, criaturas mortais e segredos enterrados. Dizem que civilizações inteiras foram engolidas por suas areias, e seus tesouros aguardam os corajosos.',
        order: 5
      },
      {
        id: '6',
        title: 'Floresta de Lenórienn',
        description: 'Lar ancestral dos elfos, uma floresta mágica protegida por encantamentos antigos. Suas árvores gigantes abrigam cidades suspensas e santuários dedicados aos deuses da natureza.',
        order: 6
      }
    ],
    pantheon: [
      {
        id: '1',
        name: 'Khalmyr',
        title: 'O Deus da Justiça',
        description: 'Senhor dos paladinos e juízes, Khalmyr representa a ordem, a lei e a proteção dos inocentes. Seus seguidores são conhecidos por sua devoção à justiça e pelo código de honra que seguem.',
        domains: ['Justiça', 'Ordem', 'Proteção', 'Honra'],
        order: 1
      },
      {
        id: '2',
        name: 'Valkaria',
        title: 'A Deusa da Ambição',
        description: 'Padroeira dos nobres e conquistadores, Valkaria inspira seus devotos a buscar poder e grandeza. É venerada por aqueles que desejam mudar o mundo através de sua força de vontade.',
        domains: ['Ambição', 'Nobreza', 'Guerra', 'Conquista'],
        order: 2
      },
      {
        id: '3',
        name: 'Thyatis',
        title: 'A Deusa da Ressurreição',
        description: 'Mãe dos deuses, Thyatis é a senhora da vida e da morte. Seus clérigos são curadores e protetores, mantendo o equilíbrio entre os mundos dos vivos e dos mortos.',
        domains: ['Vida', 'Morte', 'Ressurreição', 'Cura'],
        order: 3
      },
      {
        id: '4',
        name: 'Wynna',
        title: 'A Deusa da Magia',
        description: 'Patrona dos magos e estudiosos, Wynna é a fonte de todo conhecimento arcano. Seus templos são bibliotecas e academias onde se busca desvendar os mistérios do universo.',
        domains: ['Magia', 'Conhecimento', 'Mistério', 'Ilusão'],
        order: 4
      },
      {
        id: '5',
        name: 'Azgher',
        title: 'O Deus do Sol',
        description: 'Senhor da luz e da verdade, Azgher é adorado por aqueles que combatem as trevas e a Tormenta. Seus paladinos são a vanguarda na luta contra o mal.',
        domains: ['Sol', 'Luz', 'Verdade', 'Força'],
        order: 5
      },
      {
        id: '6',
        name: 'Allihanna',
        title: 'A Deusa da Natureza',
        description: 'Mãe Natureza, protetora das florestas e dos animais. Druidas e rangers seguem seus ensinamentos de equilíbrio e respeito pela vida selvagem.',
        domains: ['Natureza', 'Animais', 'Crescimento', 'Fertilidade'],
        order: 6
      },
      {
        id: '7',
        name: 'Keen',
        title: 'O Deus da Morte',
        description: 'Guardião dos mortos e senhor do submundo, Keen mantém a ordem no reino dos falecidos. Seus cultistas são temidos, mas seu papel é essencial no equilíbrio cósmico.',
        domains: ['Morte', 'Submundo', 'Inevitabilidade', 'Julgamento'],
        order: 7
      },
      {
        id: '8',
        name: 'Tanna-Toh',
        title: 'A Deusa da Liberdade',
        description: 'Padroeira dos artistas, bardos e aventureiros, Tanna-Toh celebra a liberdade individual e a expressão criativa. Seus seguidores valorizam a arte, a música e a alegria de viver.',
        domains: ['Liberdade', 'Arte', 'Criatividade', 'Caos Bom'],
        order: 8
      }
    ]
  }))

  // Usar mock se world for null
  displayWorld = computed(() => this.world() || this.mockWorld())

  constructor() {
    effect(() => {
      const worldData = this.displayWorld()
      console.log('CampaignWorld data:', worldData)
      if (worldData) {
        console.log('Lore entries:', worldData.lore?.length || 0)
        console.log('Location entries:', worldData.locations?.length || 0)
        console.log('Pantheon entries:', worldData.pantheon?.length || 0)
      }
    })
  }
}
