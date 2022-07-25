import express from 'express';
import {GetGames, PostGames} from '../Controllers/gamesController.js';
import {ValidateGames, VerifyGames} from '../Middlewares/gamesMiddleware.js';

const router = express.Router();

router.get('/games', GetGames);
router.post('/games', ValidateGames, VerifyGames, PostGames);

export default router;