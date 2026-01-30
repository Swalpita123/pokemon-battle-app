import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';

interface Pokemon {
  id: string;
  name: string;
  type: string;
  power: number;
  life: number;
  image: string;
}

interface Team {
  id: string;
  name: string;
  pokemon_ids: string[];
  pokemons: Pokemon[];
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  pokemons: Pokemon[] = [];
  teams: Team[] = [];

  selectedPokemons: Pokemon[] = [];
  teamName: string = '';

  constructor(private supabase: SupabaseService, private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    this.pokemons = await this.supabase.getPokemons();

    // Delay 1s before loading teams
    setTimeout(async () => {
      await this.loadTeams();
      this.cd.detectChanges();
    }, 1000);
  }

  async loadTeams() {
    const teamsData: any[] = await this.supabase.getTeams();

    this.teams = teamsData.map((team: any) => {
      const pokemonsForTeam: Pokemon[] = [];
      if (Array.isArray(team.pokemon_ids)) {
        for (const id of team.pokemon_ids) {
          const found = this.pokemons.find(p => p.id === id);
          if (found) pokemonsForTeam.push(found);
        }
      }

      return {
        id: team.id != null ? team.id.toString() : '',
        name: team.name || 'Unknown Team',
        pokemon_ids: Array.isArray(team.pokemon_ids) ? team.pokemon_ids : [],
        pokemons: pokemonsForTeam
      };
    });
  }

  addPokemon(pokemon: Pokemon) {
    if (this.selectedPokemons.length < 6 && !this.selectedPokemons.includes(pokemon)) {
      this.selectedPokemons.push(pokemon);
    }
  }

  removePokemon(index: number) {
    this.selectedPokemons.splice(index, 1);
  }

async saveTeam() {
  if (this.selectedPokemons.length !== 6 || !this.teamName.trim()) return;

  const newTeam: { name: string; pokemon_ids: string[] } = {
    name: this.teamName,
    pokemon_ids: this.selectedPokemons.map(p => p.id)
  };

  // Save to Supabase
  await this.supabase.saveTeam(newTeam);

  // Clear selection
  this.selectedPokemons = [];
  this.teamName = '';

  // Reload teams
  await this.loadTeams();
}

  getTeamPower(team: Team): number {
    return team.pokemons.reduce((total, p) => total + p.power, 0);
  }

}
