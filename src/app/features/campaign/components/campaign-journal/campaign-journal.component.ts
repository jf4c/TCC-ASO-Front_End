import { Component, input, signal, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TabViewModule } from 'primeng/tabview'
import { AccordionModule } from 'primeng/accordion'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { finalize } from 'rxjs'

// Importar componentes reutilizáveis
import { InputComponent } from '../../../../shared/components/input/input.component'
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import {
  ChapterDialogComponent,
  ChapterDialogData,
} from '../dialogs/chapter-dialog/chapter-dialog.component'
import {
  ActDialogComponent,
  ActDialogData,
} from '../dialogs/act-dialog/act-dialog.component'
import {
  MasterNoteDialogComponent,
  MasterNoteDialogData,
} from '../dialogs/master-note-dialog/master-note-dialog.component'

// Interfaces e Services
import { Act } from '../../interfaces/act.interface'
import { Chapter } from '../../interfaces/chapter.interface'
import { MasterNote } from '../../interfaces/master-note.interface'
import { JournalService } from '../../services/journal.service'

export interface JournalEntry {
  id: string
  title: string
  content: string
  order: number
  chapters: JournalChapter[]
  createdAt: Date
  updatedAt: Date
}

export interface JournalChapter {
  id: string
  title: string
  content: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface PlanningNote {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
}

@Component({
  selector: 'aso-campaign-journal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    AccordionModule,
    ConfirmDialogModule,
    ToastModule,
    // Componentes reutilizáveis
    InputComponent,
    ButtonComponent,
    ChapterDialogComponent,
    ActDialogComponent,
    MasterNoteDialogComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './campaign-journal.component.html',
  styleUrl: './campaign-journal.component.scss',
})
export class CampaignJournalComponent implements OnInit {
  campaignId = input.required<string>()

  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)
  private journalService = inject(JournalService)

  // Diário de Aventuras
  acts = signal<Act[]>([])
  masterNotes = signal<MasterNote[]>([])
  
  loading = signal<boolean>(false)
  
  // Inline add act
  pendingNewAct = signal<string>('')
  newActTitle = signal<string>('')
  
  // Dialog de atos (apenas para editar)
  actDialogVisible = signal<boolean>(false)
  actDialogData = signal<ActDialogData | null>(null)

  // Dialog de capítulos
  chapterDialogVisible = signal<boolean>(false)
  chapterDialogData = signal<ChapterDialogData | null>(null)

  // Dialog de notas do mestre
  masterNoteDialogVisible = signal<boolean>(false)
  masterNoteDialogData = signal<MasterNoteDialogData | null>(null)

  ngOnInit(): void {
    this.loadJournalData()
  }

  private loadJournalData(): void {
    this.loading.set(true)
    this.loadActs()
    this.loadMasterNotes()
  }

  private loadActs(): void {
    this.journalService
      .getActs(this.campaignId())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (acts) => {
          console.log('Acts carregados (raw):', acts)
          console.log('Quantidade de atos:', acts.length)
          // Converter strings de data para objetos Date
          const processedActs = acts.map(act => ({
            ...act,
            createdAt: new Date(act.createdAt),
            updatedAt: new Date(act.updatedAt),
            chapters: act.chapters?.map(ch => ({
              ...ch,
              createdAt: new Date(ch.createdAt),
              updatedAt: new Date(ch.updatedAt)
            })) || []
          }))
          console.log('Acts processados:', processedActs)
          this.acts.set(processedActs)
          console.log('Signal acts() atualizado, valor atual:', this.acts())
        },
        error: (error) => {
          console.error('Erro ao carregar atos:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar atos da campanha',
          })
          this.loading.set(false)
        },
      })
  }

  private loadMasterNotes(): void {
    this.journalService.getMasterNotes(this.campaignId()).subscribe({
      next: (notes) => {
        this.masterNotes.set(notes)
      },
      error: (error) => {
        console.error('Erro ao carregar notas do mestre:', error)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar notas do mestre',
        })
      },
    })
  }

  // ==================== ACTS ====================

  addAct(): void {
    this.newActTitle.set('')
    this.pendingNewAct.set('creating')
  }

  confirmNewAct(): void {
    const actTitle = this.newActTitle().trim()
    if (!actTitle) return

    console.log('Criando ato:', actTitle)
    this.journalService
      .createAct(this.campaignId(), { title: actTitle })
      .subscribe({
        next: (createdAct) => {
          console.log('Ato criado:', createdAct)
          console.log('Chamando loadActs() para atualizar lista...')
          this.loadActs()
          this.pendingNewAct.set('')
          this.newActTitle.set('')
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ato criado com sucesso',
          })
        },
        error: (error) => {
          console.error('Erro ao criar ato:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao criar ato',
          })
        },
      })
  }

  cancelNewAct(): void {
    this.pendingNewAct.set('')
    this.newActTitle.set('')
  }

  editAct(act: Act): void {
    this.actDialogData.set({
      act,
      isEditing: true,
    })
    this.actDialogVisible.set(true)
  }

  onActSave(data: { title: string }): void {
    const dialogData = this.actDialogData()
    if (!dialogData) return

    if (dialogData.isEditing && dialogData.act) {
      // Editar ato existente
      this.updateAct(dialogData.act.id, data.title)
    }

    this.closeActDialog()
  }

  onActCancel(): void {
    this.closeActDialog()
  }

  private closeActDialog(): void {
    this.actDialogVisible.set(false)
    this.actDialogData.set(null)
  }

  private createAct(title: string): void {
    this.journalService
      .createAct(this.campaignId(), { title })
      .subscribe({
        next: () => {
          this.loadActs()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ato criado com sucesso',
          })
        },
        error: (error) => {
          console.error('Erro ao criar ato:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao criar ato',
          })
        },
      })
  }

  private updateAct(actId: string, title: string): void {
    this.journalService
      .updateAct(this.campaignId(), actId, { title })
      .subscribe({
        next: () => {
          this.loadActs()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ato atualizado com sucesso',
          })
        },
        error: (error) => {
          console.error('Erro ao atualizar ato:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar ato',
          })
        },
      })
  }

  deleteAct(act: Act): void {
    const chapterCount = act.chapters.length
    const message =
      chapterCount > 0
        ? `Este ato possui ${chapterCount} capítulo(s). Todos serão excluídos permanentemente. Deseja continuar?`
        : 'Tem certeza que deseja excluir este ato?'

    this.confirmationService.confirm({
      message,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.journalService
          .deleteAct(this.campaignId(), act.id)
          .subscribe({
            next: () => {
              this.loadActs()
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ato excluído com sucesso',
              })
            },
            error: (error) => {
              console.error('Erro ao excluir ato:', error)
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao excluir ato',
              })
            },
          })
      },
    })
  }

  // ==================== CHAPTERS ====================

  addChapter(act: Act): void {
    this.chapterDialogData.set({
      actId: act.id,
      isEditing: false,
    })
    this.chapterDialogVisible.set(true)
  }

  editChapter(actId: string, chapter: Chapter): void {
    this.chapterDialogData.set({
      actId,
      chapter,
      isEditing: true,
    })
    this.chapterDialogVisible.set(true)
  }

  onChapterSave(data: { title: string; content: string }): void {
    const dialogData = this.chapterDialogData()
    if (!dialogData) return

    if (dialogData.isEditing && dialogData.chapter) {
      // Editar capítulo existente
      this.updateChapter(
        dialogData.actId,
        dialogData.chapter.id,
        data.title,
        data.content,
      )
    } else {
      // Criar novo capítulo
      this.createChapter(dialogData.actId, data.title, data.content)
    }

    this.closeChapterDialog()
  }

  onChapterCancel(): void {
    this.closeChapterDialog()
  }

  private closeChapterDialog(): void {
    this.chapterDialogVisible.set(false)
    this.chapterDialogData.set(null)
  }

  private createChapter(
    actId: string,
    title: string,
    content: string,
  ): void {
    this.journalService
      .createChapter(this.campaignId(), actId, { title, content })
      .subscribe({
        next: () => {
          this.loadActs()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Capítulo criado com sucesso',
          })
        },
        error: (error) => {
          console.error('Erro ao criar capítulo:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao criar capítulo',
          })
        },
      })
  }

  private updateChapter(
    actId: string,
    chapterId: string,
    title: string,
    content: string,
  ): void {
    this.journalService
      .updateChapter(this.campaignId(), actId, chapterId, { title, content })
      .subscribe({
        next: () => {
          this.loadActs()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Capítulo atualizado com sucesso',
          })
        },
        error: (error) => {
          console.error('Erro ao atualizar capítulo:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar capítulo',
          })
        },
      })
  }

  deleteChapter(actId: string, chapterId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este capítulo?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.journalService
          .deleteChapter(this.campaignId(), actId, chapterId)
          .subscribe({
            next: () => {
              this.loadActs()
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Capítulo excluído com sucesso',
              })
            },
            error: (error) => {
              console.error('Erro ao excluir capítulo:', error)
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao excluir capítulo',
              })
            },
          })
      },
    })
  }

  // ==================== MASTER NOTES ====================

  addMasterNote(): void {
    this.masterNoteDialogData.set({
      isEditing: false,
    })
    this.masterNoteDialogVisible.set(true)
  }

  editMasterNote(note: MasterNote): void {
    this.masterNoteDialogData.set({
      note,
      isEditing: true,
    })
    this.masterNoteDialogVisible.set(true)
  }

  onMasterNoteSave(data: { content: string }): void {
    const dialogData = this.masterNoteDialogData()
    if (!dialogData) return

    if (dialogData.isEditing && dialogData.note) {
      // Editar nota existente
      this.updateMasterNote(dialogData.note.id, data.content)
    } else {
      // Criar nova nota
      this.createMasterNote(data.content)
    }

    this.closeMasterNoteDialog()
  }

  onMasterNoteCancel(): void {
    this.closeMasterNoteDialog()
  }

  private closeMasterNoteDialog(): void {
    this.masterNoteDialogVisible.set(false)
    this.masterNoteDialogData.set(null)
  }

  private createMasterNote(content: string): void {
    this.journalService
      .createMasterNote(this.campaignId(), { content })
      .subscribe({
        next: () => {
          this.loadMasterNotes()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Nota criada com sucesso',
          })
        },
        error: (error) => {
          console.error('Erro ao criar nota:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao criar nota',
          })
        },
      })
  }

  private updateMasterNote(noteId: string, content: string): void {
    this.journalService
      .updateMasterNote(this.campaignId(), noteId, { content })
      .subscribe({
        next: () => {
          this.loadMasterNotes()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Nota atualizada com sucesso',
          })
        },
        error: (error) => {
          console.error('Erro ao atualizar nota:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar nota',
          })
        },
      })
  }

  deleteMasterNote(noteId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta nota?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.journalService
          .deleteMasterNote(this.campaignId(), noteId)
          .subscribe({
            next: () => {
              this.loadMasterNotes()
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Nota excluída com sucesso',
              })
            },
            error: (error) => {
              console.error('Erro ao excluir nota:', error)
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao excluir nota',
              })
            },
          })
      },
    })
  }

  // Métodos legados removidos - TODO: remover código antigo abaixo

  // ==================== IA ====================

  requestAISuggestions(): void {
    this.loading.set(true)
    this.journalService
      .generateStorySuggestions(this.campaignId())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          // Criar nova nota do mestre com a sugestão da IA
          this.journalService
            .createMasterNote(this.campaignId(), { content: response.suggestions })
            .subscribe({
              next: () => {
                this.loadMasterNotes()
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sugestão da IA',
                  detail: 'Nova nota criada com sugestões da IA',
                })
              },
              error: (error) => {
                console.error('Erro ao criar nota com sugestão:', error)
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro',
                  detail: 'Falha ao salvar sugestão da IA',
                })
              },
            })
        },
        error: (error) => {
          console.error('Erro ao gerar sugestões:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao gerar sugestões de história',
          })
        },
      })
  }

  // TrackBy functions for performance
  trackByActId(index: number, act: Act): string {
    return act.id
  }

  trackByChapterId(index: number, chapter: Chapter): string {
    return chapter.id
  }

  trackByNoteId(index: number, note: MasterNote): string {
    return note.id
  }
}
