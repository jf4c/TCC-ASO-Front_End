import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CharacterDetail } from '@characters/interface/character.model';

@Component({
  selector: 'aso-character-detail-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './character-detail-dialog.component.html',
  styleUrl: './character-detail-dialog.component.scss',
})
export class CharacterDetailDialogComponent implements OnInit {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  character: CharacterDetail | null = null;
  showSelectButton = false;

  ngOnInit(): void {
    this.character = this.config.data?.character;
    this.showSelectButton = this.config.data?.showSelectButton ?? false;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSelect(): void {
    this.dialogRef.close({ selected: true, character: this.character });
  }

  getImageUrl(image: string | null | undefined): string {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/assets') || image.startsWith('./assets')) {
      return image.startsWith('./') ? image.substring(2) : image;
    }
    return image;
  }

  getModifier(value: number): number {
    return Math.floor((value - 10) / 2);
  }

  formatModifier(value: number): string {
    const mod = this.getModifier(value);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }
}
