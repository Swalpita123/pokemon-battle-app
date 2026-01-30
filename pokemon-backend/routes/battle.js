import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { teamA, teamB } = req.body;

  // fetch pokemon data
  // fetch weakness table
  // simulate rounds
  // return battle log + winner

  res.json({ winner: 'Team A', rounds: [] });
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 249a76cb6364d0303202c91fd2acd415bee6bceb
