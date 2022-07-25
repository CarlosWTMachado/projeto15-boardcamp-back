import express from 'express';
import {GetRentals, PostRentals, PostRentalsIdReturn} from '../Controllers/rentalsController.js';
import {ValidaPostRentals, VerificaPostRentals, VerificaPostRentalsIdReturn} from '../Middlewares/rentalsMiddleware.js';

const router = express.Router();

router.get('/rentals', GetRentals);
router.post('/rentals', ValidaPostRentals, VerificaPostRentals, PostRentals);
router.post('/rentals/:id/return', VerificaPostRentalsIdReturn, PostRentalsIdReturn);

export default router;