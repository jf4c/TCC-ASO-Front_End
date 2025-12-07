import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';
import { BackstoryService } from '@features/character/services/backstory.service';
import { CharacterBackstoryRequest } from '@features/character/interface/backstory.model';
import { MessageService } from 'primeng/api';

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
export class BackstoryEditorComponent {
  private readonly backstoryService = inject(BackstoryService);
  private readonly messageService = inject(MessageService);

  @Input() initialBackstory: string | null = null;
  @Input() characterName: string = '';
  @Input() ancestryName: string = '';
  @Input() className: string = '';
  @Input() attributes: string = '';
  @Input() skills: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Output() backstoryChange = new EventEmitter<string>();

  isGenerating = signal(false);
  generatedBackstory = signal<string | null>(null);
  backstoryAccepted = signal(false);
  acceptedBackstory = signal<string | null>(null);
  isEditingBackstory = signal(false);
  editBackstoryControl = new FormControl('');
  manualBackstoryControl = new FormControl('');

  canGenerate = computed(() => {
    return !!(
      this.characterName?.trim() &&
      this.ancestryName?.trim() &&
      this.className?.trim()
    );
  });

  ngOnInit(): void {
    // Se há backstory inicial, configura como aceita
    if (this.initialBackstory) {
      this.generatedBackstory.set(this.initialBackstory);
      this.acceptedBackstory.set(this.initialBackstory);
      this.backstoryAccepted.set(true);
    }
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

    const request: CharacterBackstoryRequest = {
      name: this.characterName,
      ancestry: this.ancestryName,
      class: this.className,
      attributes: this.attributes,
      skills: this.skills,
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
}
