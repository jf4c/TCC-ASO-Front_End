import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CharacterService } from '../../services/character.service';
import { BackstoryService } from '../../services/backstory.service';
import { CharacterDetail, UpdateCharacterRequest, Modifiers } from '../../interface/character.model';
import { Skill } from '../../interface/skill.model';
import { CharacterDialogImageComponent } from '../../components/dialogs/character-dialog-image/character-dialog-image.component';
import { BackstoryEditorComponent } from '@shared/components/backstory-editor/backstory-editor.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'aso-view-character',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    BackstoryEditorComponent,
  ],
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './view-character.page.html',
  styleUrl: './view-character.page.scss',
})
export class ViewCharacterPage implements OnInit {
  private readonly characterService = inject(CharacterService);
  private readonly backstoryService = inject(BackstoryService);
  private readonly dialogService = inject(DialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  character = signal<CharacterDetail | null>(null);
  isLoading = signal(true);
  isEditMode = signal(false);
  isSaving = signal(false);
  tempImageId = signal<string | null>(null);
  tempImageUrl = signal<string | null>(null);
  
  // Dialog reference para seleção de imagem
  dialogRef: DynamicDialogRef | undefined;
  
  // Estado da geração de backstory
  isGeneratingBackstory = signal(false);
  generatedBackstory = signal<string | null>(null);
  showBackstoryDialog = signal(false);

  characterId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  /**
   * URL completa da imagem do personagem
   */
  characterImageUrl = computed(() => {
    // Se há imagem temporária selecionada, usa a URL diretamente
    const tempUrl = this.tempImageUrl();
    if (tempUrl) {
      return tempUrl;
    }
    
    const char = this.character();
    if (!char?.image) return null;
    
    // Se já for URL completa, retorna direto
    if (char.image.startsWith('http')) {
      return char.image;
    }
    
    // Se começar com /assets, é uma imagem local do Angular
    if (char.image.startsWith('/assets') || char.image.startsWith('./assets')) {
      return char.image.startsWith('./') ? char.image.substring(2) : char.image;
    }
    
    // Remove ./ do início se existir
    let imagePath = char.image.startsWith('./') ? char.image.substring(2) : char.image;
    
    // Se não começar com /, adiciona
    if (!imagePath.startsWith('/')) {
      imagePath = `/${imagePath}`;
    }
    
    // Concatena com URL base da API (remove /api do final)
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  });

  // Computed properties para acessar dados do backend
  health = computed(() => {
    const char = this.character();
    if (!char) return 0;
    
    // HP Total = HP Inicial + modCON + [(HP por Nível + modCON) × (Nível - 1)]
    const initialHp = char.class.initialHp;
    const hpPerLevel = char.class.hpPerLevel;
    const conMod = char.modifiers.constitution;
    const level = char.level;
    
    return initialHp + conMod + ((hpPerLevel + conMod) * (level - 1));
  });

  mana = computed(() => {
    const char = this.character();
    if (!char) return 0;
    
    // MP Total = MP por Nível × Nível
    const mpPerLevel = char.class.mpPerLevel;
    const level = char.level;
    
    return mpPerLevel * level;
  });

  modifiers = computed(() => {
    const char = this.character();
    if (!char) return {
      modStrength: 0,
      modDexterity: 0,
      modConstitution: 0,
      modIntelligence: 0,
      modWisdom: 0,
      modCharisma: 0,
    };
    
    // O backend já retorna os modificadores calculados
    return {
      modStrength: char.modifiers.strength,
      modDexterity: char.modifiers.dexterity,
      modConstitution: char.modifiers.constitution,
      modIntelligence: char.modifiers.intelligence,
      modWisdom: char.modifiers.wisdom,
      modCharisma: char.modifiers.charisma,
    };
  });

  // Campos que não podem ser editados se o personagem estiver em campanha
  lockedFields = computed<string[]>(() => {
    if (this.isInCampaign()) {
      return ['name', 'ancestry', 'class', 'backstory'];
    }
    return [];
  });

  isInCampaign = computed(() => {
    const char = this.character();
    return !!(char?.campaignId);
  });

  editForm = this.fb.group({
    name: ['', Validators.required],
    backstory: [''],
    imageId: [null as string | null],
  });

  ngOnInit(): void {
    const id = this.characterId();
    if (id) {
      this.loadCharacter(id);
    }
  }

  /**
   * Carrega detalhes do personagem
   */
  private loadCharacter(id: string): void {
    this.isLoading.set(true);
    this.characterService.getCharacterById(id).subscribe({
      next: (character) => {






        this.character.set(character);
        this.populateForm(character);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar personagem:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar detalhes do personagem',
        });
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Popula formulário com dados do personagem
   */
  private populateForm(character: CharacterDetail): void {
    this.editForm.patchValue({
      name: character.name,
      backstory: character.backstory || '',
    });

    // Desabilita campos bloqueados se em campanha
    if (this.isInCampaign()) {
      this.editForm.get('name')?.disable();
      this.editForm.get('backstory')?.disable();
    }
  }

  /**
   * Ativa modo de edição
   */
  onEnableEdit(): void {
    this.isEditMode.set(true);
  }

  /**
   * Cancela edição
   */
  onCancelEdit(): void {
    this.isEditMode.set(false);
    this.tempImageId.set(null);
    this.tempImageUrl.set(null);
    const char = this.character();
    if (char) {
      this.populateForm(char);
    }
  }

  /**
   * Salva alterações
   */
  onSaveChanges(): void {
    if (this.editForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    const id = this.characterId();
    if (!id) return;

    this.isSaving.set(true);
    const formValue = this.editForm.getRawValue();
    const char = this.character();
    if (!char) return;

    // Monta payload APENAS com campos que mudaram ou são editáveis
    const payload: Partial<UpdateCharacterRequest> = {};
    
    // Nome - apenas se mudou e não está bloqueado
    if (formValue.name && formValue.name !== char.name && !this.isFieldLocked('name')) {
      payload.name = formValue.name;
    }
    
    // Backstory - apenas se mudou e não está bloqueado
    const currentBackstory = formValue.backstory || '';
    const originalBackstory = char.backstory || '';
    if (currentBackstory !== originalBackstory && !this.isFieldLocked('backstory')) {
      payload.backstory = currentBackstory;
    }
    
    // ImageId - sempre enviar (usa nova se selecionada, senão extrai da atual)
    if (formValue.imageId) {
      payload.imageId = formValue.imageId;
    } else if (char.image) {
      // Extrai o UUID do path: /uploads/characters/uuid.ext -> uuid
      const match = char.image.match(/\/([a-f0-9-]+)\./i);
      if (match) {
        payload.imageId = match[1];
      }
    }

    // Se não há nada para atualizar, cancela
    if (Object.keys(payload).length === 0) {
      this.isSaving.set(false);
      this.messageService.add({
        severity: 'info',
        summary: 'Informação',
        detail: 'Nenhuma alteração detectada',
      });
      return;
    }





    this.characterService.updateCharacter(id, payload).subscribe({
      next: (updated) => {







        
        this.character.set(updated);
        this.isEditMode.set(false);
        this.isSaving.set(false);
        this.tempImageId.set(null);
        this.tempImageUrl.set(null);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Personagem atualizado com sucesso',
        });
      },
      error: (error) => {
        console.error('=== ERRO AO ATUALIZAR ===');
        console.error('Status:', error.status);
        console.error('Erro completo:', error);
        console.error('Detalhes:', error.error);
        console.error('=======================');
        this.isSaving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar personagem',
        });
      },
    });
  }

  /**
   * Deleta personagem
   */
  onDeleteCharacter(): void {
    const char = this.character();
    if (!char) return;

    if (this.isInCampaign()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não é possível deletar um personagem que está em uma campanha',
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar ${char.name}? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.characterService.deleteCharacter(char.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Personagem deletado com sucesso',
            });
            this.router.navigate(['/personagens']);
          },
          error: (error) => {
            console.error('Erro ao deletar personagem:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao deletar personagem',
            });
          },
        });
      },
    });
  }

  /**
   * Volta para lista de personagens
   */
  onBack(): void {
    this.router.navigate(['/personagens']);
  }

  /**
   * Level up do personagem (quando em campanha)
   */
  onLevelUp(): void {
    const char = this.character();
    if (!char) return;

    const currentLevel = char.level;
    const newLevel = currentLevel + 1;

    if (newLevel > 20) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nível Máximo',
        detail: 'O personagem já atingiu o nível máximo (20).',
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Deseja aumentar ${char.name} para o nível ${newLevel}?`,
      header: 'Confirmar Level Up',
      icon: 'pi pi-arrow-up',
      acceptLabel: 'Sim, subir de nível',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.characterService.levelUp(char.id, { newLevel }).subscribe({
          next: (response) => {
            const updatedChar = { ...char, level: response.newLevel };
            this.character.set(updatedChar);
            this.messageService.add({
              severity: 'success',
              summary: 'Level Up!',
              detail: `${char.name} subiu para o nível ${response.newLevel}!`,
            });
          },
          error: (error) => {
            console.error('Erro ao fazer level up:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error?.error?.message || 'Erro ao fazer level up',
            });
          },
        });
      },
    });
  }

  /**
   * Verifica se campo está bloqueado
   */
  isFieldLocked(fieldName: string): boolean {
    const locked = this.lockedFields();
    return locked.length > 0 && locked.includes(fieldName);
  }

  /**
   * Abre dialog para seleção de imagem
   */
  onOpenImageDialog(): void {
    this.dialogRef = this.dialogService.open(CharacterDialogImageComponent, {
      header: 'Selecionar Imagem do Personagem',
      width: '30vw',
      modal: true,
      closable: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    this.dialogRef.onClose.subscribe((result: { id: string, url: string } | null) => {
      if (result) {
        this.editForm.patchValue({ imageId: result.id });
        this.tempImageId.set(result.id);
        this.tempImageUrl.set(result.url);
        this.messageService.add({
          severity: 'success',
          summary: 'Imagem Selecionada',
          detail: 'Imagem do personagem atualizada. Salve para confirmar.',
        });
      }
    });
  }

  /**
   * Gera backstory usando IA
   */
  onGenerateBackstory(): void {
    const char = this.character();
    if (!char) return;

    if (this.isFieldLocked('backstory')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo Bloqueado',
        detail: 'Não é possível alterar a história de um personagem em campanha',
      });
      return;
    }

    this.isGeneratingBackstory.set(true);

    const request = {
      name: char.name,
      ancestry: char.ancestry.name,
      class: char.class.name,
      attributes: Object.entries(char.modifiers)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', '),
      skills: char.skills.map(s => s.name).join(', '),
    };

    this.backstoryService.generateBackstory(request).subscribe({
      next: (response) => {
        this.generatedBackstory.set(response.text);
        this.showBackstoryDialog.set(true);
        this.isGeneratingBackstory.set(false);
      },
      error: (error) => {
        console.error('Erro ao gerar backstory:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao gerar história. Tente novamente.',
        });
        this.isGeneratingBackstory.set(false);
      },
    });
  }

  /**
   * Aceita backstory gerada
   */
  onAcceptBackstory(): void {
    const backstory = this.generatedBackstory();
    if (backstory) {
      this.editForm.patchValue({ backstory });
      this.showBackstoryDialog.set(false);
      this.generatedBackstory.set(null);
      this.messageService.add({
        severity: 'success',
        summary: 'História Aceita',
        detail: 'História do personagem atualizada. Salve para confirmar.',
      });
    }
  }

  /**
   * Rejeita backstory gerada
   */
  onRejectBackstory(): void {
    this.showBackstoryDialog.set(false);
    this.generatedBackstory.set(null);
  }

  /**
   * Handler para mudança de backstory do componente genérico
   */
  onBackstoryChange(backstory: string): void {
    this.editForm.patchValue({ backstory });
  }

  /**
   * Formata atributos para string
   */
  formatAttributes(attributes: Record<string, number>): string {
    const attributeLabels = {
      strength: 'Força',
      dexterity: 'Destreza',
      constitution: 'Constituição',
      intelligence: 'Inteligência',
      wisdom: 'Sabedoria',
      charisma: 'Carisma',
    };

    return Object.entries(attributes)
      .map(([key, value]) => `${attributeLabels[key as keyof typeof attributeLabels] || key}: ${value}`)
      .join(', ');
  }

  /**
   * Formata skills para string
   */
  formatSkills(skills: Skill[]): string {
    if (!skills || !Array.isArray(skills)) return '';
    return skills.map(s => s.name).join(', ');
  }
}
