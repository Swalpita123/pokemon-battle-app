## Pokémon Battle App
A simple web application to view Pokémon, create teams, and simulate battles between two Pokémon teams.

## Tech Stack: 
Angular, TypeScript, Supabase (PostgreSQL)

## Setup & Run Locally
Prerequisites: Node.js v18+, Angular CLI v16+, Supabase account

git clone https://github.com/Swalpita123/pokemon-battle-app.git
cd pokemon-frontend
npm install


## Create a .env file:

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key


## Run the app:
ng serve

Open: http://localhost:4200

## Design & Data Model
pokemon_type: Normalizes Pokémon types and allows easy extension.
pokemon: Stores Pokémon stats (power, life, image) and references a type using UUID.
weakness: Stores type-vs-type damage multipliers for flexible battle logic.
team: Stores exactly 6 Pokémon UUIDs in an array to preserve order and enable fast battle simulation.
This structure prioritizes data integrity, performance, and simplicity.

## Database Schema & Scripts
Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

## Team Table (Requirement 4)
CREATE TABLE team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    pokemon_ids UUID[] NOT NULL
        CHECK (array_length(pokemon_ids, 1) = 6)
);

## PostgreSQL Functions (Requirement 5)
CREATE OR REPLACE FUNCTION insert_team(team_name TEXT, pokemon_ids UUID[])
RETURNS VOID AS $$
BEGIN
    IF array_length(pokemon_ids, 1) != 6 THEN
        RAISE EXCEPTION 'A team must have exactly 6 Pokémon';
    END IF;
    INSERT INTO team (name, pokemon_ids)
    VALUES (team_name, pokemon_ids);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION list_teams_by_power()
RETURNS TABLE(team_id UUID, team_name TEXT, total_power INT) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.name, SUM(p.power)
    FROM team t
    JOIN pokemon p ON p.id = ANY(t.pokemon_ids)
    GROUP BY t.id, t.name
    ORDER BY total_power DESC;
END;
$$ LANGUAGE plpgsql;

## Battle Algorithm
Two teams of 6 Pokémon fight sequentially (1v1).

## Damage calculation:
damage = power × type_factor
Pokémon faint when life ≤ 0.

Battle continues until one team has no Pokémon.
The team with remaining Pokémon is declared the winner.
Battle log shows a concise summary and winner.

## Author:
Swalpita Ray Nayak
