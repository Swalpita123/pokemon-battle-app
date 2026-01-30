import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import pokemonRoutes from './routes/pokemon.js';
import teamRoutes from './routes/team.js';
import battleRoutes from './routes/battle.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/pokemons', pokemonRoutes);
app.use('/teams', teamRoutes);
app.use('/battle', battleRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
<<<<<<< HEAD
});
=======
});
>>>>>>> 249a76cb6364d0303202c91fd2acd415bee6bceb
