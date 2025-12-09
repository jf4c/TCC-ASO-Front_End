import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CampaignService } from '../../services/campaign.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { CampaignDetail, CampaignParticipant } from '../../interfaces/campaign-detail.model';
import { UserRole } from '../../interfaces/campaign.model';

@Component({
  selector: 'aso-edit-campaign',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './edit-campaign.page.html',
  styleUrl: './edit-campaign.page.scss',
})
export class EditCampaignPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  campaignId!: string;
  campaign: CampaignDetail | null = null;
  loading = false;
  participants: CampaignParticipant[] = [];

  editForm!: FormGroup;

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadCampaign();
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      newGameMasterId: ['']
    });
  }

  private loadCampaign(): void {
    this.loading = true;
    this.campaignService.getCampaign(this.campaignId).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        this.participants = campaign.participants || [];

        // Verificar se é Game Master
        if (!this.isGameMaster()) {
          this.messageService.add({
            severity: 'error',
            summary: 'Acesso Negado',
            detail: 'Apenas o Game Master pode editar esta campanha'
          });
          setTimeout(() => {
            this.router.navigate(['/campanhas', this.campaignId]);
          }, 2000);
          return;
        }

        // Preencher formulário
        const currentGM = this.participants.find(p => p.role === UserRole.MASTER);
        this.editForm.patchValue({
          name: campaign.name,
          description: campaign.description || '',
          newGameMasterId: currentGM?.userId || ''
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar campanha:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a campanha'
        });
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/campanhas']);
        }, 2000);
      }
    })
  }

  getMasterParticipant(): CampaignParticipant | undefined {
    return this.participants.find(p => p.role === UserRole.MASTER)
  }

  isGameMaster(): boolean {
    const currentPlayerId = this.authService.getPlayerId()
    if (!currentPlayerId) return false
    const master = this.getMasterParticipant()
    return master?.userId === currentPlayerId
  }

  get participantsOptions() {
    return this.participants.map(p => ({
      label: p.userName,
      value: p.userId
    }));
  }

  onSave(): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    this.loading = true;
    const formValues = this.editForm.value;

    // Atualizar dados básicos
    this.campaignService.updateCampaign(this.campaignId, {
      name: formValues.name,
      description: formValues.description
    }).subscribe({
      next: () => {
        // Se GM mudou, atualizar separadamente
        const currentGM = this.participants.find(p => p.role === UserRole.MASTER);
        if (formValues.newGameMasterId !== currentGM?.userId) {
          this.updateGameMaster(formValues.newGameMasterId);
        } else {
          this.handleSaveSuccess();
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar campanha:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível salvar as alterações'
        });
        this.loading = false;
      }
    });
  }

  private updateGameMaster(newGMId: string): void {
    this.campaignService.setGameMaster(this.campaignId, newGMId).subscribe({
      next: () => {
        this.handleSaveSuccess();
      },
      error: (error) => {
        console.error('Erro ao atualizar Game Master:', error);
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Campanha atualizada, mas falha ao trocar Game Master'
        });
        this.loading = false;
      }
    });
  }

  private handleSaveSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Campanha atualizada com sucesso!'
    });
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/campanhas', this.campaignId]);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/campanhas', this.campaignId]);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
