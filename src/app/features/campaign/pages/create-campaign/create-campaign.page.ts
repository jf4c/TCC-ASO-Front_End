import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { MessageService, MenuItem } from 'primeng/api';
import { CampaignService } from '../../services/campaign.service';
import { FriendshipService } from '../../../friends/services/friendship.service';
import { CharacterService } from '../../../character/services/character.service';
import { CreateCampaignRequest } from '../../interfaces/campaign.interface';
import { AvailableFriend, AvailableCharacter } from '../../interfaces/campaign-participant.interface';
import { Friend } from '../../../friends/interfaces/friend.interface';
import { CharacterCardComponent } from '../../../character/components/character-card/character-card.component';
import { Character } from '../../../character/interface/character.model';

@Component({
  selector: 'aso-create-campaign',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    StepsModule,
    CardModule,
    CharacterCardComponent
  ],
  providers: [MessageService],
  templateUrl: './create-campaign.page.html',
  styleUrl: './create-campaign.page.scss',
})
export class CreateCampaignPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private campaignService = inject(CampaignService);
  private friendshipService = inject(FriendshipService);
  private characterService = inject(CharacterService);
  private messageService = inject(MessageService);

  // Wizard Steps
  activeStep = 0;
  steps: MenuItem[] = [
    { label: 'Informações Básicas' },
    { label: 'Adicionar Jogadores' },
    { label: 'Atribuir Personagens' },
    { label: 'Revisar' }
  ];

  // Forms
  campaignForm!: FormGroup;
  
  // Data
  loading = false;
  friends: Friend[] = [];
  selectedPlayers: Friend[] = [];
  playerCharacters: Map<string, AvailableCharacter[]> = new Map(); // playerId -> characters
  selectedCharacters: Map<string, string> = new Map(); // playerId -> characterId
  createdCampaignId: string | null = null;

  maxPlayersOptions = [
    { label: '2 jogadores', value: 2 },
    { label: '3 jogadores', value: 3 },
    { label: '4 jogadores', value: 4 },
    { label: '5 jogadores', value: 5 },
    { label: '6 jogadores', value: 6 },
    { label: '7 jogadores', value: 7 },
    { label: '8 jogadores', value: 8 },
    { label: '10 jogadores', value: 10 },
    { label: '12 jogadores', value: 12 },
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadFriends();
  }

  initForm(): void {
    this.campaignForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      maxPlayers: [6, Validators.required],
      isPublic: [false]
    });
  }

  loadFriends(): void {
    this.friendshipService.friends$.subscribe({
      next: (friends) => {
        this.friends = friends;
      },
      error: (error) => {
        console.error('Erro ao carregar amigos:', error);
      }
    });
    this.friendshipService.getFriends().subscribe();
  }

  // Navigation
  nextStep(): void {
    if (this.activeStep === 0 && this.campaignForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios'
      });
      return;
    }

    // Ao avançar do step 1 (adicionar jogadores) para step 2 (atribuir personagens)
    if (this.activeStep === 1 && this.selectedPlayers.length > 0) {
      this.loadPlayersCharacters();
    }

    if (this.activeStep < this.steps.length - 1) {
      this.activeStep++;
    }
  }

  prevStep(): void {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  // Load characters for selected players
  async loadPlayersCharacters(): Promise<void> {
    this.loading = true;
    this.playerCharacters.clear();
    
    try {
      // Carregar personagens de cada jogador selecionado
      const loadPromises = this.selectedPlayers.map(player => {
        return this.characterService
          .getCharactersByPlayer(player.friend.id, 1, 50) // Carregar até 50 personagens
          .toPromise()
          .then(response => {
            if (response) {
              // Mapear os personagens para o formato esperado
              const characters: AvailableCharacter[] = response.results.map(char => ({
                id: char.id,
                name: char.name,
                race: char.ancestry,
                class: char.class,
                level: char.level,
                image: char.image,
                health: char.health,
                mana: char.mana,
                isInCampaign: false // TODO: Verificar se já está em campanha
              }));
              
              this.playerCharacters.set(player.friend.id, characters);
            }
          })
          .catch(error => {
            console.error(`Erro ao carregar personagens do jogador ${player.friend.nickName}:`, error);
            // Em caso de erro, define lista vazia
            this.playerCharacters.set(player.friend.id, []);
          });
      });
      
      await Promise.all(loadPromises);
    } finally {
      this.loading = false;
    }
  }

  // Character Selection
  selectCharacter(playerId: string, characterId: string): void {
    this.selectedCharacters.set(playerId, characterId);
  }

  getSelectedCharacterId(playerId: string): string | undefined {
    return this.selectedCharacters.get(playerId);
  }

  getPlayerCharacters(playerId: string): AvailableCharacter[] {
    return this.playerCharacters.get(playerId) || [];
  }

  getSelectedCharacter(playerId: string): AvailableCharacter | undefined {
    const characterId = this.selectedCharacters.get(playerId);
    const characters = this.playerCharacters.get(playerId) || [];
    return characters.find(c => c.id === characterId);
  }

  /**
   * Converte AvailableCharacter para Character (formato do card)
   */
  toCharacterCard(char: AvailableCharacter): Character {
    return {
      id: char.id,
      name: char.name,
      class: char.class,
      ancestry: char.race,
      level: char.level,
      health: char.health || 100,
      mana: char.mana || 50,
      image: char.image || '/assets/Character/unknown.png'
    };
  }

  // Player Selection
  togglePlayer(friend: Friend): void {
    const index = this.selectedPlayers.findIndex(p => p.friend.id === friend.friend.id);
    if (index >= 0) {
      this.selectedPlayers.splice(index, 1);
    } else {
      const maxPlayers = this.campaignForm.get('maxPlayers')?.value || 6;
      if (this.selectedPlayers.length >= maxPlayers - 1) { // -1 porque o criador já conta
        this.messageService.add({
          severity: 'warn',
          summary: 'Limite Atingido',
          detail: `Você pode adicionar no máximo ${maxPlayers - 1} jogadores`
        });
        return;
      }
      this.selectedPlayers.push(friend);
    }
  }

  isPlayerSelected(friend: Friend): boolean {
    return this.selectedPlayers.some(p => p.friend.id === friend.friend.id);
  }

  removePlayer(friend: Friend): void {
    const index = this.selectedPlayers.findIndex(p => p.friend.id === friend.friend.id);
    if (index >= 0) {
      this.selectedPlayers.splice(index, 1);
    }
  }

  // Submit
  async onSubmit(): Promise<void> {
    if (this.campaignForm.invalid) {
      return;
    }

    this.loading = true;

    const request: CreateCampaignRequest = {
      name: this.campaignForm.get('name')?.value,
      description: this.campaignForm.get('description')?.value || undefined,
      maxPlayers: this.campaignForm.get('maxPlayers')?.value,
      isPublic: this.campaignForm.get('isPublic')?.value
    };

    this.campaignService.createCampaign(request).subscribe({
      next: async (campaign) => {
        this.createdCampaignId = campaign.id;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Campanha criada com sucesso!'
        });

        // Adicionar jogadores se houver
        if (this.selectedPlayers.length > 0) {
          await this.addParticipants(campaign.id);
        } else {
          this.navigateToDetail(campaign.id);
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao criar campanha'
        });
      }
    });
  }

  private async addParticipants(campaignId: string): Promise<void> {
    const addPromises = this.selectedPlayers.map(player => {
      const characterId = this.selectedCharacters.get(player.friend.id);
      return this.campaignService.addParticipant(campaignId, {
        playerId: player.friend.id,
        role: 0, // Player role
        characterId: characterId
      }).toPromise();
    });

    try {
      await Promise.all(addPromises);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${this.selectedPlayers.length} jogadores adicionados`
      });
    } catch (error) {
      console.error('Erro ao adicionar jogadores:', error);
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Alguns jogadores não foram adicionados'
      });
    } finally {
      this.loading = false;
      this.navigateToDetail(campaignId);
    }
  }

  private navigateToDetail(campaignId: string): void {
    setTimeout(() => {
      this.router.navigate(['/campanhas', campaignId]);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/campanhas']);
  }
}
