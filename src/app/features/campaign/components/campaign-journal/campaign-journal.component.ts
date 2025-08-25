import { Component, input, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TabViewModule } from 'primeng/tabview'
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { InputTextarea } from 'primeng/inputtextarea'
import { InputTextModule } from 'primeng/inputtext'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'

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
    ButtonModule,
    InputTextarea,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
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
  editingChapter = signal<string | null>(null) // Para controlar qual capítulo está sendo editado
  newJournalTitle = signal('')
  pendingNewAct = signal<string>('') // Para o novo ato em criação
  pendingNewChapter = signal<string | null>(null) // Para o novo capítulo em criação

  // Planejamento do Mestre
  planningNotes = signal<PlanningNote[]>([])
  editingPlanning = signal<string | null>(null)
  newPlanningContent = signal('')

  // Diário de Aventuras Methods
  addJournalEntry(): void {
    const atoNumber = this.journalEntries().length + 1
    this.pendingNewAct.set(`ATO ${atoNumber}: `)

    // Foca no input após o Angular atualizar a view
    setTimeout(() => {
      const input = document.querySelector(
        '.pending-act-input',
      ) as HTMLInputElement
      if (input) {
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length) // Posiciona cursor no final
      }
    }, 0)
  }

  confirmNewAct(): void {
    if (!this.pendingNewAct().trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: this.pendingNewAct(),
      content: '',
      order: this.journalEntries().length + 1,
      chapters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.journalEntries.update((entries) => [...entries, newEntry])
    this.pendingNewAct.set('')
  }

  cancelNewAct(): void {
    this.pendingNewAct.set('')
  }

  editJournalEntry(entryId: string): void {
    this.editingJournal.set(entryId)
  }

  saveJournalEntry(entryId: string, content: string): void {
    this.journalEntries.update((entries) =>
      entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, content, updatedAt: new Date() }
          : entry,
      ),
    )
    this.editingJournal.set(null)
  }

  deleteJournalEntry(entryId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este ato?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
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

  editJournalTitle(entryId: string): void {
    this.editingJournalTitle.set(entryId)

    // Foca no input após o Angular atualizar a view
    setTimeout(() => {
      const input = document.querySelector(
        '.entry-title-input',
      ) as HTMLInputElement
      if (input) {
        input.focus()
        input.select() // Seleciona todo o texto para facilitar a edição
      }
    }, 0)
  }

  saveJournalTitle(entryId: string, title: string): void {
    if (!title.trim()) return

    this.journalEntries.update((entries) =>
      entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, title: title.trim(), updatedAt: new Date() }
          : entry,
      ),
    )
    this.editingJournalTitle.set(null)
  }

  // Planejamento do Mestre Methods
  addPlanningNote(): void {
    if (!this.newPlanningContent().trim()) return

    const newNote: PlanningNote = {
      id: Date.now().toString(),
      content: this.newPlanningContent(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.planningNotes.update((notes) => [...notes, newNote])
    this.newPlanningContent.set('')
  }

  editPlanningNote(noteId: string): void {
    this.editingPlanning.set(noteId)
  }

  savePlanningNote(noteId: string, content: string): void {
    this.planningNotes.update((notes) =>
      notes.map((note) =>
        note.id === noteId ? { ...note, content, updatedAt: new Date() } : note,
      ),
    )
    this.editingPlanning.set(null)
  }

  deletePlanningNote(noteId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta nota de planejamento?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
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

  // Métodos para gerenciar capítulos
  addChapter(entryId: string): void {
    const entry = this.journalEntries().find((e) => e.id === entryId)
    if (!entry) return

    // Define o ID do capítulo pendente
    const pendingChapterId = `${entryId}-pending-${Date.now()}`
    this.pendingNewChapter.set(entryId)
    this.editingChapter.set(pendingChapterId)

    // Foca no input do título após o Angular atualizar a view
    setTimeout(() => {
      const input = document.querySelector(
        '.chapter-title-input',
      ) as HTMLInputElement
      if (input) {
        input.focus()
      }
    }, 100)
  }

  saveNewChapter(entryId: string, title: string, content: string): void {
    if (!title.trim()) return

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

    // Limpa os estados pendentes
    this.pendingNewChapter.set(null)
    this.editingChapter.set(null)

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Capítulo criado com sucesso',
    })
  }

  cancelNewChapter(): void {
    this.pendingNewChapter.set(null)
    this.editingChapter.set(null)
  }

  editChapter(entryId: string, chapterId: string): void {
    this.editingChapter.set(`${entryId}-${chapterId}`)
  }

  saveChapter(
    entryId: string,
    chapterId: string,
    title: string,
    content: string,
  ): void {
    if (!title.trim()) return

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
              updatedAt: new Date(),
            }
          : entry,
      ),
    )
    this.editingChapter.set(null)
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Capítulo atualizado com sucesso',
    })
  }

  cancelChapterEdit(): void {
    this.editingChapter.set(null)
  }

  deleteChapter(entryId: string, chapterId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este capítulo?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.journalEntries.update((entries) =>
          entries.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                  chapters: e.chapters.filter((ch) => ch.id !== chapterId),
                }
              : e,
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

  updateChapterContent(
    entryId: string,
    chapterId: string,
    content: string,
  ): void {
    this.journalEntries.update((entries) =>
      entries.map((e) =>
        e.id === entryId
          ? {
              ...e,
              chapters: e.chapters.map((ch) =>
                ch.id === chapterId
                  ? { ...ch, content, updatedAt: new Date() }
                  : ch,
              ),
            }
          : e,
      ),
    )
  }
}
