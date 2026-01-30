import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';

interface Pokemon {
  id: string;
  name: string;
  power: number;
  life: number;
  image: string;
  type: string;
}

interface Team {
  id: string;
  name: string;
  pokemon_ids: string[];
  pokemons: Pokemon[];
}

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {

  teams: Team[] = [];
  loading = true;

  teamA?: Team;
  teamB?: Team;

  battleLog: string[] = [];
  winner: string | null = null;
  battleStarted = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.loadTeams();
  }

  // ✅ IMPORTANT FIX
  compareTeams(t1: Team, t2: Team): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  async loadTeams() {
    this.loading = true;

    const pokemons = await this.supabase.getPokemons() as Pokemon[];
    const teamsData = await this.supabase.getTeams() as Team[];

    this.teams = teamsData.map(team => ({
      ...team,
      pokemons: team.pokemon_ids
        .map(id => pokemons.find(p => p.id === id))
        .filter((p): p is Pokemon => !!p)
    }));

    this.loading = false;
  }


  getFactor(attacker: string, defender: string): number {
  const chart: Record<string, Record<string, number>> = {
    Fire: { Fire: 1, Water: 0.5, Grass: 2 },
    Water: { Fire: 2, Water: 1, Grass: 0.5 },
    Grass: { Fire: 0.5, Water: 2, Grass: 1 },
    Electric: { Water: 2, Electric: 1, Grass: 0.5 }
    // Add more types if needed
  };

  // Handle multi-types by taking the first type
  const attType = attacker.split('/')[0];
  const defType = defender.split('/')[0];

  return chart[attType]?.[defType] || 1;
}

startBattle() {
  if (!this.teamA || !this.teamB || !this.teamA.pokemons.length || !this.teamB.pokemons.length) return;

  this.battleStarted = true;
  this.battleLog = [];
  this.winner = null;

  const teamAPokemons = this.teamA.pokemons.map(p => ({ ...p }));
  const teamBPokemons = this.teamB.pokemons.map(p => ({ ...p }));

  this.battleLog.push(`⚔️ Battle started between ${this.teamA.name} and ${this.teamB.name}`);
  
  while (teamAPokemons.length && teamBPokemons.length) {
    const pA = teamAPokemons[0];
    const pB = teamBPokemons[0];

    const factorA = this.getFactor(pA.type, pB.type);
    const factorB = this.getFactor(pB.type, pA.type);

    const damageA = Math.round(pA.power * factorA);
    const damageB = Math.round(pB.power * factorB);

    pB.life -= damageA;
    pA.life -= damageB;

    if (pA.life <= 0) teamAPokemons.shift();
    if (pB.life <= 0) teamBPokemons.shift();
  }

  this.winner = teamAPokemons.length ? this.teamA.name : this.teamB.name;

  this.battleLog.push(`🏆 Winner: ${this.winner}`);
}


}
