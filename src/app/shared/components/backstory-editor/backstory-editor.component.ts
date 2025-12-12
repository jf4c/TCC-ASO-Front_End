import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';
import { BackstoryService } from '@features/character/services/backstory.service';
import { CharacterBackstoryRequest } from '@features/character/interface/backstory.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aso-backstory-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    TextareaComponent,
  ],
  templateUrl: './backstory-editor.component.html',
  styleUrl: './backstory-editor.component.scss',
})
export class BackstoryEditorComponent implements OnInit, OnDestroy {
  private readonly backstoryService = inject(BackstoryService);
  private readonly messageService = inject(MessageService);
  private formSubscription?: Subscription;

  @Input() initialBackstory: string | null = null;
  @Input() characterForm?: FormGroup;
  
  // Props alternativas (para uso em view-character)
  @Input() characterName?: string;
  @Input() ancestryName?: string;
  @Input() className?: string;
  @Input() attributes?: string;
  @Input() skills?: string;
  
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Output() backstoryChange = new EventEmitter<string>();

  // Signals para rastrear valores
  private _characterName = signal('');
  private _ancestryName = signal('');
  private _className = signal('');

  isGenerating = signal(false);
  generatedBackstory = signal<string | null>(null);
  backstoryAccepted = signal(false);
  acceptedBackstory = signal<string | null>(null);
  isEditingBackstory = signal(false);
  editBackstoryControl = new FormControl('');
  manualBackstoryControl = new FormControl('');

  canGenerate = computed(() => {
    const hasName = !!this._characterName()?.trim();
    const hasAncestry = !!this._ancestryName()?.trim();
    const hasClass = !!this._className()?.trim();
    
    console.log('🔍 canGenerate:', {
      characterName: this._characterName(),
      ancestryName: this._ancestryName(),
      className: this._className(),
      hasName,
      hasAncestry,
      hasClass,
      result: hasName && hasAncestry && hasClass
    });
    
    return hasName && hasAncestry && hasClass;
  });

  ngOnInit(): void {
    // Se há backstory inicial, configura como aceita
    if (this.initialBackstory) {
      this.generatedBackstory.set(this.initialBackstory);
      this.acceptedBackstory.set(this.initialBackstory);
      this.backstoryAccepted.set(true);
    }

    // Observa mudanças no formulário se fornecido
    if (this.characterForm) {
      // Inicializa valores
      this.updateSignalsFromForm();
      
      // Observa mudanças no formulário
      this.formSubscription = this.characterForm.valueChanges.subscribe(() => {
        this.updateSignalsFromForm();
      });
    } else {
      // Usa props diretas
      this._characterName.set(this.characterName || '');
      this._ancestryName.set(this.ancestryName || '');
      this._className.set(this.className || '');
    }
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
  }

  private updateSignalsFromForm() {
    if (!this.characterForm) return;
    
    const name = this.characterForm.get('name')?.value || '';
    const ancestry = this.characterForm.get('ancestry')?.value?.name || '';
    const charClass = this.characterForm.get('charClass')?.value?.name || '';
    
    this._characterName.set(name);
    this._ancestryName.set(ancestry);
    this._className.set(charClass);
  }

  onGenerateBackstory(): void {
    if (!this.canGenerate() || this.disabled) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obrigatórios',
        detail: 'Preencha o nome, raça e classe antes de gerar a história.',
      });
      return;
    }

    this.isGenerating.set(true);
    this.backstoryAccepted.set(false);

    // Pega atributos e skills do form OU das props
    let attrsStr = '';
    let skillsStr = '';
    
    if (this.characterForm) {
      const attrs = this.characterForm.get('attributes')?.value;
      const skills = this.characterForm.get('skills')?.value;
      attrsStr = this.formatAttributes(attrs);
      skillsStr = this.formatSkills(skills);
    } else {
      attrsStr = this.attributes || '';
      skillsStr = this.skills || '';
    }

    const request: CharacterBackstoryRequest = {
      name: this._characterName(),
      ancestry: this._ancestryName(),
      class: this._className(),
      attributes: attrsStr,
      skills: skillsStr,
      supplements: this.manualBackstoryControl.value || '',
    };

    this.backstoryService.generateBackstory(request).subscribe({
      next: (response) => {
        this.generatedBackstory.set(response.text);
        this.isGenerating.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'História gerada com sucesso! Revise e confirme.',
        });
      },
      error: (error) => {
        this.isGenerating.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível gerar a história. Verifique sua conexão.',
        });
        console.error('Erro ao gerar backstory:', error);
      },
    });
  }

  onAcceptBackstory(): void {
    const backstory = this.generatedBackstory();
    if (backstory) {
      this.acceptedBackstory.set(backstory);
      this.backstoryAccepted.set(true);
      this.manualBackstoryControl.setValue('');
      this.backstoryChange.emit(backstory);
      this.messageService.add({
        severity: 'success',
        summary: 'História Aceita',
        detail: 'A história foi salva para o seu personagem.',
      });
    }
  }

  onAcceptManualBackstory(): void {
    const manualText = this.manualBackstoryControl.value?.trim();
    if (manualText) {
      this.acceptedBackstory.set(manualText);
      this.backstoryAccepted.set(true);
      this.generatedBackstory.set(manualText);
      this.manualBackstoryControl.setValue('');
      this.backstoryChange.emit(manualText);
      this.messageService.add({
        severity: 'success',
        summary: 'História Manual Aceita',
        detail: 'Sua história foi salva para o personagem.',
      });
    }
  }

  hasManualText(): boolean {
    return !!this.manualBackstoryControl.value?.trim();
  }

  onDiscardBackstory(): void {
    this.generatedBackstory.set(null);
    this.backstoryAccepted.set(false);
    this.acceptedBackstory.set(null);
    this.isEditingBackstory.set(false);
    this.backstoryChange.emit('');
    this.messageService.add({
      severity: 'info',
      summary: 'História Descartada',
      detail: 'Você pode gerar uma nova história quando quiser.',
    });
  }

  onEditBackstory(): void {
    if (this.readonly || this.disabled) return;
    this.isEditingBackstory.set(true);
    this.editBackstoryControl.setValue(this.acceptedBackstory() || '');
  }

  onSaveEditBackstory(): void {
    const editedText = this.editBackstoryControl.value || '';
    this.acceptedBackstory.set(editedText);
    this.generatedBackstory.set(editedText);
    this.isEditingBackstory.set(false);
    this.backstoryChange.emit(editedText);
    this.messageService.add({
      severity: 'success',
      summary: 'História Editada',
      detail: 'As alterações foram salvas.',
    });
  }

  onCancelEditBackstory(): void {
    this.isEditingBackstory.set(false);
    this.editBackstoryControl.setValue('');
  }

  onDeleteBackstory(): void {
    this.generatedBackstory.set(null);
    this.backstoryAccepted.set(false);
    this.acceptedBackstory.set(null);
    this.isEditingBackstory.set(false);
    this.backstoryChange.emit('');
    this.messageService.add({
      severity: 'info',
      summary: 'História Excluída',
      detail: 'A história foi removida.',
    });
  }

  getFinalBackstory(): string {
    return this.acceptedBackstory() || '';
  }

  /**
   * Formata atributos para string
   */
  private formatAttributes(attributes: Record<string, number>): string {
    if (!attributes) return '';

    const attributeLabels: Record<string, string> = {
      strength: 'Força',
      dexterity: 'Destreza',
      constitution: 'Constituição',
      intelligence: 'Inteligência',
      wisdom: 'Sabedoria',
      charisma: 'Carisma',
    };

    return Object.entries(attributes)
      .map(([key, value]) => `${attributeLabels[key] || key}: ${value}`)
      .join(', ');
  }

  /**
   * Formata skills para string
   */
  private formatSkills(skills: any[]): string {
    if (!skills || !Array.isArray(skills)) return '';

    return skills
      .map((skill) => skill?.name || skill)
      .filter((name) => name)
      .join(', ');
  }
}
