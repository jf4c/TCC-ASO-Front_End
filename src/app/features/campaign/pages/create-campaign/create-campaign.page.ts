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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CampaignService } from '../../services/campaign.service';
import { FriendshipService } from '../../../friends/services/friendship.service';
import { CharacterService } from '../../../character/services/character.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { CreateCampaignRequest } from '../../interfaces/campaign.interface';
import { AvailableFriend, AvailableCharacter } from '../../interfaces/campaign-participant.interface';
import { Friend } from '../../../friends/interfaces/friend.interface';
import { CharacterCardComponent } from '../../../character/components/character-card/character-card.component';
import { Character } from '../../../character/interface/character.model';
import { CharacterDetailDialogComponent } from '../../../character/components/dialogs/character-detail-dialog/character-detail-dialog.component';

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
  providers: [MessageService, DialogService],
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
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  
  dialogRef: DynamicDialogRef | undefined;

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
  creatorName: string = '';
  creatorNickname: string = '';
  
  // IA Story Generation
  isGeneratingStory = false;
  generatedStory = '';
  storyAccepted = false;
  storyErrorMessage = '';

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
    this.loadCreatorInfo();
  }

  private loadCreatorInfo(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.creatorName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
        this.creatorNickname = profile.username || 'Você';
      },
      error: (err) => {
        console.error('Erro ao carregar perfil do criador:', err);
        this.creatorNickname = 'Você';
      }
    });
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
          .getCharactersByPlayer(player.friend.id)
          .toPromise()
          .then(characters => {
            if (characters && characters.length > 0) {
              // Mapear os personagens para o formato esperado
              const mappedCharacters: AvailableCharacter[] = characters.map(char => ({
                id: char.id,
                name: char.name,
                race: char.ancestry,
                class: char.class,
                level: char.level,
                image: char.image,
                health: char.health,
                mana: char.mana,
                isInCampaign: false
              }));
              
              this.playerCharacters.set(player.friend.id, mappedCharacters);
            } else {
              this.playerCharacters.set(player.friend.id, []);
            }
          })
          .catch(error => {
            console.error(`Erro ao carregar personagens do jogador ${player.friend.nickName}:`, error);
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

    // Monta o array de participantes para o payload
    const participants = this.selectedPlayers.map(player => {
      const characterId = this.selectedCharacters.get(player.friend.id);
      const participant: any = { playerId: player.friend.id };
      
      // Só adiciona characterId se existir
      if (characterId) {
        participant.characterId = characterId;
      }
      
      return participant;
    });

    const request: CreateCampaignRequest = {
      name: this.campaignForm.get('name')?.value,
      description: this.campaignForm.get('description')?.value || undefined,
      maxPlayers: this.campaignForm.get('maxPlayers')?.value,
      isPublic: this.campaignForm.get('isPublic')?.value,
      participants,
      storyIntroduction: this.storyAccepted && this.generatedStory ? this.generatedStory : undefined
    };

    this.campaignService.createCampaign(request).subscribe({
      next: async (campaign) => {
        this.createdCampaignId = campaign.id;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Campanha criada com sucesso!'
        });
        this.navigateToDetail(campaign.id);
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

  // IA Story Generation (with selected characters)
  async onGenerateCampaignStory(): Promise<void> {
    const characterIds = this.selectedPlayers
      .map(player => this.selectedCharacters.get(player.friend.id))
      .filter(id => !!id) as string[];

    if (characterIds.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um personagem para gerar a história'
      });
      return;
    }

    const campaignName = this.campaignForm.get('name')?.value;
    const campaignDescription = this.campaignForm.get('description')?.value;

    this.isGeneratingStory = true;
    this.storyErrorMessage = '';

    try {
      const response = await this.campaignService.generateCampaignStory({
        characterIds,
        campaignName,
        campaignDescription
      }).toPromise();

      if (response?.story) {
        this.generatedStory = response.story;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'História da campanha gerada com IA!'
        });
      }
    } catch (error: any) {
      console.error('Erro ao gerar história:', error);
      
      // Tenta extrair a mensagem do erro em diferentes formatos
      let errorMessage = 'Erro ao gerar história. Tente novamente.';
      
      if (error?.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.title) {
          errorMessage = error.error.title;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      this.storyErrorMessage = errorMessage;
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao gerar história',
        detail: errorMessage,
        life: 5000
      });
    } finally {
      this.isGeneratingStory = false;
    }
  }

  onAcceptStory(): void {
    this.storyAccepted = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'História aceita!'
    });
  }

  onDiscardStory(): void {
    this.generatedStory = '';
    this.storyAccepted = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Descartado',
      detail: 'História descartada'
    });
  }

  hasSelectedCharacters(): boolean {
    return this.selectedCharacters.size > 0;
  }

  /**
   * Abre dialog com detalhes do personagem
   */
  onViewCharacterDetails(character: Character): void {
    // Busca detalhes completos do personagem
    this.characterService.getCharacterById(character.id).subscribe({
      next: (characterDetail) => {
        this.dialogRef = this.dialogService.open(CharacterDetailDialogComponent, {
          header: 'Detalhes do Personagem',
          width: '70vw',
          modal: true,
          closable: true,
          data: {
            character: characterDetail,
            showSelectButton: true
          },
          breakpoints: {
            '960px': '85vw',
            '640px': '95vw',
          },
        });

        // Escuta o resultado do dialog
        this.dialogRef.onClose.subscribe((result) => {
          if (result?.selected && result?.character) {
            // Encontra o playerId deste personagem
            for (const [playerId, characters] of this.playerCharacters.entries()) {
              const foundChar = characters.find(c => c.id === result.character.id);
              if (foundChar && !foundChar.isInCampaign) {
                this.selectCharacter(playerId, result.character.id);
                break;
              }
            }
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do personagem:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os detalhes do personagem'
        });
      }
    });
  }

  isGenerateStoryDisabled(): boolean {
    return !this.hasSelectedCharacters() || this.isGeneratingStory;
  }
}
