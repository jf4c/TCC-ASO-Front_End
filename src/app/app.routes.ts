import { Routes } from '@angular/router'
import { HomePage } from '@features/home/home.page'
import { ListCharacterPage } from '@features/character/pages/list-character/list-character.page'
import { CreateCharacterPage } from '@features/character/pages/create-character/create-character.page'
import { ListCampaignPage } from '@features/campaign/pages/list-campaign/list-campaign.page'
import { ViewCampaignPage } from '@features/campaign/pages/view-campaign/view-campaign.page'
import { authGuard } from '@core/auth/auth.guard'

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage, canActivate: [authGuard] },
  {
    path: 'campanhas',
    component: ListCampaignPage,
    canActivate: [authGuard],
  },
  {
    path: 'campanhas/:id',
    component: ViewCampaignPage,
    canActivate: [authGuard],
  },
  {
    path: 'personagens',
    component: ListCharacterPage,
    canActivate: [authGuard],
  },
  {
    path: 'personagens/criar',
    component: CreateCharacterPage,
    canActivate: [authGuard],
  },
]
