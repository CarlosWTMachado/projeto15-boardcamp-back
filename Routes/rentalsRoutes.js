import express from 'express';
import {GetRentals, PostRentals} from '../Controllers/rentalsController.js';
import {ValidaPostRentals, VerificaPostRentals} from '../Middlewares/rentalsMiddleware.js';

const router = express.Router();

router.get('/rentals', GetRentals);
router.post('/rentals', ValidaPostRentals, VerificaPostRentals, PostRentals);

export default router;