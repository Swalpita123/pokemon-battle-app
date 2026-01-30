import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  private supabaseUrl = 'https://bbdtgpwilkplyledzega.supabase.co';
  private supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZHRncHdpbGtwbHlsZWR6ZWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzgwNzksImV4cCI6MjA4NTI1NDA3OX0.xPCTRVgcYd1oEnUJJbne0tH8YZ3irsAe9-XEBQjyA9w';

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async getPokemons() {
    const { data, error } = await this.supabase.from('pokemon').select('*');

    if (error) throw error;
    return data;
  }

  async saveTeam(team: { name: string; pokemon_ids: string[] }) {
    const { data, error } = await this.supabase.from('team').insert([team]).select(); // returns inserted rows

    if (error) throw error;
    return data;
  }

  async getTeams() {
    const { data, error } = await this.supabase.from('team').select('*');

    if (error) throw error;
    return data;
  }

  async insertTeam(name: string, pokemon_ids: string[]) {
    const { error } = await this.supabase.from('team').insert([{ name, pokemon_ids }]);

    if (error) throw error;
  }

  async deleteTeam(id: string) {
    const { error } = await this.supabase.from('team').delete().eq('id', id);

    if (error) throw error;
  }
}
