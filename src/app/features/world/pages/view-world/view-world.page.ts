import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { WorldService } from '../../services/world.service';
import { WorldDetail } from '../../interfaces/world.model';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-view-world',
  standalone: true,
  imports: [CommonModule, ButtonModule, AccordionModule, DialogModule, ImageUploadComponent],
  templateUrl: './view-world.page.html',
  styleUrl: './view-world.page.scss',
})
export class ViewWorldPage implements OnInit {
  private readonly worldService = inject(WorldService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  world = signal<WorldDetail | null>(null);
  isLoading = signal(true);
  showImageDialog = signal(false);
  isUpdatingImage = signal(false);

  worldId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  ngOnInit(): void {
    const id = this.worldId();
    if (id) {
      this.loadWorld(id);
    }
  }

  /**
   * Carrega detalhes completos do mundo
   */
  private loadWorld(id: string): void {
    this.isLoading.set(true);
    this.worldService.getWorldById(id).subscribe({
      next: (world) => {
        this.world.set(world);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar mundo:', error);
        this.isLoading.set(false);
        // Mock data para desenvolvimento
        this.world.set({
          id: '1',
          name: 'Arton',
          description:
            'O mundo de Tormenta20, lar de deuses, heróis e a ameaça da Tormenta.',
          imageUrl: '/assets/worlds/arton.jpg',
          creatorId: 'user1',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
          lore: [
            {
              id: 'lore1',
              title: 'Arton: O Mundo Conhecido',
              content:
                'Arton é um mundo vasto e diverso, repleto de reinos poderosos, cidades prósperas e perigos ocultos. É lar de diversas raças, desde humanos e elfos até minotauros e qareen. A história de Arton é marcada por guerras épicas, descobertas mágicas e a constante ameaça da Tormenta.',
            },
            {
              id: 'lore2',
              title: 'A Tormenta',
              content:
                'A Tormenta é uma tempestade de energia caótica que ameaça consumir Arton. Originada de uma dimensão paralela, ela corrompe tudo que toca, criando criaturas aberrantes conhecidas como lefeu. Os povos de Arton unem forças para combater essa ameaça existencial.',
            },
            {
              id: 'lore3',
              title: 'Reinos e Política',
              content:
                'Arton é dividido em diversos reinos e nações, cada um com sua própria cultura e sistema político. O Reinado é a maior potência, seguido pelo Império de Tauron e as Cidades-Estado Livres. A política em Arton é complexa, com alianças frágeis e rivalidades ancestrais.',
            },
            {
              id: 'lore4',
              title: 'Magia e Tecnologia',
              content:
                'Em Arton, magia e tecnologia coexistem. Magos poderosos estudam nas academias arcanas, enquanto artífices criam dispositivos mágicos impressionantes. A tecnologia varia de medieval a steampunk em algumas regiões, com o poder da magia impulsionando inovações incríveis.',
            },
          ],
          locations: [
            {
              id: 'loc1',
              title: 'Valkaria',
              description:
                'A capital do Reinado, Valkaria é a maior cidade de Arton. Seus muros brancos e torres douradas podem ser vistos de longe. É o centro político, econômico e cultural do continente, onde nobres intrigam e heróis começam suas jornadas.',
            },
            {
              id: 'loc2',
              title: 'Vectórea',
              description:
                'A maior cidade portuária de Arton, Vectórea é um centro de comércio marítimo. Suas docas estão sempre movimentadas com navios de todas as nações. A cidade é conhecida por sua diversidade cultural e pela presença marcante da Guilda dos Mercadores.',
            },
            {
              id: 'loc3',
              title: 'Hogul',
              description:
                'A fortaleza-cidade dos anões nas Montanhas Sanguinárias. Hogul é uma maravilha da engenharia anã, com túneis que se estendem por quilômetros e forjas que produzem as melhores armas e armaduras de Arton. É também o último bastião contra invasões vindas do leste.',
            },
            {
              id: 'loc4',
              title: 'Cidade Livre de Valkaria',
              description:
                'Não confundir com a capital do Reinado, esta é uma das Cidades-Estado independentes. Valoriza a liberdade individual e o comércio livre, sendo um refúgio para aventureiros, mercenários e aqueles que buscam uma vida longe das restrições dos grandes reinos.',
            },
            {
              id: 'loc5',
              title: 'Deserto da Perdição',
              description:
                'Um vasto deserto ao sul, lar dos nômades e de ruínas antigas. Dizem que tesouros inimagináveis estão enterrados sob as areias, guardados por armadilhas mortais e criaturas do deserto. Poucos que entram retornam para contar a história.',
            },
            {
              id: 'loc6',
              title: 'Floresta de Lenórienn',
              description:
                'O reino dos elfos, uma floresta mágica onde o tempo parece fluir diferente. As árvores são antigas e sábias, e a magia permeia cada folha e raiz. Os elfos de Lenórienn são guardiões vigilantes, protegendo segredos ancestrais.',
            },
          ],
          pantheon: [
            {
              id: 'god1',
              name: 'Khalmyr',
              title: 'O Deus da Justiça',
              description:
                'Khalmyr é o líder do Panteão e deus da justiça, honra e guerra justa. Empunha a espada Separatista e guia aqueles que buscam proteger os inocentes. É o patrono de paladinos e guerreiros que lutam pelo bem maior.',
              domains: ['Justiça', 'Guerra', 'Honra', 'Proteção'],
            },
            {
              id: 'god2',
              name: 'Valkaria',
              title: 'A Deusa da Ambição',
              description:
                'Valkaria é a deusa da ambição, poder e glória. Ela inspira mortais a alcançarem grandeza, não importa o custo. É padroeira de conquistadores, nobres ambiciosos e todos que buscam deixar sua marca na história.',
              domains: ['Ambição', 'Poder', 'Conquista', 'Glória'],
            },
            {
              id: 'god3',
              name: 'Thyatis',
              title: 'A Deusa da Ressurreição',
              description:
                'Thyatis governa sobre a vida, morte e renascimento. Ela oferece uma segunda chance àqueles dignos e julga as almas que partem. Seus clérigos são curandeiros reverenciados que trazem esperança aos moribundos.',
              domains: ['Vida', 'Morte', 'Ressurreição', 'Julgamento'],
            },
            {
              id: 'god4',
              name: 'Wynna',
              title: 'A Deusa da Magia',
              description:
                'Wynna é a deusa da magia, conhecimento e mistérios arcanos. Ela preside sobre todos os lançadores de magia e guarda os segredos do multiverso. Suas bibliotecas divinas contêm todo conhecimento que já existiu ou existirá.',
              domains: ['Magia', 'Conhecimento', 'Mistério', 'Arcano'],
            },
            {
              id: 'god5',
              name: 'Azgher',
              title: 'O Deus do Sol',
              description:
                'Azgher é o deus do sol, fogo e purificação. Sua luz expulsa as trevas e queima as impurezas. É venerado por aqueles que combatem mortos-vivos e aberrações, trazendo a luz divina para os cantos mais sombrios de Arton.',
              domains: ['Sol', 'Fogo', 'Luz', 'Purificação'],
            },
            {
              id: 'god6',
              name: 'Allihanna',
              title: 'A Deusa da Natureza',
              description:
                'Allihanna é a deusa da natureza, dos animais e das terras selvagens. Ela protege as florestas e os seres que nelas habitam. Druidas e rangers são seus seguidores mais devotos, defendendo o equilíbrio natural contra a civilização invasora.',
              domains: ['Natureza', 'Animais', 'Florestas', 'Equilíbrio'],
            },
            {
              id: 'god7',
              name: 'Keen',
              title: 'O Deus da Morte',
              description:
                'Keen é o deus da morte, assassinato e vingança. Diferente de Thyatis, ele representa o fim definitivo. É temido e respeitado, patrono de assassinos e necromantes. Seus clérigos administram ritos funerários e caçam mortos-vivos.',
              domains: ['Morte', 'Assassinato', 'Vingança', 'Fim'],
            },
            {
              id: 'god8',
              name: 'Tanna-Toh',
              title: 'A Deusa da Liberdade',
              description:
                'Tanna-Toh é a deusa da liberdade, sorte e aventura. Ela abençoa viajantes, ladrões e todos que vivem sem amarras. Sua filosofia é que cada um deve forjar seu próprio destino, livre de tirania ou opressão.',
              domains: ['Liberdade', 'Sorte', 'Aventura', 'Caos'],
            },
          ],
        });
      },
    });
  }

  /**
   * Navega para edição do mundo
   */
  onEditWorld(): void {
    const id = this.worldId();
    if (id) {
      this.router.navigate(['/worlds', id, 'edit']);
    }
  }

  /**
   * Deleta o mundo após confirmação
   */
  onDeleteWorld(): void {
    const id = this.worldId();
    const worldName = this.world()?.name;
    
    if (!id || !worldName) return;

    if (confirm(`Tem certeza que deseja deletar o mundo "${worldName}"? Esta ação não pode ser desfeita.`)) {
      this.worldService.deleteWorld(id).subscribe({
        next: () => {
          this.router.navigate(['/worlds']);
        },
        error: (error) => {
          console.error('Erro ao deletar mundo:', error);
          alert('Erro ao deletar mundo. Tente novamente.');
        },
      });
    }
  }

  /**
   * Volta para lista de mundos
   */
  onBack(): void {
    this.router.navigate(['/worlds']);
  }

  /**
   * Abre dialog para trocar imagem
   */
  onChangeImage(): void {
    this.showImageDialog.set(true);
  }

  /**
   * Fecha dialog de imagem
   */
  onCloseImageDialog(): void {
    this.showImageDialog.set(false);
  }

  /**
   * Atualiza imagem do mundo
   */
  onImageUploaded(url: string): void {
    const id = this.worldId();
    if (!id) return;

    this.isUpdatingImage.set(true);
    this.worldService.updateWorld(id, { imageUrl: url }).subscribe({
      next: (updatedWorld) => {
        this.world.set(updatedWorld);
        this.showImageDialog.set(false);
        this.isUpdatingImage.set(false);
      },
      error: (error) => {
        console.error('Erro ao atualizar imagem:', error);
        this.isUpdatingImage.set(false);
        alert('Erro ao atualizar imagem. Tente novamente.');
      },
    });
  }

  /**
   * Remove imagem do mundo
   */
  onImageRemoved(): void {
    const id = this.worldId();
    if (!id) return;

    this.isUpdatingImage.set(true);
    this.worldService.updateWorld(id, { imageUrl: null }).subscribe({
      next: (updatedWorld) => {
        this.world.set(updatedWorld);
        this.isUpdatingImage.set(false);
      },
      error: (error) => {
        console.error('Erro ao remover imagem:', error);
        this.isUpdatingImage.set(false);
        alert('Erro ao remover imagem. Tente novamente.');
      },
    });
  }
}
