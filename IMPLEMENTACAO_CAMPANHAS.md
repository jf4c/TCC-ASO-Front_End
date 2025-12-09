# 🚀 IMPLEMENTAÇÃO EM ANDAMENTO - MÓDULO DE CAMPANHAS

## ✅ JÁ IMPLEMENTADO

### Fase 1 - Edição de Campanhas
- ✅ EditCampaignPage criada (TS, HTML, SCSS)
- ✅ Formulário com nome, descrição, trocar GM
- ✅ Validação de permissão (apenas GM)
- ✅ Métodos no CampaignService:
  - `updateCampaign(id, data)`
  - `deleteCampaign(id)`
  - `getAvailableCharactersForPlayer(campaignId, playerId)`
  - `assignCharacterToParticipant(campaignId, playerId, characterId)`
- ✅ Rota `/campanhas/:id/editar` adicionada

---

## 🔄 PRÓXIMOS PASSOS

### 1. Adicionar Botões na ViewCampaignPage
**Arquivo:** `view-campaign.page.ts` e `view-campaign.page.html`

**Adicionar:**
```typescript
// No .ts
import { ConfirmationService } from 'primeng/api';

isGameMaster(): boolean {
  const currentPlayerId = this.authService.getPlayerId();
  return this.campaign?.gameMasterId === currentPlayerId;
}

onEdit(): void {
  this.router.navigate(['/campanhas', this.campaign.id, 'editar']);
}

onDelete(): void {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.',
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.campaignService.deleteCampaign(this.campaign.id).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Sucesso', 
            detail: 'Campanha excluída' 
          });
          this.router.navigate(['/campanhas']);
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Falha ao excluir campanha' 
          });
        }
      });
    }
  });
}
```

**No HTML (após botões existentes):**
```html
@if (isGameMaster()) {
  <button pButton label="Editar Campanha" icon="pi pi-pencil" (click)="onEdit()"></button>
  <button pButton label="Deletar Campanha" icon="pi pi-trash" 
          class="p-button-danger" (click)="onDelete()"></button>
}
```

**Imports necessários:**
- `ConfirmDialogModule` do primeng
- `ConfirmationService` nos providers

---

### 2. Criar Aba de Jogadores
**Arquivo:** `view-campaign.page.html`

**Adicionar TabView:**
```html
<p-tabView>
  <p-tabPanel header="Detalhes da Campanha">
    <!-- Conteúdo existente -->
  </p-tabPanel>
  
  <p-tabPanel header="Jogadores">
    <div class="players-section">
      <div *ngFor="let participant of campaign.participants" 
           class="player-card"
           (click)="onPlayerClick(participant)">
        <div class="player-info">
          <h4>{{ participant.player.nickName }}</h4>
          
          <span *ngIf="participant.player.id === campaign.gameMasterId" 
                class="badge badge-gm">Game Master</span>
          
          <div *ngIf="participant.character" class="character-preview">
            <img [src]="participant.character.imageUrl" />
            <span>{{ participant.character.name }}</span>
          </div>
          
          <div *ngIf="!participant.character" class="no-character">
            <i class="pi pi-exclamation-triangle"></i>
            <span>Sem Personagem</span>
          </div>
        </div>
      </div>
    </div>
  </p-tabPanel>
</p-tabView>
```

**Imports:**
- `TabViewModule` do primeng

---

### 3. Criar PlayerInfoDialogComponent
**Arquivos a criar:**
- `player-info-dialog.component.ts`
- `player-info-dialog.component.html`
- `player-info-dialog.component.scss`

**Localização:** `src/app/features/campaign/components/dialogs/player-info-dialog/`

---

### 4. Criar CharacterSelectionDialogComponent
**Arquivos a criar:**
- `character-selection-dialog.component.ts`
- `character-selection-dialog.component.html`
- `character-selection-dialog.component.scss`

**Localização:** `src/app/features/campaign/components/dialogs/character-selection-dialog/`

---

## 📝 CÓDIGO COMPLETO PARA COPIAR

Todos os componentes necessários estão documentados no plano de ação atualizado.
Continue a implementação com os passos acima.
