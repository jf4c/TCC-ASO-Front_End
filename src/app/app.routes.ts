import { Routes } from '@angular/router'
import { HomePage } from '@features/home/home.page'
import { ListCharacterPage } from '@features/character/pages/list-character/list-character.page'
import { CreateCharacterPage } from '@features/character/pages/create-character/create-character.page'

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'personagens', component: ListCharacterPage },
  { path: 'personagens/criar', component: CreateCharacterPage },
]
