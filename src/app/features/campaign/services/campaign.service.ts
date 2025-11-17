import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        console.log('Campanha criada:', campaign);
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
    let url = this.apiUrl;
    const queryParams: string[] = [];

    if (params?.status !== undefined) {
      queryParams.push(`status=${params.status}`);
    }
    if (params?.role) {
      queryParams.push(`role=${params.role}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<CampaignListItem[]>(url).pipe(
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

  getAvailableFriends(campaignId: string): Observable<AvailableFriend[]> {
    return this.http.get<AvailableFriend[]>(`${this.apiUrl}/${campaignId}/available-friends`);
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
}
