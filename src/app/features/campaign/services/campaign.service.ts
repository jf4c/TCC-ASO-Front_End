import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Campaign,
  CampaignListItem,
  CampaignStatus,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  GenerateCampaignStoryRequest,
  GenerateCampaignStoryResponse
} from '../interfaces/campaign.interface';
import {
  CampaignParticipant,
  ParticipantRole,
  AddParticipantRequest,
  AvailableFriend,
  AvailableCharacter
} from '../interfaces/campaign-participant.interface';
import { CampaignDetail } from '../interfaces/campaign-detail.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Campaign`;
  private readonly oracleApiUrl = environment.oracleApiUrl;

  private campaignsSubject = new BehaviorSubject<CampaignListItem[]>([]);
  public campaigns$ = this.campaignsSubject.asObservable();

  private currentCampaignSubject = new BehaviorSubject<CampaignDetail | null>(null);
  public currentCampaign$ = this.currentCampaignSubject.asObservable();

  createCampaign(data: CreateCampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, data).pipe(
      tap(campaign => {
        this.refreshCampaigns();
      }),
      catchError((error) => {
        console.error('Erro ao criar campanha:', error);
        return throwError(() => error);
      })
    );
  }

  getCampaign(campaignId: string): Observable<CampaignDetail> {
    return this.http.get<CampaignDetail>(`${this.apiUrl}/${campaignId}`).pipe(
      tap(campaign => this.currentCampaignSubject.next(campaign)),
      catchError((error) => throwError(() => error))
    );
  }

  getMyCampaigns(): Observable<CampaignListItem[]> {
    return this.http.get<CampaignListItem[]>(this.apiUrl).pipe(
      tap(campaigns => this.campaignsSubject.next(campaigns)),
      catchError((error) => throwError(() => error))
    );
  }

  getCampaigns(params?: { status?: CampaignStatus; role?: 'creator' | 'gameMaster' | 'player' }): Observable<CampaignListItem[]> {
    let httpParams = new HttpParams();

    if (params?.status !== undefined) {
      httpParams = httpParams.set('status', params.status.toString());
    }
    if (params?.role) {
      httpParams = httpParams.set('role', params.role);
    }

    return this.http.get<CampaignListItem[]>(this.apiUrl, { params: httpParams }).pipe(
      tap(campaigns => this.campaignsSubject.next(campaigns)),
      catchError((error) => throwError(() => error))
    );
  }

  addParticipant(campaignId: string, data: AddParticipantRequest): Observable<CampaignParticipant> {
    return this.http.post<CampaignParticipant>(`${this.apiUrl}/${campaignId}/Participant`, data).pipe(
      tap(() => this.refreshCurrentCampaign(campaignId)),
      catchError((error) => throwError(() => error))
    );
  }

  updateCampaign(campaignId: string, data: { name: string; description?: string }): Observable<CampaignDetail> {
    return this.http.patch<CampaignDetail>(`${this.apiUrl}/${campaignId}`, data).pipe(
      tap(campaign => this.currentCampaignSubject.next(campaign)),
      catchError((error) => {
        console.error('Erro ao atualizar campanha:', error);
        return throwError(() => error);
      })
    );
  }

  deleteCampaign(campaignId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${campaignId}`).pipe(
      tap(() => this.refreshCampaigns()),
      catchError((error) => {
        console.error('Erro ao deletar campanha:', error);
        return throwError(() => error);
      })
    );
  }

  getAvailableFriends(campaignId: string): Observable<AvailableFriend[]> {
    return this.http.get<AvailableFriend[]>(`${this.apiUrl}/${campaignId}/available-friends`);
  }

  getAvailableCharactersForPlayer(campaignId: string, playerId: string): Observable<AvailableCharacter[]> {
    return this.http.get<AvailableCharacter[]>(`${this.apiUrl}/${campaignId}/Player/${playerId}/available-characters`);
  }

  assignCharacterToParticipant(campaignId: string, playerId: string, characterId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${campaignId}/characters`, { playerId, characterId }).pipe(
      tap(() => this.refreshCurrentCampaign(campaignId)),
      catchError((error) => throwError(() => error))
    );
  }

  setGameMaster(campaignId: string, playerId: string | null): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${campaignId}/set-game-master`, { playerId }).pipe(
      tap(() => this.refreshCurrentCampaign(campaignId))
    );
  }

  refreshCampaigns(): void {
    this.getMyCampaigns().subscribe();
  }

  refreshCurrentCampaign(campaignId: string): void {
    this.getCampaign(campaignId).subscribe();
  }

  clearAll(): void {
    this.campaignsSubject.next([]);
    this.currentCampaignSubject.next(null);
  }

  generateCampaignStory(data: { characterIds: string[]; campaignName: string; campaignDescription?: string }): Observable<{ story: string }> {
    return this.http.post<{ story: string }>(`${this.oracleApiUrl}/campaign-story-from-characters`, data).pipe(
      catchError((error) => {
        console.error('Erro ao gerar história da campanha:', error);
        return throwError(() => error);
      })
    );
  }

  updateCampaignStory(campaignId: string, storyIntroduction: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${campaignId}/story`, { storyIntroduction }).pipe(
      tap(() => this.refreshCurrentCampaign(campaignId)),
      catchError((error) => {
        console.error('Erro ao atualizar história da campanha:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Atualiza a imagem da campanha
   */
  updateCampaignImage(campaignId: string, imageUrl: string | null): Observable<CampaignDetail> {
    return this.http.patch<CampaignDetail>(`${this.apiUrl}/${campaignId}/image`, { imageUrl }).pipe(
      tap((campaign) => this.currentCampaignSubject.next(campaign)),
      catchError((error) => {
        console.error('Erro ao atualizar imagem da campanha:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Verifica se o player logado é o GameMaster ou Creator da campanha
   */
  isMaster(campaignId: string): Observable<{ isMaster: boolean }> {
    return this.http.get<{ isMaster: boolean }>(`${this.apiUrl}/${campaignId}/is-master`);
  }

  addPlayer(campaignId: string, playerId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${campaignId}/players`, { playerId }).pipe(
      tap(() => this.refreshCurrentCampaign(campaignId)),
      catchError((error) => throwError(() => error))
    );
  }

  addCharacter(campaignId: string, playerId: string, characterId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${campaignId}/characters`, { playerId, characterId }).pipe(
      tap(() => this.refreshCurrentCampaign(campaignId)),
      catchError((error) => throwError(() => error))
    );
  }

  removePlayer(campaignId: string, playerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${campaignId}/participants/${playerId}`).pipe(
      tap(() => this.refreshCurrentCampaign(campaignId)),
      catchError((error) => throwError(() => error))
    );
  }
}
