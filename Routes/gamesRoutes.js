import express from 'express';
import {GetGames, PostGames} from '../Controllers/gamesController.js';
import {ValidaPostGames, VerificaPostGames} from '../Middlewares/gamesMiddleware.js';

const router = express.Router();

router.get('/games', GetGames);
router.post('/games', ValidaPostGames, VerificaPostGames, PostGames);

export default router;