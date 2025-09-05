import { Component, input, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TabViewModule } from 'primeng/tabview'
import { AccordionModule } from 'primeng/accordion'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'

// Importar componentes reutilizáveis
import { InputComponent } from '../../../../shared/components/input/input.component'
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import {
  ChapterDialogComponent,
  ChapterDialogData,
} from '../dialogs/chapter-dialog/chapter-dialog.component'

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
    TextareaComponent,
    ButtonComponent,
    ChapterDialogComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './campaign-journal.component.html',
  styleUrl: './campaign-journal.component.scss',
})
export class CampaignJournalComponent {
  campaignId = input.required<string>()

  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)

  // Diário de Aventuras
  journalEntries = signal<JournalEntry[]>([
    {
      id: '1',
      title: 'ATO I: O CHAMADO PARA A AVENTURA',
      content: '',
      order: 1,
      chapters: [
        {
          id: 'ch1',
          title: 'O ENCONTRO NA ESTALAGEM',
          content:
            'Nossos heróis, de origens e caminhos distintos, cruzaram seus destinos na taverna "O Javali Sedento". Uma proposta de trabalho misteriosa, deixada por um anão chamado Gundren Rockseeker, prometia uma recompensa generosa para escoltar uma carroça de suprimentos até a vila fronteiriça de Phandalin. Pouco sabiam eles que essa simples tarefa os lançaria em uma teia de intrigas, perigos e a lenda de uma mina perdida há muito tempo.',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'ch2',
          title: 'A EMBOSCADA DOS GOBLINS',
          content:
            'A viagem, inicialmente tranquila, foi brutalmente interrompida por uma emboscada goblin. Após uma batalha acirrada, os aventureiros descobriram que os goblins haviam capturado seu empregador, Gundren, e seu guarda-costas humano, Sildar Hallwinter. A trilha dos goblins os levou a uma caverna escura, o primeiro de muitos desafios.',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  editingJournal = signal<string | null>(null)
  editingJournalTitle = signal<string | null>(null)
  newJournalTitle = signal('')
  pendingNewAct = signal<string>('') // Para o novo ato em criação
  newActTitle = signal<string>('') // Título do novo ato sendo digitado
  editingTitleValue = signal<string>('') // Valor do título sendo editado

  // Dialog de capítulos
  chapterDialogVisible = signal<boolean>(false)
  chapterDialogData = signal<ChapterDialogData | null>(null)

  // Planejamento do Mestre
  planningNotes = signal<PlanningNote[]>([])
  editingPlanning = signal<string | null>(null)
  newPlanningContent = signal('')

  // Diário de Aventuras Methods
  addJournalEntry(): void {
    // Reseta o título e apenas exibe o campo de input
    this.newActTitle.set('')
    this.pendingNewAct.set('creating')
  }

  editJournal(entryId: string): void {
    this.editingJournal.set(entryId)
  }

  editJournalTitle(entryId: string): void {
    const entry = this.journalEntries().find((e) => e.id === entryId)
    if (entry) {
      this.editingTitleValue.set(entry.title)
    }
    this.editingJournalTitle.set(entryId)
  }

  saveJournalTitle(entryId: string, title?: string): void {
    const titleToSave = title || this.editingTitleValue()
    if (!titleToSave.trim()) return

    this.journalEntries.update((entries) =>
      entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, title: titleToSave.trim(), updatedAt: new Date() }
          : entry,
      ),
    )

    this.editingJournalTitle.set(null)
    this.editingTitleValue.set('')

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Título do ato atualizado com sucesso',
    })
  }

  cancelJournalTitleEdit(): void {
    this.editingJournalTitle.set(null)
    this.editingTitleValue.set('')
  }

  onAccordionToggle(event: { originalEvent?: Event; index: number }): void {
    // Bloqueia o toggle do accordion se estiver editando algum título
    if (this.editingJournalTitle()) {
      if (event.originalEvent) {
        event.originalEvent.preventDefault()
        event.originalEvent.stopPropagation()
      }
    }
  }

  saveJournal(entryId: string, content: string): void {
    this.journalEntries.update((entries) =>
      entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, content: content.trim(), updatedAt: new Date() }
          : entry,
      ),
    )

    this.editingJournal.set(null)

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Entrada do diário salva com sucesso',
    })
  }

  cancelJournalEdit(): void {
    this.editingJournal.set(null)
  }

  saveJournalEntry(entryId: string, content: string): void {
    this.saveJournal(entryId, content)
  }

  confirmNewAct(): void {
    const actTitle = this.newActTitle().trim()
    if (!actTitle) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: actTitle,
      content: '',
      order: this.journalEntries().length + 1,
      chapters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.journalEntries.update((entries) => [...entries, newEntry])
    this.pendingNewAct.set('')
    this.newActTitle.set('')

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Novo ato adicionado com sucesso',
    })
  }

  cancelNewAct(): void {
    this.pendingNewAct.set('')
    this.newActTitle.set('')
  }

  deleteJournalEntry(entryId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este ato?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.journalEntries.update((entries) =>
          entries.filter((entry) => entry.id !== entryId),
        )
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ato excluído com sucesso',
        })
      },
    })
  }

  // Métodos para gerenciar capítulos
  addChapter(entryId: string): void {
    this.chapterDialogData.set({
      entryId,
      isEditing: false,
    })
    this.chapterDialogVisible.set(true)
  }

  editChapter(entryId: string, chapterId: string): void {
    const entry = this.journalEntries().find((e) => e.id === entryId)
    const chapter = entry?.chapters.find((c) => c.id === chapterId)

    if (!entry || !chapter) return

    this.chapterDialogData.set({
      entryId,
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
        dialogData.entryId,
        dialogData.chapter.id,
        data.title,
        data.content,
      )
    } else {
      // Criar novo capítulo
      this.createNewChapter(dialogData.entryId, data.title, data.content)
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

  private createNewChapter(
    entryId: string,
    title: string,
    content: string,
  ): void {
    const entry = this.journalEntries().find((e) => e.id === entryId)
    if (!entry) return

    const newChapter: JournalChapter = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      order: entry.chapters.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.journalEntries.update((entries) =>
      entries.map((e) =>
        e.id === entryId ? { ...e, chapters: [...e.chapters, newChapter] } : e,
      ),
    )

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Capítulo criado com sucesso',
    })
  }

  private updateChapter(
    entryId: string,
    chapterId: string,
    title: string,
    content: string,
  ): void {
    this.journalEntries.update((entries) =>
      entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              chapters: entry.chapters.map((chapter) =>
                chapter.id === chapterId
                  ? {
                      ...chapter,
                      title: title.trim(),
                      content: content.trim(),
                      updatedAt: new Date(),
                    }
                  : chapter,
              ),
            }
          : entry,
      ),
    )

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Capítulo atualizado com sucesso',
    })
  }

  deleteChapter(entryId: string, chapterId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este capítulo?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.journalEntries.update((entries) =>
          entries.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  chapters: entry.chapters.filter((c) => c.id !== chapterId),
                }
              : entry,
          ),
        )
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Capítulo excluído com sucesso',
        })
      },
    })
  }

  // Planejamento Methods
  addPlanningNote(): void {
    if (!this.newPlanningContent().trim()) return

    const newNote: PlanningNote = {
      id: Date.now().toString(),
      content: this.newPlanningContent().trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.planningNotes.update((notes) => [...notes, newNote])
    this.newPlanningContent.set('')

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Nota de planejamento adicionada com sucesso',
    })
  }

  editPlanningNote(noteId: string): void {
    this.editingPlanning.set(noteId)
  }

  savePlanningNote(noteId: string, content: string): void {
    if (!content.trim()) return

    this.planningNotes.update((notes) =>
      notes.map((note) =>
        note.id === noteId
          ? { ...note, content: content.trim(), updatedAt: new Date() }
          : note,
      ),
    )

    this.editingPlanning.set(null)

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Nota de planejamento atualizada com sucesso',
    })
  }

  cancelPlanningEdit(): void {
    this.editingPlanning.set(null)
  }

  deletePlanningNote(noteId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta nota de planejamento?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.planningNotes.update((notes) =>
          notes.filter((note) => note.id !== noteId),
        )
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Nota de planejamento excluída com sucesso',
        })
      },
    })
  }
}
