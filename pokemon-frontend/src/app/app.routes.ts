
import { Routes } from '@angular/router';
import { PokemonComponent } from './pokemons/pokemons.component';
import { TeamsComponent } from './teams/teams.component';
import { BattleComponent } from './battle/battle.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'battle', component: BattleComponent },
  { path: '**', redirectTo: 'pokemon' } // fallback
];
