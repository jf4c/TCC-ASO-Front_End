import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import {
  Act,
  CreateActRequest,
  UpdateActRequest,
  ReorderActRequest,
} from '../interfaces/act.interface'
import {
  Chapter,
  CreateChapterRequest,
  UpdateChapterRequest,
  ReorderChapterRequest,
} from '../interfaces/chapter.interface'
import {
  MasterNote,
  CreateMasterNoteRequest,
  UpdateMasterNoteRequest,
} from '../interfaces/master-note.interface'

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/Campaign`

  // ==================== ACTS ====================

  /**
   * Retorna todos os atos da campanha ordenados por Order (ASC)
   * Inclui a lista de capítulos de cada ato
   */
  getActs(campaignId: string): Observable<Act[]> {
    return this.http.get<Act[]>(`${this.apiUrl}/${campaignId}/acts`)
  }

  /**
   * Cria um novo ato
   * Order é definido automaticamente como max(Order) + 1
   */
  createAct(
    campaignId: string,
    data: CreateActRequest,
  ): Observable<Act> {
    return this.http.post<Act>(
      `${this.apiUrl}/${campaignId}/acts`,
      data,
    )
  }

  /**
   * Atualiza o título do ato
   */
  updateAct(
    campaignId: string,
    actId: string,
    data: UpdateActRequest,
  ): Observable<Act> {
    return this.http.put<Act>(
      `${this.apiUrl}/${campaignId}/acts/${actId}`,
      data,
    )
  }

  /**
   * Deleta o ato e TODOS os seus capítulos (cascade delete)
   * Reordena os atos restantes automaticamente
   */
  deleteAct(campaignId: string, actId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${campaignId}/acts/${actId}`,
    )
  }

  /**
   * Atualiza a ordem de múltiplos atos
   */
  reorderActs(
    campaignId: string,
    reorders: ReorderActRequest[],
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${campaignId}/acts/reorder`,
      reorders,
    )
  }

  // ==================== CHAPTERS ====================

  /**
   * Retorna todos os capítulos do ato ordenados por Order (ASC)
   */
  getChapters(campaignId: string, actId: string): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(
      `${this.apiUrl}/${campaignId}/acts/${actId}/chapters`,
    )
  }

  /**
   * Cria um novo capítulo
   * Order é definido automaticamente como max(Order) + 1 dentro do ato
   */
  createChapter(
    campaignId: string,
    actId: string,
    data: CreateChapterRequest,
  ): Observable<Chapter> {
    return this.http.post<Chapter>(
      `${this.apiUrl}/${campaignId}/acts/${actId}/chapters`,
      data,
    )
  }

  /**
   * Atualiza título e/ou conteúdo do capítulo
   */
  updateChapter(
    campaignId: string,
    actId: string,
    chapterId: string,
    data: UpdateChapterRequest,
  ): Observable<Chapter> {
    return this.http.put<Chapter>(
      `${this.apiUrl}/${campaignId}/acts/${actId}/chapters/${chapterId}`,
      data,
    )
  }

  /**
   * Deleta o capítulo
   * Reordena os capítulos restantes do ato automaticamente
   */
  deleteChapter(
    campaignId: string,
    actId: string,
    chapterId: string,
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${campaignId}/acts/${actId}/chapters/${chapterId}`,
    )
  }

  /**
   * Atualiza a ordem de múltiplos capítulos dentro do ato
   */
  reorderChapters(
    campaignId: string,
    actId: string,
    reorders: ReorderChapterRequest[],
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${campaignId}/acts/${actId}/chapters/reorder`,
      reorders,
    )
  }

  // ==================== MASTER NOTES ====================

  /**
   * Retorna todas as notas do mestre ordenadas por CreatedAt DESC
   */
  getMasterNotes(campaignId: string): Observable<MasterNote[]> {
    return this.http.get<MasterNote[]>(
      `${this.apiUrl}/${campaignId}/master-notes`,
    )
  }

  /**
   * Cria uma nova nota do mestre
   */
  createMasterNote(
    campaignId: string,
    data: CreateMasterNoteRequest,
  ): Observable<MasterNote> {
    return this.http.post<MasterNote>(
      `${this.apiUrl}/${campaignId}/master-notes`,
      data,
    )
  }

  /**
   * Atualiza o conteúdo da nota
   */
  updateMasterNote(
    campaignId: string,
    noteId: string,
    data: UpdateMasterNoteRequest,
  ): Observable<MasterNote> {
    return this.http.put<MasterNote>(
      `${this.apiUrl}/${campaignId}/master-notes/${noteId}`,
      data,
    )
  }

  /**
   * Deleta a nota
   */
  deleteMasterNote(campaignId: string, noteId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${campaignId}/master-notes/${noteId}`,
    )
  }

  // ==================== IA ====================

  /**
   * Gera sugestões de história usando IA
   */
  generateStorySuggestions(campaignId: string): Observable<{ suggestions: string }> {
    return this.http.post<{ suggestions: string }>(
      `${this.apiUrl}/${campaignId}/acts/generate-suggestions`,
      {},
    )
  }

  /**
   * Gera ideias de campanha baseadas no contexto fornecido
   */
  generateCampaignIdeas(campaignContext: string): Observable<{ ideas: string[] }> {
    return this.http.post<{ ideas: string[] }>(
      `${environment.apiUrl}/oracle/campaign-ideas`,
      { campaignContext }
    )
  }
}
