import { Routes } from '@angular/router'
import { HomeComponent } from './features/home/home.component'
import { ListCharacterComponent } from './features/character/pages/list-character/list-character.component'

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'personagens', component: ListCharacterComponent },
]
