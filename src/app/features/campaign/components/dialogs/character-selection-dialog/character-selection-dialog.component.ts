import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { Character } from '../../../../character/interface/character.model';
import { CampaignParticipant } from '../../../interfaces/campaign-detail.model';
import { CharacterCardComponent } from '../../../../character/components/character-card/character-card.component';

@Component({
  selector: 'aso-character-selection-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, CharacterCardComponent],
  templateUrl: './character-selection-dialog.component.html',
  styleUrl: './character-selection-dialog.component.scss',
})
export class CharacterSelectionDialogComponent implements OnInit {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  characters: Character[] = [];
  participant: CampaignParticipant | null = null;
  selectedCharacterId: string | null = null;

  ngOnInit(): void {
    this.characters = this.config.data?.characters || [];
    this.participant = this.config.data?.participant;
  }

  selectCharacter(characterId: string): void {
    this.selectedCharacterId = characterId;
  }

  onConfirm(): void {
    if (this.selectedCharacterId) {
      this.dialogRef.close({
        characterId: this.selectedCharacterId,
        participant: this.participant
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
