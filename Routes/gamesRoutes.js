import express from 'express';
import {GetGames, PostGames} from '../Controllers/gamesController.js';
//import {} from '../Middlewares/gamesMiddleware.js';

const router = express.Router();

router.get('/games', GetGames);
router.post('/games', PostGames);

export default router;