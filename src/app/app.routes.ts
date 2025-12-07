import { Routes } from '@angular/router'
import { HomePage } from '@features/home/home.page'
import { ListCharacterPage } from '@features/character/pages/list-character/list-character.page'
import { CreateCharacterPage } from '@features/character/pages/create-character/create-character.page'
import { ViewCharacterPage } from '@features/character/pages/view-character/view-character.page'
import { ListCampaignPage } from '@features/campaign/pages/list-campaign/list-campaign.page'
import { ViewCampaignPage } from '@features/campaign/pages/view-campaign/view-campaign.page'
import { CreateCampaignPage } from '@features/campaign/pages/create-campaign/create-campaign.page'
import { ListWorldsPage } from '@features/world/pages/list-worlds/list-worlds.page'
import { ViewWorldPage } from '@features/world/pages/view-world/view-world.page'
import { FriendsListPage } from '@features/friends/pages/friends-list/friends-list.page'
import { FriendSearchPage } from '@features/friends/pages/friend-search/friend-search.page'
import { FriendRequestsPage } from '@features/friends/pages/friend-requests/friend-requests.page'
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
    path: 'campanhas/criar',
    component: CreateCampaignPage,
    canActivate: [authGuard],
  },
  {
    path: 'campanhas/:id',
    component: ViewCampaignPage,
    canActivate: [authGuard],
  },
  {
    path: 'campanhas/:id/editar',
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
  {
    path: 'personagens/:id',
    component: ViewCharacterPage,
    canActivate: [authGuard],
  },
  {
    path: 'mundos',
    component: ListWorldsPage,
    canActivate: [authGuard],
  },
  {
    path: 'mundos/:id',
    component: ViewWorldPage,
    canActivate: [authGuard],
  },
  {
    path: 'amigos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: FriendsListPage,
        title: 'Meus Amigos'
      },
      {
        path: 'buscar',
        component: FriendSearchPage,
        title: 'Buscar Amigos'
      },
      {
        path: 'convites',
        component: FriendRequestsPage,
        title: 'Convites de Amizade'
      }
    ]
  },
]
