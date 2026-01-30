import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { data } = await supabase
    .from('pokemon')
    .select('*, pokemon_type(name)');

  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { power, life, type } = req.body;

  await supabase
    .from('pokemon')
    .update({ power, life, type })
    .eq('id', id);

  res.sendStatus(200);
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 249a76cb6364d0303202c91fd2acd415bee6bceb
