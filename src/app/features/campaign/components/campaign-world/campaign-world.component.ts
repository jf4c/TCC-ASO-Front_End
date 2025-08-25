import { Component, input, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AccordionModule } from 'primeng/accordion'
import { CampaignWorld } from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-campaign-world',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './campaign-world.component.html',
  styleUrl: './campaign-world.component.scss',
})
export class CampaignWorldComponent {
  world = input<CampaignWorld | null>(null)

  constructor() {
    effect(() => {
      const worldData = this.world()
      console.log('CampaignWorld data:', worldData)
      if (worldData) {
        console.log('Lore entries:', worldData.lore?.length || 0)
        console.log('Location entries:', worldData.locations?.length || 0)
        console.log('Pantheon entries:', worldData.pantheon?.length || 0)
      }
    })
  }
}
