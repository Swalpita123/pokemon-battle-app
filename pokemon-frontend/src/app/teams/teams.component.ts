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
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  pokemons: Pokemon[] = [];
  teams: Team[] = [];
  selectedPokemons: Pokemon[] = [];
  teamName: string = '';
  showCreateTeam = true;

  constructor(
    private supabase: SupabaseService,
    private cd: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.pokemons = await this.supabase.getPokemons();

    // Load existing teams
    setTimeout(async () => {
      await this.loadTeams();
      this.cd.detectChanges();
    }, 1000);
  }

  async loadTeams() {
    const teamsData: any[] = await this.supabase.getTeams();

    this.teams = teamsData.map((team: any) => {
      const pokemonsForTeam: Pokemon[] = [];

      // Ensure pokemon_ids is an array
      let pokemonIds: string[] = [];
      if (Array.isArray(team.pokemon_ids)) {
        pokemonIds = team.pokemon_ids;
      } else if (typeof team.pokemon_ids === 'string') {
        try {
          // parse JSON if stored as string
          pokemonIds = JSON.parse(team.pokemon_ids);
        } catch {
          // fallback for Postgres array string like "{1,2,3}"
          pokemonIds = team.pokemon_ids
            .replace('{', '')
            .replace('}', '')
            .split(',')
            .map((id: string) => id.trim());
        }
      }

      for (const id of pokemonIds) {
        const found = this.pokemons.find((p) => p.id === id);
        if (found) pokemonsForTeam.push(found);
      }

      return {
        id: team.id != null ? team.id.toString() : '',
        name: team.name || 'Unknown Team',
        pokemon_ids: pokemonIds,
        pokemons: pokemonsForTeam,
      };
    });
  }

  addPokemon(pokemon: Pokemon) {
    if (
      this.selectedPokemons.length < 6 &&
      !this.selectedPokemons.some((p) => p.id === pokemon.id)
    ) {
      this.selectedPokemons.push(pokemon);
    }
  }

  removePokemon(index: number) {
    this.selectedPokemons.splice(index, 1);
  }
  async saveTeam() {
    if (this.selectedPokemons.length !== 6 || !this.teamName.trim()) return;

    const newTeam = {
      name: this.teamName,
      pokemon_ids: this.selectedPokemons.map((p) => p.id),
    };

    try {
      await this.supabase.saveTeam(newTeam);

      // Reload teams so UI is always correct
      await this.loadTeams();

      // Reset form
      this.teamName = '';
      this.selectedPokemons = [];

      // 🔥 Hide create section
      this.showCreateTeam = false;
    } catch (err) {
      console.error('Error saving team:', err);
    }
  }

  async deleteTeam(teamId: string) {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      // Delete from Supabase
      await this.supabase.deleteTeam(teamId);

      // Remove from local array
      this.teams = this.teams.filter((team) => team.id !== teamId);
    } catch (err) {
      console.error('Error deleting team:', err);
    }
  }

  getTeamPower(team: Team): number {
    return team.pokemons.reduce((total, p) => total + p.power, 0);
  }
}
